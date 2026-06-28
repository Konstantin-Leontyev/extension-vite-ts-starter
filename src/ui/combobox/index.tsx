import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'styled-components';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { useFocusTrap } from '@hooks/use-focus-trap';
import { CheckIcon } from '@icons/check';
import { ChevronIcon } from '@icons/chevron';
import { Input } from '@ui/input';
import {
  textSizePreset as resolveTextSizePreset,
  valuePaddingInline as resolveValuePaddingInline,
} from '@ui/presets';
import { ScrollPort } from '@ui/scroll-port';
import { Text } from '@ui/text';

import {
  StyledComboboxCheck,
  StyledComboboxChevron,
  StyledComboboxChevronBox,
  StyledComboboxList,
  StyledComboboxOption,
  StyledComboboxOptionIcon,
  StyledComboboxPanel,
  StyledComboboxRoot,
  StyledComboboxSearchRow,
  StyledComboboxTrigger,
  StyledComboboxValue,
  splitLayoutProps,
  type ComboboxStyleProps,
} from './combobox.styles';

/** Внешний зазор открытой панели: outline 2px + outline-offset 2px. */
const PANEL_OUTER_INSET = 4;

/** Минимум видимых строк списка; ниже него панель сдвигается вверх, чтобы влезть. */
const MIN_VISIBLE_OPTION_ROWS = 4;

const DEFAULT_SEARCH_PLACEHOLDER = 'Search…';
const DEFAULT_EMPTY_MESSAGE = 'Nothing found';

export type ComboboxOption = {
  disabled?: boolean;
  /** Слот перед label: флаг локали, иконка и т.п. */
  icon?: ReactNode;
  label: string;
  value: string;
};

export type ComboboxProps = ComboboxStyleProps & {
  /** Доступное имя триггера, когда видимый `label` не используется. */
  'aria-label'?: string;
  defaultValue?: string;
  disabled?: boolean;
  /** Текст при пустом результате поиска. */
  emptyMessage?: string;
  /** Встроенная подпись над триггером (как у Input). */
  label?: string;
  onChange?: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  /** Резерв высоты под строку ошибки — для общей сетки с полями формы. */
  reserveErrorSpace?: boolean;
  searchPlaceholder?: string;
  value?: string;
};

function filterComboboxOptions(
  options: ComboboxOption[],
  normalizedQuery: string
): ComboboxOption[] {
  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery)
  );
}

function findEnabledIndex(
  options: ComboboxOption[],
  from: number,
  step: 1 | -1
): number {
  for (let cursor = from; cursor >= 0 && cursor < options.length; cursor += step) {
    if (!options[cursor].disabled) {
      return cursor;
    }
  }

  return -1;
}

export function Combobox({
  'aria-label': ariaLabel,
  defaultValue,
  disabled = false,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  label,
  onChange,
  options,
  placeholder = 'Select…',
  reserveErrorSpace = true,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  shape,
  sizePreset,
  value,
  ...rest
}: ComboboxProps) {
  const theme = useTheme();
  const { layout } = splitLayoutProps(rest);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRowRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const triggerId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    defaultValue
  );

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalSelected;
  const textSizePreset = resolveTextSizePreset(sizePreset);
  const valuePaddingInline = resolveValuePaddingInline(sizePreset);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () => filterComboboxOptions(options, normalizedQuery),
    [options, normalizedQuery]
  );

  const dismissCombobox = useCallback((): void => {
    setOpen(false);
  }, []);

  const isInsideCombobox = useCallback((target: Node): boolean => {
    return (
      (rootRef.current?.contains(target) ?? false) ||
      (panelRef.current?.contains(target) ?? false)
    );
  }, []);

  useAnchoredDismiss({
    active: open,
    isInside: isInsideCombobox,
    onDismiss: dismissCombobox,
  });

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    returnFocusRef: triggerRef,
  });

  // Позиция и высота панели: поле поиска садится на место контрола; панель вписывается
  // во вьюпорт (max-height по доступной высоте), гарантируя минимум строк — остаток крутит ScrollPort.
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const triggerElement = triggerRef.current;
    const panelElement = panelRef.current;

    if (!triggerElement || !panelElement) {
      return;
    }

    function applyPanelPosition(): void {
      if (!triggerElement || !panelElement) {
        return;
      }

      const triggerRect = triggerElement.getBoundingClientRect();
      const rowHeight = triggerRect.height;
      const maxLeft = Math.max(
        PANEL_OUTER_INSET,
        window.innerWidth - triggerRect.width - PANEL_OUTER_INSET
      );
      const left = Math.min(Math.max(PANEL_OUTER_INSET, triggerRect.left), maxLeft);
      const searchHeight = searchRowRef.current?.offsetHeight ?? rowHeight;
      const reservedRows = Math.min(
        MIN_VISIBLE_OPTION_ROWS,
        Math.max(1, options.length)
      );
      const minPanelHeight = searchHeight + reservedRows * rowHeight;

      // Поиск на линии триггера; минимум не влезает вниз — сдвигаем панель вверх.
      let top = triggerRect.top;

      if (top + minPanelHeight > window.innerHeight - PANEL_OUTER_INSET) {
        top = window.innerHeight - PANEL_OUTER_INSET - minPanelHeight;
      }

      top = Math.max(PANEL_OUTER_INSET, top);
      const maxBlockSize = window.innerHeight - top - PANEL_OUTER_INSET;

      panelElement.style.left = `${left}px`;
      panelElement.style.width = `${triggerRect.width}px`;
      panelElement.style.maxHeight = `${Math.max(rowHeight, maxBlockSize)}px`;
      panelElement.style.top = `${top}px`;
    }

    applyPanelPosition();
    const frameId = window.requestAnimationFrame(applyPanelPosition);

    window.addEventListener('resize', applyPanelPosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', applyPanelPosition);
    };
  }, [open, filtered.length, options.length]);

  // Фокус при открытии — в поле поиска.
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [open]);

  // Активная строка всегда в зоне видимости списка.
  useEffect(() => {
    if (!open) {
      return;
    }

    const activeOption = panelRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );

    activeOption?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  /** Активная строка при открытии/фильтрации: выбранная, иначе первая доступная. */
  function initialActiveIndex(
    list: ComboboxOption[],
    selected: string | undefined
  ): number {
    const selectedFilteredIndex = list.findIndex(
      (option) => option.value === selected && !option.disabled
    );

    return selectedFilteredIndex >= 0
      ? selectedFilteredIndex
      : Math.max(0, findEnabledIndex(list, 0, 1));
  }

  function openPanel(): void {
    if (disabled) {
      return;
    }

    setQuery('');
    setActiveIndex(initialActiveIndex(options, selectedValue));
    setOpen(true);
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextQuery = event.target.value;
    const nextFiltered = filterComboboxOptions(options, nextQuery.trim().toLowerCase());

    setQuery(nextQuery);
    setActiveIndex(Math.max(0, findEnabledIndex(nextFiltered, 0, 1)));
  }

  function commitSelected(option: ComboboxOption): void {
    if (disabled || option.disabled) {
      return;
    }

    if (!isControlled) {
      setInternalSelected(option.value);
    }

    onChange?.(option.value);
    setOpen(false);
    setQuery('');
  }

  function moveActive(step: 1 | -1): void {
    setActiveIndex((current) => {
      const next = findEnabledIndex(filtered, current + step, step);

      return next >= 0 ? next : current;
    });
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);

      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(Math.max(0, findEnabledIndex(filtered, 0, 1)));

      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(0, findEnabledIndex(filtered, filtered.length - 1, -1)));

      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const option = filtered[activeIndex];

      if (option) {
        commitSelected(option);
      }

      return;
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'Escape') {
      setOpen(false);
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      openPanel();
    }
  }

  const selectedOption = options.find((option) => option.value === selectedValue);
  const activeOptionId =
    filtered[activeIndex] !== undefined
      ? `${listId}-${filtered[activeIndex].value}`
      : undefined;

  return (
    <StyledComboboxRoot ref={rootRef} data-open={open} {...layout}>
      {Boolean(label) && (
        <Text
          as="label"
          color={theme.colors.muted}
          htmlFor={triggerId}
          sizePreset="medium"
        >
          {label}
        </Text>
      )}
      <StyledComboboxTrigger
        ref={triggerRef}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        data-open={open}
        disabled={disabled}
        id={triggerId}
        shape={shape}
        sizePreset={sizePreset}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={handleTriggerKeyDown}
      >
        <StyledComboboxValue sizePreset={sizePreset}>
          {Boolean(selectedOption?.icon) && (
            <StyledComboboxOptionIcon>{selectedOption?.icon}</StyledComboboxOptionIcon>
          )}
          <Text
            color={selectedOption ? undefined : theme.colors.muted}
            ellipsis
            minInlineSize="0"
            sizePreset={textSizePreset}
          >
            {selectedOption?.label ?? placeholder}
          </Text>
        </StyledComboboxValue>
        <StyledComboboxChevronBox sizePreset={sizePreset}>
          <StyledComboboxChevron sizePreset={sizePreset}>
            <ChevronIcon />
          </StyledComboboxChevron>
        </StyledComboboxChevronBox>
      </StyledComboboxTrigger>

      {reserveErrorSpace && (
        <Text aria-hidden="true" as="p" minBlockSize="1.25rem" sizePreset="thin" />
      )}

      {open &&
        createPortal(
          <StyledComboboxPanel
            ref={panelRef}
            shape={shape}
            sizePreset={sizePreset}
            onKeyDown={handlePanelKeyDown}
          >
            <StyledComboboxSearchRow ref={searchRowRef}>
              <Input
                ref={searchInputRef}
                aria-activedescendant={activeOptionId}
                aria-controls={listId}
                aria-expanded
                placeholder={searchPlaceholder}
                reserveErrorSpace={false}
                role="combobox"
                shape={shape}
                sizePreset={sizePreset}
                type="search"
                value={query}
                onChange={handleQueryChange}
              />
            </StyledComboboxSearchRow>

            <ScrollPort
              paddingInlineEnd={8}
              scrollbarInsetBlockEnd={4}
              scrollbarInsetBlockStart={4}
              veil={false}
            >
              <StyledComboboxList
                aria-label={label ?? placeholder}
                id={listId}
                role="listbox"
              >
                {filtered.length === 0 && (
                  <li role="presentation">
                    <Text
                      color={theme.colors.muted}
                      paddingBlock={8}
                      paddingInline={valuePaddingInline}
                      sizePreset={textSizePreset}
                    >
                      {emptyMessage}
                    </Text>
                  </li>
                )}
                {filtered.map((option, index) => {
                  const isSelected = option.value === selectedValue;

                  return (
                    <li key={option.value} role="presentation">
                      <StyledComboboxOption
                        aria-selected={isSelected}
                        data-active={index === activeIndex}
                        data-index={index}
                        disabled={disabled || option.disabled}
                        id={`${listId}-${option.value}`}
                        role="option"
                        shape={shape}
                        sizePreset={sizePreset}
                        type="button"
                        onClick={() => commitSelected(option)}
                        onMouseMove={() => setActiveIndex(index)}
                      >
                        {Boolean(option.icon) && (
                          <StyledComboboxOptionIcon>
                            {option.icon}
                          </StyledComboboxOptionIcon>
                        )}
                        <Text
                          ellipsis
                          minInlineSize="0"
                          sizePreset={textSizePreset}
                          zIndex="1"
                        >
                          {option.label}
                        </Text>
                        {isSelected && (
                          <StyledComboboxCheck>
                            <CheckIcon />
                          </StyledComboboxCheck>
                        )}
                      </StyledComboboxOption>
                    </li>
                  );
                })}
              </StyledComboboxList>
            </ScrollPort>
          </StyledComboboxPanel>,
          document.body
        )}
    </StyledComboboxRoot>
  );
}

export type { ComboboxStyleProps } from './combobox.styles';

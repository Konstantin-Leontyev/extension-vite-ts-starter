import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'styled-components';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { CheckIcon } from '@icons/check';
import { ChevronIcon } from '@icons/chevron';
import { Checkbox } from '@ui/checkbox';
import { Text } from '@ui/text';

import {
  StyledListboxCheck,
  StyledListboxChevron,
  StyledListboxIcon,
  StyledListboxOptionButton,
  StyledListboxOptionLabel,
  StyledListboxOptionRow,
  StyledListboxPanel,
  StyledListboxRoot,
  StyledListboxTrigger,
  StyledListboxValue,
  listboxTextSizePreset,
  splitLayoutProps,
  type ListboxStyleProps,
} from './listbox.styles';

/** Внешний зазор открытой панели: outline 2px + outline-offset 2px. */
const PANEL_OUTER_INSET = 4;

export type ListboxOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type ListboxProps = ListboxStyleProps & {
  defaultValue?: string | string[];
  disabled?: boolean;
  /** Чекбоксы в строках работает только вместе с `multiple`. */
  inlineCheckbox?: boolean;
  /** Встроенная подпись над триггером (как у Input). */
  label?: string;
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  options: ListboxOption[];
  placeholder?: string;
  /** Резерв высоты под строку ошибки — как у Input, для общей сетки с полями формы. */
  reserveErrorSpace?: boolean;
  value?: string | string[];
};

function toSelectedValues(
  raw: string | string[] | undefined,
  multiple: boolean
): string[] {
  if (raw === undefined) {
    return [];
  }

  if (multiple) {
    return Array.isArray(raw) ? raw : [raw];
  }

  const single = Array.isArray(raw) ? raw[0] : raw;

  return single ? [single] : [];
}

function formatMultipleTriggerLabel(
  options: ListboxOption[],
  selected: string[]
): ReactNode {
  const labels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  if (labels.length === 0) {
    return null;
  }

  if (labels.length === 1) {
    return labels[0];
  }

  return `${labels.length} selected`;
}

/** Круговая очередь индексов после выбранного: next..end, затем 0..prev. */
function getCircularAfterIndices(selectedIndex: number, optionCount: number): number[] {
  const afterIndices: number[] = [];

  for (let step = 1; step < optionCount; step += 1) {
    afterIndices.push((selectedIndex + step) % optionCount);
  }

  return afterIndices;
}

/**
 * Делит опции вокруг выбранной строки (она на линии триггера):
 * заполняем вниз сколько влезает, остаток уходит вверх; затем поджимаем,
 * пока вся панель не уместится во вьюпорт.
 */
function splitPanelOptionIndices(
  selectedIndex: number,
  optionCount: number,
  rowsFitBelow: number,
  triggerTop?: number,
  rowHeight?: number
): { aboveIndices: number[]; belowIndices: number[] } {
  if (selectedIndex < 0 || optionCount === 0) {
    return { aboveIndices: [], belowIndices: [] };
  }

  const circularAfter = getCircularAfterIndices(selectedIndex, optionCount);
  let belowCount = Math.min(circularAfter.length, Math.max(0, rowsFitBelow));

  if (triggerTop !== undefined && rowHeight !== undefined && rowHeight > 0) {
    while (belowCount >= 0) {
      const aboveCount = circularAfter.length - belowCount;
      const panelTop = triggerTop - aboveCount * rowHeight;
      const panelHeight = optionCount * rowHeight;
      const panelBottom = panelTop + panelHeight;

      if (
        panelTop >= PANEL_OUTER_INSET &&
        panelBottom + PANEL_OUTER_INSET <= window.innerHeight
      ) {
        break;
      }

      belowCount -= 1;
    }

    belowCount = Math.max(0, belowCount);
  }

  return {
    aboveIndices: circularAfter.slice(belowCount),
    belowIndices: circularAfter.slice(0, belowCount),
  };
}

function countRowsFitBelow(triggerTop: number, rowHeight: number): number {
  const spaceBelowSelected = Math.max(
    0,
    window.innerHeight - triggerTop - rowHeight - PANEL_OUTER_INSET
  );

  return Math.floor(spaceBelowSelected / Math.max(1, rowHeight));
}

type PanelOrder = {
  aboveIndices: number[];
  belowIndices: number[];
  optionCount: number;
  selectedIndex: number;
};

function panelOrdersEqual(left: PanelOrder | null, right: PanelOrder): boolean {
  if (left === null) {
    return false;
  }

  if (
    left.selectedIndex !== right.selectedIndex ||
    left.optionCount !== right.optionCount
  ) {
    return false;
  }

  if (
    left.aboveIndices.length !== right.aboveIndices.length ||
    left.belowIndices.length !== right.belowIndices.length
  ) {
    return false;
  }

  return (
    left.aboveIndices.every((index, item) => index === right.aboveIndices[item]) &&
    left.belowIndices.every((index, item) => index === right.belowIndices[item])
  );
}

export function Listbox({
  defaultValue,
  disabled = false,
  inlineCheckbox = false,
  label,
  multiple = false,
  onChange,
  options,
  placeholder = 'Select…',
  reserveErrorSpace = true,
  shape = 'default',
  sizePreset = 'large',
  value,
  ...rest
}: ListboxProps) {
  const theme = useTheme();
  const { layout } = splitLayoutProps(rest);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const panelOrderRef = useRef<PanelOrder | null>(null);
  const listId = useId();
  const triggerId = useId();
  const [open, setOpen] = useState(false);
  const [panelOrder, setPanelOrder] = useState<PanelOrder | null>(null);
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    toSelectedValues(defaultValue, multiple)
  );

  const isControlled = value !== undefined;
  const selected = isControlled ? toSelectedValues(value, multiple) : internalSelected;
  const selectedValue = selected[0];
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const optionsKey = options.map((option) => option.value).join('\0');
  const textSizePreset = listboxTextSizePreset(sizePreset);

  const dismissListbox = useCallback((): void => {
    setOpen(false);
  }, []);

  const isInsideListbox = useCallback((target: Node): boolean => {
    return (
      (rootRef.current?.contains(target) ?? false) ||
      (panelRef.current?.contains(target) ?? false)
    );
  }, []);

  useAnchoredDismiss({
    active: open,
    isInside: isInsideListbox,
    onDismiss: dismissListbox,
  });

  // Порядок строк (above/below) — при открытии и смене выбора/опций.
  useLayoutEffect(() => {
    if (!open) {
      panelOrderRef.current = null;

      return;
    }

    const triggerElement = triggerRef.current;

    if (!triggerElement) {
      return;
    }

    const triggerRect = triggerElement.getBoundingClientRect();
    const rowHeight = triggerRect.height;
    const rowsFitBelow =
      selectedIndex >= 0
        ? countRowsFitBelow(triggerRect.top, rowHeight)
        : options.length;
    const nextOrder: PanelOrder = {
      ...splitPanelOptionIndices(
        selectedIndex,
        options.length,
        rowsFitBelow,
        triggerRect.top,
        rowHeight
      ),
      optionCount: options.length,
      selectedIndex,
    };

    panelOrderRef.current = nextOrder;
    setPanelOrder((current) =>
      panelOrdersEqual(current, nextOrder) ? current : nextOrder
    );
  }, [open, options.length, optionsKey, selectedIndex]);

  // Позиция панели (top/left/width) — отдельно, с подстройкой на resize.
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
      const order = panelOrderRef.current;

      if (!order || !triggerElement || !panelElement) {
        return;
      }

      const triggerRect = triggerElement.getBoundingClientRect();
      const rowHeight = triggerRect.height;
      const panelTop = triggerRect.top - order.aboveIndices.length * rowHeight;

      panelElement.style.left = `${triggerRect.left}px`;
      panelElement.style.width = `${triggerRect.width}px`;
      panelElement.scrollTop = 0;
      panelElement.style.top = `${panelTop}px`;
    }

    applyPanelPosition();
    const frameId = window.requestAnimationFrame(applyPanelPosition);

    window.addEventListener('resize', applyPanelPosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', applyPanelPosition);
    };
  }, [open, panelOrder]);

  function commitSelected(next: string[]): void {
    if (!isControlled) {
      setInternalSelected(next);
    }

    onChange?.(multiple ? next : (next[0] ?? ''));
  }

  function toggleOption(option: ListboxOption): void {
    if (disabled || option.disabled) {
      return;
    }

    if (multiple) {
      const next = selected.includes(option.value)
        ? selected.filter((item) => item !== option.value)
        : [...selected, option.value];
      commitSelected(next);

      return;
    }

    commitSelected([option.value]);
    setOpen(false);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'Escape') {
      setOpen(false);
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (!disabled) {
        setOpen((wasOpen) => !wasOpen);
      }
    }
  }

  const selectedOption = options.find((option) => option.value === selected[0]);
  const triggerLabel = multiple
    ? formatMultipleTriggerLabel(options, selected)
    : (selectedOption?.label ?? null);

  const showCheckbox = multiple && inlineCheckbox;
  const displayOrder =
    open &&
    panelOrder !== null &&
    panelOrder.selectedIndex === selectedIndex &&
    panelOrder.optionCount === options.length
      ? panelOrder
      : splitPanelOptionIndices(
          selectedIndex,
          options.length,
          Math.max(0, options.length - 1)
        );
  const { aboveIndices, belowIndices } = displayOrder;

  function renderOption(option: ListboxOption): ReactNode {
    const isSelected = selected.includes(option.value);

    if (showCheckbox) {
      return (
        <li key={option.value} aria-selected={isSelected} role="option">
          <StyledListboxOptionRow shape={shape} sizePreset={sizePreset}>
            <Checkbox
              bare
              inverted
              checked={isSelected}
              disabled={disabled || option.disabled}
              sizePreset={sizePreset}
              onChange={() => {
                toggleOption(option);
                (document.activeElement as HTMLElement | null)?.blur();
              }}
            />
            <StyledListboxOptionLabel sizePreset={sizePreset}>
              <Text sizePreset={textSizePreset}>{option.label}</Text>
            </StyledListboxOptionLabel>
          </StyledListboxOptionRow>
        </li>
      );
    }

    return (
      <li key={option.value} aria-selected={isSelected} role="option">
        <StyledListboxOptionButton
          disabled={disabled || option.disabled}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={() => toggleOption(option)}
        >
          <StyledListboxOptionLabel sizePreset={sizePreset}>
            <Text sizePreset={textSizePreset}>{option.label}</Text>
          </StyledListboxOptionLabel>
          {isSelected && (
            <StyledListboxCheck>
              <CheckIcon />
            </StyledListboxCheck>
          )}
        </StyledListboxOptionButton>
      </li>
    );
  }

  const panelOptions =
    selectedIndex >= 0
      ? [
          ...aboveIndices.map((index) => renderOption(options[index])),
          renderOption(options[selectedIndex]),
          ...belowIndices.map((index) => renderOption(options[index])),
        ]
      : options.map((option) => renderOption(option));

  return (
    <StyledListboxRoot ref={rootRef} data-open={open} {...layout}>
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
      <StyledListboxTrigger
        ref={triggerRef}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        data-open={open}
        disabled={disabled}
        id={triggerId}
        shape={shape}
        sizePreset={sizePreset}
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <StyledListboxValue sizePreset={sizePreset}>
          <Text
            color={triggerLabel ? undefined : theme.colors.muted}
            sizePreset={textSizePreset}
          >
            {triggerLabel ?? placeholder}
          </Text>
        </StyledListboxValue>
        <StyledListboxIcon sizePreset={sizePreset}>
          <StyledListboxChevron sizePreset={sizePreset}>
            <ChevronIcon />
          </StyledListboxChevron>
        </StyledListboxIcon>
      </StyledListboxTrigger>

      {reserveErrorSpace && (
        <Text aria-hidden="true" as="p" minBlockSize="1.25rem" sizePreset="thin" />
      )}

      {open &&
        createPortal(
          <StyledListboxPanel
            ref={panelRef}
            aria-multiselectable={multiple || undefined}
            id={listId}
            role="listbox"
            shape={shape}
            sizePreset={sizePreset}
          >
            {panelOptions}
          </StyledListboxPanel>,
          document.body
        )}
    </StyledListboxRoot>
  );
}

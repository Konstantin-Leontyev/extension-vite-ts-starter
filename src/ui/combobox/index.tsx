/**
 * Файл: `src/ui/combobox/index.tsx`
 * Предоставляет компонент Combobox для отображения выбора значения из списка с поиском.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму через проп `shape`
 *  - тон глифа шеврона через проп `iconFill`
 *  - позицию шеврона через проп `iconPosition`
 *  - тон секции шеврона через проп `iconTone`
 *  - начальное значение через проп `defaultValue`
 *  - недоступное состояние через проп `disabled`
 *  - текст пустого результата поиска через проп `emptyMessage`
 *  - подпись над триггером через проп `label`
 *  - обработчик изменения значения через проп `onChange`
 *  - опции списка через проп `options`
 *  - плейсхолдер неактивного триггера через проп `placeholder`
 *  - плейсхолдер поля поиска через проп `searchPlaceholder`
 *  - контролируемое значение через проп `value`
 *  - текстовую метку через проп `aria-label`
 *  - опциональный сброс выбора через проп `showClear`. Базовая логика — шеврон.
 *    Clear появляется при выборе, только когда проп включён
 *
 * Основные задачи:
 * 1. Экспортировать компонент Combobox
 * 2. Типизировать пропсы через `ComboboxProps`
 * 3. Экспортировать тип `ComboboxOption`
 * 4. Выставлять `role` и `aria`-атрибуты триггера и панели
 *
 * Потребители:
 *  - `src/pages/showcase/icon-group/index.tsx` — выбирает глиф иконки
 *  - `src/pages/showcase/card-settings/index.tsx` — выбирает иконку действия шапки
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { CheckIcon, ChevronDownIcon, CloseIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { AnchoredPortal } from '@ui/anchored-portal';
import { FieldLabel } from '@ui/field-label';
import { DEFAULT_ICON_POSITION, Icon, type IconPosition } from '@ui/icon';
import { Input } from '@ui/input';
import { Text } from '@ui/text';
import { type TonePreset } from '@ui/tones';
import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

import {
  StyledComboboxList,
  StyledComboboxOption,
  StyledComboboxPanel,
  StyledComboboxRoot,
  StyledComboboxSearchRow,
  StyledComboboxTrigger,
  StyledComboboxTriggerRow,
  StyledComboboxValue,
  getComboboxTextSize,
  splitLayoutProps,
  type ComboboxStyleProps,
} from './combobox.styles';

/**
 * MIN_VISIBLE_OPTION_ROWS — задаёт минимум видимых строк списка в панели.
 * Используется в `applyComboboxPanelPosition` для расчёта минимальной высоты панели.
 */
const MIN_VISIBLE_OPTION_ROWS = 4;

/**
 * DEFAULT_COMBOBOX_DISABLED — задаёт недоступное состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `disabled`.
 */
const DEFAULT_COMBOBOX_DISABLED = false;

/**
 * DEFAULT_COMBOBOX_EMPTY_MESSAGE — задаёт текст пустого результата поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `emptyMessage`.
 */
const DEFAULT_COMBOBOX_EMPTY_MESSAGE = 'Nothing found';

/**
 * DEFAULT_COMBOBOX_PLACEHOLDER — задаёт плейсхолдер неактивного триггера по умолчанию.
 * Используется, когда вызывающий код не передал проп `placeholder`.
 */
const DEFAULT_COMBOBOX_PLACEHOLDER = 'Select…';

/**
 * DEFAULT_COMBOBOX_SEARCH_PLACEHOLDER — задаёт плейсхолдер поля поиска по умолчанию.
 * Используется, когда вызывающий код не передал проп `searchPlaceholder`.
 */
const DEFAULT_COMBOBOX_SEARCH_PLACEHOLDER = 'Search…';

/**
 * DEFAULT_COMBOBOX_SHOW_CLEAR — задаёт показ кнопки сброса выбора по умолчанию.
 * Используется, когда вызывающий код не передал проп `showClear`.
 */
const DEFAULT_COMBOBOX_SHOW_CLEAR = false;

/**
 * ComboboxOption — представляет опцию списка Combobox.
 *
 * @property disabled — включает недоступное состояние опции
 * @property icon — слот перед `label`, например флаг локали или иконка
 * @property label — содержимое подписи опции
 * @property value — стабильный ключ опции
 */
export type ComboboxOption = {
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  value: string;
};

/**
 * ComboboxProps — представляет пропсы компонента Combobox.
 *
 * @property aria-label — текстовая метка триггера
 * @property defaultValue — начальное значение в неконтролируемом режиме
 * @property disabled — включает недоступное состояние
 * @property emptyMessage — текст при пустом результате поиска
 * @property iconFill — тон глифа шеврона при нейтральном `iconTone`
 * @property iconPosition — позиция шеврона относительно значения
 * @property label — подпись над триггером
 * @property onChange — обработчик изменения значения
 * @property options — опции списка
 * @property placeholder — плейсхолдер неактивного триггера
 * @property searchPlaceholder — плейсхолдер поля поиска
 * @property showClear — включает кнопку сброса выбора при выбранном значении
 * @property value — контролируемое значение
 */
type ComboboxProps = ComboboxStyleProps & {
  'aria-label'?: string;
  defaultValue?: string;
  disabled?: boolean;
  emptyMessage?: string;
  iconFill?: TonePreset;
  iconPosition?: IconPosition;
  label?: string;
  onChange?: (value: string) => void;
  options: readonly ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  showClear?: boolean;
  value?: string;
} & Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'onChange' | 'style' | keyof ComboboxStyleProps
  >;

/**
 * filterComboboxOptions — возвращает опции, подходящие под нормализованный запрос.
 *
 * Как работает:
 * 1. Без запроса возвращает исходный перечень
 * 2. Иначе оставляет опции, чей `label` содержит нормализованный запрос
 *
 * @param options опции списка
 * @param normalizedQuery нормализованная строка поиска
 * @returns отфильтрованный перечень опций
 */
function filterComboboxOptions(
  options: readonly ComboboxOption[],
  normalizedQuery: string
): readonly ComboboxOption[] {
  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * findEnabledIndex — возвращает индекс ближайшей доступной опции по шагу.
 *
 * Как работает:
 * 1. Идёт от `from` шагом `step` в пределах списка
 * 2. Возвращает первый индекс без `disabled` или `-1`
 *
 * @param options опции списка
 * @param from индекс старта обхода
 * @param step направление обхода
 * @returns индекс доступной опции или `-1`
 */
function findEnabledIndex(
  options: readonly ComboboxOption[],
  from: number,
  step: -1 | 1
): number {
  for (let cursor = from; cursor >= 0 && cursor < options.length; cursor += step) {
    if (!options[cursor].disabled) {
      return cursor;
    }
  }

  return -1;
}

/**
 * applyComboboxPanelPosition — позиционирует панель относительно триггера.
 *
 * Как работает:
 * 1. Берёт геометрию триггера и ограничивает `left` вьюпортом с учётом
 *    `PORTAL_VIEWPORT_EDGE_INSET`
 * 2. Считает минимальную высоту панели: высота поиска плюс высота строк —
 *    не меньше одной и не больше `MIN_VISIBLE_OPTION_ROWS`
 * 3. Поджимает `top`, если панель не влезает снизу, и не даёт уйти выше
 *    отступа вьюпорта
 * 4. Выставляет `left`, `width`, `maxHeight` и `top`
 *
 * @param trigger элемент-триггер
 * @param panel элемент панели
 * @param optionCount число опций в списке
 * @param searchInputHeight высота поля поиска
 */
function applyComboboxPanelPosition(
  trigger: HTMLElement,
  panel: HTMLElement,
  optionCount: number,
  searchInputHeight: number | undefined
): void {
  const triggerRect = trigger.getBoundingClientRect();
  const rowHeight = triggerRect.height;
  const maxLeft = Math.max(
    PORTAL_VIEWPORT_EDGE_INSET,
    window.innerWidth - triggerRect.width - PORTAL_VIEWPORT_EDGE_INSET
  );
  const left = Math.min(Math.max(PORTAL_VIEWPORT_EDGE_INSET, triggerRect.left), maxLeft);
  const searchHeight = searchInputHeight ?? rowHeight;
  const reservedRows = Math.min(MIN_VISIBLE_OPTION_ROWS, Math.max(1, optionCount));
  const minPanelHeight = searchHeight + reservedRows * rowHeight;

  let top = triggerRect.top;

  if (top + minPanelHeight > window.innerHeight - PORTAL_VIEWPORT_EDGE_INSET) {
    top = window.innerHeight - PORTAL_VIEWPORT_EDGE_INSET - minPanelHeight;
  }

  top = Math.max(PORTAL_VIEWPORT_EDGE_INSET, top);
  const maxBlockSize = window.innerHeight - top - PORTAL_VIEWPORT_EDGE_INSET;

  panel.style.left = `${left}px`;
  panel.style.width = `${triggerRect.width}px`;
  panel.style.maxHeight = `${Math.max(rowHeight, maxBlockSize)}px`;
  panel.style.top = `${top}px`;
}

/**
 * Combobox — отображает выбор значения из списка с поиском в панели.
 *
 * @example
 * <Combobox
 *   label="Locale:"
 *   options={options}
 *   value={value}
 *   onChange={setValue}
 * />
 */
export function Combobox({
  'aria-label': ariaLabel,
  defaultValue,
  disabled = DEFAULT_COMBOBOX_DISABLED,
  emptyMessage = DEFAULT_COMBOBOX_EMPTY_MESSAGE,
  iconFill,
  iconPosition = DEFAULT_ICON_POSITION,
  iconTone,
  label,
  onChange,
  options,
  placeholder = DEFAULT_COMBOBOX_PLACEHOLDER,
  searchPlaceholder = DEFAULT_COMBOBOX_SEARCH_PLACEHOLDER,
  shape,
  showClear = DEFAULT_COMBOBOX_SHOW_CLEAR,
  sizePreset,
  value,
  ...rest
}: ComboboxProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const surfaceProps = { iconTone, shape, sizePreset };
  const textSizePreset = getComboboxTextSize(sizePreset);
  const isIconStart = iconPosition === 'start';
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const triggerId = useId();
  const { handleClose, handleOpen, isOpen, panelRef } =
    useAnchoredOpen<HTMLDivElement>();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    defaultValue
  );

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalSelected;
  const isClearVisible =
    showClear && selectedValue !== undefined && selectedValue !== '' && !disabled;
  const showChevron = !isClearVisible;
  const iconNode = showChevron && (
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={iconTone}
      interactive
      showBorder
      showHover={false}
      showShadow={false}
      sizePreset={sizePreset}
    >
      <ChevronDownIcon />
    </Icon>
  );
  const clearNode = isClearVisible && (
    <Icon
      aria-label={resolveClearAriaLabel(label)}
      as="button"
      data-slot="clear"
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      showBorder
      showShadow={false}
      sizePreset={sizePreset}
      onClick={handleClear}
    >
      <CloseIcon />
    </Icon>
  );
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = filterComboboxOptions(options, normalizedQuery);

  function focusComboboxSearch(panel: HTMLElement): void {
    const searchInput = panel.querySelector<HTMLInputElement>('input[type="search"]');

    searchInput?.focus();
  }

  /**
   * Прокручивает активную опцию в видимую область списка при открытой панели.
   * Срабатывает при смене `activeIndex` и открытии панели.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const activeOption = panelRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );

    activeOption?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex, panelRef]);

  function initialActiveIndex(
    list: readonly ComboboxOption[],
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
    handleOpen();
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
    handleClose();
    setQuery('');
  }

  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    if (!isControlled) {
      setInternalSelected(undefined);
    }

    onChange?.('');
    handleClose();
    setQuery('');
  }

  function moveActive(step: -1 | 1): void {
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
      handleClose();
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'Escape') {
      handleClose();
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
    <StyledComboboxRoot
      data-disabled={disabled ? '' : undefined}
      data-open={isOpen}
      ref={rootRef}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>
      <StyledComboboxTriggerRow
        data-has-clear={isClearVisible ? '' : undefined}
        data-open={isOpen}
        ref={triggerRowRef}
        {...surfaceProps}
      >
        {isIconStart && clearNode}

        <StyledComboboxTrigger
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          disabled={disabled}
          id={triggerId}
          ref={triggerRef}
          type="button"
          {...surfaceProps}
          onClick={() => (isOpen ? handleClose() : openPanel())}
          onKeyDown={handleTriggerKeyDown}
        >
          {iconPosition === 'start' && iconNode}
          <StyledComboboxValue sizePreset={sizePreset}>
            {Boolean(selectedOption?.icon) && (
              <Icon showHover={false} sizePreset={sizePreset}>
                {selectedOption?.icon}
              </Icon>
            )}
            <Text
              ellipsis
              minInlineSize="0"
              sizePreset={textSizePreset}
              tone={selectedOption ? undefined : 'muted'}
            >
              {selectedOption?.label ?? placeholder}
            </Text>
          </StyledComboboxValue>
          {iconPosition === 'end' && iconNode}
        </StyledComboboxTrigger>

        {!isIconStart && clearNode}
      </StyledComboboxTriggerRow>

      <AnchoredPortal
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        positionStrategy={{
          anchorRef: triggerRowRef,
          apply: (anchor, panel) =>
            applyComboboxPanelPosition(
              anchor,
              panel,
              Math.max(filtered.length, 1),
              searchInputRef.current?.offsetHeight
            ),
          layoutDeps: [filtered.length],
        }}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={focusComboboxSearch}
      >
        <StyledComboboxPanel
          ref={panelRef}
          shape={shape}
          sizePreset={sizePreset}
          onKeyDown={handlePanelKeyDown}
        >
          <StyledComboboxSearchRow data-has-clear={query.length > 0 ? '' : undefined}>
            <Input
              aria-activedescendant={activeOptionId}
              aria-controls={listId}
              aria-expanded
              placeholder={searchPlaceholder}
              ref={searchInputRef}
              shape={shape}
              showBorder={false}
              sizePreset={sizePreset}
              type="search"
              value={query}
              onChange={handleQueryChange}
            />
            {query.length > 0 && (
              <Icon
                aria-label="Clear search"
                as="button"
                padding={12}
                shape="round"
                showHover={false}
                sizePreset="normal"
                onClick={() => {
                  setQuery('');
                  searchInputRef.current?.focus();
                }}
              >
                <CloseIcon />
              </Icon>
            )}
          </StyledComboboxSearchRow>

          <StyledComboboxList
            aria-label={label ?? placeholder}
            id={listId}
            role="listbox"
            sizePreset={sizePreset}
          >
            {filtered.length === 0 && (
              <Text
                as="li"
                paddingBlock={8}
                placeSelf="center"
                role="presentation"
                sizePreset={textSizePreset}
                tone="muted"
              >
                {emptyMessage}
              </Text>
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
                      <Icon showHover={false} sizePreset={sizePreset}>
                        {option.icon}
                      </Icon>
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
                      <Icon
                        data-slot="check"
                        iconFill="primary"
                        marginInlineStart="auto"
                        position="relative"
                        showHover={false}
                        sizePreset={sizePreset}
                        zIndex={1}
                      >
                        <CheckIcon />
                      </Icon>
                    )}
                  </StyledComboboxOption>
                </li>
              );
            })}
          </StyledComboboxList>
        </StyledComboboxPanel>
      </AnchoredPortal>
    </StyledComboboxRoot>
  );
}

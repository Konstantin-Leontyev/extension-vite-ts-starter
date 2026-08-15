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
 * 4. Выставлять `role` и `aria`-атрибуты триггера, поля поиска и панели.
 *    Поле поиска — `role="combobox"` и `aria-autocomplete="list"`.
 *    Фокус панели — на поле поиска
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
import {
  DEFAULT_ICON_POSITION,
  Icon,
  resolveIconShape,
  type IconPosition,
} from '@ui/icon';
import {
  getOpenControlTextSize,
  resolveEnabledOpenControlIndex,
} from '@ui/open-control';
import { SearchField } from '@ui/search-field';
import { Text } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  StyledComboboxList,
  StyledComboboxOption,
  StyledComboboxPanel,
  StyledComboboxRoot,
  StyledComboboxTrigger,
  StyledComboboxTriggerRow,
  StyledComboboxValue,
  splitLayoutProps,
  type ComboboxStyleProps,
} from './combobox.styles';

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
  const iconShape = resolveIconShape(shape);
  const textSizePreset = getOpenControlTextSize(sizePreset);
  const isIconStart = iconPosition === 'start';
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
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
      shape={iconShape}
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
      shape={iconShape}
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

  function handleOpenFocus(): void {
    searchInputRef.current?.focus();
  }

  /**
   * Прокручивает активную опцию в видимую область списка по ссылке на узел.
   * Срабатывает при смене `activeIndex` и открытии панели.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  function initialActiveIndex(
    list: readonly ComboboxOption[],
    selected: string | undefined
  ): number {
    const selectedFilteredIndex = list.findIndex(
      (option) => option.value === selected && !option.disabled
    );

    return selectedFilteredIndex >= 0
      ? selectedFilteredIndex
      : Math.max(0, resolveEnabledOpenControlIndex(list, 0, 1));
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
    setActiveIndex(Math.max(0, resolveEnabledOpenControlIndex(nextFiltered, 0, 1)));
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
      const next = resolveEnabledOpenControlIndex(filtered, current + step, step);

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
      setActiveIndex(Math.max(0, resolveEnabledOpenControlIndex(filtered, 0, 1)));

      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(
        Math.max(0, resolveEnabledOpenControlIndex(filtered, filtered.length - 1, -1))
      );

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
      ref={rootRef}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>
      <StyledComboboxTriggerRow
        data-has-clear={isClearVisible ? '' : undefined}
        data-open={isOpen ? 'true' : undefined}
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
        anchorRef={triggerRowRef}
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={handleOpenFocus}
      >
        <StyledComboboxPanel
          ref={panelRef}
          shape={shape}
          sizePreset={sizePreset}
          onKeyDown={handlePanelKeyDown}
        >
          <SearchField
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded
            placeholder={searchPlaceholder}
            ref={searchInputRef}
            role="combobox"
            shape={shape}
            showBorder={false}
            showIcon={false}
            sizePreset={sizePreset}
            value={query}
            onChange={handleQueryChange}
            onClear={() => setQuery('')}
          />

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
                    data-active={
                      index === activeIndex && !option.disabled ? true : undefined
                    }
                    disabled={disabled || option.disabled}
                    id={`${listId}-${option.value}`}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    role="option"
                    shape={shape}
                    sizePreset={sizePreset}
                    type="button"
                    onClick={() => commitSelected(option)}
                    onMouseMove={() => {
                      if (disabled || option.disabled) {
                        return;
                      }

                      setActiveIndex(index);
                    }}
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

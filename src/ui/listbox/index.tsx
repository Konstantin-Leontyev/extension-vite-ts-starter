/**
 * Файл: `src/ui/listbox/index.tsx`
 * Предоставляет компонент Listbox для отображения выбора значения из списка опций.
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
 *  - чекбоксы в строках опций через проп `inlineCheckbox`. Без `multiple` чекбоксы
 *    не показываются
 *  - подпись над триггером через проп `label`
 *  - множественный выбор через проп `multiple`
 *  - обработчик изменения значения через проп `onChange`
 *  - опции списка через проп `options`
 *  - плейсхолдер неактивного триггера через проп `placeholder`
 *  - резерв высоты под строку ошибки через проп `reserveErrorSpace`
 *  - контролируемое значение через проп `value`
 *  - опциональный сброс выбора через проп `showClear`. Базовая логика — шеврон.
 *    Clear появляется при выборе, только когда проп включён
 *
 * Основные задачи:
 * 1. Экспортировать компонент Listbox
 * 2. Типизировать пропсы через `ListboxProps`
 * 3. Экспортировать тип `ListboxOption`
 * 4. Выставлять `role` и `aria`-атрибуты триггера и панели
 *
 * Потребители:
 *  - панели настроек витрины дизайн-системы, например SizeListbox и ToneListbox —
 *    выбирают значения настроек
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { getFocusables } from '@hooks/use-focus';
import { CheckIcon, ChevronDownIcon, CloseIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Checkbox } from '@ui/checkbox';
import { FieldLabel } from '@ui/field-label';
import { DEFAULT_ICON_POSITION, Icon, type IconPosition } from '@ui/icon';
import { Text, getTextLineHeight, type TextSizePreset } from '@ui/text';
import { type TonePreset } from '@ui/tones';
import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

import {
  StyledListboxOptionButton,
  StyledListboxOptionRow,
  StyledListboxPanel,
  StyledListboxRoot,
  StyledListboxTrigger,
  StyledListboxTriggerRow,
  getListboxTextSize,
  splitLayoutProps,
  type ListboxStyleProps,
} from './listbox.styles';

/**
 * DEFAULT_LISTBOX_DISABLED — задаёт недоступное состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `disabled`.
 */
const DEFAULT_LISTBOX_DISABLED = false;

/**
 * DEFAULT_LISTBOX_INLINE_CHECKBOX — задаёт режим чекбоксов в строках по умолчанию.
 * Используется, когда вызывающий код не передал проп `inlineCheckbox`.
 */
const DEFAULT_LISTBOX_INLINE_CHECKBOX = false;

/**
 * DEFAULT_LISTBOX_MULTIPLE — задаёт режим множественного выбора по умолчанию.
 * Используется, когда вызывающий код не передал проп `multiple`.
 */
const DEFAULT_LISTBOX_MULTIPLE = false;

/**
 * DEFAULT_LISTBOX_PLACEHOLDER — задаёт плейсхолдер неактивного триггера по умолчанию.
 * Используется, когда вызывающий код не передал проп `placeholder`.
 */
const DEFAULT_LISTBOX_PLACEHOLDER = 'Select…';

/**
 * DEFAULT_LISTBOX_RESERVE_ERROR_SPACE — задаёт резерв высоты под строку ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveErrorSpace`.
 */
const DEFAULT_LISTBOX_RESERVE_ERROR_SPACE = false;

/**
 * DEFAULT_LISTBOX_SHOW_CLEAR — задаёт показ кнопки сброса выбора по умолчанию.
 * Используется, когда вызывающий код не передал проп `showClear`. Базовая логика —
 * шеврон. Clear включается явно.
 */
const DEFAULT_LISTBOX_SHOW_CLEAR = false;

/**
 * LISTBOX_ERROR_TEXT_SIZE_PRESET — задаёт типографический пресет строки ошибки.
 * Используется для расчёта резерва высоты под строку ошибки.
 */
const LISTBOX_ERROR_TEXT_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * ListboxOption — представляет опцию списка Listbox.
 *
 * @property disabled — включает недоступное состояние опции
 * @property label — содержимое подписи опции
 * @property value — стабильный ключ опции
 */
export type ListboxOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

/**
 * ListboxProps — представляет пропсы компонента Listbox.
 *
 * @property defaultValue — начальное значение в неконтролируемом режиме
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа шеврона при нейтральном `iconTone`
 * @property iconPosition — позиция шеврона относительно значения
 * @property inlineCheckbox — включает чекбоксы в строках опций. Без `multiple`
 *   чекбоксы не показываются
 * @property label — подпись над триггером
 * @property multiple — включает множественный выбор
 * @property onChange — обработчик изменения значения
 * @property options — опции списка
 * @property placeholder — плейсхолдер неактивного триггера
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки, чтобы
 *   появление текста не сдвигало соседей
 * @property showClear — включает кнопку сброса выбора при выбранном значении
 * @property value — контролируемое значение
 */
type ListboxProps = ListboxStyleProps & {
  defaultValue?: string | string[];
  disabled?: boolean;
  iconFill?: TonePreset;
  iconPosition?: IconPosition;
  inlineCheckbox?: boolean;
  label?: string;
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  options: ListboxOption[];
  placeholder?: string;
  reserveErrorSpace?: boolean;
  showClear?: boolean;
  value?: string | string[];
} & Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'onChange' | 'style' | keyof ListboxStyleProps
  >;

/**
 * toSelectedValues — преобразует сырое значение в массив выбранных ключей.
 *
 * Как работает:
 * 1. Без значения возвращает пустой массив
 * 2. В режиме `multiple` нормализует скаляр в массив из одного ключа
 * 3. В одиночном режиме берёт первый элемент массива или сам скаляр. Пустую
 *    строку отбрасывает
 *
 * @param raw сырое значение пропа `value` или `defaultValue`
 * @param multiple признак множественного выбора
 * @returns массив выбранных ключей
 */
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

/**
 * formatMultipleTriggerLabel — возвращает подпись триггера при множественном выборе.
 *
 * Как работает:
 * 1. Собирает подписи выбранных опций
 * 2. Без выбранных возвращает `null` — триггер покажет плейсхолдер
 * 3. Для одной опции возвращает её подпись, для нескольких — счётчик
 *    вида `N selected`
 *
 * @param options опции списка
 * @param selected выбранные ключи
 * @returns подпись одной опции, счётчик выбранных или `null`
 */
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

/**
 * resolveCircularAfterIndices — возвращает круговую очередь индексов после выбранного.
 * Порядок: next..end, затем 0..prev.
 *
 * Как работает:
 * 1. Идёт шагами от 1 до `optionCount - 1`
 * 2. На каждом шаге кладёт индекс `(selectedIndex + step) % optionCount`
 *
 * @param selectedIndex индекс выбранной опции
 * @param optionCount число опций
 * @returns индексы опций после выбранной по кругу
 */
function resolveCircularAfterIndices(
  selectedIndex: number,
  optionCount: number
): number[] {
  const afterIndices: number[] = [];

  for (let step = 1; step < optionCount; step += 1) {
    afterIndices.push((selectedIndex + step) % optionCount);
  }

  return afterIndices;
}

/**
 * splitPanelOptionIndices — делит опции вокруг выбранной строки на линии триггера.
 * Заполняет вниз сколько влезает, остаток уходит вверх, затем поджимает,
 * пока вся панель не уместится во вьюпорт.
 *
 * Как работает:
 * 1. Строит круговую очередь индексов после выбранной через `resolveCircularAfterIndices`
 * 2. Берёт вниз столько строк, сколько влезает по `rowsFitBelow`
 * 3. При известных `triggerTop` и `rowHeight` уменьшает число строк вниз, пока
 *    панель с учётом `PORTAL_VIEWPORT_EDGE_INSET` не поместится во вьюпорт
 * 4. Отдаёт индексы выше и ниже выбранной
 *
 * @param selectedIndex индекс выбранной опции
 * @param optionCount число опций
 * @param rowsFitBelow сколько строк опций влезает ниже триггера
 * @param triggerTop верх триггера во вьюпорте
 * @param rowHeight высота строки опции
 * @returns индексы опций выше и ниже выбранной
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

  const circularAfter = resolveCircularAfterIndices(selectedIndex, optionCount);
  let belowCount = Math.min(circularAfter.length, Math.max(0, rowsFitBelow));

  if (triggerTop !== undefined && rowHeight !== undefined && rowHeight > 0) {
    while (belowCount >= 0) {
      const aboveCount = circularAfter.length - belowCount;
      const panelTop = triggerTop - aboveCount * rowHeight;
      const panelHeight = optionCount * rowHeight;
      const panelBottom = panelTop + panelHeight;

      if (
        panelTop >= PORTAL_VIEWPORT_EDGE_INSET &&
        panelBottom + PORTAL_VIEWPORT_EDGE_INSET <= window.innerHeight
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

/**
 * countRowsFitBelow — возвращает число строк опций, влезающих ниже триггера.
 *
 * Как работает:
 * 1. Считает свободное место ниже выбранной строки с учётом
 *    `PORTAL_VIEWPORT_EDGE_INSET`
 * 2. Делит его на высоту строки и отдаёт целое число строк
 *
 * @param triggerTop верх триггера во вьюпорте
 * @param rowHeight высота строки опции
 * @returns целое число строк ниже выбранной
 */
function countRowsFitBelow(triggerTop: number, rowHeight: number): number {
  const spaceBelowSelected = Math.max(
    0,
    window.innerHeight - triggerTop - rowHeight - PORTAL_VIEWPORT_EDGE_INSET
  );

  return Math.floor(spaceBelowSelected / Math.max(1, rowHeight));
}

/**
 * PanelOrder — представляет раскладку индексов опций вокруг выбранной строки.
 *
 * @property aboveIndices — индексы опций выше выбранной
 * @property belowIndices — индексы опций ниже выбранной
 * @property optionCount — число опций на момент расчёта
 * @property selectedIndex — индекс выбранной опции
 */
type PanelOrder = {
  aboveIndices: number[];
  belowIndices: number[];
  optionCount: number;
  selectedIndex: number;
};

/**
 * panelOrdersEqual — возвращает признак равенства двух раскладок панели.
 *
 * Как работает:
 * 1. При `left === null` возвращает `false`
 * 2. Сравнивает `selectedIndex` и `optionCount`
 * 3. Сравнивает длины массивов индексов выше и ниже
 * 4. Поэлементно сравнивает оба массива индексов
 *
 * @param left предыдущая раскладка или `null`
 * @param right новая раскладка
 * @returns `true`, когда индексы и счётчики совпадают
 */
function panelOrdersEqual(left: null | PanelOrder, right: PanelOrder): boolean {
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
    left.aboveIndices.every(
      (optionIndex, position) => optionIndex === right.aboveIndices[position]
    ) &&
    left.belowIndices.every(
      (optionIndex, position) => optionIndex === right.belowIndices[position]
    )
  );
}

/**
 * applyListboxPanelPosition — позиционирует панель относительно триггера по раскладке.
 *
 * Как работает:
 * 1. Без раскладки выходит — позиционировать нечего
 * 2. Берёт геометрию триггера: ширина, левый край и высота строки
 * 3. Считает верх панели как верх триггера минус число строк выше выбранной
 * 4. Выставляет `left`, `width`, сбрасывает `scrollTop` и пишет `top`
 *
 * @param trigger элемент-триггер
 * @param panel элемент панели
 * @param order текущая раскладка опций или `null`
 */
function applyListboxPanelPosition(
  trigger: HTMLElement,
  panel: HTMLElement,
  order: null | PanelOrder
): void {
  if (!order) {
    return;
  }

  const triggerRect = trigger.getBoundingClientRect();
  const rowHeight = triggerRect.height;
  const panelTop = triggerRect.top - order.aboveIndices.length * rowHeight;

  panel.style.left = `${triggerRect.left}px`;
  panel.style.width = `${triggerRect.width}px`;
  panel.scrollTop = 0;
  panel.style.top = `${panelTop}px`;
}

/**
 * handleOpenFocus — переводит фокус на выбранную или первую доступную опцию.
 *
 * Как работает:
 * 1. Ищет кнопку выбранной опции без `disabled`
 * 2. Иначе берёт первую фокусируемую кнопку панели через `getFocusables`
 * 3. Переводит фокус на найденную цель
 *
 * @param panel элемент панели
 */
function handleOpenFocus(panel: HTMLElement): void {
  const selectedOption = panel.querySelector<HTMLElement>(
    'li[aria-selected="true"] button:not([disabled])'
  );
  const focusTarget =
    selectedOption ??
    getFocusables(panel).find((element) => element.tagName === 'BUTTON');

  focusTarget?.focus();
}

/**
 * Listbox — отображает выбор значения из списка опций с выпадающей панелью.
 *
 * @example
 * <Listbox
 *   label="Tone:"
 *   options={LISTBOX_DEMO_OPTIONS}
 *   value={tone}
 *   onChange={setTone}
 * />
 * <Listbox multiple inlineCheckbox options={options} value={selected} onChange={setSelected} />
 */
export function Listbox({
  defaultValue,
  disabled = DEFAULT_LISTBOX_DISABLED,
  iconFill,
  iconPosition = DEFAULT_ICON_POSITION,
  iconTone,
  inlineCheckbox = DEFAULT_LISTBOX_INLINE_CHECKBOX,
  label,
  multiple = DEFAULT_LISTBOX_MULTIPLE,
  onChange,
  options,
  placeholder = DEFAULT_LISTBOX_PLACEHOLDER,
  reserveErrorSpace = DEFAULT_LISTBOX_RESERVE_ERROR_SPACE,
  shape,
  showClear = DEFAULT_LISTBOX_SHOW_CLEAR,
  sizePreset,
  value,
  ...rest
}: ListboxProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const surfaceProps = { iconTone, shape, sizePreset };
  const textSizePreset = getListboxTextSize(sizePreset);
  const isIconStart = iconPosition === 'start';
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const panelOrderRef = useRef<null | PanelOrder>(null);
  const listId = useId();
  const triggerId = useId();
  const { handleClose, handleToggle, isOpen, panelRef } =
    useAnchoredOpen<HTMLUListElement>();
  const [panelOrder, setPanelOrder] = useState<null | PanelOrder>(null);
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    toSelectedValues(defaultValue, multiple)
  );

  const isControlled = value !== undefined;
  const selected = isControlled ? toSelectedValues(value, multiple) : internalSelected;
  const selectedValue = selected[0];
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const optionsKey = options.map((option) => option.value).join('\0');
  const isClearVisible = showClear && selected.length > 0 && !disabled;
  const showChevron = !isClearVisible;
  const iconNode = showChevron && (
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={iconTone}
      interactive
      showBorder
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

  /**
   * Пересчитывает порядок строк панели при открытии и смене выбора или опций.
   */
  useLayoutEffect(() => {
    if (!isOpen) {
      panelOrderRef.current = null;

      return;
    }

    const triggerElement = triggerRowRef.current;

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
  }, [isOpen, options.length, optionsKey, selectedIndex]);

  function commitSelected(next: string[]): void {
    if (!isControlled) {
      setInternalSelected(next);
    }

    onChange?.(multiple ? next : (next[0] ?? ''));
  }

  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    commitSelected([]);
    handleClose();
  }

  function handleOptionToggle(option: ListboxOption): void {
    if (disabled || option.disabled) {
      return;
    }

    if (multiple) {
      const next = selected.includes(option.value)
        ? selected.filter((optionValue) => optionValue !== option.value)
        : [...selected, option.value];
      commitSelected(next);

      return;
    }

    commitSelected([option.value]);
    handleClose();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'Escape') {
      handleClose();
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (!disabled) {
        handleToggle();
      }
    }
  }

  const selectedOption = options.find((option) => option.value === selected[0]);
  const triggerLabel = multiple
    ? formatMultipleTriggerLabel(options, selected)
    : (selectedOption?.label ?? null);

  const showCheckbox = multiple && inlineCheckbox;
  const displayOrder =
    isOpen &&
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
        <li aria-selected={isSelected} key={option.value} role="option">
          <StyledListboxOptionRow shape={shape} sizePreset={sizePreset}>
            <Checkbox
              checked={isSelected}
              disabled={disabled || option.disabled}
              inverted
              sizePreset={sizePreset}
              onChange={() => {
                handleOptionToggle(option);
                (document.activeElement as HTMLElement | null)?.blur();
              }}
            />
            <Text data-slot="label" ellipsis sizePreset={textSizePreset}>
              {option.label}
            </Text>
          </StyledListboxOptionRow>
        </li>
      );
    }

    return (
      <li aria-selected={isSelected} key={option.value} role="option">
        <StyledListboxOptionButton
          disabled={disabled || option.disabled}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={() => handleOptionToggle(option)}
        >
          <Text data-slot="label" ellipsis sizePreset={textSizePreset}>
            {option.label}
          </Text>
          {isSelected && (
            <Icon
              data-slot="check"
              iconFill="primary"
              position="relative"
              showHover={false}
              sizePreset={sizePreset}
              zIndex={1}
            >
              <CheckIcon />
            </Icon>
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
    <StyledListboxRoot
      data-disabled={disabled ? '' : undefined}
      data-open={isOpen}
      ref={rootRef}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>
      <StyledListboxTriggerRow
        data-has-clear={isClearVisible ? '' : undefined}
        data-open={isOpen}
        ref={triggerRowRef}
        {...surfaceProps}
      >
        {isIconStart && clearNode}

        <StyledListboxTrigger
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          id={triggerId}
          ref={triggerRef}
          type="button"
          {...surfaceProps}
          onClick={handleToggle}
          onKeyDown={handleTriggerKeyDown}
        >
          {iconPosition === 'start' && iconNode}
          <Text
            data-slot="label"
            ellipsis
            sizePreset={textSizePreset}
            tone={triggerLabel ? undefined : 'muted'}
          >
            {triggerLabel ?? placeholder}
          </Text>
          {iconPosition === 'end' && iconNode}
        </StyledListboxTrigger>

        {!isIconStart && clearNode}
      </StyledListboxTriggerRow>

      {reserveErrorSpace && (
        <Text
          aria-hidden="true"
          as="p"
          minBlockSize={getTextLineHeight(LISTBOX_ERROR_TEXT_SIZE_PRESET)}
          sizePreset={LISTBOX_ERROR_TEXT_SIZE_PRESET}
        />
      )}

      <AnchoredPortal
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        openFocusDeps={[panelOrder, selectedIndex]}
        panelRef={panelRef}
        positionStrategy={{
          anchorRef: triggerRowRef,
          apply: (anchor, panel) =>
            applyListboxPanelPosition(anchor, panel, panelOrderRef.current),
          layoutDeps: [panelOrder],
        }}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={handleOpenFocus}
      >
        <StyledListboxPanel
          aria-multiselectable={multiple || undefined}
          id={listId}
          ref={panelRef}
          role="listbox"
          shape={shape}
          sizePreset={sizePreset}
        >
          {panelOptions}
        </StyledListboxPanel>
      </AnchoredPortal>
    </StyledListboxRoot>
  );
}

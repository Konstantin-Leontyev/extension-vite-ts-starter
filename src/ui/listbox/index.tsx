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
 *  - контролируемое значение через проп `value`
 *  - опциональный сброс выбора через проп `showClear`. Базовая логика — шеврон.
 *    Clear появляется при выборе, только когда проп включён
 *
 * Основные задачи:
 * 1. Экспортировать компонент Listbox
 * 2. Типизировать пропсы через `ListboxProps`
 * 3. Экспортировать тип `ListboxOption`
 * 4. Выставлять `role` и `aria`-атрибуты триггера, панели и строк опций.
 *    Фокус панели — на строке. Чекбокс в строке — презентационный
 * 5. Вести клавиатуру панели: стрелки, `Home` и `End` по видимому порядку барабана
 *    без смены выбора
 *
 * Потребители:
 *  - контролы и панели настроек витрины дизайн-системы, например SizeListbox
 *    и ToneListbox — выбирают значения настроек
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
import { CheckIcon, ChevronDownIcon, CloseIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Checkbox } from '@ui/checkbox';
import { FieldLabel } from '@ui/field-label';
import { DEFAULT_ICON_POSITION, Icon, type IconPosition } from '@ui/icon';
import {
  OPEN_CONTROL_PANEL_MAX_OPTION_ROWS,
  getOpenControlTextSize,
  resolveEnabledOpenControlIndex,
} from '@ui/open-control';
import { Text } from '@ui/text';
import { type TonePreset } from '@ui/tones';
import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

import {
  StyledListboxOption,
  StyledListboxPanel,
  StyledListboxRoot,
  StyledListboxTrigger,
  StyledListboxTriggerRow,
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
 * DEFAULT_LISTBOX_SHOW_CLEAR — задаёт показ кнопки сброса выбора по умолчанию.
 * Используется, когда вызывающий код не передал проп `showClear`.
 */
const DEFAULT_LISTBOX_SHOW_CLEAR = false;

/**
 * LISTBOX_DRUM_SHIFT_NONE — задаёт нулевой сдвиг барабана.
 * Используется, когда текущей раскладки панели нет.
 */
const LISTBOX_DRUM_SHIFT_NONE = '0px';

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
  options: readonly ListboxOption[];
  placeholder?: string;
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
  options: readonly ListboxOption[],
  selected: readonly string[]
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
 * resolveCircularAfterIndices — возвращает круговую очередь индексов после строки
 * на линии триггера. Порядок: next..end, затем 0..prev.
 *
 * Как работает:
 * 1. Идёт шагами от 1 до `optionCount - 1`
 * 2. На каждом шаге кладёт индекс `(lineIndex + step) % optionCount`
 *
 * @param lineIndex индекс строки на линии триггера
 * @param optionCount число опций
 * @returns индексы опций после строки на линии триггера по кругу
 */
function resolveCircularAfterIndices(lineIndex: number, optionCount: number): number[] {
  const afterIndices: number[] = [];

  for (let step = 1; step < optionCount; step += 1) {
    afterIndices.push((lineIndex + step) % optionCount);
  }

  return afterIndices;
}

/**
 * resolveDrumLineIndex — вычисляет индекс строки на линии триггера.
 * Берёт выбранную опцию, иначе первую доступную.
 *
 * @param options опции списка
 * @param selectedIndex индекс выбранной опции
 * @returns индекс строки на линии триггера
 */
function resolveDrumLineIndex(
  options: readonly ListboxOption[],
  selectedIndex: number
): number {
  if (selectedIndex >= 0) {
    return selectedIndex;
  }

  const firstAvailableIndex = resolveEnabledOpenControlIndex(options, 0, 1);

  return firstAvailableIndex >= 0 ? firstAvailableIndex : 0;
}

/**
 * splitPanelOptionIndices — делит опции вокруг строки на линии триггера.
 * Заполняет вниз сколько влезает в потолок, остаток видимого окна уходит вверх,
 * хвост сверх потолка — ниже строки на линии; затем поджимает, пока видимая панель
 * не уместится во вьюпорт.
 *
 * Как работает:
 * 1. Строит круговую очередь индексов после строки на линии через
 *    `resolveCircularAfterIndices`
 * 2. Ограничивает видимую высоту панели `OPEN_CONTROL_PANEL_MAX_OPTION_ROWS`
 * 3. Берёт вниз столько строк, сколько влезает по `rowsFitBelow` и потолку
 * 4. При известных `triggerTop` и `rowHeight` уменьшает число строк вниз, пока
 *    видимая панель с учётом `PORTAL_VIEWPORT_EDGE_INSET` не поместится во вьюпорт
 * 5. Строки выше — последние из остатка в пределах потолка; остальное уходит
 *    в хвост ниже строки на линии
 *
 * @param lineIndex индекс строки на линии триггера
 * @param optionCount число опций
 * @param rowsFitBelow сколько строк опций влезает ниже триггера
 * @param triggerTop верх триггера во вьюпорте
 * @param rowHeight высота строки опции
 * @returns индексы опций выше и ниже строки на линии триггера
 */
function splitPanelOptionIndices(
  lineIndex: number,
  optionCount: number,
  rowsFitBelow: number,
  triggerTop?: number,
  rowHeight?: number
): { aboveIndices: number[]; belowIndices: number[] } {
  if (lineIndex < 0 || optionCount === 0) {
    return { aboveIndices: [], belowIndices: [] };
  }

  const circularAfter = resolveCircularAfterIndices(lineIndex, optionCount);
  const visibleRowCount = Math.min(optionCount, OPEN_CONTROL_PANEL_MAX_OPTION_ROWS);
  const maxOtherRows = Math.max(0, visibleRowCount - 1);
  let belowCount = Math.min(circularAfter.length, Math.max(0, rowsFitBelow), maxOtherRows);

  if (triggerTop !== undefined && rowHeight !== undefined && rowHeight > 0) {
    while (belowCount >= 0) {
      const remaining = circularAfter.length - belowCount;
      const aboveCount = Math.min(remaining, maxOtherRows - belowCount);
      const panelTop = triggerTop - aboveCount * rowHeight;
      const panelHeight = visibleRowCount * rowHeight;
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

  const remainingAfterBelow = circularAfter.slice(belowCount);
  const aboveCount = Math.min(remainingAfterBelow.length, maxOtherRows - belowCount);
  const overflowIndices = remainingAfterBelow.slice(
    0,
    remainingAfterBelow.length - aboveCount
  );

  return {
    aboveIndices: remainingAfterBelow.slice(remainingAfterBelow.length - aboveCount),
    belowIndices: [...circularAfter.slice(0, belowCount), ...overflowIndices],
  };
}

/**
 * countRowsFitBelow — возвращает число строк опций, влезающих ниже триггера.
 *
 * Как работает:
 * 1. Считает свободное место ниже триггера с учётом
 *    `PORTAL_VIEWPORT_EDGE_INSET`
 * 2. Делит его на высоту строки и отдаёт целое число строк
 *
 * @param triggerTop верх триггера во вьюпорте
 * @param rowHeight высота строки опции
 * @returns целое число строк ниже триггера
 */
function countRowsFitBelow(triggerTop: number, rowHeight: number): number {
  const spaceBelowSelected = Math.max(
    0,
    window.innerHeight - triggerTop - rowHeight - PORTAL_VIEWPORT_EDGE_INSET
  );

  return Math.floor(spaceBelowSelected / Math.max(1, rowHeight));
}

/**
 * PanelOrder — представляет раскладку индексов опций вокруг строки на линии триггера.
 *
 * @property aboveIndices — индексы опций выше строки на линии триггера
 * @property belowIndices — индексы опций ниже строки на линии триггера
 * @property drumShift — сдвиг барабана относительно якоря
 * @property lineIndex — индекс строки на линии триггера
 * @property optionCount — число опций на момент расчёта
 */
type PanelOrder = {
  aboveIndices: number[];
  belowIndices: number[];
  drumShift: string;
  lineIndex: number;
  optionCount: number;
};

/**
 * panelOrdersEqual — возвращает признак равенства двух раскладок панели.
 *
 * Как работает:
 * 1. При `left === null` возвращает `false`
 * 2. Сравнивает `drumShift`, `lineIndex` и `optionCount`
 * 3. Сравнивает длины массивов индексов выше и ниже
 * 4. Поэлементно сравнивает оба массива индексов
 *
 * @param left предыдущая раскладка или `null`
 * @param right новая раскладка
 * @returns `true`, когда индексы, сдвиг и счётчики совпадают
 */
function panelOrdersEqual(left: null | PanelOrder, right: PanelOrder): boolean {
  if (left === null) {
    return false;
  }

  if (
    left.drumShift !== right.drumShift ||
    left.lineIndex !== right.lineIndex ||
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
 * resolveInitialActiveIndex — возвращает индекс выбранной доступной опции,
 * иначе первой доступной.
 *
 * @param options опции списка
 * @param selectedIndex индекс выбранной опции
 * @returns индекс опции для начального фокуса или `-1`
 */
function resolveInitialActiveIndex(
  options: readonly ListboxOption[],
  selectedIndex: number
): number {
  if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
    return selectedIndex;
  }

  return resolveEnabledOpenControlIndex(options, 0, 1);
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
  shape,
  showClear = DEFAULT_LISTBOX_SHOW_CLEAR,
  sizePreset,
  value,
  ...rest
}: ListboxProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const surfaceProps = { iconTone, shape, sizePreset };
  const textSizePreset = getOpenControlTextSize(sizePreset);
  const isIconStart = iconPosition === 'start';
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const triggerId = useId();
  const { handleClose, handleOpen, isOpen, panelRef } =
    useAnchoredOpen<HTMLUListElement>();
  const [panelOrder, setPanelOrder] = useState<null | PanelOrder>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);
  const [tabStopIndex, setTabStopIndex] = useState(-1);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    toSelectedValues(defaultValue, multiple)
  );

  const isControlled = value !== undefined;
  const selected = isControlled ? toSelectedValues(value, multiple) : internalSelected;
  const selectedValue = selected[0];
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const lineIndex = resolveDrumLineIndex(options, selectedIndex);
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

  /**
   * Пересчитывает порядок строк и сдвиг барабана при открытии и смене выбора или опций.
   */
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const triggerElement = triggerRowRef.current;

    if (!triggerElement) {
      return;
    }

    const triggerRect = triggerElement.getBoundingClientRect();
    const rowHeight = triggerRect.height;
    const split = splitPanelOptionIndices(
      lineIndex,
      options.length,
      countRowsFitBelow(triggerRect.top, rowHeight),
      triggerRect.top,
      rowHeight
    );
    const nextOrder: PanelOrder = {
      ...split,
      drumShift: `${-split.aboveIndices.length * rowHeight}px`,
      lineIndex,
      optionCount: options.length,
    };

    setPanelOrder((current) =>
      panelOrdersEqual(current, nextOrder) ? current : nextOrder
    );
  }, [isOpen, lineIndex, options.length, optionsKey]);

  /**
   * Сбрасывает `scrollTop` панели при открытии, чтобы барабан стартовал с верха.
   */
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const panel = panelRef.current;

    if (panel !== null) {
      panel.scrollTop = 0;
    }
  }, [isOpen, panelRef]);

  /**
   * Прокручивает активную опцию в видимую область списка по ссылке на узел.
   * Срабатывает при смене `activeIndex` и открытии панели.
   */
  useLayoutEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

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

  function openPanel(): void {
    if (disabled) {
      return;
    }

    const initialIndex = resolveInitialActiveIndex(options, selectedIndex);

    setActiveIndex(initialIndex);
    setTabStopIndex(initialIndex);
    handleOpen();
  }

  function handleTriggerToggle(): void {
    if (isOpen) {
      handleClose();

      return;
    }

    openPanel();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'Escape') {
      handleClose();
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTriggerToggle();
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openPanel();
      setIsKeyboardNavigating(true);
    }
  }

  function handleOpenFocus(): void {
    const targetIndex =
      tabStopIndex >= 0 && !options[tabStopIndex]?.disabled
        ? tabStopIndex
        : resolveInitialActiveIndex(options, selectedIndex);

    optionRefs.current[targetIndex]?.focus();
  }

  const selectedOption = options.find((option) => option.value === selected[0]);
  const triggerLabel = multiple
    ? formatMultipleTriggerLabel(options, selected)
    : (selectedOption?.label ?? null);

  const showCheckbox = multiple && inlineCheckbox;
  const currentPanelOrder =
    isOpen &&
    panelOrder !== null &&
    panelOrder.lineIndex === lineIndex &&
    panelOrder.optionCount === options.length
      ? panelOrder
      : null;
  const displayOrder =
    currentPanelOrder ??
    splitPanelOptionIndices(
      lineIndex,
      options.length,
      Math.max(0, options.length - 1)
    );
  const drumShift = currentPanelOrder?.drumShift ?? LISTBOX_DRUM_SHIFT_NONE;
  const { aboveIndices, belowIndices } = displayOrder;
  const lineOption = options[lineIndex];
  const visualOrder =
    lineOption === undefined
      ? []
      : [...aboveIndices, lineIndex, ...belowIndices];
  const visualOptions = visualOrder.map((optionIndex) => options[optionIndex]);

  if (!isOpen && isKeyboardNavigating) {
    setIsKeyboardNavigating(false);
  }

  function moveActive(step: -1 | 1): void {
    const currentVisualIndex = visualOrder.indexOf(activeIndex);
    const from =
      currentVisualIndex >= 0
        ? currentVisualIndex + step
        : step === 1
          ? 0
          : visualOrder.length - 1;
    const nextVisual = resolveEnabledOpenControlIndex(visualOptions, from, step);

    if (nextVisual < 0) {
      return;
    }

    const nextIndex = visualOrder[nextVisual];

    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLUListElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      moveActive(1);

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      moveActive(-1);

      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      const nextVisual = resolveEnabledOpenControlIndex(visualOptions, 0, 1);

      if (nextVisual >= 0) {
        const nextIndex = visualOrder[nextVisual];

        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
      }

      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setIsKeyboardNavigating(true);
      const nextVisual = resolveEnabledOpenControlIndex(
        visualOptions,
        visualOrder.length - 1,
        -1
      );

      if (nextVisual >= 0) {
        const nextIndex = visualOrder[nextVisual];

        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
      }
    }
  }

  function handlePanelMouseMove(): void {
    if (isKeyboardNavigating) {
      setIsKeyboardNavigating(false);
    }
  }

  function renderOption(option: ListboxOption, optionIndex: number): ReactNode {
    const isSelected = selected.includes(option.value);
    const isOptionDisabled = Boolean(disabled || option.disabled);
    const isActive = optionIndex === activeIndex && !isOptionDisabled;
    const isTabStop = optionIndex === tabStopIndex && !isOptionDisabled;

    return (
      <StyledListboxOption
        aria-disabled={isOptionDisabled ? true : undefined}
        aria-selected={isSelected}
        data-active={isActive ? true : undefined}
        data-checkbox={showCheckbox ? '' : undefined}
        key={option.value}
        ref={(node) => {
          optionRefs.current[optionIndex] = node;
        }}
        role="option"
        shape={shape}
        sizePreset={sizePreset}
        tabIndex={isTabStop ? 0 : -1}
        onClick={() => {
          if (isOptionDisabled) {
            return;
          }

          setActiveIndex(optionIndex);
          optionRefs.current[optionIndex]?.focus();
          handleOptionToggle(option);
        }}
        onFocus={() => {
          if (!isOptionDisabled) {
            setTabStopIndex(optionIndex);
          }
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') {
            return;
          }

          event.preventDefault();

          if (isOptionDisabled) {
            return;
          }

          handleOptionToggle(option);
        }}
        onMouseMove={() => {
          if (isOptionDisabled) {
            return;
          }

          setActiveIndex(optionIndex);
        }}
      >
        {showCheckbox && (
          <Checkbox
            aria-hidden
            checked={isSelected}
            inverted
            readOnly
            sizePreset={sizePreset}
            tabIndex={-1}
          />
        )}
        <Text data-slot="label" ellipsis sizePreset={textSizePreset}>
          {option.label}
        </Text>
        {!showCheckbox && isSelected && (
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
      </StyledListboxOption>
    );
  }

  const panelOptions = visualOrder.map((optionIndex) =>
    renderOption(options[optionIndex], optionIndex)
  );

  return (
    <StyledListboxRoot
      data-disabled={disabled ? '' : undefined}
      ref={rootRef}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>
      <StyledListboxTriggerRow
        data-has-clear={isClearVisible ? '' : undefined}
        data-open={isOpen ? 'true' : undefined}
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
          onClick={handleTriggerToggle}
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

      <AnchoredPortal
        anchorRef={triggerRowRef}
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={handleOpenFocus}
      >
        <StyledListboxPanel
          $drumShift={drumShift}
          aria-multiselectable={multiple || undefined}
          data-keyboard-navigating={isKeyboardNavigating ? true : undefined}
          id={listId}
          ref={panelRef}
          role="listbox"
          shape={shape}
          sizePreset={sizePreset}
          onKeyDown={handlePanelKeyDown}
          onMouseMove={handlePanelMouseMove}
        >
          {panelOptions}
        </StyledListboxPanel>
      </AnchoredPortal>
    </StyledListboxRoot>
  );
}

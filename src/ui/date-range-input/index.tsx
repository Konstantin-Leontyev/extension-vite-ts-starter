/**
 * Файл: `src/ui/date-range-input/index.tsx`
 * Предоставляет компонент DateRangeInput для отображения выбора диапазона дат.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - кнопка сброса внутри ряда всегда `square`. Публичного пропа формы сброса нет:
 *    иначе шов с соседней кнопкой поедет
 *  - тон рамки через проп `borderTone`
 *  - форму кнопок подвала через проп `buttonShape`. Без `buttonShape` совпадает
 *    с `shape`
 *  - форму подсветки дня через проп `dayShape`. Без `dayShape` совпадает с `shape`
 *  - недоступное состояние через проп `disabled`
 *  - конечный день диапазона через проп `endDay`
 *  - текст `title` конечного сегмента через проп `endLabel`. Участвует в
 *    `aria-label` кнопки сброса, видимым лейблом сегмента не является
 *  - верхнюю границу допустимых дней через проп `maxDay`
 *  - нижнюю границу допустимых дней через проп `minDay`
 *  - обработчик сброса диапазона через проп `onClear`. Без обработчика кнопка
 *    сброса не показывается
 *  - обработчик изменения конечного дня через проп `onEndDayChange`
 *  - обработчик изменения начального дня через проп `onStartDayChange`
 *  - начальный день диапазона через проп `startDay`
 *  - текст `title` начального сегмента через проп `startLabel`. Участвует в
 *    `aria-label` кнопки сброса, видимым лейблом сегмента не является
 *  - иконка календаря всегда в позиции `start`. Публичного пропа позиции нет
 *  - подпись над рядом через проп `label`
 *  - черновик диапазона в открытой панели: клики по дням не пишут наружу до
 *    подтверждения. `Set` и `Enter` вне `Reset` и `Close` подтверждают и закрывают.
 *    `Enter` на `Close`, `Escape` и клик снаружи закрывают без подтверждения.
 *    `Reset` и `Enter` на нём чистят черновик без закрытия
 *
 * Основные задачи:
 * 1. Экспортировать компонент DateRangeInput
 * 2. Типизировать пропсы через `DateRangeInputProps`
 * 3. Выставлять `role="group"` и `aria-labelledby` при передаче `label`, а также
 *    `aria`-атрибуты сегментов и панели календаря.
 *    Фокус панели — на выбранном дне, иначе на первом доступном
 * 4. Реэкспортировать `todayUtc` из `src/ui/date-range-input/calendar-panel`
 *
 * Потребители:
 *  - страницы и виджеты приложения — выбирают диапазон дат
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { CalendarIcon, CloseIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { AnchoredPanel } from '@ui/anchored-panel';
import { FieldLabel } from '@ui/field-label';
import { Icon } from '@ui/icon';
import { DEFAULT_SHAPE_PRESET, getTextSize, type ShapePreset } from '@ui/presets';
import {
  SEGMENT_BUTTON_PARTS_FLUSH_SHAPE,
  SegmentButtonParts,
  SegmentButtonPartsDivider,
} from '@ui/segment-button-parts';

import {
  CalendarPanel,
  DATE_PLACEHOLDER,
  formatIsoDayCompact,
  isIsoDayAfter,
  monthViewFromIsoDayOrToday,
  type MonthView,
} from './calendar-panel';
import {
  StyledDateRangeInputPanel,
  StyledDateRangeInputRoot,
  StyledDateRangeInputTriggerRow,
  splitLayoutProps,
  type DateRangeInputStyleProps,
} from './date-range-input.styles';

/**
 * DEFAULT_DATE_RANGE_INPUT_DISABLED — задаёт недоступное состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `disabled`.
 */
const DEFAULT_DATE_RANGE_INPUT_DISABLED = false;

/**
 * DEFAULT_DATE_RANGE_INPUT_END_DAY — задаёт конечный день диапазона по умолчанию.
 * Используется, когда вызывающий код не передал проп `endDay`.
 */
const DEFAULT_DATE_RANGE_INPUT_END_DAY = '';

/**
 * DEFAULT_DATE_RANGE_INPUT_END_LABEL — задаёт текст `title` конечного сегмента по умолчанию.
 * Используется, когда вызывающий код не передал проп `endLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_END_LABEL = 'End date';

/**
 * DEFAULT_DATE_RANGE_INPUT_START_DAY — задаёт начальный день диапазона по умолчанию.
 * Используется, когда вызывающий код не передал проп `startDay`.
 */
const DEFAULT_DATE_RANGE_INPUT_START_DAY = '';

/**
 * DEFAULT_DATE_RANGE_INPUT_START_LABEL — задаёт текст `title` начального сегмента по умолчанию.
 * Используется, когда вызывающий код не передал проп `startLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_START_LABEL = 'Start date';

/**
 * PANEL_COMMIT_LABEL — задаёт текст кнопки подтверждения черновика в панели.
 */
const PANEL_COMMIT_LABEL = 'Set';

/**
 * PANEL_COMMIT_ACTION — задаёт `data-action` кнопки подтверждения черновика.
 */
const PANEL_COMMIT_ACTION = 'commit';

/**
 * PANEL_RESET_LABEL — задаёт текст кнопки сброса черновика в панели.
 */
const PANEL_RESET_LABEL = 'Reset';

/**
 * PANEL_RESET_ACTION — задаёт `data-action` кнопки сброса черновика.
 */
const PANEL_RESET_ACTION = 'reset';

/**
 * PANEL_DISMISS_LABEL — задаёт текст кнопки закрытия панели без подтверждения.
 * Совпадает по смыслу с Escape.
 */
const PANEL_DISMISS_LABEL = 'Close';

/**
 * PANEL_DISMISS_ACTION — задаёт `data-action` кнопки закрытия панели.
 */
const PANEL_DISMISS_ACTION = 'dismiss';

/**
 * CALENDAR_PANEL_ARIA_LABEL — задаёт текст `aria-label` диалога панели календаря.
 * Используется для статичного доступного имени панели без собственного титула.
 */
const CALENDAR_PANEL_ARIA_LABEL = 'Date range calendar';

/**
 * CLEAR_DATE_RANGE_ARIA_LABEL — задаёт запасной `aria-label` кнопки сброса диапазона.
 * Передаётся вторым аргументом в `resolveClearAriaLabel`, когда подписи сегментов пусты.
 */
const CLEAR_DATE_RANGE_ARIA_LABEL = 'Clear date range';

/**
 * DateRangeInputProps — представляет пропсы компонента DateRangeInput.
 *
 * @property buttonShape — форма кнопок подвала панели. Без пропа совпадает с `shape`
 * @property dayShape — форма подсветки дня в панели. Без пропа совпадает с `shape`
 * @property disabled — включает недоступное состояние
 * @property endDay — конечный день диапазона в формате ISO
 * @property endLabel — текст `title` конечного сегмента и фрагмент `aria-label`
 *   кнопки сброса. Видимым лейблом сегмента не является
 * @property label — подпись над рядом сегментов
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property onClear — обработчик сброса диапазона. Без обработчика кнопка сброса
 *   не показывается
 * @property onEndDayChange — обработчик изменения конечного дня
 * @property onStartDayChange — обработчик изменения начального дня
 * @property startDay — начальный день диапазона в формате ISO
 * @property startLabel — текст `title` начального сегмента и фрагмент `aria-label`
 *   кнопки сброса. Видимым лейблом сегмента не является
 */
type DateRangeInputProps = DateRangeInputStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    | 'className'
    | 'endDay'
    | 'onChange'
    | 'startDay'
    | 'style'
    | keyof DateRangeInputStyleProps
  > & {
    buttonShape?: ShapePreset;
    dayShape?: ShapePreset;
    disabled?: boolean;
    endDay?: string;
    endLabel?: string;
    label?: string;
    maxDay?: string;
    minDay?: string;
    onClear?: () => void;
    onEndDayChange?: (endDay: string) => void;
    onStartDayChange?: (startDay: string) => void;
    startDay?: string;
    startLabel?: string;
  };

/**
 * formatSegmentText — возвращает компактный текст дня или плейсхолдер пустого значения.
 *
 * @param isoDay день в формате ISO или пустая строка
 * @returns компактная дата или `DATE_PLACEHOLDER`
 */
function formatSegmentText(isoDay: string): string {
  return isoDay !== '' ? formatIsoDayCompact(isoDay) : DATE_PLACEHOLDER;
}

/**
 * minIsoDay — возвращает более ранний из двух ISO-дней.
 *
 * @param left первый день
 * @param right второй день
 * @returns более ранний день
 */
function minIsoDay(left: string, right: string): string {
  return isIsoDayAfter(left, right) ? right : left;
}

/**
 * maxIsoDay — возвращает более поздний из двух ISO-дней.
 *
 * @param left первый день
 * @param right второй день
 * @returns более поздний день
 */
function maxIsoDay(left: string, right: string): string {
  return isIsoDayAfter(left, right) ? left : right;
}

/**
 * isoDayUtcMs — возвращает UTC-миллисекунды полуночи ISO-дня.
 *
 * @param isoDay день в формате ISO
 * @returns миллисекунды UTC
 */
function isoDayUtcMs(isoDay: string): number {
  return Date.parse(`${isoDay}T00:00:00.000Z`);
}

/**
 * moveNearestRangeEdge — сдвигает ближайший край диапазона к кликнутому дню.
 * При равной дистанции предпочитает начальный край. После сдвига края
 * упорядочиваются через `min`/`max`.
 *
 * @param startDay текущий начальный день
 * @param endDay текущий конечный день
 * @param isoDay день клика
 * @returns новая пара краёв
 */
function moveNearestRangeEdge(
  startDay: string,
  endDay: string,
  isoDay: string
): { end: string; start: string } {
  const rangeStart = minIsoDay(startDay, endDay);
  const rangeEnd = maxIsoDay(startDay, endDay);
  const clickMs = isoDayUtcMs(isoDay);
  const distStart = Math.abs(clickMs - isoDayUtcMs(rangeStart));
  const distEnd = Math.abs(clickMs - isoDayUtcMs(rangeEnd));

  if (distStart <= distEnd) {
    return {
      end: maxIsoDay(isoDay, rangeEnd),
      start: minIsoDay(isoDay, rangeEnd),
    };
  }

  return {
    end: maxIsoDay(rangeStart, isoDay),
    start: minIsoDay(rangeStart, isoDay),
  };
}

/**
 * clearDateRangeButtonAriaLabel — возвращает `aria-label` кнопки сброса диапазона.
 *
 * Как работает:
 * 1. Обрезает краевые пробелы у `startLabel` и `endLabel`
 * 2. Склеивает оба непустых текста через `/` или берёт один непустой
 * 3. Собирает подпись сброса: при непустом фрагменте — `Clear` и фрагмент без
 *    завершающего `:`, иначе запасной текст `Clear date range`
 *
 * @param startLabel текст `title` начального сегмента
 * @param endLabel текст `title` конечного сегмента
 * @returns текст для `aria-label`
 */
function clearDateRangeButtonAriaLabel(startLabel: string, endLabel: string): string {
  const start = startLabel.trim();
  const end = endLabel.trim();

  if (start !== '' && end !== '') {
    return resolveClearAriaLabel(`${start} / ${end}`, CLEAR_DATE_RANGE_ARIA_LABEL);
  }

  return resolveClearAriaLabel(start || end, CLEAR_DATE_RANGE_ARIA_LABEL);
}

/**
 * DateRangeInput — отображает поле выбора диапазона дат с панелью календаря.
 *
 * @example
 * <DateRangeInput
 *   startDay={from}
 *   endDay={to}
 *   onStartDayChange={setFrom}
 *   onEndDayChange={setTo}
 *   onClear={clearRange}
 * />
 */
export function DateRangeInput({
  borderTone,
  buttonShape: buttonShapeProp,
  dayShape: dayShapeProp,
  disabled = DEFAULT_DATE_RANGE_INPUT_DISABLED,
  endDay = DEFAULT_DATE_RANGE_INPUT_END_DAY,
  endLabel = DEFAULT_DATE_RANGE_INPUT_END_LABEL,
  label,
  maxDay,
  minDay,
  onClear,
  onEndDayChange,
  onStartDayChange,
  shape,
  size,
  startDay = DEFAULT_DATE_RANGE_INPUT_START_DAY,
  startLabel = DEFAULT_DATE_RANGE_INPUT_START_LABEL,
  ...rest
}: DateRangeInputProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { handleClose, handleOpen, isOpen, panelRef } =
    useAnchoredOpen<HTMLDivElement>();
  const [draftStartDay, setDraftStartDay] = useState(startDay);
  const [draftEndDay, setDraftEndDay] = useState(endDay);
  const [viewMonth, setViewMonth] = useState<MonthView>(() =>
    monthViewFromIsoDayOrToday(startDay, maxDay)
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const startTriggerRef = useRef<HTMLButtonElement>(null);
  const endTriggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement>(null);
  const selectedDayRef = useRef<HTMLButtonElement>(null);
  const firstAvailableDayRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const panelId = useId();
  const buttonShape = buttonShapeProp ?? shape ?? DEFAULT_SHAPE_PRESET;
  const dayShape = dayShapeProp ?? shape ?? DEFAULT_SHAPE_PRESET;
  const surfaceProps = { borderTone, shape, size };
  const calendarIcon = <CalendarIcon />;
  const isActive = startDay !== '' || endDay !== '';
  const showClear = isActive && onClear !== undefined && !disabled;
  const textSizePreset = getTextSize(size);

  function handleOpenFromSegment(sourceDay: string): void {
    if (disabled) {
      return;
    }

    setDraftStartDay(startDay);
    setDraftEndDay(endDay);
    setViewMonth(monthViewFromIsoDayOrToday(sourceDay, maxDay));
    returnFocusRef.current = triggerRowRef.current;
    handleOpen();
  }

  /**
   * handleSelectDay — пишет черновик диапазона по кликам без фаз start/end.
   *
   * Как работает:
   * 1. Пусто или неполный черновик → оба края на кликнутый день
   * 2. Однодневный → пара `min`/`max` с кликнутым днём. Тот же день остаётся
   *    однодневным
   * 3. Полный диапазон → сдвигает ближайший край к клику наружу и внутрь
   *
   * @param isoDay выбранный день в формате ISO
   */
  function handleSelectDay(isoDay: string): void {
    if (draftStartDay === '' || draftEndDay === '') {
      setDraftStartDay(isoDay);
      setDraftEndDay(isoDay);
      return;
    }

    if (draftStartDay === draftEndDay) {
      setDraftStartDay(minIsoDay(draftStartDay, isoDay));
      setDraftEndDay(maxIsoDay(draftStartDay, isoDay));
      return;
    }

    const next = moveNearestRangeEdge(draftStartDay, draftEndDay, isoDay);
    setDraftStartDay(next.start);
    setDraftEndDay(next.end);
  }

  function handleCommit(): void {
    onStartDayChange?.(draftStartDay);
    onEndDayChange?.(draftEndDay);
    returnFocusRef.current = triggerRowRef.current;
    handleClose();
  }

  function handlePanelReset(): void {
    setDraftStartDay('');
    setDraftEndDay('');
    setViewMonth(monthViewFromIsoDayOrToday('', maxDay));
  }

  function handlePanelDismiss(): void {
    returnFocusRef.current = triggerRowRef.current;
    handleClose();
  }

  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onClear?.();
    returnFocusRef.current = triggerRowRef.current;
    handleClose();
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (event.target instanceof HTMLElement) {
      const focusedAction = event.target.closest('button')?.dataset.action;

      if (focusedAction === PANEL_RESET_ACTION) {
        handlePanelReset();
        return;
      }

      if (focusedAction === PANEL_DISMISS_ACTION) {
        handlePanelDismiss();
        return;
      }
    }

    handleCommit();
  }

  function handleOpenFocus(): void {
    (selectedDayRef.current ?? firstAvailableDayRef.current)?.focus();
  }

  function handleOpenStart(): void {
    handleOpenFromSegment(startDay);
  }

  function handleOpenEnd(): void {
    handleOpenFromSegment(endDay);
  }

  const leftSegment = {
    active: isOpen,
    ariaControls: panelId,
    ariaExpanded: isOpen,
    ariaHaspopup: 'dialog' as const,
    disabled,
    icon: calendarIcon,
    iconPosition: 'start' as const,
    ref: startTriggerRef,
    label: formatSegmentText(startDay),
    textTone: startDay === '' ? ('muted' as const) : undefined,
    title: startLabel,
    onClick: handleOpenStart,
  };

  const rightSegment = {
    active: isOpen,
    ariaControls: panelId,
    ariaExpanded: isOpen,
    ariaHaspopup: 'dialog' as const,
    disabled,
    icon: calendarIcon,
    iconPosition: 'start' as const,
    ref: endTriggerRef,
    label: formatSegmentText(endDay),
    textTone: endDay === '' ? ('muted' as const) : undefined,
    title: endLabel,
    onClick: handleOpenEnd,
  };

  const labelledBy = label ? labelId : undefined;

  return (
    <StyledDateRangeInputRoot
      aria-labelledby={labelledBy}
      ref={rootRef}
      role={labelledBy ? 'group' : undefined}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <StyledDateRangeInputTriggerRow
        data-has-clear={showClear ? '' : undefined}
        data-open={isOpen ? 'true' : undefined}
        ref={triggerRowRef}
        tabIndex={-1}
        {...surfaceProps}
      >
        <SegmentButtonParts
          left={leftSegment}
          right={rightSegment}
          // Прямые углы: скругление даёт обрезка ряда-триггера, не сегменты.
          shape={SEGMENT_BUTTON_PARTS_FLUSH_SHAPE}
          size={size}
          textSize={textSizePreset}
        />

        {showClear && (
          <>
            <SegmentButtonPartsDivider aria-hidden="true" size={size} />
            <Icon
              aria-label={clearDateRangeButtonAriaLabel(startLabel, endLabel)}
              as="button"
              data-slot="clear"
              disabled={disabled}
              shape="square"
              showBorder={false}
              size={size}
              onClick={handleClear}
            >
              <CloseIcon />
            </Icon>
          </>
        )}
      </StyledDateRangeInputTriggerRow>

      <AnchoredPanel
        anchorRef={triggerRowRef}
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        openFocusDeps={[viewMonth]}
        panelRef={panelRef}
        returnFocusRef={returnFocusRef}
        onDismiss={handlePanelDismiss}
        onOpenFocus={handleOpenFocus}
      >
        <StyledDateRangeInputPanel
          aria-label={CALENDAR_PANEL_ARIA_LABEL}
          aria-modal={true}
          id={panelId}
          ref={panelRef}
          role="dialog"
          onKeyDown={handlePanelKeyDown}
          {...surfaceProps}
        >
          <CalendarPanel
            dayShape={dayShape}
            firstAvailableDayRef={firstAvailableDayRef}
            maxDay={maxDay}
            minDay={minDay}
            rangeEnd={draftEndDay}
            rangeStart={draftStartDay}
            selectedDayRef={selectedDayRef}
            shape={shape}
            size={size}
            viewMonth={viewMonth}
            onSelectDay={handleSelectDay}
            onViewMonthChange={setViewMonth}
          />
          <SegmentButtonParts
            center={{
              dataAction: PANEL_RESET_ACTION,
              label: PANEL_RESET_LABEL,
              textTone: 'danger',
              onClick: handlePanelReset,
            }}
            left={{
              dataAction: PANEL_COMMIT_ACTION,
              label: PANEL_COMMIT_LABEL,
              textTone: 'success',
              onClick: handleCommit,
            }}
            right={{
              dataAction: PANEL_DISMISS_ACTION,
              label: PANEL_DISMISS_LABEL,
              onClick: handlePanelDismiss,
            }}
            shape={buttonShape}
            size={size}
            textSize={textSizePreset}
          />
        </StyledDateRangeInputPanel>
      </AnchoredPanel>
    </StyledDateRangeInputRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт todayUtc */
export { todayUtc } from './calendar-panel';

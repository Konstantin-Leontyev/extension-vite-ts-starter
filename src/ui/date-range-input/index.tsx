/**
 * Файл: `src/ui/date-range-input/index.tsx`
 * Предоставляет компонент DateRangeInput для выбора диапазона дат.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму через проп `shape`
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
 *
 * Основные задачи:
 * 1. Экспортировать компонент DateRangeInput
 * 2. Типизировать пропсы через `DateRangeInputProps`
 * 3. Выставлять `aria`-атрибуты сегментов и панели календаря
 * 4. Реэкспортировать `todayUtc` из вложенного `calendar-panel`
 *
 * Потребители:
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { useId, useRef, useState, type ComponentPropsWithRef } from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { placeCalendarPanel } from '@hooks/use-anchored-portal-position';
import { CalendarIcon, CloseIcon } from '@icons';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Icon } from '@ui/icon';
import { type ShapePreset } from '@ui/presets';
import { getSegmentButtonTextSize } from '@ui/segment-button';
import { SegmentButtonParts } from '@ui/segment-button-parts';

import {
  CalendarPanel,
  DATE_PLACEHOLDER,
  clearButtonAriaLabel,
  focusCalendarPanelInitial,
  formatIsoDayCompact,
  isIsoDayAfter,
  monthViewFromIsoDayOrToday,
  type MonthView,
} from './calendar-panel';
import {
  DEFAULT_DATE_RANGE_INPUT_SHAPE,
  DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET,
  StyledDateRangeInputPanel,
  StyledDateRangeInputRoot,
  StyledDateRangeInputTriggerRow,
  splitLayoutProps,
  type DateRangeInputStyleProps,
} from './date-range-input.styles';

/**
 * ActiveRangeField — представляет активное поле диапазона в открытой панели.
 */
type ActiveRangeField = 'end' | 'start';

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
 * DEFAULT_DATE_RANGE_INPUT_END_LABEL — задаёт текст `title` конечного сегмента
 * по умолчанию.
 * Используется, когда вызывающий код не передал проп `endLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_END_LABEL = 'End date';

/**
 * DEFAULT_DATE_RANGE_INPUT_START_DAY — задаёт начальный день диапазона по умолчанию.
 * Используется, когда вызывающий код не передал проп `startDay`.
 */
const DEFAULT_DATE_RANGE_INPUT_START_DAY = '';

/**
 * DEFAULT_DATE_RANGE_INPUT_START_LABEL — задаёт текст `title` начального сегмента
 * по умолчанию.
 * Используется, когда вызывающий код не передал проп `startLabel`.
 */
const DEFAULT_DATE_RANGE_INPUT_START_LABEL = 'Start date';

/**
 * DateRangeInputProps — представляет пропсы компонента DateRangeInput.
 *
 * @property dayShape — форма подсветки дня в панели. Без пропа совпадает с `shape`
 * @property disabled — включает недоступное состояние
 * @property endDay — конечный день диапазона в формате ISO
 * @property endLabel — текст `title` конечного сегмента и фрагмент `aria-label`
 *   кнопки сброса. Видимым лейблом сегмента не является
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
    dayShape?: ShapePreset;
    disabled?: boolean;
    endDay?: string;
    endLabel?: string;
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
 * clearDateRangeButtonAriaLabel — возвращает `aria-label` кнопки сброса диапазона.
 * Склеивает тексты `startLabel` и `endLabel` через `/` или берёт один непустой.
 *
 * @param startLabel текст `title` начального сегмента
 * @param endLabel текст `title` конечного сегмента
 * @returns текст для `aria-label`
 */
function clearDateRangeButtonAriaLabel(startLabel: string, endLabel: string): string {
  const start = startLabel.trim();
  const end = endLabel.trim();

  if (start !== '' && end !== '') {
    return clearButtonAriaLabel(`${start} / ${end}`, 'Clear date range');
  }

  return clearButtonAriaLabel(start || end, 'Clear date range');
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
  dayShape: dayShapeProp,
  disabled = DEFAULT_DATE_RANGE_INPUT_DISABLED,
  endDay = DEFAULT_DATE_RANGE_INPUT_END_DAY,
  endLabel = DEFAULT_DATE_RANGE_INPUT_END_LABEL,
  maxDay,
  minDay,
  onClear,
  onEndDayChange,
  onStartDayChange,
  shape,
  sizePreset,
  startDay = DEFAULT_DATE_RANGE_INPUT_START_DAY,
  startLabel = DEFAULT_DATE_RANGE_INPUT_START_LABEL,
  ...rest
}: DateRangeInputProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { handleClose, handleOpen, isOpen, panelRef } =
    useAnchoredOpen<HTMLDivElement>();
  const [activeField, setActiveField] = useState<ActiveRangeField>('start');
  const [viewMonth, setViewMonth] = useState<MonthView>(() =>
    monthViewFromIsoDayOrToday(startDay, maxDay)
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const startTriggerRef = useRef<HTMLButtonElement>(null);
  const endTriggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const resolvedShape = shape ?? DEFAULT_DATE_RANGE_INPUT_SHAPE;
  const resolvedSizePreset = sizePreset ?? DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET;
  const dayShape = dayShapeProp ?? resolvedShape;
  const surfaceProps = { shape, sizePreset };
  const calendarIcon = <CalendarIcon />;
  const isActive = startDay !== '' || endDay !== '';
  const showClear = isActive && onClear !== undefined && !disabled;
  const activeDay = activeField === 'start' ? startDay : endDay;
  const textSizePreset = getSegmentButtonTextSize(sizePreset);

  function handleOpenForField(field: ActiveRangeField): void {
    if (disabled) {
      return;
    }

    const sourceDay = field === 'start' ? startDay : endDay;

    returnFocusRef.current =
      field === 'start' ? startTriggerRef.current : endTriggerRef.current;
    setActiveField(field);
    setViewMonth(monthViewFromIsoDayOrToday(sourceDay, maxDay));
    handleOpen();
  }

  function handleSelectDay(isoDay: string): void {
    if (activeField === 'start') {
      if (isoDay === startDay && startDay !== '') {
        onStartDayChange?.('');
        return;
      }

      onStartDayChange?.(isoDay);

      if (endDay !== '' && isIsoDayAfter(isoDay, endDay)) {
        onEndDayChange?.('');
      }

      setActiveField('end');
      setViewMonth(monthViewFromIsoDayOrToday(endDay !== '' ? endDay : isoDay, maxDay));

      return;
    }

    if (isoDay === endDay && endDay !== '') {
      onEndDayChange?.('');
      return;
    }

    if (startDay !== '' && isIsoDayAfter(startDay, isoDay)) {
      onStartDayChange?.(isoDay);
      onEndDayChange?.(startDay);
    } else {
      onEndDayChange?.(isoDay);
    }
  }

  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onClear?.();
    setActiveField('start');
    handleClose();
  }

  function handleOpenStart(): void {
    handleOpenForField('start');
  }

  function handleOpenEnd(): void {
    handleOpenForField('end');
  }

  const leftSegment = {
    active: isOpen && activeField === 'start',
    ariaControls: panelId,
    ariaExpanded: isOpen && activeField === 'start',
    ariaHaspopup: 'dialog' as const,
    disabled,
    icon: calendarIcon,
    iconPosition: 'start' as const,
    ref: startTriggerRef,
    text: formatSegmentText(startDay),
    textTone: startDay === '' ? ('muted' as const) : undefined,
    title: startLabel,
    onClick: handleOpenStart,
  };

  const rightSegment = {
    active: isOpen && activeField === 'end',
    ariaControls: panelId,
    ariaExpanded: isOpen && activeField === 'end',
    ariaHaspopup: 'dialog' as const,
    disabled,
    icon: calendarIcon,
    iconPosition: 'start' as const,
    ref: endTriggerRef,
    text: formatSegmentText(endDay),
    textTone: endDay === '' ? ('muted' as const) : undefined,
    title: endLabel,
    onClick: handleOpenEnd,
  };

  return (
    <StyledDateRangeInputRoot
      data-open={isOpen ? 'true' : undefined}
      ref={rootRef}
      {...layoutProps}
      {...restProps}
    >
      <StyledDateRangeInputTriggerRow
        data-has-clear={showClear ? '' : undefined}
        data-open={isOpen ? 'true' : undefined}
        ref={triggerRowRef}
        {...surfaceProps}
      >
        <SegmentButtonParts
          left={leftSegment}
          right={rightSegment}
          shape={shape}
          sizePreset={sizePreset}
          textSize={textSizePreset}
        />

        {showClear && (
          <Icon
            aria-label={clearDateRangeButtonAriaLabel(startLabel, endLabel)}
            as="button"
            data-slot="clear"
            disabled={disabled}
            shape="square"
            showHover={false}
            sizePreset={sizePreset}
            onClick={handleClear}
          >
            <CloseIcon />
          </Icon>
        )}
      </StyledDateRangeInputTriggerRow>

      <AnchoredPortal
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        openFocusDeps={[activeDay, viewMonth]}
        panelRef={panelRef}
        positionStrategy={{
          anchorRef: triggerRowRef,
          apply: placeCalendarPanel,
          layoutDeps: [viewMonth],
        }}
        returnFocusRef={returnFocusRef}
        onDismiss={handleClose}
        onOpenFocus={focusCalendarPanelInitial}
      >
        <StyledDateRangeInputPanel
          aria-label="Date range calendar"
          aria-modal={true}
          id={panelId}
          ref={panelRef}
          role="dialog"
          {...surfaceProps}
        >
          <CalendarPanel
            activeDay={activeDay}
            dayShape={dayShape}
            maxDay={maxDay}
            minDay={minDay}
            rangeEnd={endDay}
            rangeStart={startDay}
            shape={resolvedShape}
            sizePreset={resolvedSizePreset}
            viewMonth={viewMonth}
            onSelectDay={handleSelectDay}
            onViewMonthChange={setViewMonth}
          />
        </StyledDateRangeInputPanel>
      </AnchoredPortal>
    </StyledDateRangeInputRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт todayUtc */
export { todayUtc } from './calendar-panel';

/**
 * Файл: `src/ui/date-range-input/calendar-panel/index.tsx`
 * Предоставляет компонент CalendarPanel для отображения сетки месяца
 * с навигацией и выбором дня.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму кнопок навигации через проп `shape`
 *  - форму подсветки дня через проп `dayShape`
 *  - верхнюю границу допустимых дней через проп `maxDay`
 *  - нижнюю границу допустимых дней через проп `minDay`
 *  - обработчик выбора дня через проп `onSelectDay`
 *  - обработчик смены отображаемого месяца через проп `onViewMonthChange`
 *  - конечный день диапазона через проп `rangeEnd`
 *  - начальный день диапазона через проп `rangeStart`
 *  - отображаемый месяц через проп `viewMonth`
 *  - ссылку на первый доступный день через проп `firstAvailableDayRef`
 *  - ссылку на выбранный доступный день через проп `selectedDayRef`
 *
 * Основные задачи:
 * 1. Экспортировать компонент CalendarPanel
 * 2. Типизировать пропсы через `CalendarPanelProps`
 * 3. Реэкспортировать утилиты дат и тип `MonthView` из
 *    `src/ui/date-range-input/calendar-panel/day.ts`
 * 4. Выставлять `aria`-атрибуты навигации и кнопок дней
 *
 * Потребители:
 *  - `src/ui/date-range-input/index.tsx` — рендерит панель выбора диапазона дат
 */

import { type Ref } from 'react';

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@icons';
import { Icon } from '@ui/icon';
import { getTextSize } from '@ui/presets';
import { assignRef } from '@ui/ref';
import { Text } from '@ui/text';

import {
  DEFAULT_CALENDAR_PANEL_SIZE_PRESET,
  StyledCalendarDayButton,
  StyledCalendarGrid,
  StyledCalendarHeader,
  StyledCalendarMonthTitle,
  StyledCalendarNavButton,
  StyledCalendarPanelRoot,
  StyledCalendarWeekdayCell,
  StyledCalendarWeekdayRow,
  getCalendarNavGlyphSize,
  splitLayoutProps,
  type CalendarPanelStyleProps,
} from './calendar-panel.styles';
import {
  WEEKDAY_LABELS,
  addMonths,
  addYears,
  buildMonthGrid,
  canNavigateMonthNext,
  canNavigateMonthPrevious,
  canNavigateYearNext,
  canNavigateYearPrevious,
  formatMonthTitle,
  isIsoDayAfter,
  isIsoDayBetweenRange,
  isIsoDayInBounds,
  todayUtc,
  type MonthView,
} from './day';

/**
 * CALENDAR_NAV_PREVIOUS_YEAR_ARIA_LABEL — задаёт `aria-label` кнопки «год назад».
 */
const CALENDAR_NAV_PREVIOUS_YEAR_ARIA_LABEL = 'Previous year';

/**
 * CALENDAR_NAV_PREVIOUS_MONTH_ARIA_LABEL — задаёт `aria-label` кнопки «месяц назад».
 */
const CALENDAR_NAV_PREVIOUS_MONTH_ARIA_LABEL = 'Previous month';

/**
 * CALENDAR_NAV_NEXT_MONTH_ARIA_LABEL — задаёт `aria-label` кнопки «месяц вперёд».
 */
const CALENDAR_NAV_NEXT_MONTH_ARIA_LABEL = 'Next month';

/**
 * CALENDAR_NAV_NEXT_YEAR_ARIA_LABEL — задаёт `aria-label` кнопки «год вперёд».
 */
const CALENDAR_NAV_NEXT_YEAR_ARIA_LABEL = 'Next year';

/**
 * CalendarPanelProps — представляет пропсы компонента CalendarPanel.
 *
 * @property firstAvailableDayRef — ссылка на первый доступный день
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property onSelectDay — обработчик выбора дня
 * @property onViewMonthChange — обработчик смены отображаемого месяца
 * @property rangeEnd — конечный день диапазона в формате ISO
 * @property rangeStart — начальный день диапазона в формате ISO
 * @property selectedDayRef — ссылка на выбранный доступный день
 * @property viewMonth — отображаемый месяц панели
 */
type CalendarPanelProps = CalendarPanelStyleProps & {
  firstAvailableDayRef?: Ref<HTMLButtonElement | null>;
  maxDay?: string;
  minDay?: string;
  onSelectDay: (isoDay: string) => void;
  onViewMonthChange: (viewMonth: MonthView) => void;
  rangeEnd?: string;
  rangeStart?: string;
  selectedDayRef?: Ref<HTMLButtonElement | null>;
  viewMonth: MonthView;
};

/**
 * CalendarPanel — отображает сетку месяца с навигацией и выбором дня.
 *
 * @example
 * <CalendarPanel
 *   rangeStart={startDay}
 *   rangeEnd={endDay}
 *   viewMonth={viewMonth}
 *   onSelectDay={selectDay}
 *   onViewMonthChange={setViewMonth}
 * />
 */
export function CalendarPanel({
  dayShape,
  firstAvailableDayRef,
  maxDay,
  minDay,
  onSelectDay,
  onViewMonthChange,
  rangeEnd,
  rangeStart,
  selectedDayRef,
  shape,
  sizePreset,
  viewMonth,
  ...rest
}: CalendarPanelProps) {
  const { layoutProps } = splitLayoutProps(rest);
  const cells = buildMonthGrid(viewMonth);
  const selectedDays = new Set<string>();

  if (rangeStart != null && rangeStart !== '') {
    selectedDays.add(rangeStart);
  }

  if (rangeEnd != null && rangeEnd !== '') {
    selectedDays.add(rangeEnd);
  }

  const selectedFocusIso = cells.find(
    (cell) =>
      selectedDays.has(cell.isoDay) && isIsoDayInBounds(cell.isoDay, minDay, maxDay)
  )?.isoDay;
  const firstAvailableIso = cells.find((cell) =>
    isIsoDayInBounds(cell.isoDay, minDay, maxDay)
  )?.isoDay;

  if (selectedFocusIso === undefined) {
    assignRef(selectedDayRef, null);
  }

  if (firstAvailableIso === undefined) {
    assignRef(firstAvailableDayRef, null);
  }

  const canGoMonthPrevious = canNavigateMonthPrevious(viewMonth, minDay);
  const canGoMonthNext = canNavigateMonthNext(viewMonth, maxDay);
  const canGoYearPrevious = canNavigateYearPrevious(viewMonth, minDay);
  const canGoYearNext = canNavigateYearNext(viewMonth, maxDay);
  const textSizePreset = getTextSize(sizePreset ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET);
  const navGlyphSize = getCalendarNavGlyphSize(sizePreset);

  function handlePreviousYearClick(): void {
    onViewMonthChange(addYears(viewMonth, -1));
  }

  function handlePreviousMonthClick(): void {
    onViewMonthChange(addMonths(viewMonth, -1));
  }

  function handleNextMonthClick(): void {
    onViewMonthChange(addMonths(viewMonth, 1));
  }

  function handleNextYearClick(): void {
    onViewMonthChange(addYears(viewMonth, 1));
  }

  return (
    <StyledCalendarPanelRoot {...layoutProps}>
      <StyledCalendarHeader>
        <StyledCalendarNavButton
          aria-label={CALENDAR_NAV_PREVIOUS_YEAR_ARIA_LABEL}
          disabled={!canGoYearPrevious}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={handlePreviousYearClick}
        >
          <Icon
            blockSize={navGlyphSize}
            inlineSize={navGlyphSize}
            padding={0}
            showHover={false}
          >
            <ChevronDoubleLeftIcon />
          </Icon>
        </StyledCalendarNavButton>
        <StyledCalendarNavButton
          aria-label={CALENDAR_NAV_PREVIOUS_MONTH_ARIA_LABEL}
          disabled={!canGoMonthPrevious}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={handlePreviousMonthClick}
        >
          <Icon
            blockSize={navGlyphSize}
            inlineSize={navGlyphSize}
            padding={0}
            showHover={false}
          >
            <ChevronLeftIcon />
          </Icon>
        </StyledCalendarNavButton>
        <StyledCalendarMonthTitle>
          <Text
            align="center"
            as="p"
            minInlineSize="0"
            sizePreset={textSizePreset}
            whiteSpace="normal"
          >
            {formatMonthTitle(viewMonth)}
          </Text>
        </StyledCalendarMonthTitle>
        <StyledCalendarNavButton
          aria-label={CALENDAR_NAV_NEXT_MONTH_ARIA_LABEL}
          disabled={!canGoMonthNext}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={handleNextMonthClick}
        >
          <Icon
            blockSize={navGlyphSize}
            inlineSize={navGlyphSize}
            padding={0}
            showHover={false}
          >
            <ChevronRightIcon />
          </Icon>
        </StyledCalendarNavButton>
        <StyledCalendarNavButton
          aria-label={CALENDAR_NAV_NEXT_YEAR_ARIA_LABEL}
          disabled={!canGoYearNext}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={handleNextYearClick}
        >
          <Icon
            blockSize={navGlyphSize}
            inlineSize={navGlyphSize}
            padding={0}
            showHover={false}
          >
            <ChevronDoubleRightIcon />
          </Icon>
        </StyledCalendarNavButton>
      </StyledCalendarHeader>

      <StyledCalendarWeekdayRow>
        {WEEKDAY_LABELS.map((label) => (
          <StyledCalendarWeekdayCell key={label}>
            <Text
              align="center"
              ellipsis
              minInlineSize="0"
              sizePreset="thin"
              tone="muted"
            >
              {label}
            </Text>
          </StyledCalendarWeekdayCell>
        ))}
      </StyledCalendarWeekdayRow>

      <StyledCalendarGrid>
        {cells.map((cell) => {
          const isSelectable = isIsoDayInBounds(cell.isoDay, minDay, maxDay);
          const isSelected = selectedDays.has(cell.isoDay);
          const isInRange =
            rangeStart != null &&
            rangeStart !== '' &&
            rangeEnd != null &&
            rangeEnd !== '' &&
            isIsoDayBetweenRange(cell.isoDay, rangeStart, rangeEnd);
          // Приглушение соседнего месяца — только у прошлого. Будущие дни текущего
          // и следующего месяца получают двойное приглушение через disabled: muted и opacity.
          const isAdjacentPast =
            cell.kind === 'adjacent-month' && !isIsoDayAfter(cell.isoDay, todayUtc());

          function handleDayClick(): void {
            onSelectDay(cell.isoDay);
          }

          return (
            <StyledCalendarDayButton
              aria-label={cell.isoDay}
              aria-pressed={isSelected ? true : undefined}
              data-adjacent={isAdjacentPast ? 'true' : undefined}
              data-in-range={isInRange ? 'true' : undefined}
              data-selected={isSelected ? 'true' : undefined}
              dayShape={dayShape}
              disabled={!isSelectable}
              key={cell.isoDay}
              ref={(node) => {
                if (cell.isoDay === selectedFocusIso) {
                  assignRef(selectedDayRef, node);
                }

                if (cell.isoDay === firstAvailableIso) {
                  assignRef(firstAvailableDayRef, node);
                }
              }}
              sizePreset={sizePreset}
              type="button"
              onClick={handleDayClick}
            >
              <Text ellipsis minInlineSize="0" sizePreset={textSizePreset}>
                {cell.day}
              </Text>
            </StyledCalendarDayButton>
          );
        })}
      </StyledCalendarGrid>
    </StyledCalendarPanelRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- публичные утилиты calendar-panel */

export {
  DATE_PLACEHOLDER,
  formatIsoDayCompact,
  isIsoDayAfter,
  monthViewFromIsoDayOrToday,
  todayUtc,
  type MonthView,
} from './day';

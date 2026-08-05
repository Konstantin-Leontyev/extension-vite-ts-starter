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
 *
 * Основные задачи:
 * 1. Экспортировать компонент CalendarPanel
 * 2. Типизировать пропсы через `CalendarPanelProps`
 * 3. Предоставить `focusCalendarPanelInitial`
 * 4. Реэкспортировать утилиты дат и тип `MonthView` из
 *    `src/ui/date-range-input/calendar-panel/day.ts`
 * 5. Выставлять `aria`-атрибуты навигации и кнопок дней
 *
 * Потребители:
 *  - `src/ui/date-range-input/index.tsx` — рендерит панель выбора диапазона дат
 */

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@icons';
import { Icon } from '@ui/icon';
import { Text } from '@ui/text';

import {
  StyledCalendarDayButton,
  StyledCalendarGrid,
  StyledCalendarHeader,
  StyledCalendarMonthTitle,
  StyledCalendarNavButton,
  StyledCalendarPanelRoot,
  StyledCalendarWeekdayCell,
  StyledCalendarWeekdayRow,
  getCalendarNavGlyphSize,
  getCalendarPanelTextSize,
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
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property onSelectDay — обработчик выбора дня
 * @property onViewMonthChange — обработчик смены отображаемого месяца
 * @property rangeEnd — конечный день диапазона в формате ISO
 * @property rangeStart — начальный день диапазона в формате ISO
 * @property viewMonth — отображаемый месяц панели
 */
type CalendarPanelProps = CalendarPanelStyleProps & {
  maxDay?: string;
  minDay?: string;
  onSelectDay: (isoDay: string) => void;
  onViewMonthChange: (viewMonth: MonthView) => void;
  rangeEnd?: string;
  rangeStart?: string;
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
  maxDay,
  minDay,
  onSelectDay,
  onViewMonthChange,
  rangeEnd,
  rangeStart,
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

  const canGoMonthPrevious = canNavigateMonthPrevious(viewMonth, minDay);
  const canGoMonthNext = canNavigateMonthNext(viewMonth, maxDay);
  const canGoYearPrevious = canNavigateYearPrevious(viewMonth, minDay);
  const canGoYearNext = canNavigateYearNext(viewMonth, maxDay);
  const textSizePreset = getCalendarPanelTextSize(sizePreset);
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

/**
 * focusCalendarPanelInitial — переводит фокус на выбранный или первый доступный день.
 * Сначала ищет кнопку с `aria-pressed="true"`, иначе — первую не `disabled`.
 *
 * @param panel корневой элемент открытой панели календаря
 */
export function focusCalendarPanelInitial(panel: HTMLElement): void {
  const selectedDay = panel.querySelector<HTMLElement>(
    'button[aria-pressed="true"]:not([disabled])'
  );

  if (selectedDay) {
    selectedDay.focus();
    return;
  }

  panel.querySelector<HTMLElement>('button:not([disabled])')?.focus();
}

export {
  DATE_PLACEHOLDER,
  formatIsoDayCompact,
  isIsoDayAfter,
  monthViewFromIsoDayOrToday,
  todayUtc,
  type MonthView,
} from './day';

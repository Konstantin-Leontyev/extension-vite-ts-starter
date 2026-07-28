/**
 * Файл: `src/ui/date-range-input/calendar-panel/index.tsx`
 * Предоставляет вложенный компонент CalendarPanel — сетку выбора дня
 * для DateRangeInput.
 *
 * Поддерживает:
 *  - размерный ряд через проп `sizePreset`
 *  - форму кнопок навигации через проп `shape`
 *  - форму подсветки дня через проп `dayShape`
 *  - активный выбранный день через проп `activeDay`
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
 * 3. Предоставить `clearButtonAriaLabel` и `focusCalendarPanelInitial`
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
  getCalendarPanelTextSize,
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
  isIsoDayBetweenRange,
  isIsoDayInBounds,
  type MonthView,
} from './day';

/**
 * DEFAULT_CLEAR_DATE_ARIA_LABEL — задаёт запасной текст `aria-label` кнопки сброса
 * по умолчанию.
 * Используется, когда вызывающий код не передал `fallback`.
 */
const DEFAULT_CLEAR_DATE_ARIA_LABEL = 'Clear date';

/**
 * CalendarPanelProps — представляет пропсы компонента CalendarPanel.
 *
 * @property activeDay — активный выбранный день в формате ISO
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property onSelectDay — обработчик выбора дня
 * @property onViewMonthChange — обработчик смены отображаемого месяца
 * @property rangeEnd — конечный день диапазона в формате ISO
 * @property rangeStart — начальный день диапазона в формате ISO
 * @property viewMonth — отображаемый месяц панели
 */
type CalendarPanelProps = CalendarPanelStyleProps & {
  activeDay?: string;
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
 *   activeDay={day}
 *   viewMonth={viewMonth}
 *   onSelectDay={setDay}
 *   onViewMonthChange={setViewMonth}
 * />
 * <CalendarPanel
 *   activeDay={endDay}
 *   rangeStart={startDay}
 *   rangeEnd={endDay}
 *   viewMonth={viewMonth}
 *   onSelectDay={selectDay}
 *   onViewMonthChange={setViewMonth}
 * />
 */
export function CalendarPanel({
  activeDay,
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
}: CalendarPanelProps) {
  const cells = buildMonthGrid(viewMonth);
  const selectedDays = new Set<string>();

  if (activeDay != null && activeDay !== '') {
    selectedDays.add(activeDay);
  }

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
  const resolvedSizePreset = sizePreset ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET;
  const textSizePreset = getCalendarPanelTextSize(resolvedSizePreset);
  const navGlyphSize = getCalendarNavGlyphSize(resolvedSizePreset);

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
    <StyledCalendarPanelRoot>
      <StyledCalendarHeader>
        <StyledCalendarNavButton
          aria-label="Previous year"
          disabled={!canGoYearPrevious}
          shape={shape}
          sizePreset={resolvedSizePreset}
          type="button"
          onClick={handlePreviousYearClick}
        >
          <Icon blockSize={navGlyphSize} inlineSize={navGlyphSize} padding={0}>
            <ChevronDoubleLeftIcon />
          </Icon>
        </StyledCalendarNavButton>
        <StyledCalendarNavButton
          aria-label="Previous month"
          disabled={!canGoMonthPrevious}
          shape={shape}
          sizePreset={resolvedSizePreset}
          type="button"
          onClick={handlePreviousMonthClick}
        >
          <Icon blockSize={navGlyphSize} inlineSize={navGlyphSize} padding={0}>
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
          aria-label="Next month"
          disabled={!canGoMonthNext}
          shape={shape}
          sizePreset={resolvedSizePreset}
          type="button"
          onClick={handleNextMonthClick}
        >
          <Icon blockSize={navGlyphSize} inlineSize={navGlyphSize} padding={0}>
            <ChevronRightIcon />
          </Icon>
        </StyledCalendarNavButton>
        <StyledCalendarNavButton
          aria-label="Next year"
          disabled={!canGoYearNext}
          shape={shape}
          sizePreset={resolvedSizePreset}
          type="button"
          onClick={handleNextYearClick}
        >
          <Icon blockSize={navGlyphSize} inlineSize={navGlyphSize} padding={0}>
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

          function handleDayClick(): void {
            onSelectDay(cell.isoDay);
          }

          return (
            <StyledCalendarDayButton
              aria-label={cell.isoDay}
              aria-pressed={isSelected ? true : undefined}
              data-adjacent={cell.kind === 'adjacent-month' ? 'true' : undefined}
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
 * clearButtonAriaLabel — возвращает `aria-label` кнопки сброса по доступному имени.
 * Убирает завершающее двоеточие и подставляет `fallback` без имени.
 *
 * @param ariaLabel доступное имя поля или текст `title` сегмента
 * @param fallback запасной текст без имени
 * @returns текст для `aria-label`
 */
export function clearButtonAriaLabel(
  ariaLabel: string | undefined,
  fallback = DEFAULT_CLEAR_DATE_ARIA_LABEL
): string {
  const trimmed = ariaLabel?.trim();

  if (!trimmed) {
    return fallback;
  }

  return `Clear ${trimmed.replace(/:$/, '')}`;
}

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

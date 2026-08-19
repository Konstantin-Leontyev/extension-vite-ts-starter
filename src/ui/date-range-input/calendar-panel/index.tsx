/**
 * Файл: `src/ui/date-range-input/calendar-panel/index.tsx`
 * Предоставляет компонент CalendarPanel для отображения сетки месяца
 * с навигацией и выбором дня.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
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
 *  - ссылку на сегодняшний доступный день через проп `todayDayRef`
 *
 * Основные задачи:
 * 1. Экспортировать компонент CalendarPanel
 * 2. Типизировать пропсы через `CalendarPanelProps`
 * 3. Реэкспортировать утилиты дат и тип `MonthView` из
 *    `src/ui/date-range-input/calendar-panel/day.ts`
 * 4. Выставлять роли сетки `grid`, `row`, `columnheader` и `gridcell` и
 *    `aria`-атрибуты навигации и кнопок дней. Стрелки месяца и сетка дней —
 *    две Tab-остановки с roving focus внутри. Сегодняшний день помечает
 *    `aria-current="date"`
 *
 * Потребители:
 *  - `src/ui/date-range-input/index.tsx` — рендерит панель выбора диапазона дат
 */

import { useId, useRef, useState, type KeyboardEvent, type Ref } from 'react';

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
  StyledCalendarDayCell,
  StyledCalendarGrid,
  StyledCalendarHeader,
  StyledCalendarMonthTitle,
  StyledCalendarNavButton,
  StyledCalendarPanelRoot,
  StyledCalendarWeekRow,
  StyledCalendarWeekdayCell,
  StyledCalendarWeekdayRow,
  getCalendarNavGlyphSize,
  splitLayoutProps,
  type CalendarPanelStyleProps,
} from './calendar-panel.styles';
import {
  WEEKDAY_LABELS,
  addDaysToIsoDay,
  addMonths,
  addMonthsToIsoDay,
  addYears,
  addYearsToIsoDay,
  buildMonthGrid,
  canNavigateMonthNext,
  canNavigateMonthPrevious,
  canNavigateYearNext,
  canNavigateYearPrevious,
  clampIsoDayInBounds,
  formatIsoDayAccessible,
  formatMonthTitle,
  isIsoDayAfter,
  isIsoDayBetweenRange,
  isIsoDayInBounds,
  monthViewFromIsoDay,
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
 * @property todayDayRef — ссылка на сегодняшний доступный день
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
  todayDayRef?: Ref<HTMLButtonElement | null>;
  viewMonth: MonthView;
};

/**
 * resolveFirstEnabledIndex — возвращает индекс первой доступной кнопки навигации.
 *
 * @param enabled доступность кнопок навигации в порядке ряда
 * @returns индекс первой доступной кнопки, иначе `-1`
 */
function resolveFirstEnabledIndex(enabled: boolean[]): number {
  return enabled.findIndex(Boolean);
}

/**
 * resolveEnabledNeighborIndex — возвращает индекс ближайшей доступной кнопки по кругу.
 *
 * @param enabled доступность кнопок навигации в порядке ряда
 * @param fromIndex текущий индекс
 * @param direction направление обхода: `-1` к предыдущему, `1` к следующему
 * @returns индекс соседа из обхода или `fromIndex`, если таких нет
 */
function resolveEnabledNeighborIndex(
  enabled: boolean[],
  fromIndex: number,
  direction: -1 | 1
): number {
  const { length } = enabled;
  let index = fromIndex;

  for (let step = 0; step < length; step += 1) {
    index = (index + direction + length) % length;

    if (enabled[index]) {
      return index;
    }
  }

  return fromIndex;
}

/**
 * resolveEnabledEdgeIndex — возвращает индекс крайней доступной кнопки навигации.
 *
 * @param enabled доступность кнопок навигации в порядке ряда
 * @param edge край ряда: `start` или `end`
 * @returns индекс первой или последней доступной кнопки, иначе `-1`
 */
function resolveEnabledEdgeIndex(enabled: boolean[], edge: 'end' | 'start'): number {
  if (edge === 'start') {
    return resolveFirstEnabledIndex(enabled);
  }

  for (let index = enabled.length - 1; index >= 0; index -= 1) {
    if (enabled[index]) {
      return index;
    }
  }

  return -1;
}

/**
 * chunkWeeks — принимает плоскую сетку дней и возвращает её по неделям.
 *
 * @param cells ячейки месяца слева направо
 * @returns недели по семь ячеек
 */
function chunkWeeks<T>(cells: T[]): T[][] {
  const weekLength = WEEKDAY_LABELS.length;
  const weeks: T[][] = [];

  for (let index = 0; index < cells.length; index += weekLength) {
    weeks.push(cells.slice(index, index + weekLength));
  }

  return weeks;
}

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
  size,
  todayDayRef,
  viewMonth,
  ...rest
}: CalendarPanelProps) {
  const { layoutProps } = splitLayoutProps(rest);
  const monthTitleId = useId();
  const cells = buildMonthGrid(viewMonth);
  const weeks = chunkWeeks(cells);
  const todayIso = todayUtc();
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
  const todayFocusIso = cells.find(
    (cell) => cell.isoDay === todayIso && isIsoDayInBounds(cell.isoDay, minDay, maxDay)
  )?.isoDay;
  const firstAvailableIso = cells.find((cell) =>
    isIsoDayInBounds(cell.isoDay, minDay, maxDay)
  )?.isoDay;
  const defaultTabStopIso = selectedFocusIso ?? todayFocusIso ?? firstAvailableIso;

  if (selectedFocusIso === undefined) {
    assignRef(selectedDayRef, null);
  }

  if (todayFocusIso === undefined) {
    assignRef(todayDayRef, null);
  }

  if (firstAvailableIso === undefined) {
    assignRef(firstAvailableDayRef, null);
  }

  const canGoMonthPrevious = canNavigateMonthPrevious(viewMonth, minDay);
  const canGoMonthNext = canNavigateMonthNext(viewMonth, maxDay);
  const canGoYearPrevious = canNavigateYearPrevious(viewMonth, minDay);
  const canGoYearNext = canNavigateYearNext(viewMonth, maxDay);
  const navEnabled = [
    canGoYearPrevious,
    canGoMonthPrevious,
    canGoMonthNext,
    canGoYearNext,
  ];
  const textSizePreset = getTextSize(size ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET);
  const navGlyphSize = getCalendarNavGlyphSize(size);
  const navButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const [navTabStop, setNavTabStop] = useState(() =>
    resolveFirstEnabledIndex(navEnabled)
  );
  const [pendingFocusIso, setPendingFocusIso] = useState<null | string>(null);
  const [tabStopIso, setTabStopIso] = useState(defaultTabStopIso);
  const [prevViewMonth, setPrevViewMonth] = useState(viewMonth);

  if (viewMonth.month !== prevViewMonth.month || viewMonth.year !== prevViewMonth.year) {
    setPrevViewMonth(viewMonth);
    const pendingInGrid =
      pendingFocusIso != null &&
      cells.some(
        (cell) =>
          cell.isoDay === pendingFocusIso &&
          isIsoDayInBounds(cell.isoDay, minDay, maxDay)
      );

    setTabStopIso(pendingInGrid ? pendingFocusIso : defaultTabStopIso);

    if (!pendingInGrid) {
      setPendingFocusIso(null);
    }
  }

  if (navTabStop < 0 || !navEnabled[navTabStop]) {
    const nextNavIndex = resolveFirstEnabledIndex(navEnabled);

    if (nextNavIndex !== navTabStop) {
      setNavTabStop(nextNavIndex);
    }
  }

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

  function moveFocusToIsoDay(nextIso: string): void {
    if (nextIso === tabStopIso) {
      return;
    }

    const nextView = monthViewFromIsoDay(nextIso);
    const isInCurrentGrid = cells.some((cell) => cell.isoDay === nextIso);

    if (
      nextView != null &&
      !isInCurrentGrid &&
      (nextView.month !== viewMonth.month || nextView.year !== viewMonth.year)
    ) {
      setPendingFocusIso(nextIso);
      setTabStopIso(nextIso);
      onViewMonthChange(nextView);
      return;
    }

    setTabStopIso(nextIso);
    dayButtonRefs.current.get(nextIso)?.focus();
  }

  function handleNavKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ): void {
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const previousKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowUp':
      case previousKey: {
        nextIndex = resolveEnabledNeighborIndex(navEnabled, index, -1);
        break;
      }
      case 'ArrowDown':
      case nextKey: {
        nextIndex = resolveEnabledNeighborIndex(navEnabled, index, 1);
        break;
      }
      case 'End': {
        nextIndex = resolveEnabledEdgeIndex(navEnabled, 'end');
        break;
      }
      case 'Home': {
        nextIndex = resolveEnabledEdgeIndex(navEnabled, 'start');
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();

    if (nextIndex < 0 || nextIndex === index) {
      return;
    }

    setNavTabStop(nextIndex);
    navButtonRefs.current[nextIndex]?.focus();
  }

  function handleDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    isoDay: string
  ): void {
    const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const nextDayKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const previousDayKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
    let nextIso: string | undefined;

    switch (event.key) {
      case previousDayKey: {
        nextIso = clampIsoDayInBounds(addDaysToIsoDay(isoDay, -1), minDay, maxDay);
        break;
      }
      case nextDayKey: {
        nextIso = clampIsoDayInBounds(addDaysToIsoDay(isoDay, 1), minDay, maxDay);
        break;
      }
      case 'ArrowUp': {
        nextIso = clampIsoDayInBounds(addDaysToIsoDay(isoDay, -7), minDay, maxDay);
        break;
      }
      case 'ArrowDown': {
        nextIso = clampIsoDayInBounds(addDaysToIsoDay(isoDay, 7), minDay, maxDay);
        break;
      }
      case 'Home': {
        const cellIndex = cells.findIndex((cell) => cell.isoDay === isoDay);
        const weekStart = cellIndex - (cellIndex % WEEKDAY_LABELS.length);
        const weekEnd = weekStart + WEEKDAY_LABELS.length;

        nextIso = cells
          .slice(weekStart, weekEnd)
          .find((cell) => isIsoDayInBounds(cell.isoDay, minDay, maxDay))?.isoDay;
        break;
      }
      case 'End': {
        const cellIndex = cells.findIndex((cell) => cell.isoDay === isoDay);
        const weekStart = cellIndex - (cellIndex % WEEKDAY_LABELS.length);
        const weekEnd = weekStart + WEEKDAY_LABELS.length;

        nextIso = [...cells.slice(weekStart, weekEnd)]
          .reverse()
          .find((cell) => isIsoDayInBounds(cell.isoDay, minDay, maxDay))?.isoDay;
        break;
      }
      case 'PageUp': {
        nextIso = clampIsoDayInBounds(
          event.shiftKey ? addYearsToIsoDay(isoDay, -1) : addMonthsToIsoDay(isoDay, -1),
          minDay,
          maxDay
        );
        break;
      }
      case 'PageDown': {
        nextIso = clampIsoDayInBounds(
          event.shiftKey ? addYearsToIsoDay(isoDay, 1) : addMonthsToIsoDay(isoDay, 1),
          minDay,
          maxDay
        );
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();

    if (nextIso == null || nextIso === isoDay) {
      return;
    }

    moveFocusToIsoDay(nextIso);
  }

  return (
    <StyledCalendarPanelRoot {...layoutProps}>
      <StyledCalendarHeader>
        <StyledCalendarNavButton
          aria-label={CALENDAR_NAV_PREVIOUS_YEAR_ARIA_LABEL}
          disabled={!canGoYearPrevious}
          ref={(node) => {
            navButtonRefs.current[0] = node;
          }}
          shape={shape}
          size={size}
          tabIndex={navTabStop === 0 && canGoYearPrevious ? 0 : -1}
          type="button"
          onClick={handlePreviousYearClick}
          onFocus={() => setNavTabStop(0)}
          onKeyDown={(event) => handleNavKeyDown(event, 0)}
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
          ref={(node) => {
            navButtonRefs.current[1] = node;
          }}
          shape={shape}
          size={size}
          tabIndex={navTabStop === 1 && canGoMonthPrevious ? 0 : -1}
          type="button"
          onClick={handlePreviousMonthClick}
          onFocus={() => setNavTabStop(1)}
          onKeyDown={(event) => handleNavKeyDown(event, 1)}
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
            id={monthTitleId}
            minInlineSize="0"
            size={textSizePreset}
            whiteSpace="normal"
          >
            {formatMonthTitle(viewMonth)}
          </Text>
        </StyledCalendarMonthTitle>
        <StyledCalendarNavButton
          aria-label={CALENDAR_NAV_NEXT_MONTH_ARIA_LABEL}
          disabled={!canGoMonthNext}
          ref={(node) => {
            navButtonRefs.current[2] = node;
          }}
          shape={shape}
          size={size}
          tabIndex={navTabStop === 2 && canGoMonthNext ? 0 : -1}
          type="button"
          onClick={handleNextMonthClick}
          onFocus={() => setNavTabStop(2)}
          onKeyDown={(event) => handleNavKeyDown(event, 2)}
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
          ref={(node) => {
            navButtonRefs.current[3] = node;
          }}
          shape={shape}
          size={size}
          tabIndex={navTabStop === 3 && canGoYearNext ? 0 : -1}
          type="button"
          onClick={handleNextYearClick}
          onFocus={() => setNavTabStop(3)}
          onKeyDown={(event) => handleNavKeyDown(event, 3)}
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

      <StyledCalendarGrid aria-labelledby={monthTitleId} role="grid">
        <StyledCalendarWeekdayRow role="row">
          {WEEKDAY_LABELS.map((label) => (
            <StyledCalendarWeekdayCell key={label} role="columnheader">
              <Text align="center" ellipsis minInlineSize="0" size="thin" tone="muted">
                {label}
              </Text>
            </StyledCalendarWeekdayCell>
          ))}
        </StyledCalendarWeekdayRow>
        {weeks.map((week) => (
          <StyledCalendarWeekRow key={week[0]?.isoDay} role="row">
            {week.map((cell) => {
              const isSelectable = isIsoDayInBounds(cell.isoDay, minDay, maxDay);
              const isSelected = selectedDays.has(cell.isoDay);
              const isToday = cell.isoDay === todayIso;
              const isTabStop = cell.isoDay === tabStopIso && isSelectable;
              const isInRange =
                rangeStart != null &&
                rangeStart !== '' &&
                rangeEnd != null &&
                rangeEnd !== '' &&
                isIsoDayBetweenRange(cell.isoDay, rangeStart, rangeEnd);
              // Приглушение соседнего месяца — только у прошлого. Будущие дни текущего
              // и следующего месяца получают двойное приглушение через disabled: muted и opacity.
              const isAdjacentPast =
                cell.kind === 'adjacent-month' && !isIsoDayAfter(cell.isoDay, todayIso);

              function handleDayClick(): void {
                setTabStopIso(cell.isoDay);
                onSelectDay(cell.isoDay);
              }

              return (
                <StyledCalendarDayCell
                  aria-current={isToday ? 'date' : undefined}
                  aria-selected={isSelected ? true : undefined}
                  key={cell.isoDay}
                  role="gridcell"
                >
                  <StyledCalendarDayButton
                    aria-label={formatIsoDayAccessible(cell.isoDay)}
                    data-adjacent={isAdjacentPast ? 'true' : undefined}
                    data-in-range={isInRange ? 'true' : undefined}
                    data-selected={isSelected ? 'true' : undefined}
                    data-today={isToday ? 'true' : undefined}
                    dayShape={dayShape}
                    disabled={!isSelectable}
                    ref={(node) => {
                      if (node == null) {
                        dayButtonRefs.current.delete(cell.isoDay);
                      } else {
                        dayButtonRefs.current.set(cell.isoDay, node);
                      }

                      if (cell.isoDay === selectedFocusIso) {
                        assignRef(selectedDayRef, node);
                      }

                      if (cell.isoDay === todayFocusIso) {
                        assignRef(todayDayRef, node);
                      }

                      if (cell.isoDay === firstAvailableIso) {
                        assignRef(firstAvailableDayRef, node);
                      }

                      if (pendingFocusIso === cell.isoDay && node != null) {
                        node.focus();
                        setPendingFocusIso(null);
                      }
                    }}
                    size={size}
                    tabIndex={isTabStop ? 0 : -1}
                    type="button"
                    onClick={handleDayClick}
                    onKeyDown={(event) => handleDayKeyDown(event, cell.isoDay)}
                  >
                    <Text ellipsis minInlineSize="0" size={textSizePreset}>
                      {cell.day}
                    </Text>
                  </StyledCalendarDayButton>
                </StyledCalendarDayCell>
              );
            })}
          </StyledCalendarWeekRow>
        ))}
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

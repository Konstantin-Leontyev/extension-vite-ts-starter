// TODO: ручное ревью — ui/calendar-panel/index.tsx
import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import { ChevronDownIcon } from '@icons/chevron-down';
import { Text } from '@ui/text';

import {
  StyledCalendarDayButton,
  StyledCalendarGrid,
  StyledCalendarHeader,
  StyledCalendarNavButton,
  StyledCalendarPanelRoot,
  StyledCalendarWeekdayCell,
  StyledCalendarWeekdayRow,
  type CalendarPanelAxisProps,
} from './calendar-panel.styles';
import {
  WEEKDAY_LABELS,
  addMonths,
  buildMonthGrid,
  canNavigateMonthNext,
  canNavigateMonthPrevious,
  formatMonthTitle,
  isIsoDayBetweenRange,
  isIsoDayInBounds,
  type MonthView,
} from './day';

export type CalendarPanelProps = CalendarPanelAxisProps & {
  activeDay?: string;
  maxDay?: string;
  minDay?: string;
  onSelectDay: (isoDay: string) => void;
  onViewMonthChange: (viewMonth: MonthView) => void;
  rangeEnd?: string;
  rangeStart?: string;
  viewMonth: MonthView;
};

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
  const theme = useTheme();
  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const selectedDays = useMemo(() => {
    const days = new Set<string>();

    if (activeDay != null && activeDay !== '') {
      days.add(activeDay);
    }

    if (rangeStart != null && rangeStart !== '') {
      days.add(rangeStart);
    }

    if (rangeEnd != null && rangeEnd !== '') {
      days.add(rangeEnd);
    }

    return days;
  }, [activeDay, rangeEnd, rangeStart]);
  const canGoPrevious = canNavigateMonthPrevious(viewMonth, minDay);
  const canGoNext = canNavigateMonthNext(viewMonth, maxDay);

  return (
    <StyledCalendarPanelRoot shape={shape} sizePreset={sizePreset}>
      <StyledCalendarHeader>
        <StyledCalendarNavButton
          aria-label="Previous month"
          disabled={!canGoPrevious}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={() => {
            onViewMonthChange(addMonths(viewMonth, -1));
          }}
        >
          <span style={{ display: 'grid', transform: 'rotate(90deg)' }}>
            <ChevronDownIcon />
          </span>
        </StyledCalendarNavButton>
        <Text align="center" as="p" sizePreset="medium">
          {formatMonthTitle(viewMonth)}
        </Text>
        <StyledCalendarNavButton
          aria-label="Next month"
          disabled={!canGoNext}
          shape={shape}
          sizePreset={sizePreset}
          type="button"
          onClick={() => {
            onViewMonthChange(addMonths(viewMonth, 1));
          }}
        >
          <span style={{ display: 'grid', transform: 'rotate(-90deg)' }}>
            <ChevronDownIcon />
          </span>
        </StyledCalendarNavButton>
      </StyledCalendarHeader>

      <StyledCalendarWeekdayRow>
        {WEEKDAY_LABELS.map((label) => (
          <StyledCalendarWeekdayCell key={label}>
            <Text
              color={theme.colors.muted}
              ellipsis
              minInlineSize="0"
              sizePreset="thin"
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
              onClick={() => {
                onSelectDay(cell.isoDay);
              }}
            >
              <Text ellipsis minInlineSize="0" sizePreset="medium">
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

/** aria-label кнопки сброса — из подписи триггера, без двоеточия. */
export function clearButtonAriaLabel(
  ariaLabel: string | undefined,
  fallback = 'Clear date'
): string {
  const trimmed = ariaLabel?.trim();

  if (!trimmed) {
    return fallback;
  }

  return `Clear ${trimmed.replace(/:$/, '')}`;
}

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
  WEEKDAY_LABELS,
  addMonths,
  buildMonthGrid,
  formatIsoDayCompact,
  formatMonthTitle,
  isIsoDayAfter,
  isIsoDayBefore,
  isIsoDayBetweenRange,
  isIsoDayInBounds,
  monthViewFromIsoDay,
  monthViewFromIsoDayOrToday,
  parseIsoDay,
  toIsoDay,
  todayUtc,
} from './day';
export type { CalendarCell, IsoDayParts, MonthView } from './day';
/* eslint-enable react-refresh/only-export-components */

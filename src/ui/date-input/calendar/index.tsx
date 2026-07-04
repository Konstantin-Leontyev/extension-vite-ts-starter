import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import { ChevronDownIcon } from '@icons/chevron-down';
import { Text } from '@ui/text';

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
} from '../day';
import {
  StyledCalendarDayButton,
  StyledCalendarGrid,
  StyledCalendarHeader,
  StyledCalendarNavButton,
  StyledCalendarPanel,
  StyledCalendarWeekdayCell,
  StyledCalendarWeekdayRow,
  type CalendarAxisProps,
} from './calendar.styles';

export type CalendarPanelProps = CalendarAxisProps & {
  activeDay?: string;
  maxDay?: string;
  minDay?: string;
  rangeEnd?: string;
  rangeStart?: string;
  viewMonth: MonthView;
  onSelectDay: (isoDay: string) => void;
  onViewMonthChange: (viewMonth: MonthView) => void;
};

export function CalendarPanel({
  activeDay,
  dayShape,
  maxDay,
  minDay,
  rangeEnd,
  rangeStart,
  shape,
  sizePreset,
  viewMonth,
  onSelectDay,
  onViewMonthChange,
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
    <StyledCalendarPanel shape={shape} sizePreset={sizePreset}>
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
              key={cell.isoDay}
              aria-label={cell.isoDay}
              aria-pressed={isSelected ? true : undefined}
              data-adjacent={cell.kind === 'adjacent-month' ? 'true' : undefined}
              data-in-range={isInRange ? 'true' : undefined}
              data-selected={isSelected ? 'true' : undefined}
              dayShape={dayShape}
              disabled={!isSelectable}
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
    </StyledCalendarPanel>
  );
}

export type { CalendarAxisProps } from './calendar.styles';

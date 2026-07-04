import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
} from 'react';
import { createPortal } from 'react-dom';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { useAnchoredPanelPosition } from '@hooks/use-anchored-panel-position';
import { useFocusTrap } from '@hooks/use-focus-trap';
import { CalendarIcon } from '@icons/calendar';
import { CloseIcon } from '@icons/close';
import { type ShapePreset } from '@ui/presets';
import { SegmentButton } from '@ui/segment-button';

import {
  DEFAULT_DATE_RANGE_INPUT_SHAPE,
  DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET,
  StyledDateRangeInputClearButton,
  StyledDateRangeInputClearIcon,
  StyledDateRangeInputPanel,
  StyledDateRangeInputRoot,
  StyledDateRangeInputTriggerRow,
  splitLayoutProps,
  type DateRangeInputStyleProps,
} from './date-range-input.styles';
import { CalendarPanel } from '../date-input/calendar';
import {
  DATE_PLACEHOLDER,
  formatIsoDayCompact,
  isIsoDayAfter,
  monthViewFromIsoDayOrToday,
  type MonthView,
} from '../date-input/day';
import {
  clearButtonAriaLabel,
  focusCalendarPanelInitial,
} from '../date-input/popover-a11y';

type ActiveRangeField = 'start' | 'end';

export type DateRangeInputProps = DateRangeInputStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    | keyof DateRangeInputStyleProps
    | 'className'
    | 'onChange'
    | 'style'
    | 'endDay'
    | 'startDay'
  > & {
    disabled?: boolean;
    /** Форма подсветки дня; по умолчанию — как у триггера (`shape`). */
    dayShape?: ShapePreset;
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

function formatSegmentText(isoDay: string): string {
  return isoDay !== '' ? formatIsoDayCompact(isoDay) : DATE_PLACEHOLDER;
}

function clearDateRangeButtonAriaLabel(startLabel: string, endLabel: string): string {
  const start = startLabel.trim();
  const end = endLabel.trim();

  if (start !== '' && end !== '') {
    return clearButtonAriaLabel(`${start} / ${end}`, 'Clear date range');
  }

  return clearButtonAriaLabel(start || end, 'Clear date range');
}

export function DateRangeInput({
  dayShape: dayShapeProp,
  disabled = false,
  endDay = '',
  endLabel = 'End date',
  maxDay,
  minDay,
  onClear,
  onEndDayChange,
  onStartDayChange,
  shape = DEFAULT_DATE_RANGE_INPUT_SHAPE,
  sizePreset = DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET,
  startDay = '',
  startLabel = 'Start date',
  ...rest
}: DateRangeInputProps) {
  const { layout, rest: rootProps } = splitLayoutProps(rest);
  const [open, setOpen] = useState(false);
  const [activeField, setActiveField] = useState<ActiveRangeField>('start');
  const [viewMonth, setViewMonth] = useState<MonthView>(() =>
    monthViewFromIsoDayOrToday(startDay, maxDay)
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const startTriggerRef = useRef<HTMLButtonElement>(null);
  const endTriggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const dayShape = dayShapeProp ?? shape;
  const axisProps = { shape, sizePreset };
  const calendarIcon = useMemo(() => <CalendarIcon />, []);
  const isActive = startDay !== '' || endDay !== '';
  const showClear = isActive && onClear !== undefined && !disabled;
  const activeDay = activeField === 'start' ? startDay : endDay;

  const closePanel = useCallback((): void => {
    setOpen(false);
  }, []);

  const isInsideDateRangeInput = useCallback((target: Node): boolean => {
    return (
      (rootRef.current?.contains(target) ?? false) ||
      (panelRef.current?.contains(target) ?? false)
    );
  }, []);

  useAnchoredDismiss({
    active: open,
    isInside: isInsideDateRangeInput,
    onDismiss: closePanel,
  });

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    returnFocusRef,
  });

  useAnchoredPanelPosition(open, triggerRowRef, panelRef, [viewMonth]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const panel = panelRef.current;

      if (panel) {
        focusCalendarPanelInitial(panel);
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeDay, open, viewMonth]);

  const openForField = useCallback(
    (field: ActiveRangeField): void => {
      if (disabled) {
        return;
      }

      const sourceDay = field === 'start' ? startDay : endDay;

      returnFocusRef.current =
        field === 'start' ? startTriggerRef.current : endTriggerRef.current;
      setActiveField(field);
      setViewMonth(monthViewFromIsoDayOrToday(sourceDay, maxDay));
      setOpen(true);
    },
    [disabled, endDay, maxDay, startDay]
  );

  const handleSelectDay = useCallback(
    (isoDay: string): void => {
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
        setViewMonth(
          monthViewFromIsoDayOrToday(endDay !== '' ? endDay : isoDay, maxDay)
        );

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
    },
    [activeField, endDay, maxDay, onEndDayChange, onStartDayChange, startDay]
  );

  const handleClear = useCallback(
    (event: { stopPropagation: () => void }): void => {
      event.stopPropagation();

      if (disabled) {
        return;
      }

      onClear?.();
      setActiveField('start');
      closePanel();
    },
    [closePanel, disabled, onClear]
  );

  const leftSegment = useMemo(
    () => ({
      active: open && activeField === 'start',
      ariaControls: panelId,
      ariaExpanded: open && activeField === 'start',
      ariaHaspopup: 'dialog' as const,
      disabled,
      icon: calendarIcon,
      ref: startTriggerRef,
      text: formatSegmentText(startDay),
      textColor: startDay === '' ? ('muted' as const) : undefined,
      title: startLabel,
      onClick: () => {
        openForField('start');
      },
    }),
    [
      activeField,
      calendarIcon,
      disabled,
      open,
      openForField,
      panelId,
      startDay,
      startLabel,
    ]
  );

  const rightSegment = useMemo(
    () => ({
      active: open && activeField === 'end',
      ariaControls: panelId,
      ariaExpanded: open && activeField === 'end',
      ariaHaspopup: 'dialog' as const,
      disabled,
      icon: calendarIcon,
      ref: endTriggerRef,
      text: formatSegmentText(endDay),
      textColor: endDay === '' ? ('muted' as const) : undefined,
      title: endLabel,
      onClick: () => {
        openForField('end');
      },
    }),
    [activeField, calendarIcon, disabled, endDay, endLabel, open, openForField, panelId]
  );

  return (
    <StyledDateRangeInputRoot
      ref={rootRef}
      data-open={open ? 'true' : undefined}
      {...layout}
      {...rootProps}
    >
      <StyledDateRangeInputTriggerRow
        ref={triggerRowRef}
        data-active={isActive ? 'true' : undefined}
        data-open={open ? 'true' : undefined}
        {...axisProps}
      >
        <SegmentButton
          embedded
          inlineSize="100%"
          left={leftSegment}
          right={rightSegment}
          shape={shape}
          sizePreset={sizePreset}
        />

        {showClear && (
          <StyledDateRangeInputClearButton
            aria-label={clearDateRangeButtonAriaLabel(startLabel, endLabel)}
            disabled={disabled}
            type="button"
            {...axisProps}
            onClick={handleClear}
          >
            <StyledDateRangeInputClearIcon {...axisProps}>
              <CloseIcon />
            </StyledDateRangeInputClearIcon>
          </StyledDateRangeInputClearButton>
        )}
      </StyledDateRangeInputTriggerRow>

      {open &&
        createPortal(
          <StyledDateRangeInputPanel
            ref={panelRef}
            aria-label="Date range calendar"
            aria-modal={true}
            id={panelId}
            role="dialog"
            {...axisProps}
          >
            <CalendarPanel
              activeDay={activeDay}
              dayShape={dayShape}
              maxDay={maxDay}
              minDay={minDay}
              rangeEnd={endDay}
              rangeStart={startDay}
              shape={shape}
              sizePreset={sizePreset}
              viewMonth={viewMonth}
              onSelectDay={handleSelectDay}
              onViewMonthChange={setViewMonth}
            />
          </StyledDateRangeInputPanel>,
          document.body
        )}
    </StyledDateRangeInputRoot>
  );
}

export type { DateRangeInputStyleProps } from './date-range-input.styles';

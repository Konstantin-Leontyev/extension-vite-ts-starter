import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'styled-components';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { useAnchoredPanelPosition } from '@hooks/use-anchored-panel-position';
import { useFocusTrap } from '@hooks/use-focus-trap';
import { CalendarIcon } from '@icons/calendar';
import { CloseIcon } from '@icons/close';
import { textSizePreset, type ShapePreset } from '@ui/presets';
import { Text } from '@ui/text';

import { CalendarPanel } from './calendar';
import {
  DEFAULT_DATE_INPUT_SHAPE,
  DEFAULT_DATE_INPUT_SIZE_PRESET,
  StyledDateInputClearButton,
  StyledDateInputClearIcon,
  StyledDateInputPanel,
  StyledDateInputRoot,
  StyledDateInputTrigger,
  StyledDateInputTriggerRow,
  splitLayoutProps,
  type DateInputStyleProps,
} from './date-input.styles';
import {
  DATE_PLACEHOLDER,
  formatIsoDayCompact,
  monthViewFromIsoDayOrToday,
  type MonthView,
} from './day';
import { clearButtonAriaLabel, focusCalendarPanelInitial } from './popover-a11y';

export type DateInputProps = DateInputStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    | keyof DateInputStyleProps
    | 'className'
    | 'defaultValue'
    | 'onChange'
    | 'style'
    | 'value'
  > & {
    'aria-label'?: string;
    disabled?: boolean;
    maxDay?: string;
    minDay?: string;
    onChange?: (isoDay: string) => void;
    onClear?: () => void;
    /** Форма подсветки дня; по умолчанию — как у триггера (`shape`). */
    dayShape?: ShapePreset;
    value?: string;
  };

export function DateInput({
  'aria-label': ariaLabel,
  dayShape: dayShapeProp,
  disabled = false,
  maxDay,
  minDay,
  onChange,
  onClear,
  shape = DEFAULT_DATE_INPUT_SHAPE,
  sizePreset = DEFAULT_DATE_INPUT_SIZE_PRESET,
  value = '',
  ...rest
}: DateInputProps) {
  const theme = useTheme();
  const { layout, rest: rootProps } = splitLayoutProps(rest);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<MonthView>(() =>
    monthViewFromIsoDayOrToday(value, maxDay)
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const dayShape = dayShapeProp ?? shape;
  const axisProps = { shape, sizePreset };
  const isActive = value !== '';
  const showClear = isActive && onClear !== undefined && !disabled;

  const closePanel = useCallback((): void => {
    setOpen(false);
  }, []);

  const isInsideDateInput = useCallback((target: Node): boolean => {
    return (
      (rootRef.current?.contains(target) ?? false) ||
      (panelRef.current?.contains(target) ?? false)
    );
  }, []);

  useAnchoredDismiss({
    active: open,
    isInside: isInsideDateInput,
    onDismiss: closePanel,
  });

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    returnFocusRef: triggerRef,
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
  }, [open, value, viewMonth]);

  function openPanel(): void {
    if (disabled) {
      return;
    }

    setViewMonth(monthViewFromIsoDayOrToday(value, maxDay));
    setOpen(true);
  }

  function handleSelectDay(isoDay: string): void {
    if (isoDay === value && value !== '') {
      onChange?.('');
      closePanel();
      return;
    }

    onChange?.(isoDay);
    closePanel();
  }

  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onClear?.();
    closePanel();
  }

  const triggerLabel = isActive ? formatIsoDayCompact(value) : DATE_PLACEHOLDER;
  const triggerColor = isActive ? undefined : theme.colors.muted;

  return (
    <StyledDateInputRoot
      ref={rootRef}
      data-open={open ? 'true' : undefined}
      {...layout}
      {...rootProps}
    >
      <StyledDateInputTriggerRow
        ref={triggerRowRef}
        data-active={isActive ? 'true' : undefined}
        data-open={open ? 'true' : undefined}
        {...axisProps}
      >
        <StyledDateInputTrigger
          ref={triggerRef}
          aria-controls={panelId}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={ariaLabel}
          disabled={disabled}
          type="button"
          {...axisProps}
          onClick={openPanel}
        >
          <CalendarIcon />
          <Text
            color={triggerColor}
            ellipsis
            minInlineSize="0"
            sizePreset={textSizePreset(sizePreset)}
          >
            {triggerLabel}
          </Text>
        </StyledDateInputTrigger>

        {showClear && (
          <StyledDateInputClearButton
            aria-label={clearButtonAriaLabel(ariaLabel)}
            disabled={disabled}
            type="button"
            {...axisProps}
            onClick={handleClear}
          >
            <StyledDateInputClearIcon {...axisProps}>
              <CloseIcon />
            </StyledDateInputClearIcon>
          </StyledDateInputClearButton>
        )}
      </StyledDateInputTriggerRow>

      {open &&
        createPortal(
          <StyledDateInputPanel
            ref={panelRef}
            aria-label={ariaLabel ?? 'Calendar'}
            aria-modal={true}
            id={panelId}
            role="dialog"
            {...axisProps}
          >
            <CalendarPanel
              activeDay={value}
              dayShape={dayShape}
              maxDay={maxDay}
              minDay={minDay}
              shape={shape}
              sizePreset={sizePreset}
              viewMonth={viewMonth}
              onSelectDay={handleSelectDay}
              onViewMonthChange={setViewMonth}
            />
          </StyledDateInputPanel>,
          document.body
        )}
    </StyledDateInputRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- публичные утилиты date-input */
export { DATE_PLACEHOLDER, formatIsoDayCompact, todayUtc } from './day';
export { clearButtonAriaLabel } from './popover-a11y';
export type { DateInputStyleProps } from './date-input.styles';
/* eslint-enable react-refresh/only-export-components */

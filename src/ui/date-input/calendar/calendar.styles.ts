import styled, { css } from 'styled-components';

import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  blockSizeRem,
  controlIconSize,
  radiusPreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme } from '@ui/theme';

export type CalendarAxisProps = {
  dayShape?: ShapePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

export const CALENDAR_AXIS_PROP_NAMES = new Set<string>([
  'dayShape',
  'shape',
  'sizePreset',
]);

const shouldForwardAxis = (prop: string): boolean => !CALENDAR_AXIS_PROP_NAMES.has(prop);

function calendarChromeRadius(props: CalendarAxisProps): string {
  return radiusPreset(
    props.shape ?? DEFAULT_SHAPE_PRESET,
    props.sizePreset ?? DEFAULT_SIZE_PRESET
  );
}

/**
 * Высота зоны подсветки дня — меньше строки контрола; радиус считаем от неё,
 * иначе radiusPreset по controlBlockSize даёт слишком большой радиус и овал.
 */
const calendarDayHighlightBlockSize = {
  small: 24,
  medium: 28,
  large: 32,
} as const satisfies Record<SizePreset, SpacingPx>;

const CALENDAR_DAY_GRID_GAP = spacingRem(4);

function calendarDayHighlightSize(sizePreset: SizePreset = DEFAULT_SIZE_PRESET): string {
  return spacingRem(calendarDayHighlightBlockSize[sizePreset]);
}

function calendarDayHighlightMaxSize(
  sizePreset: SizePreset = DEFAULT_SIZE_PRESET
): string {
  const fixedSize = calendarDayHighlightSize(sizePreset);

  // Между соседними подсветками — минимум 1px: H <= W + gap − 1.
  return `min(${fixedSize}, calc(100% + ${CALENDAR_DAY_GRID_GAP} - 1px))`;
}

function calendarDayHighlightRadius(
  dayShape: ShapePreset = DEFAULT_SHAPE_PRESET,
  sizePreset: SizePreset = DEFAULT_SIZE_PRESET
): string {
  return radiusPreset(dayShape, sizePreset);
}

export const StyledCalendarPanel = styled.div.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<CalendarAxisProps>`
  display: grid;
  gap: ${spacingRem(8)};
  inline-size: 100%;
  min-inline-size: 0;
`;

export const StyledCalendarHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${spacingRem(4)};
`;

export const StyledCalendarNavButton = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<CalendarAxisProps>`
  display: grid;
  place-items: center;
  inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  color: ${(props) => getTheme(props).colors.default};
  cursor: pointer;
  background: none;
  border: none;
  border-radius: ${(props) => calendarChromeRadius(props)};

  & svg {
    inline-size: ${(props) =>
      spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
    block-size: ${(props) =>
      spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
  }

  &:not(:disabled):hover {
    background-color: ${(props) => {
      const theme = getTheme(props);

      return `color-mix(in srgb, ${theme.colors.border} 28%, ${theme.colors.surface})`;
    }};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const StyledCalendarWeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0;
  inline-size: 100%;
  min-inline-size: 0;
`;

export const StyledCalendarWeekdayCell = styled.span`
  display: grid;
  place-items: center;
  min-block-size: 0;
  padding-block: ${spacingRem(4)};
  color: ${(props) => getTheme(props).colors.muted};
  text-align: center;
`;

export const StyledCalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${CALENDAR_DAY_GRID_GAP};
  inline-size: 100%;
  min-inline-size: 0;
`;

type CalendarDayButtonProps = Pick<CalendarAxisProps, 'dayShape' | 'sizePreset'>;

const calendarDayButtonStyles = css<CalendarDayButtonProps>`
  position: relative;
  z-index: 0;
  display: grid;
  place-items: center;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 0;
  padding-block: ${spacingRem(4)};
  padding-inline: 0;
  color: ${(props) => getTheme(props).colors.default};
  cursor: pointer;
  background: none;
  border: none;

  &::before {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    z-index: -1;
    box-sizing: border-box;
    inline-size: ${(props) =>
      calendarDayHighlightMaxSize(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
    max-block-size: ${(props) =>
      calendarDayHighlightMaxSize(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
    aspect-ratio: 1;
    block-size: auto;
    pointer-events: none;
    content: '';
    border: 1px solid transparent;
    border-radius: ${(props) =>
      calendarDayHighlightRadius(
        props.dayShape ?? DEFAULT_SHAPE_PRESET,
        props.sizePreset ?? DEFAULT_SIZE_PRESET
      )};
    opacity: 0;
    translate: -50% -50%;
  }

  &[data-in-range='true']::before {
    background-color: ${(props) => getTheme(props).colors.scrollbarThumb};
    opacity: 1;
  }

  &[data-in-range='true']:not(:disabled):hover::before {
    background-color: transparent;
    border-color: ${(props) => getTheme(props).colors.primary};
    opacity: 1;
  }

  &[data-selected='true'] {
    color: ${(props) => getTheme(props).colors.inverse};
  }

  &[data-selected='true']::before {
    background-color: ${(props) => getTheme(props).colors.primary};
    opacity: 1;
  }

  &[data-adjacent='true'] {
    color: ${(props) => getTheme(props).colors.muted};
  }

  &[data-in-range='true'] {
    color: ${(props) => getTheme(props).colors.default};
  }

  &:not(:disabled):hover {
    color: ${(props) => getTheme(props).colors.primary};
  }

  &:not(:disabled):hover::before {
    background-color: transparent;
    border-color: ${(props) => getTheme(props).colors.primary};
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
`;

export const StyledCalendarDayButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'dayShape' && prop !== 'sizePreset',
})<CalendarDayButtonProps>`
  ${calendarDayButtonStyles}
`;

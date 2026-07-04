import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  blockSizeRem,
  controlIconSize,
  radiusPreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

export const DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET: SizePreset = DEFAULT_SIZE_PRESET;
export const DEFAULT_DATE_RANGE_INPUT_SHAPE: ShapePreset = DEFAULT_SHAPE_PRESET;

export const DATE_RANGE_INPUT_AXIS_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

export type DateRangeInputAxisProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

export type DateRangeInputStyleProps = LayoutProps & DateRangeInputAxisProps;

const shouldForwardAxis = (prop: string): boolean =>
  !DATE_RANGE_INPUT_AXIS_PROP_NAMES.has(prop);

function dateRangeInputRadius(props: DateRangeInputAxisProps): string {
  return radiusPreset(
    props.shape ?? DEFAULT_SHAPE_PRESET,
    props.sizePreset ?? DEFAULT_SIZE_PRESET
  );
}

export const StyledDateRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  position: relative;
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}

  &[data-open='true'] {
    z-index: 50;
  }
`;

export const StyledDateRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<DateRangeInputAxisProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  overflow: hidden;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${(props) => dateRangeInputRadius(props)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};

  &[data-active='true'],
  &[data-open='true'] {
    border-color: ${(props) => getTheme(props).colors.primary};
  }

  &[data-open='true'] {
    visibility: hidden;
  }
`;

export const StyledDateRangeInputClearButton = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<DateRangeInputAxisProps>`
  display: grid;
  place-items: center;
  inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  min-inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  padding: 0;
  color: ${(props) => getTheme(props).colors.muted};
  cursor: pointer;
  background: none;
  border: none;
  border-inline-start: 1px solid ${(props) => getTheme(props).colors.border};

  &:not(:disabled):hover {
    color: ${(props) => getTheme(props).colors.default};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const StyledDateRangeInputClearIcon = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<DateRangeInputAxisProps>`
  display: block;
  inline-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
  block-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
`;

function getDateRangeInputPanelStyles(
  props: DateRangeInputAxisProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);

  return [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    'z-index: 2000;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${dateRangeInputRadius(props)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: 2px;',
    `padding: ${spacingRem(12)};`,
  ].join('\n');
}

export const StyledDateRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<DateRangeInputAxisProps>`
  display: grid;
  min-inline-size: 0;
  box-sizing: border-box;
  ${(props) => getDateRangeInputPanelStyles(props)}
`;

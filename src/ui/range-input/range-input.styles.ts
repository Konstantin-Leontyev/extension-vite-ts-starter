import styled, { css } from 'styled-components';

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

export const DEFAULT_RANGE_INPUT_SIZE_PRESET: SizePreset = DEFAULT_SIZE_PRESET;
export const DEFAULT_RANGE_INPUT_SHAPE: ShapePreset = DEFAULT_SHAPE_PRESET;

const RANGE_INPUT_AXIS_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/** Оси вида range-input: общие для триггера и панели. */
export type RangeInputAxisProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

export type RangeInputStyleProps = LayoutProps & RangeInputAxisProps;

const shouldForwardAxis = (prop: string): boolean =>
  !RANGE_INPUT_AXIS_PROP_NAMES.has(prop);

/** Радиус контрола из текущих осей вида. */
function rangeInputRadius(props: RangeInputAxisProps): string {
  return radiusPreset(
    props.shape ?? DEFAULT_SHAPE_PRESET,
    props.sizePreset ?? DEFAULT_SIZE_PRESET
  );
}

export const StyledRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  position: relative;
  display: grid;
  gap: ${spacingRem(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}

  &[data-open='true'] {
    z-index: 50;
  }
`;

export const StyledRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  overflow: hidden;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${(props) => rangeInputRadius(props)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};

  &[data-active='true'],
  &[data-open='true'] {
    border-color: ${(props) => getTheme(props).colors.primary};
  }

  &[data-open='true'] {
    visibility: hidden;
  }
`;

export const StyledRangeInputTrigger = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  min-inline-size: 0;
  padding: 0;
  text-align: start;
  color: inherit;
  cursor: pointer;
  background: none;
  border: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const StyledRangeInputChevronBox = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
  display: grid;
  place-items: center;
  inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  min-inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  color: ${(props) => getTheme(props).colors.muted};
  border-inline-start: 1px solid ${(props) => getTheme(props).colors.border};
`;

export const StyledRangeInputChevron = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
  display: block;
  inline-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
  block-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
`;

export const StyledRangeInputClearButton = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
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

export const StyledRangeInputClearIcon = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
  display: block;
  inline-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
  block-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
`;

function getPanelStyles(props: RangeInputAxisProps & { theme: AppTheme }): string {
  const theme = getTheme(props);

  return [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    'z-index: 2000;',
    'overflow: hidden auto;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${rangeInputRadius(props)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: 2px;',
  ].join('\n');
}

export const StyledRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
  display: grid;
  gap: ${spacingRem(12)};
  padding: ${spacingRem(12)};
  ${(props) => getPanelStyles(props)}
`;

export const StyledRangeInputPresetList = styled.ul`
  display: grid;
  gap: 0;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const presetRowBase = css<RangeInputAxisProps>`
  position: relative;
  z-index: 0;
  display: grid;
  align-items: center;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  padding: 0;
  text-align: start;
  cursor: pointer;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: none;

  &::before {
    position: absolute;
    inset: ${spacingRem(4)};
    z-index: -1;
    pointer-events: none;
    content: '';
    background-color: transparent;
    border-radius: calc(${(props) => rangeInputRadius(props)} - ${spacingRem(4)});
    transition: background-color 0.12s ease;
  }
`;

export const StyledRangeInputPresetButton = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<RangeInputAxisProps>`
  ${presetRowBase}

  &:focus {
    outline: none;
  }

  &:hover:not(:disabled)::before,
  &:focus-visible::before {
    background-color: ${(props) => getTheme(props).colors.primary};
  }

  &:hover:not(:disabled),
  &:focus-visible {
    color: ${(props) => getTheme(props).colors.inverse};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const StyledRangeInputCustomSection = styled.div`
  display: grid;
  gap: ${spacingRem(12)};
`;

export const StyledRangeInputFields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: ${spacingRem(12)};
`;

export const StyledRangeInputButtonRow = styled.div`
  display: grid;
  justify-items: center;
`;

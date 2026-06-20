import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  blockSizeRem,
  controlPaddingInline,
  controlTextSizePreset,
  radiusPreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { textSizePresets } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Оси вида контрола (без layout — он на корне-grid). */
export type InputControlStyleProps = {
  align?: CSSProperties['textAlign'];
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/** Публичные пропы поля: layout — на корень, оси вида — на контрол. */
export type InputStyleProps = LayoutProps & InputControlStyleProps;

const INPUT_CONTROL_PROP_NAMES = new Set<string>(['align', 'shape', 'sizePreset']);

/** Габариты, рамка и типографика контрола по оси sizePreset/shape. */
export function getInputControlStyles(
  props: InputControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { align, shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  const rules = [
    `min-block-size: ${blockSizeRem(sizePreset)};`,
    `padding-inline: ${spacingRem(controlPaddingInline[sizePreset])};`,
    `font-size: ${textSizePresets[controlTextSizePreset[sizePreset]].fontSize};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${radiusPreset(shape, sizePreset)};`,
    `background-color: ${theme.colors.surface};`,
    `box-shadow: ${theme.shadow.surface};`,
    `&::placeholder { color: ${theme.colors.muted}; }`,
  ];

  if (align !== undefined) {
    rules.push(`text-align: ${align};`);
  }

  return rules.join('\n');
}

export const StyledInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${spacingRem(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

export const StyledInputControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !INPUT_CONTROL_PROP_NAMES.has(prop),
})<InputControlStyleProps>`
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getInputControlStyles(props)}
`;

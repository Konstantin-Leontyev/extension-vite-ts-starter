import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { SPACING_REM, spacingRem, type SpacingPx } from '@ui/spacing';
import { textSizePresets, type TextSizePreset } from '@ui/text/text.styles';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

export type InputShape = 'default' | 'round';

/** Пресеты размера поля: габариты, отступы и размер текста контрола. */
export const inputSizePresets = {
  small: {
    blockSize: 32,
    controlSizePreset: 'medium',
    paddingInline: 12,
  },
  medium: {
    blockSize: 40,
    controlSizePreset: 'normal',
    paddingInline: 12,
  },
  large: {
    blockSize: 48,
    controlSizePreset: 'normal',
    paddingInline: 16,
  },
} as const satisfies Record<
  string,
  {
    blockSize: SpacingPx;
    controlSizePreset: TextSizePreset;
    paddingInline: SpacingPx;
  }
>;

export type InputSizePreset = keyof typeof inputSizePresets;

const DEFAULT_SHAPE: InputShape = 'default';
const DEFAULT_SIZE_PRESET: InputSizePreset = 'large';

/** Оси вида контрола (без layout — он на корне-grid). */
export type InputControlStyleProps = {
  align?: CSSProperties['textAlign'];
  shape?: InputShape;
  sizePreset?: InputSizePreset;
};

/** Публичные пропы поля: layout — на корень, оси вида — на контрол. */
export type InputStyleProps = LayoutProps & InputControlStyleProps;

const INPUT_CONTROL_PROP_NAMES = new Set<string>(['align', 'shape', 'sizePreset']);

/** Габариты, рамка и типографика контрола по оси sizePreset/shape. */
export function getInputControlStyles(
  props: InputControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { align, shape = DEFAULT_SHAPE, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const preset = inputSizePresets[sizePreset];
  const radius = shape === 'round' ? '9999px' : SPACING_REM[8];

  const rules = [
    `min-block-size: ${spacingRem(preset.blockSize)};`,
    `padding-inline: ${spacingRem(preset.paddingInline)};`,
    `font-size: ${textSizePresets[preset.controlSizePreset].fontSize};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${radius};`,
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
  gap: ${SPACING_REM[8]};
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

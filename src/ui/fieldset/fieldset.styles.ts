import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  controlPaddingInline,
  radiusPreset,
} from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE_PRESET,
  extendedToneOptions,
  resolveExtendedToneColor,
  type ExtendedTone,
  type ToneExtraColors,
} from '@ui/tones';

/** Локальный слой borderTone: канон tone + inverted (белая рамка). */
export type FieldsetBorderTone = ExtendedTone<'inverted'>;

/** Локальные значения borderTone вне канона → ключи темы. */
const FIELDSET_BORDER_EXTRA_COLORS = {
  inverted: 'inverse',
} as const satisfies ToneExtraColors<'inverted'>;

export const FIELDSET_BORDER_TONE_OPTIONS = extendedToneOptions(['inverted']);

export const DEFAULT_FIELDSET_BORDER_TONE: FieldsetBorderTone = DEFAULT_TONE_PRESET;

export type FieldsetStyleProps = LayoutProps & {
  borderTone?: FieldsetBorderTone;
};

const FIELDSET_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'borderTone']);

function resolveFieldsetBorderColor(
  theme: AppTheme,
  borderTone: FieldsetBorderTone | undefined
): string {
  const tone = borderTone ?? DEFAULT_FIELDSET_BORDER_TONE;

  return resolveExtendedToneColor(
    theme,
    tone,
    FIELDSET_BORDER_EXTRA_COLORS,
    theme.colors.border
  );
}

export function getFieldsetStyles(
  props: FieldsetStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const paddingInline = spacingRem(controlPaddingInline[DEFAULT_SIZE_PRESET]);
  const paddingBlock = spacingRem(controlPaddingInline[DEFAULT_SIZE_PRESET]);
  const borderColor = resolveFieldsetBorderColor(theme, props.borderTone);

  return [
    'margin: 0;',
    'inline-size: 100%;',
    'min-inline-size: 0;',
    'block-size: auto;',
    `padding-block: ${paddingBlock};`,
    `padding-inline: ${paddingInline};`,
    `border: 1px solid ${borderColor};`,
    `border-radius: ${radiusPreset(DEFAULT_SHAPE_PRESET, DEFAULT_SIZE_PRESET)};`,
  ].join('\n');
}

export const StyledFieldset = styled.fieldset.withConfig({
  shouldForwardProp: (prop) => !FIELDSET_PROP_NAMES.has(prop),
})<FieldsetStyleProps>`
  display: grid;
  grid-auto-rows: min-content;
  align-content: start;
  gap: ${spacingRem(8)};
  ${(props) => getFieldsetStyles(props)}
  ${(props) => getLayoutStyles(props)}

  & > legend {
    padding-inline: ${spacingRem(4)};
    margin: 0;
    background-color: transparent;
  }
`;

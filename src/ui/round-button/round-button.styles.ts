import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { controlBlockSize, controlIconSize, type SizePreset } from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/** Круглая кнопка расширяет общий размерный ряд собственным huge. */
export type RoundButtonSizePreset = SizePreset | 'huge';

/** Габариты круглой кнопки: общая высотная шкала + локальный huge. */
export const roundButtonSizePresets = {
  ...controlBlockSize,
  huge: 80,
} as const satisfies Record<RoundButtonSizePreset, SpacingPx>;

/** Габарит глифа: канон controlIconSize + локальный huge (inset 16 в кнопке 80). */
export const roundButtonIconSize = {
  ...controlIconSize,
  huge: 48,
} as const satisfies Record<RoundButtonSizePreset, SpacingPx>;

export const DEFAULT_ROUND_BUTTON_SIZE_PRESET: RoundButtonSizePreset = 'medium';

export type RoundButtonStyleProps = LayoutProps & {
  elevated?: boolean;
  sizePreset?: RoundButtonSizePreset;
};

const ROUND_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'elevated',
  'sizePreset',
]);

export function getRoundButtonStyles(
  props: RoundButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { elevated = true, sizePreset = DEFAULT_ROUND_BUTTON_SIZE_PRESET } = props;
  const dimension = spacingRem(roundButtonSizePresets[sizePreset]);
  const glyph = spacingRem(roundButtonIconSize[sizePreset]);

  const rules: string[] = [
    `inline-size: ${dimension};`,
    `block-size: ${dimension};`,
    `& svg {`,
    `inline-size: ${glyph};`,
    `block-size: ${glyph};`,
    `}`,
  ];

  if (elevated) {
    rules.push(`border: 1px solid ${theme.colors.border};`);
    rules.push(`box-shadow: ${theme.shadow.surface};`);
  } else {
    rules.push(`color: ${theme.colors.muted};`);
  }

  return rules.join('\n');
}

export const StyledRoundButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !ROUND_BUTTON_PROP_NAMES.has(prop),
})<RoundButtonStyleProps>`
  display: grid;
  overflow: hidden;
  place-items: center;
  border-radius: 50%;

  &:not(:disabled):hover,
  &:focus-visible {
    background-color: ${(props) => {
      const theme = getTheme(props);

      return `color-mix(in srgb, ${theme.colors.border} 35%, ${theme.colors.surface})`;
    }};
    color: ${(props) => getTheme(props).colors.muted};
  }

  ${(props) => getRoundButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

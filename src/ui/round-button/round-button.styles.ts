import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/** Пресеты габаритов круглой кнопки (inline/block-size). */
export const roundButtonSizePresets = {
  huge: 80,
  large: 48,
  medium: 40,
  small: 32,
} as const satisfies Record<string, SpacingPx>;

export type RoundButtonSizePreset = keyof typeof roundButtonSizePresets;

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
  const { elevated = true, sizePreset = 'medium' } = props;
  const sizePx = roundButtonSizePresets[sizePreset];
  const dimension = spacingRem(sizePx);

  const rules: string[] = [`inline-size: ${dimension};`, `block-size: ${dimension};`];

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
  padding: ${(props) => spacingRem((props.sizePreset ?? 'medium') === 'huge' ? 16 : 4)};
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

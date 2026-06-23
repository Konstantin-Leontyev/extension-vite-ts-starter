import { css, keyframes, styled } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE_PRESET, toneThemeColor, type TonePreset } from '@ui/tones';

const spinnerBlockSize = {
  small: 16,
  medium: 24,
  large: 32,
} as const satisfies Record<SizePreset, SpacingPx>;

const spinnerBorderWidthPx = {
  small: 2,
  medium: 2,
  large: 3,
} as const satisfies Record<SizePreset, number>;

export type SpinnerStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  /** Semantic tone; `default` resolves to `theme.colors.primary` (fallback). */
  tone?: TonePreset;
};

const SPINNER_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset', 'tone']);

const spinnerRotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export function getSpinnerStyles(props: SpinnerStyleProps & { theme: AppTheme }) {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;
  const tone = props.tone ?? DEFAULT_TONE_PRESET;
  const blockSize = spacingRem(spinnerBlockSize[sizePreset]);
  const borderWidth = `${spinnerBorderWidthPx[sizePreset]}px`;
  const accentColor = toneThemeColor(theme, tone, theme.colors.primary);

  return css`
    inline-size: ${blockSize};
    block-size: ${blockSize};
    border: ${borderWidth} solid ${theme.colors.border};
    border-block-start-color: ${accentColor};
    border-radius: 50%;
    animation: ${spinnerRotate} 0.8s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation-duration: 1.6s;
    }
  `;
}

export const StyledSpinner = styled.div.withConfig({
  shouldForwardProp: (prop) => !SPINNER_PROP_NAMES.has(prop),
})<SpinnerStyleProps>`
  display: grid;
  flex-shrink: 0;
  min-inline-size: 0;
  ${(props) => getSpinnerStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

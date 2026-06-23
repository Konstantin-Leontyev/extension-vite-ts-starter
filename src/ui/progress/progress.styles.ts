import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE_PRESET, toneThemeColor, type TonePreset } from '@ui/tones';

const progressTrackBlockSize = {
  small: 4,
  medium: 8,
  large: 12,
} as const satisfies Record<SizePreset, SpacingPx>;

export type ProgressStyleProps = LayoutProps & {
  /** Determinate fill ratio in the range 0–1. */
  value: number;
  sizePreset?: SizePreset;
  /** Semantic tone; `default` resolves to `theme.colors.primary` (fallback). */
  tone?: TonePreset;
};

const PROGRESS_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'value',
  'sizePreset',
  'tone',
]);

export function clampProgressValue(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

export function getProgressTrackStyles(props: ProgressStyleProps): string {
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;
  const blockSize = spacingRem(progressTrackBlockSize[sizePreset]);

  return `
    block-size: ${blockSize};
    border-radius: ${blockSize};
  `;
}

export function getProgressFillStyles(
  props: ProgressStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const tone = props.tone ?? DEFAULT_TONE_PRESET;
  const fillColor = toneThemeColor(theme, tone, theme.colors.primary);
  const value = clampProgressValue(props.value);

  return `
    inline-size: ${value * 100}%;
    background-color: ${fillColor};
  `;
}

export const StyledProgressRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_PROP_NAMES.has(prop),
})<ProgressStyleProps>`
  /* Flex: label sits beside the track only when present; absent label takes no space. */
  display: flex;
  align-items: center;
  gap: ${spacingRem(12)};
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

export const StyledProgressTrack = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_PROP_NAMES.has(prop),
})<ProgressStyleProps>`
  display: grid;
  flex-grow: 1;
  min-inline-size: 0;
  overflow: hidden;
  background-color: ${(props) => getTheme(props).colors.border};
  ${(props) => getProgressTrackStyles(props)}
`;

export const StyledProgressFill = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_PROP_NAMES.has(prop),
})<ProgressStyleProps>`
  block-size: 100%;
  border-radius: inherit;
  transition: inline-size 120ms ease-out;
  ${(props) => getProgressFillStyles(props)}
`;

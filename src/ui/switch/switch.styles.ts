import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { DISABLED_OPACITY, getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE_PRESET, toneThemeColor, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/** Габариты дорожки и бегунка — собственный ряд switch (мельче ряда контролов). */
export const switchSizePresets = {
  small: { trackInline: 28, trackBlock: 16, knob: 12 },
  medium: { trackInline: 36, trackBlock: 20, knob: 16 },
  large: { trackInline: 44, trackBlock: 24, knob: 20 },
} as const satisfies Record<
  SizePreset,
  { knob: SpacingPx; trackBlock: SpacingPx; trackInline: SpacingPx }
>;

/** Оси вида дорожки (без layout — он на корне). */
export type SwitchTrackStyleProps = {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/** Публичные пропы: layout — на корень, оси вида — на дорожку. */
export type SwitchStyleProps = LayoutProps & SwitchTrackStyleProps;

/** Оси вида приходят только на дорожку; layout идёт на корень-label, не сюда. */
const SWITCH_TRACK_PROP_NAMES = new Set<string>(['sizePreset', 'tone']);

/** Рамка дорожки: вычитается из инсета бегунка, иначе border-box смещает его вниз. */
const TRACK_BORDER = '1px';

export const StyledSwitchInput = styled.input`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
`;

/** Дорожка, бегунок и checked/focus-вид по осям sizePreset/tone. */
export function getSwitchTrackStyles(
  props: SwitchTrackStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, tone = DEFAULT_TONE_PRESET } = props;
  const preset = switchSizePresets[sizePreset];
  const trackInline = spacingRem(preset.trackInline);
  const trackBlock = spacingRem(preset.trackBlock);
  const knob = spacingRem(preset.knob);
  // Бегунок центрируется инсетом (минус рамка: inset отсчитывается от padding-края)
  // и проходит ровно (trackInline - trackBlock) — обе позиции смещены рамкой одинаково.
  const knobInset = `calc((${trackBlock} - ${knob}) / 2 - ${TRACK_BORDER})`;
  const knobTravel = `calc(${trackInline} - ${trackBlock})`;
  const checkedBackground = toneThemeColor(theme, tone, theme.colors.primary);

  return `
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    inline-size: ${trackInline};
    block-size: ${trackBlock};
    background-color: ${theme.colors.border};
    border: ${TRACK_BORDER} solid ${theme.colors.border};
    border-radius: calc(${trackBlock} / 2);
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease;

    &::after {
      position: absolute;
      inset-block-start: ${knobInset};
      inset-inline-start: ${knobInset};
      inline-size: ${knob};
      block-size: ${knob};
      content: '';
      background-color: ${theme.colors.surface};
      border-radius: 50%;
      box-shadow: ${theme.shadow.surface};
      transition: transform 0.15s ease;
    }

    ${StyledSwitchInput}:checked + & {
      background-color: ${checkedBackground};
      border-color: ${checkedBackground};
    }

    ${StyledSwitchInput}:checked + &::after {
      transform: translateX(${knobTravel});
    }

    ${StyledSwitchInput}:focus-visible + & {
      outline: 2px solid ${theme.colors.focusRing};
      outline-offset: 2px;
    }
  `;
}

export const StyledSwitchTrack = styled.span.withConfig({
  shouldForwardProp: (prop) => !SWITCH_TRACK_PROP_NAMES.has(prop),
})<SwitchTrackStyleProps>`
  ${(props) => getSwitchTrackStyles(props)}
`;

export const StyledSwitchRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: inline-grid;
  grid-auto-flow: column;
  /* Треки к началу: при растяжении корня родителем лейбл остаётся прижат к дорожке. */
  justify-content: start;
  align-items: center;
  gap: ${spacingRem(8)};
  cursor: pointer;
  ${(props) => getLayoutStyles(props)}

  /* disabled приходит на скрытый input; корень-label глушим структурно через :has. */
  &:has(:disabled) {
    cursor: not-allowed;
    opacity: ${DISABLED_OPACITY};
  }
`;

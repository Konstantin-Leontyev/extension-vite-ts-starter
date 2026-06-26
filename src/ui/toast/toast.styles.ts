import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, blockSizeRem } from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE_PRESET, toneThemeColor, type TonePreset } from '@ui/tones';

/** Ось вида тоста — семантический тон (акцентная грань; ARIA задаётся в примитиве). */
export type ToastViewStyleProps = {
  tone?: TonePreset;
};

/** Публичные пропы: layout — на корень, оси вида — там же. */
export type ToastStyleProps = LayoutProps & ToastViewStyleProps;

const TOAST_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'tone']);

/** Поверхность тоста с акцентной гранью по тону (default — нейтральная рамка). */
export function getToastStyles(
  props: ToastViewStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { tone = DEFAULT_TONE_PRESET } = props;
  const accent = toneThemeColor(theme, tone, theme.colors.border);

  return `
    display: grid;
    /* Высота по канону размерного ряда; контент выше — растягивает (min, не fixed). */
    align-content: center;
    min-block-size: ${blockSizeRem(DEFAULT_SIZE_PRESET)};
    min-inline-size: min(18rem, calc(100vw - ${spacingRem(32)}));
    max-inline-size: min(24rem, calc(100vw - ${spacingRem(32)}));
    padding: ${spacingRem(12)} ${spacingRem(16)};
    background-color: ${theme.colors.surface};
    color: ${theme.colors.default};
    border: 1px solid ${theme.colors.border};
    border-inline-start: ${spacingRem(4)} solid ${accent};
    border-radius: ${spacingRem(8)};
    box-shadow: ${theme.shadow.surface};
  `;
}

export const StyledToast = styled.div.withConfig({
  shouldForwardProp: (prop) => !TOAST_PROP_NAMES.has(prop),
})<ToastStyleProps>`
  ${(props) => getToastStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { SPACING_REM, spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/** Единый дефолт inline-end gutter: должен совпадать у корня (margin/вуаль) и вьюпорта (padding). */
const DEFAULT_PADDING_INLINE_END: SpacingPx = 16;

/** Смещение inline-end трека: уводит скроллбар в правый паддинг карточки. */
function scrollPortTrackMarginInlineEnd(
  paddingInlineEnd: SpacingPx = DEFAULT_PADDING_INLINE_END
): string {
  const gutter = spacingRem(paddingInlineEnd);
  const halfXs = spacingRem(8);

  return `calc(-1 * (${gutter} - ${halfXs} / 2))`;
}

export type ScrollPortStyleProps = LayoutProps & {
  /** Цвет затухания вуали; дефолт — surface (фон карточки). */
  fadeColor?: string;
  /** Inline-end gutter for scrollbar and content padding. */
  paddingInlineEnd?: SpacingPx;
  scrollbarInsetBlockEnd?: SpacingPx;
  scrollbarInsetBlockStart?: SpacingPx;
  /** Edge fade when content scrolls. */
  veil?: boolean;
};

const SCROLL_PORT_AXIS_PROP_NAMES = new Set<string>([
  'fadeColor',
  'paddingInlineEnd',
  'scrollbarInsetBlockEnd',
  'scrollbarInsetBlockStart',
  'veil',
]);

export const SCROLL_PORT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...SCROLL_PORT_AXIS_PROP_NAMES,
]);

const SCROLL_PORT_VIEWPORT_PROP_NAMES = new Set<string>([
  'paddingInlineEnd',
  'scrollbarInsetBlockEnd',
  'scrollbarInsetBlockStart',
]);

function getScrollPortRootStyles(
  props: ScrollPortStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    fadeColor = theme.colors.surface,
    paddingInlineEnd = DEFAULT_PADDING_INLINE_END,
    veil = true,
  } = props;
  const gutter = spacingRem(paddingInlineEnd);

  const rules = [
    'position: relative;',
    'display: flex;',
    'flex-direction: column;',
    'block-size: 100%;',
    'min-block-size: 0;',
    'min-inline-size: 0;',
    'background-color: inherit;',
    `margin-inline-end: ${scrollPortTrackMarginInlineEnd(paddingInlineEnd)};`,
  ];

  if (veil === true) {
    const veilBlockSize = spacingRem(32);
    const veilInsetInline = `calc(${spacingRem(4)} * -1) calc(${gutter} - ${spacingRem(4)})`;

    rules.push(`
      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 2;
        block-size: ${veilBlockSize};
        pointer-events: none;
        inset-inline: ${veilInsetInline};
      }

      &::before {
        inset-block-start: 0;
        background: linear-gradient(to top, transparent, ${fadeColor});
      }

      &::after {
        inset-block-end: 0;
        background: linear-gradient(to bottom, transparent, ${fadeColor});
      }
    `);
  }

  return rules.join('\n');
}

function getScrollPortViewportStyles(props: ScrollPortStyleProps): string {
  const {
    paddingInlineEnd = DEFAULT_PADDING_INLINE_END,
    scrollbarInsetBlockEnd = 32,
    scrollbarInsetBlockStart = 32,
  } = props;

  return [
    'block-size: 100%;',
    'min-block-size: 0;',
    'min-inline-size: 0;',
    'overflow: auto;',
    `padding-inline: ${spacingRem(4)} ${spacingRem(paddingInlineEnd)};`,
    `padding-block-start: ${spacingRem(scrollbarInsetBlockStart)};`,
    `padding-block-end: ${spacingRem(scrollbarInsetBlockEnd)};`,
    `&::-webkit-scrollbar-track { margin-block-end: ${spacingRem(4)}; }`,
  ].join('\n');
}

export const StyledScrollPort = styled.div.withConfig({
  shouldForwardProp: (prop) => !SCROLL_PORT_PROP_NAMES.has(prop),
})<ScrollPortStyleProps>`
  ${(props) => getScrollPortRootStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

export const StyledScrollPortContainer = styled.div`
  flex: 1 1 auto;
  min-block-size: 0;
  min-inline-size: 0;
  padding-block: ${SPACING_REM[4]};
`;

export const StyledScrollPortViewport = styled.div.withConfig({
  shouldForwardProp: (prop) => !SCROLL_PORT_VIEWPORT_PROP_NAMES.has(prop),
})<ScrollPortStyleProps>`
  ${(props) => getScrollPortViewportStyles(props)}
`;

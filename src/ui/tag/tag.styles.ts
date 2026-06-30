import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  controlBlockSize,
  controlPaddingInline,
  controlTextSizePreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE_PRESET, toneThemeColorKey, type TonePreset } from '@ui/tones';

/** Тег ниже контролов — добавляет «тонкий» шаг (24) к каноническому ряду 32/40/48. */
export type TagSizePreset = SizePreset | 'thin';

const tagBlockSize = {
  ...controlBlockSize,
  thin: 24,
} as const satisfies Record<TagSizePreset, SpacingPx>;

const tagPaddingInline = {
  ...controlPaddingInline,
  thin: 8,
} as const satisfies Record<TagSizePreset, SpacingPx>;

/** Размер текста по оси sizePreset тега; `thin` повторяет текст `small`. */
export const tagTextSizePreset = {
  ...controlTextSizePreset,
  thin: 'medium',
} as const satisfies Record<TagSizePreset, TextSizePreset>;

function tagBlockSizeRem(sizePreset: TagSizePreset): string {
  return spacingRem(tagBlockSize[sizePreset]);
}

/** Радиус по оси shape поверх расширенного ряда тега: round = половина высоты, default = spacing 8. */
function tagRadiusPreset(shape: ShapePreset, sizePreset: TagSizePreset): string {
  // Канонический round-радиус — половина высоты строки (таблетка на любом размере).
  return shape === 'round' ? `calc(${tagBlockSizeRem(sizePreset)} / 2)` : spacingRem(8);
}

/** Тег компактнее контролов и по умолчанию «таблетка» — свои дефолты осей. */
export const DEFAULT_TAG_SIZE_PRESET: TagSizePreset = 'small';
const DEFAULT_TAG_SHAPE: ShapePreset = 'round';

export type TagStyleProps = LayoutProps & {
  borderColor?: TonePreset;
  dot?: boolean;
  dotColor?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: TagSizePreset;
  bordered?: boolean;
  tinted?: boolean;
  textColor?: TonePreset;
  tone?: TonePreset;
};

const TAG_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'borderColor',
  'dot',
  'dotColor',
  'shape',
  'sizePreset',
  'bordered',
  'textColor',
  'tinted',
  'tone',
]);

/** Доля цвета поверх прозрачного — мягкая заливка `tinted`. */
function tint(color: string, pct: number): string {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

type TagSurface = { fg: string; fill: string };

/**
 * Заливка/текст по тону. Без `tinted`: нейтраль — прозрачно/`default`, цвет —
 * тема/`inverse`. С `tinted`: мягкий тинт цвета, текст — цвет тона (нейтраль —
 * тинт `muted`, текст `default`).
 */
function resolveTagFill(theme: AppTheme, tone: TonePreset, tinted: boolean): TagSurface {
  const key = toneThemeColorKey(tone);

  if (!key) {
    return {
      fg: theme.colors.default,
      fill: tinted ? tint(theme.colors.muted, 14) : 'transparent',
    };
  }

  const color = theme.colors[key];

  return tinted
    ? { fg: color, fill: tint(color, 16) }
    : { fg: theme.colors.inverse, fill: color };
}

/**
 * Тон текста → цвет темы. Без override (наследует контрастный цвет родителя), когда тон
 * `default` или совпадает с `tone` заливки — иначе текст слился бы с заливкой.
 */
export function resolveTagTextColor(
  theme: AppTheme,
  textColor: TonePreset | undefined,
  tone: TonePreset | undefined
): string | undefined {
  if (!textColor || textColor === DEFAULT_TONE_PRESET || textColor === tone) {
    return undefined;
  }

  const key = toneThemeColorKey(textColor);

  return key ? theme.colors[key] : undefined;
}

/** Цвет границы по тону: нейтраль → нейтральный `border`. */
function resolveTagBorderColor(theme: AppTheme, borderColor: TonePreset): string {
  const key = toneThemeColorKey(borderColor);

  return key ? theme.colors[key] : theme.colors.border;
}

/**
 * Цвет точки. По правилу текста: `default` или совпадение с `tone` заливки →
 * `currentColor` (тот же альт-цвет, что у текста при смене тона); иначе — цвет тона.
 */
function resolveTagDotColor(
  theme: AppTheme,
  dotColor: TonePreset | undefined,
  tone: TonePreset | undefined
): string {
  if (!dotColor || dotColor === DEFAULT_TONE_PRESET || dotColor === tone) {
    return 'currentColor';
  }

  const key = toneThemeColorKey(dotColor);

  return key ? theme.colors[key] : 'currentColor';
}

export function getTagStyles(props: TagStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    borderColor = DEFAULT_TONE_PRESET,
    shape = DEFAULT_TAG_SHAPE,
    sizePreset = DEFAULT_TAG_SIZE_PRESET,
    bordered = false,
    tinted = false,
    tone = DEFAULT_TONE_PRESET,
  } = props;
  const surface = resolveTagFill(theme, tone, tinted);
  const borderCol = bordered ? resolveTagBorderColor(theme, borderColor) : 'transparent';
  const blockSize = tagBlockSizeRem(sizePreset);

  return [
    `min-block-size: ${blockSize};`,
    `padding-inline: ${spacingRem(tagPaddingInline[sizePreset])};`,
    `border: 1px solid ${borderCol};`,
    `border-radius: ${tagRadiusPreset(shape, sizePreset)};`,
    `background-color: ${surface.fill};`,
    `color: ${surface.fg};`,
  ].join('\n');
}

export const StyledTag = styled.span.withConfig({
  shouldForwardProp: (prop) => !TAG_PROP_NAMES.has(prop),
})<TagStyleProps>`
  /* flex (не grid): инлайн-ряд [точка?] + текст по центру, как у Button; текст
     сжимается с ellipsis, grid с auto-треком тянул бы трек к max-content. */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacingRem(4)};
  white-space: nowrap;
  ${(props) => getTagStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

const TAG_DOT_PROP_NAMES = new Set<string>(['dotColor', 'tone']);

export const StyledTagDot = styled.span.withConfig({
  shouldForwardProp: (prop) => !TAG_DOT_PROP_NAMES.has(prop),
})<{ dotColor?: TonePreset; tone?: TonePreset }>`
  flex-shrink: 0;
  inline-size: 0.5em;
  block-size: 0.5em;
  border-radius: 50%;
  background-color: ${(props) =>
    resolveTagDotColor(getTheme(props), props.dotColor, props.tone)};
`;

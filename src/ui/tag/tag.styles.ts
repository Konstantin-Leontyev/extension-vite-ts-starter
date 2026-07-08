/**
 * Файл: tag.styles.ts
 * Стилизованные компоненты Tag и утилиты их вида.
 * Определяет локальный размерный ряд, тоны заливки/границы/точки и режимы `tinted`/`bordered`.
 *
 * Основные задачи:
 * 1. Локальный ряд размеров (`tiny` + канон `@ui/presets`)
 * 2. Резолв заливки (`resolveTagFill`), границы и точки (`getTagBorderColor`, `getTagDotColor`)
 * 3. `StyledTag`, `StyledTagDot`, `getTagStyles`
 *
 * Потребители: `./index.tsx`.
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  blockSize,
  paddingInline,
  resolveBlockRadius,
  textSize,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, getToneKey, type TonePreset } from '@ui/tones';

/**
 * TagSizePreset — размерный ряд тега.
 * Локальное расширение канона: спред `@ui/presets` + ключ `tiny` (24 spacing-токен),
 * без добавления `tiny` в общий `SizePreset` контролов.
 */
export type TagSizePreset = SizePreset | 'tiny';

/** Высота тега по размеру; `tiny` — локальный ключ, остальное из `@ui/presets` `blockSize`. */
const tagBlockSize = {
  ...blockSize,
  tiny: 24,
} as const satisfies Record<TagSizePreset, SpacingValue>;

/** Горизонтальный отступ; `tiny` — 8, остальное из `@ui/presets` `paddingInline`. */
const tagPaddingInline = {
  ...paddingInline,
  tiny: 8,
} as const satisfies Record<TagSizePreset, SpacingValue>;

/**
 * Размер текста по `sizePreset` тега.
 * `tiny` совпадает с текстом `small` (`medium` в `@ui/text`).
 * Экспорт — только для `./index.tsx`, в баррель `@ui/tag` не входит.
 */
export const tagTextSize = {
  ...textSize,
  tiny: 'medium',
} as const satisfies Record<TagSizePreset, TextSizePreset>;

/**
 * getTagBlockSize — высота тега (block-size) для `sizePreset`.
 *
 * @param sizePreset — размер тега
 * @returns CSS-длина в rem
 */
function getTagBlockSize(sizePreset: TagSizePreset): string {
  return getSpacingValue(tagBlockSize[sizePreset]);
}

/** Размер по умолчанию — `tiny`; тег компактнее контролов. */
export const DEFAULT_TAG_SIZE_PRESET: TagSizePreset = 'tiny';

/** Форма по умолчанию — таблетка. */
const DEFAULT_TAG_SHAPE: ShapePreset = 'round';

/**
 * TagStyleProps — оси вида тега и layout-пропы.
 * `tone` — заливка; `borderTone` — при `bordered`; `tinted` — мягкая заливка.
 */
export type TagStyleProps = LayoutProps & {
  borderTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: TagSizePreset;
  bordered?: boolean;
  tinted?: boolean;
  tone?: TonePreset;
};

/** Оси вида для `shouldForwardProp` корня `StyledTag`. */
const TAG_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'borderTone',
  'shape',
  'sizePreset',
  'bordered',
  'tinted',
  'tone',
]);

/** Доля цвета в `color-mix` — мягкая заливка в режиме `tinted`. */
function resolveTagTint(color: string, pct: number): string {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

/** Цвет текста и заливки, которые задаёт `resolveTagFill`. */
type TagSurface = { fg: string; fill: string };

/**
 * resolveTagFill — заливка и цвет контейнера по `tone` и `tinted`.
 * Без `tinted`: нейтраль — прозрачный фон и `default`; цветной — заливка тона и `inverse`.
 * С `tinted`: мягкий тинт (`muted` или цвет тона), текст — `default` или цвет тона.
 *
 * @param theme — текущая тема
 * @param tone — тон заливки
 * @param tinted — режим мягкой заливки
 * @returns цвет текста контейнера и фона
 */
function resolveTagFill(theme: AppTheme, tone: TonePreset, tinted: boolean): TagSurface {
  const key = getToneKey(tone);

  if (!key) {
    return {
      fg: theme.colors.default,
      fill: tinted ? resolveTagTint(theme.colors.muted, 14) : 'transparent',
    };
  }

  const color = theme.colors[key];

  return tinted
    ? { fg: color, fill: resolveTagTint(color, 16) }
    : { fg: theme.colors.inverse, fill: color };
}

/**
 * getTagBorderColor — цвет границы по `borderTone`.
 *
 * @param theme — текущая тема
 * @param borderTone — тон границы
 * @returns CSS-цвет; для `default` — `theme.colors.border`
 */
function getTagBorderColor(theme: AppTheme, borderTone: TonePreset): string {
  return getToneColor(theme, borderTone, theme.colors.border);
}

/**
 * getTagDotColor — цвет точки по `dotTone`.
 * Без `dotTone` или `default` — `currentColor` (наследует `color` корня `StyledTag`).
 *
 * @param theme — текущая тема
 * @param dotTone — тон точки
 * @returns CSS-цвет точки
 */
function getTagDotColor(theme: AppTheme, dotTone: TonePreset | undefined): string {
  if (!dotTone || dotTone === DEFAULT_TONE) {
    return 'currentColor';
  }

  return getToneColor(theme, dotTone, 'currentColor');
}

/**
 * getTagStyles — CSS вида корня `StyledTag`.
 *
 * @param props — оси вида и тема
 * @returns строка CSS-стилей, каждая декларация с новой строки
 */
export function getTagStyles(props: TagStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    borderTone = DEFAULT_TONE,
    shape = DEFAULT_TAG_SHAPE,
    sizePreset = DEFAULT_TAG_SIZE_PRESET,
    bordered = false,
    tinted = false,
    tone = DEFAULT_TONE,
  } = props;
  const surface = resolveTagFill(theme, tone, tinted);
  const borderCol = bordered ? getTagBorderColor(theme, borderTone) : 'transparent';
  const blockSizeValue = getTagBlockSize(sizePreset);

  return [
    `min-block-size: ${blockSizeValue};`,
    `padding-inline: ${getSpacingValue(tagPaddingInline[sizePreset])};`,
    `border: 1px solid ${borderCol};`,
    `border-radius: ${resolveBlockRadius(shape, blockSizeValue)};`,
    `background-color: ${surface.fill};`,
    `color: ${surface.fg};`,
  ].join('\n');
}

/**
 * StyledTag — корень тега.
 * Генерация: `getTagStyles`, затем `getLayoutStyles`.
 */
export const StyledTag = styled.span.withConfig({
  shouldForwardProp: (prop) => !TAG_PROP_NAMES.has(prop),
})<TagStyleProps>`
  /* flex (не grid): инлайн-ряд [точка?] + текст по центру, как у Button; текст
     сжимается с ellipsis, grid с auto-треком тянул бы трек к max-content. */
  display: inline-flex;
  gap: ${getSpacingValue(4)};
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  ${(props) => getTagStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/** Ось `StyledTagDot` для `shouldForwardProp`. */
const TAG_DOT_PROP_NAMES = new Set<string>(['dotTone']);

/**
 * StyledTagDot — круглая точка-индикатор в теге.
 * Цвет — по `dotTone`, иначе `currentColor`.
 */
export const StyledTagDot = styled.span.withConfig({
  shouldForwardProp: (prop) => !TAG_DOT_PROP_NAMES.has(prop),
})<{ dotTone?: TonePreset }>`
  flex-shrink: 0;
  /* Размер — 0.5em от наследованного font-size у StyledTag. */
  inline-size: 0.5em;
  block-size: 0.5em;
  background-color: ${(props) => getTagDotColor(getTheme(props), props.dotTone)};
  border-radius: 50%;
`;

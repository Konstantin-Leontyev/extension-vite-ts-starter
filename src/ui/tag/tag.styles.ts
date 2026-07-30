/**
 * Файл: `src/ui/tag/tag.styles.ts`
 * Определяет внешний вид компонента Tag.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TagStyleProps` и `TagSizePreset`
 * 2. Хранить локальный ряд размеров в `tagMinBlockSize`, `tagPaddingInline` и `tagTextSize`
 * 3. Предоставить функцию `getTagTextSize` и перечень `TAG_SIZE_PRESET_KEYS`
 * 4. Предоставить styled-узлы `StyledTag` и `StyledTagDot`
 *
 * Потребители:
 *  - `src/ui/tag/index.tsx` — собирает компонент Tag и реэкспортирует публичное API
 */

import styled from 'styled-components';

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type BorderProps,
} from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  minBlockSize,
  padding,
  resolveBlockRadius,
  textSize,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE,
  getToneColor,
  getToneColorKey,
  resolveColorMix,
  type TonePreset,
} from '@ui/tones';

/**
 * TagSizePreset — представляет размерный ряд метки.
 * Расширяет канонический `SizePreset` ключом `tiny`, не добавляя его
 * в общий ряд контролов.
 */
export type TagSizePreset = 'tiny' | SizePreset;

/**
 * tagMinBlockSize — хранит минимальную высоту метки для каждого размера ряда.
 * Расширяет `minBlockSize` из `@ui/presets` спредом, добавляя локальный ключ `tiny`.
 */
const tagMinBlockSize = {
  ...minBlockSize,
  tiny: 24,
} as const satisfies Record<TagSizePreset, SpacingValue>;

/**
 * TAG_SIZE_PRESET_KEYS — формирует перечень размеров метки из ключей `tagMinBlockSize`.
 * Используется в панелях настроек витрины дизайн-системы: `SizeListbox` принимает его пропом `sizes`.
 */
export const TAG_SIZE_PRESET_KEYS = Object.freeze(
  Object.keys(tagMinBlockSize) as TagSizePreset[]
);

/**
 * DEFAULT_TAG_SIZE_PRESET — задаёт размер по умолчанию.
 * Метка компактнее контролов, поэтому дефолт мельче канонического.
 */
const DEFAULT_TAG_SIZE_PRESET: TagSizePreset = 'tiny';

/**
 * getTagMinBlockSize — возвращает значение для CSS-свойства `min-block-size`
 * по `sizePreset` метки.
 *
 * @param sizePreset размер метки
 * @returns CSS-длина в rem
 */
function getTagMinBlockSize(sizePreset: TagSizePreset): string {
  return getSpacingValue(tagMinBlockSize[sizePreset]);
}

/**
 * tagPaddingInline — хранит горизонтальные отступы метки для каждого размера ряда.
 * Ключи канона берёт из `padding` в `@ui/presets`, `tiny` задаёт локально.
 */
const tagPaddingInline = {
  small: padding.small.inline,
  normal: padding.normal.inline,
  large: padding.large.inline,
  tiny: 8,
} as const satisfies Record<TagSizePreset, SpacingValue>;

/**
 * tagTextSize — хранит размер текста для каждого размера ряда метки.
 * Расширяет `textSize` из `@ui/presets` спредом, добавляя ключ `tiny`,
 * который использует `thin`, как и `small`.
 */
const tagTextSize = {
  ...textSize,
  tiny: 'thin',
} as const satisfies Record<TagSizePreset, TextSizePreset>;

/**
 * getTagTextSize — возвращает размер текста по `sizePreset`.
 * Подставляет `DEFAULT_TAG_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер метки
 * @returns метка размера текста из `TextSizePreset` для текста метки
 */
export function getTagTextSize(sizePreset?: TagSizePreset): TextSizePreset {
  return tagTextSize[sizePreset ?? DEFAULT_TAG_SIZE_PRESET];
}

/**
 * TAG_TINTED_KEEP_PERCENT — задаёт долю цвета в смеси с `transparent`:
 * для цветного тона — цвет тона, для нейтрального — `muted`.
 * Используется в `resolveTagSurface` для мягкой заливки.
 */
const TAG_TINTED_KEEP_PERCENT = 15;

/**
 * TagSurface — представляет пару цветов метки, которую возвращает `resolveTagSurface`.
 *
 * @property backgroundColor — цвет фона
 * @property textColor — цвет текста
 */
type TagSurface = { backgroundColor: string; textColor: string };

/**
 * resolveTagSurface — вычисляет цвет текста и цвет фона метки по `tone` и `tinted`.
 * Без `tinted` нейтральный тон даёт прозрачный фон и цвет `default`,
 * цветной — фон цвета тона и текст `inverse`.
 * С `tinted` фон — мягкий тинт из `muted` или цвета тона,
 * текст — `default` или цвет тона.
 *
 * @param theme текущая тема
 * @param tone тон фона
 * @param tinted режим мягкой заливки
 * @returns пара `TagSurface`: цвет текста и цвет фона
 */
function resolveTagSurface(
  theme: AppTheme,
  tone: TonePreset,
  tinted: boolean
): TagSurface {
  const colorKey = getToneColorKey(tone);

  if (!colorKey) {
    return {
      textColor: theme.colors.default,
      backgroundColor: tinted
        ? resolveColorMix(theme.colors.muted, 'transparent', TAG_TINTED_KEEP_PERCENT)
        : 'transparent',
    };
  }

  const color = theme.colors[colorKey];

  return tinted
    ? {
        textColor: color,
        backgroundColor: resolveColorMix(color, 'transparent', TAG_TINTED_KEEP_PERCENT),
      }
    : { textColor: theme.colors.inverse, backgroundColor: color };
}

/**
 * getTagDotColor — возвращает цвет точки по `dotTone`.
 * Без `dotTone` или при тоне по умолчанию возвращает `currentColor` —
 * точка наследует цвет текста корня `StyledTag`.
 *
 * @param theme текущая тема
 * @param dotTone тон точки
 * @returns CSS-цвет точки
 */
function getTagDotColor(theme: AppTheme, dotTone: TonePreset | undefined): string {
  if (!dotTone || dotTone === DEFAULT_TONE) {
    return 'currentColor';
  }

  return getToneColor(theme, dotTone, 'currentColor');
}

/**
 * TagStyleProps — представляет пропсы стилизации Tag и layout-пропсы.
 *
 * @property shape — форма метки
 * @property sizePreset — размер метки
 * @property tinted — включает режим мягкой заливки
 * @property tone — тон заливки
 */
export type TagStyleProps = LayoutProps &
  BorderProps & {
    shape?: ShapePreset;
    sizePreset?: TagSizePreset;
    tinted?: boolean;
    tone?: TonePreset;
  };

/**
 * TAG_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Tag.
 */
const TAG_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'shape',
  'sizePreset',
  'tinted',
  'tone',
]);

/**
 * DEFAULT_TAG_SHAPE — задаёт форму по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
const DEFAULT_TAG_SHAPE: ShapePreset = 'pill';

/**
 * DEFAULT_TAG_SHOW_BORDER — задаёт показ границы по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
const DEFAULT_TAG_SHOW_BORDER = false;

/**
 * DEFAULT_TAG_TINTED — задаёт режим мягкой заливки по умолчанию.
 * Используется, когда вызывающий код не передал проп `tinted`.
 */
const DEFAULT_TAG_TINTED = false;

/**
 * getTagStyles — возвращает CSS-правила для корня `StyledTag`:
 * размер, отступы, границу, форму и цвета.
 *
 * @param props пропсы стилизации Tag и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTagStyles(props: TagStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    borderTone,
    shape = DEFAULT_TAG_SHAPE,
    showBorder = DEFAULT_TAG_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
    sizePreset = DEFAULT_TAG_SIZE_PRESET,
    tinted = DEFAULT_TAG_TINTED,
    tone = DEFAULT_TONE,
  } = props;
  const surface = resolveTagSurface(theme, tone, tinted);
  const styles = [
    `min-block-size: ${getTagMinBlockSize(sizePreset)};`,
    `padding-inline: ${getSpacingValue(tagPaddingInline[sizePreset])};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
    `border-radius: ${resolveBlockRadius(shape, getTagMinBlockSize(sizePreset))};`,
    `background-color: ${surface.backgroundColor};`,
    `color: ${surface.textColor};`,
  ];

  return styles.join('\n');
}

/**
 * StyledTag — задаёт корневой узел компонента Tag.
 * Базируется на `<span>` и поддерживает все пропсы из `TagStyleProps`.
 *
 * Встроенные стили:
 *  - `gap` — отступ между точкой и текстом
 *  - `display: inline-flex` — инлайн-ряд из точки и текста, grid с auto-треком
 *    тянул бы трек к max-content
 *  - `white-space: nowrap` — метка не переносит текст, длинное содержимое
 *    обрезает внутренний Text с `ellipsis`
 *
 * Генерация стилей:
 *  - `getTagStyles` — размер, отступы, граница, форма и цвета
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledTag = styled.span.withConfig({
  shouldForwardProp: (prop) => !TAG_PROP_NAMES.has(prop),
})<TagStyleProps>`
  display: inline-flex;
  gap: ${getSpacingValue(4)};
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  ${(props) => getTagStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * TAG_DOT_PROP_NAMES — хранит имена пропсов стилизации узла `StyledTagDot`.
 */
const TAG_DOT_PROP_NAMES = new Set<string>(['dotTone']);

/**
 * getTagDotStyles — возвращает CSS-правила для узла `StyledTagDot`: цвет точки.
 *
 * @param props проп `dotTone` и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTagDotStyles(props: { dotTone?: TonePreset; theme: AppTheme }): string {
  const styles = [
    `background-color: ${getTagDotColor(getTheme(props), props.dotTone)};`,
  ];

  return styles.join('\n');
}

/**
 * StyledTagDot — задаёт точку-индикатор компонента Tag.
 * Базируется на `<span>` и принимает единственный проп `dotTone`.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — точка не сжимается при нехватке места
 *  - `inline-size` и `block-size: 0.5em` — половина высоты кегля из унаследованного
 *    `font-size`: точка масштабируется с типографикой контекста; от `sizePreset`
 *    метки не зависит — корень `StyledTag` не задаёт `font-size`
 *  - `border-radius: 50%` — круглая форма
 *
 * Генерация стилей:
 *  - `getTagDotStyles` — цвет точки: по `dotTone`, иначе `currentColor`
 */
export const StyledTagDot = styled.span.withConfig({
  shouldForwardProp: (prop) => !TAG_DOT_PROP_NAMES.has(prop),
})<{ dotTone?: TonePreset }>`
  flex-shrink: 0;
  inline-size: 0.5em;
  block-size: 0.5em;
  border-radius: 50%;
  ${(props) => getTagDotStyles(props)}
`;

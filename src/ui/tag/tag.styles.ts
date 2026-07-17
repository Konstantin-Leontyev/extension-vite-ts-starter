/**
 * Файл: `src/ui/tag/tag.styles.ts`
 * Определяет внешний вид компонента Tag.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TagStyleProps` и `TagSizePreset`
 * 2. Хранить локальный ряд размеров в `tagMinBlockSize`, `tagPaddingInline` и `tagTextSize`
 * 3. Предоставить функции `getTagStyles`, `getTagDotStyles` и `getTagTextSize`,
 *    а также перечень `TAG_SIZE_PRESET_KEYS`
 * 4. Предоставить styled-узлы `StyledTag` и `StyledTagDot`
 *
 * Потребители:
 *  - `src/ui/tag/index.tsx` — собирает компонент Tag и реэкспортирует публичное API
 */

import styled from 'styled-components';

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
import { DEFAULT_TONE, getToneColor, getToneColorKey, type TonePreset } from '@ui/tones';

/**
 * TagSizePreset — представляет размерный ряд метки.
 * Расширяет канонический `SizePreset` ключом `tiny`, не добавляя его
 * в общий ряд контролов.
 */
export type TagSizePreset = 'tiny' | SizePreset;

/**
 * TagStyleProps — представляет пропсы стилизации Tag и layout-пропсы.
 *
 * @property borderTone — тон границы при включённом `showBorder`
 * @property shape — форма метки
 * @property showBorder — включает границу
 * @property sizePreset — размер метки
 * @property tinted — включает режим мягкой заливки
 * @property tone — тон заливки
 */
export type TagStyleProps = LayoutProps & {
  borderTone?: TonePreset;
  shape?: ShapePreset;
  showBorder?: boolean;
  sizePreset?: TagSizePreset;
  tinted?: boolean;
  tone?: TonePreset;
};

/**
 * TagSurface — представляет пару цветов метки, которую возвращает `resolveTagSurface`.
 *
 * @property textColor — цвет текста
 * @property backgroundColor — цвет фона
 */
type TagSurface = { backgroundColor: string; textColor: string };

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
 * tagPaddingInline — хранит горизонтальные отступы метки для каждого размера ряда.
 * Ключи канона берёт из `padding` в `@ui/presets`, `tiny` задаёт локально.
 */
const tagPaddingInline = {
  small: padding.small.inline,
  medium: padding.medium.inline,
  large: padding.large.inline,
  tiny: 8,
} as const satisfies Record<TagSizePreset, SpacingValue>;

/**
 * tagTextSize — хранит размер текста для каждого размера ряда метки.
 * Расширяет `textSize` из `@ui/presets` спредом, добавляя ключ `tiny`,
 * который использует `medium`, как и `small`.
 */
const tagTextSize = {
  ...textSize,
  tiny: 'medium',
} as const satisfies Record<TagSizePreset, TextSizePreset>;

/**
 * DEFAULT_TAG_SIZE_PRESET — задаёт размер по умолчанию.
 * Метка компактнее контролов, поэтому дефолт мельче канонического.
 */
const DEFAULT_TAG_SIZE_PRESET: TagSizePreset = 'tiny';

/**
 * DEFAULT_TAG_SHAPE — задаёт форму по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
const DEFAULT_TAG_SHAPE: ShapePreset = 'pill';

/**
 * TAG_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Tag.
 */
const TAG_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'borderTone',
  'shape',
  'showBorder',
  'sizePreset',
  'tinted',
  'tone',
]);

/**
 * TAG_DOT_PROP_NAMES — хранит имена пропсов стилизации узла `StyledTagDot`.
 */
const TAG_DOT_PROP_NAMES = new Set<string>(['dotTone']);

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
 * resolveTagTint — преобразует исходный CSS-цвет в цвет с прозрачностью через `color-mix`.
 *
 * @param color исходный CSS-цвет
 * @param opacityPercent доля цвета в процентах, остальное прозрачно
 * @returns CSS-цвет с заданной долей исходного цвета в смеси
 */
function resolveTagTint(color: string, opacityPercent: number): string {
  return `color-mix(in srgb, ${color} ${opacityPercent}%, transparent)`;
}

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
      backgroundColor: tinted ? resolveTagTint(theme.colors.muted, 14) : 'transparent',
    };
  }

  const color = theme.colors[colorKey];

  return tinted
    ? { textColor: color, backgroundColor: resolveTagTint(color, 16) }
    : { textColor: theme.colors.inverse, backgroundColor: color };
}

/**
 * getTagBorderColor — возвращает цвет границы по `borderTone`.
 *
 * @param theme текущая тема
 * @param borderTone тон границы
 * @returns CSS-цвет. Для тона по умолчанию — `theme.colors.border`
 */
function getTagBorderColor(theme: AppTheme, borderTone: TonePreset): string {
  return getToneColor(theme, borderTone, theme.colors.border);
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
 * getTagDotStyles — возвращает CSS-правила для узла `StyledTagDot`: цвет точки.
 *
 * @param props проп `dotTone` и тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getTagDotStyles(props: {
  dotTone?: TonePreset;
  theme: AppTheme;
}): string {
  return `background-color: ${getTagDotColor(getTheme(props), props.dotTone)};`;
}

/**
 * getTagStyles — возвращает CSS-правила для корня `StyledTag`:
 * размер, отступы, границу, форму и цвета.
 *
 * @param props пропсы стилизации Tag и тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getTagStyles(props: TagStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    borderTone = DEFAULT_TONE,
    shape = DEFAULT_TAG_SHAPE,
    showBorder = false,
    sizePreset = DEFAULT_TAG_SIZE_PRESET,
    tinted = false,
    tone = DEFAULT_TONE,
  } = props;
  const surface = resolveTagSurface(theme, tone, tinted);
  const styles = [
    `min-block-size: ${getTagMinBlockSize(sizePreset)};`,
    `padding-inline: ${getSpacingValue(tagPaddingInline[sizePreset])};`,
    `border: 1px solid ${showBorder ? getTagBorderColor(theme, borderTone) : 'transparent'};`,
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
 *    обрезает внутренний Text с `showEllipsis`
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
 * StyledTagDot — задаёт точку-индикатор компонента Tag.
 * Базируется на `<span>` и принимает единственный проп `dotTone`.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — точка не сжимается при нехватке места
 *  - `inline-size` и `block-size: 0.5em` — единица `em` берёт размер
 *    от `font-size` родителя `StyledTag`, точка — половина высоты шрифта
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

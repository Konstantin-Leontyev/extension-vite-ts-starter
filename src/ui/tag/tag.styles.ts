/**
 * Файл: `src/ui/tag/tag.styles.ts`
 * Определяет внешний вид компонента Tag.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TagStyleProps` и `TagSizePreset`
 * 2. Хранить локальный ряд размеров в `tagBlockSize`, `tagPaddingInline` и `tagTextSize`
 * 3. Предоставить функции `getTagStyles` и `getTagTextSize`,
 *    дефолт `DEFAULT_TAG_SIZE_PRESET`
 * 4. Предоставить styled-узлы `StyledTag` и `StyledTagDot`
 *
 * Потребители:
 *  - `src/ui/tag/index.tsx` — собирает компонент Tag
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
import { DEFAULT_TONE, getToneColor, getToneKey, type TonePreset } from '@ui/tones';

/**
 * TagSizePreset — представляет размерный ряд тега.
 * Расширяет канонический `SizePreset` ключом `tiny`, не добавляя его
 * в общий ряд контролов.
 */
export type TagSizePreset = SizePreset | 'tiny';

/**
 * TagStyleProps — представляет пропсы стилизации тега и layout-пропсы.
 *
 * @property tone — тон заливки
 * @property borderTone — тон границы в режиме `bordered`
 * @property shape — форма строки-поля
 * @property sizePreset — размер тега
 * @property bordered — режим с границей
 * @property tinted — режим мягкой заливки
 */
export type TagStyleProps = LayoutProps & {
  borderTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: TagSizePreset;
  bordered?: boolean;
  tinted?: boolean;
  tone?: TonePreset;
};

/**
 * TagSurface — представляет пару цветов тега, которую возвращает `resolveTagFill`.
 *
 * @property fg — цвет текста
 * @property fill — цвет заливки
 */
type TagSurface = { fg: string; fill: string };

/**
 * tagBlockSize — хранит минимальную высоту тега для каждого размера ряда.
 * Расширяет `minBlockSize` из `@ui/presets` спредом, добавляя локальный ключ `tiny`.
 */
const tagBlockSize = Object.freeze({
  ...minBlockSize,
  tiny: 24,
} as const satisfies Record<TagSizePreset, SpacingValue>);

/**
 * TAG_SIZE_PRESET_KEYS — формирует перечень размеров тега из ключей `tagBlockSize`.
 * Используется в панелях настроек витрины design-system: `SizeListbox` принимает его пропом `sizes`.
 */
export const TAG_SIZE_PRESET_KEYS = Object.keys(tagBlockSize) as TagSizePreset[];

/**
 * tagPaddingInline — хранит горизонтальные отступы тега для каждого размера ряда.
 * Ключи канона берёт из `padding` в `@ui/presets`, `tiny` задаёт локально.
 */
const tagPaddingInline = Object.freeze({
  small: padding.small.inline,
  medium: padding.medium.inline,
  large: padding.large.inline,
  tiny: 8,
} as const satisfies Record<TagSizePreset, SpacingValue>);

/**
 * tagTextSize — хранит размер текста для каждого размера ряда тега.
 * Расширяет `textSize` из `@ui/presets` спредом, добавляя ключ `tiny`,
 * который использует `medium`, как и `small`.
 */
const tagTextSize = Object.freeze({
  ...textSize,
  tiny: 'medium',
} as const satisfies Record<TagSizePreset, TextSizePreset>);

/**
 * DEFAULT_TAG_SIZE_PRESET — задаёт размер по умолчанию для пропа `sizePreset` тега.
 * Тег компактнее контролов, поэтому дефолт мельче канонического.
 */
export const DEFAULT_TAG_SIZE_PRESET: TagSizePreset = 'tiny';

/**
 * DEFAULT_TAG_SHAPE — задаёт форму по умолчанию для пропа `shape` тега — таблетку.
 */
const DEFAULT_TAG_SHAPE: ShapePreset = 'round';

/**
 * TAG_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации тега.
 */
const TAG_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'borderTone',
  'shape',
  'sizePreset',
  'bordered',
  'tinted',
  'tone',
]);

/**
 * TAG_DOT_PROP_NAMES — хранит имена пропсов стилизации узла `StyledTagDot`.
 */
const TAG_DOT_PROP_NAMES = new Set<string>(['dotTone']);

/**
 * getTagBlockSize — возвращает значение для CSS-свойства `min-block-size`
 * по `sizePreset` тега.
 *
 * @param sizePreset — размер тега
 * @returns CSS-длина в rem
 */
function getTagBlockSize(sizePreset: TagSizePreset): string {
  return getSpacingValue(tagBlockSize[sizePreset]);
}

/**
 * getTagTextSize — возвращает размер текста по `sizePreset` тега.
 * Подставляет `DEFAULT_TAG_SIZE_PRESET`, когда размер не задан — как в `getTagStyles`.
 *
 * @param sizePreset — размер тега
 * @returns метка размера текста из `TextSizePreset` для внутреннего Text
 */
export function getTagTextSize(sizePreset?: TagSizePreset): TextSizePreset {
  return tagTextSize[sizePreset ?? DEFAULT_TAG_SIZE_PRESET];
}

/**
 * resolveTagTint — возвращает цвет с прозрачностью для мягкой заливки в режиме `tinted`.
 *
 * @param color — исходный CSS-цвет
 * @param pct — доля цвета в процентах, остальное прозрачно
 * @returns CSS-цвет через `color-mix`
 */
function resolveTagTint(color: string, pct: number): string {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

/**
 * resolveTagFill — вычисляет цвет текста и заливку тега по `tone` и `tinted`.
 * Без `tinted` нейтральный тон даёт прозрачный фон и цвет `default`,
 * цветной — заливку тона и цвет `inverse`.
 * С `tinted` фон — мягкий тинт из `muted` или цвета тона,
 * текст — `default` или цвет тона.
 *
 * @param theme — текущая тема
 * @param tone — тон заливки
 * @param tinted — режим мягкой заливки
 * @returns пара `TagSurface`: цвет текста и заливка
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
 * getTagBorderColor — возвращает цвет границы по `borderTone`.
 *
 * @param theme — текущая тема
 * @param borderTone — тон границы
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
 * getTagStyles — возвращает CSS-правила для корня `StyledTag`:
 * размер, отступы, границу, форму и цвета.
 *
 * @param props — пропсы стилизации тега и тема
 * @returns CSS-правила, каждое с новой строки
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
 * StyledTag — задаёт корневой узел компонента Tag.
 * Базируется на `<span>` и поддерживает все пропсы из `TagStyleProps`.
 *
 * Встроенные стили:
 *  - `display: inline-flex` — инлайн-ряд из точки и текста, grid с auto-треком
 *    тянул бы трек к max-content
 *  - `white-space: nowrap` — тег не переносит текст, длинное содержимое
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
 *  - `getTagDotColor` — цвет точки: по `dotTone`, иначе `currentColor`
 */
export const StyledTagDot = styled.span.withConfig({
  shouldForwardProp: (prop) => !TAG_DOT_PROP_NAMES.has(prop),
})<{ dotTone?: TonePreset }>`
  flex-shrink: 0;
  inline-size: 0.5em;
  block-size: 0.5em;
  background-color: ${(props) => getTagDotColor(getTheme(props), props.dotTone)};
  border-radius: 50%;
`;

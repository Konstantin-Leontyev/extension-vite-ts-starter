/**
 * Файл: presets.ts
 * Система размерных пресетов для контролов и примитивов на оси SizePreset.
 * Определяет единый ряд (small, medium, large): min-block-size, padding, текст, радиус.
 *
 * Основные задачи:
 * 1. Определить типы SizePreset и ShapePreset
 * 2. Канонические оси: minBlockSize, padding (inline + block), textSize
 * 3. get* — lookup по sizePreset; resolveBlockRadius — правило радиуса
 *
 * Модель высоты: minBlockSize — пол (min-block-size бокса); padding.block — вертикаль
 * внутри бокса; при одной строке пол и padding согласованы, при нескольких padding
 * сохраняет отступ сверху/снизу, пока контент растёт выше пола.
 *
 * Потребители: `@ui/button`, `@ui/input`, `@ui/tag`, `@ui/listbox`, `@ui/combobox`,
 * `@ui/toast`, `@ui/fieldset`, остальные kit-контролы через `getMinBlockSize` / `getPadding`.
 */

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';

/**
 * ShapePreset — форма строки-поля.
 * - `default` — прямоугольная, радиус — spacing 8 (0.5rem)
 * - `round` — таблетка: calc(min-block-size / 2)
 */
export type ShapePreset = 'default' | 'round';

/**
 * SizePreset — единый размерный ряд контролов проекта.
 * Все размеры контролов строятся на основе трёх предустановок.
 */
export type SizePreset = 'small' | 'medium' | 'large';

/**
 * DEFAULT_SIZE_PRESET — размер по умолчанию для контролов.
 * В проекте используется `large` как основной размер.
 */
export const DEFAULT_SIZE_PRESET: SizePreset = 'large';

/**
 * DEFAULT_SHAPE_PRESET — форма по умолчанию для контролов.
 * `default` — прямоугольная форма.
 */
export const DEFAULT_SHAPE_PRESET: ShapePreset = 'default';

/**
 * minBlockSize — минимальная высота бокса (min-block-size) для sizePreset.
 * Согласован с line-height текста и padding.block при одной строке.
 */
export const minBlockSize = {
  small: 32,
  medium: 40,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * padding — отступы контрола по sizePreset (spacing-токены в px).
 * inline — padding-inline; block — padding-block.
 */
export const padding = {
  small: { inline: 12, block: 8 },
  medium: { inline: 16, block: 10 },
  large: { inline: 16, block: 14 },
} as const satisfies Record<SizePreset, { inline: SpacingValue; block: SpacingValue }>;

/**
 * textSize — TextSizePreset для каждого sizePreset контрола.
 */
export const textSize = {
  small: 'medium',
  medium: 'normal',
  large: 'normal',
} as const satisfies Record<SizePreset, TextSizePreset>;

/**
 * getMinBlockSize — CSS min-block-size для sizePreset.
 *
 * @param sizePreset — размер контрола
 * @returns CSS-длина в rem
 */
export function getMinBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(minBlockSize[sizePreset]);
}

/**
 * ControlPadding — отступы контрола в CSS-строках.
 */
export type ControlPadding = {
  block: string;
  inline: string;
};

/**
 * getPadding — padding-inline и padding-block для sizePreset в rem.
 *
 * @param sizePreset — размер контрола
 * @returns объект с CSS-строками inline и block
 */
export function getPadding(sizePreset: SizePreset): ControlPadding {
  const preset = padding[sizePreset];

  return {
    inline: getSpacingValue(preset.inline),
    block: getSpacingValue(preset.block),
  };
}

/**
 * getPaddingInline — padding-inline для sizePreset (rem).
 *
 * @param sizePreset — размер контрола
 * @returns CSS-строка padding-inline
 */
export function getPaddingInline(sizePreset: SizePreset): string {
  return getPadding(sizePreset).inline;
}

/**
 * getPaddingBlock — padding-block для sizePreset (rem).
 *
 * @param sizePreset — размер контрола
 * @returns CSS-строка padding-block
 */
export function getPaddingBlock(sizePreset: SizePreset): string {
  return getPadding(sizePreset).block;
}

/**
 * getTextSize — TextSizePreset для sizePreset контрола.
 *
 * @param sizePreset — размер контрола
 * @returns TextSizePreset ('normal' | 'medium' | ...)
 */
export function getTextSize(sizePreset: SizePreset): TextSizePreset {
  return textSize[sizePreset];
}

/**
 * resolveBlockRadius — радиус скругления по shape и min-block-size.
 * - `round` — calc(minBlockSize / 2)
 * - `default` — `getSpacingValue(8)` (0.5rem)
 *
 * @param shape — форма контрола
 * @param minBlockSize — CSS min-block-size (из `getMinBlockSize`)
 * @returns CSS border-radius
 *
 * @example
 * resolveBlockRadius('round', '2rem') → 'calc(2rem / 2)'
 * resolveBlockRadius('default', '2rem') → '0.5rem'
 */
export function resolveBlockRadius(shape: ShapePreset, minBlockSize: string): string {
  return shape === 'round' ? `calc(${minBlockSize} / 2)` : getSpacingValue(8);
}

/**
 * Файл: presets.ts
 * Этот файл содержит систему пресетов (размерных предустановок) для контролов.
 * Определяет единый размерный ряд (small, medium, large) и связанные с ним
 * значения: высоту, отступы, размер текста, радиус.
 *
 * Основные задачи:
 * 1. Определить типы SizePreset и ShapePreset
 * 2. Предоставить канонические оси (blockSize, paddingInline, textSize)
 * 3. Предоставить get* — lookup по sizePreset; resolveBlockRadius — правило радиуса
 */

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';

/**
 * ShapePreset — форма строки-поля.
 * - 'default' — прямоугольная; радиус — spacing 8 (0.5rem)
 * - 'round' — таблетка: calc(block-size / 2)
 */
export type ShapePreset = 'default' | 'round';

/**
 * SizePreset — единый размерный ряд контролов проекта.
 * Все размеры контролов строятся на основе трёх предустановок.
 */
export type SizePreset = 'small' | 'medium' | 'large';

/**
 * DEFAULT_SIZE_PRESET — размер по умолчанию для контролов.
 * В проекте используется 'large' как основной размер.
 */
export const DEFAULT_SIZE_PRESET: SizePreset = 'large';

/**
 * DEFAULT_SHAPE_PRESET — форма по умолчанию для контролов.
 * 'default' — прямоугольная форма.
 */
export const DEFAULT_SHAPE_PRESET: ShapePreset = 'default';

/**
 * blockSize — высота строки контрола (block-size) для каждого размера.
 * Используется как основа для расчёта радиуса в форме 'round'.
 *
 * Канонические оси: каждый примитив композирует только нужные ему оси
 * (высоту, отступ, текст), а не весь объект целиком.
 */
export const blockSize = {
  small: 32,
  medium: 40,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * paddingInline — горизонтальные отступы (padding-inline) для контрола.
 * Ключи — spacing-токены (px): small 12, medium 16, large 16.
 */
export const paddingInline = {
  small: 12,
  medium: 16,
  large: 16,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * textSize — размер текста (TextSizePreset) для каждого размера контрола.
 * Связывает размер контрола с типографическим пресетом.
 */
export const textSize = {
  small: 'medium',
  medium: 'normal',
  large: 'normal',
} as const satisfies Record<SizePreset, TextSizePreset>;

/**
 * getBlockSize — высота строки контрола (block-size) для sizePreset.
 *
 * @param sizePreset — размер контрола
 * @returns CSS-длина в rem (например, '2rem' для small)
 */
export function getBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(blockSize[sizePreset]);
}

/**
 * getPaddingInline — горизонтальный отступ (padding-inline) для sizePreset.
 *
 * @param sizePreset — размер контрола
 * @returns CSS-длина в rem (например, '1rem' для medium/large)
 */
export function getPaddingInline(sizePreset: SizePreset): string {
  return getSpacingValue(paddingInline[sizePreset]);
}

/**
 * getTextSize — TextSizePreset для sizePreset (lookup в карте textSize).
 *
 * @param sizePreset — размер контрола
 * @returns 'medium' для small, 'normal' для medium/large
 */
export function getTextSize(sizePreset: SizePreset): TextSizePreset {
  return textSize[sizePreset];
}

/**
 * resolveBlockRadius — радиус скругления строки-поля по форме и высоте.
 * - 'round' — calc(blockSize / 2)
 * - 'default' — getSpacingValue(8)
 *
 * @param shape — форма контрола
 * @param blockSize — CSS-строка block-size (из getBlockSize), не карта blockSize
 * @returns CSS-значение border-radius
 */
export function resolveBlockRadius(shape: ShapePreset, blockSize: string): string {
  return shape === 'round' ? `calc(${blockSize} / 2)` : getSpacingValue(8);
}

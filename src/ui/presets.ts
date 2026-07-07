/**
 * Файл: presets.ts
 * Этот файл содержит систему пресетов (размерных предустановок) для контролов.
 * Определяет единый размерный ряд (small, medium, large) и связанные с ним
 * значения: высоту, размер иконки, отступы, размер текста.
 *
 * Основные задачи:
 * 1. Определить типы SizePreset и ShapePreset
 * 2. Предоставить канонические значения для каждого размера
 * 3. Предоставить утилиты для получения конкретных значений пресета
 * 4. Предоставить функцию для генерации полного текстового стиля для input
 */

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { textSizePresets, type TextSizePreset } from '@ui/text';

/**
 * ShapePreset — форма строки-поля.
 * - 'default' — прямоугольная со скруглением 8px
 * - 'round' — "таблетка" (половина высоты контрола)
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
 * controlBlockSize — высота контрола (block-size) для каждого размера.
 * Используется как основа для расчёта радиуса в форме 'round'.
 *
 * Канонические оси: каждый примитив композирует только нужные ему оси
 * (высоту, иконку, отступ, текст), а не весь объект целиком.
 */
export const controlBlockSize = {
  small: 32,
  medium: 40,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * controlIconSize — габарит окна под глиф внутри контрола.
 * Контрол задаёт inline/block-size этого окна; svg без width/height заполняет родителя.
 */
export const controlIconSize = {
  small: 16,
  medium: 20,
  large: 24,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * controlPaddingInline — горизонтальные отступы (padding-inline) для контрола.
 * Для small и medium: 12px и 16px соответственно.
 * Для large: 16px (такой же, как у medium).
 */
export const controlPaddingInline = {
  small: 12,
  medium: 16,
  large: 16,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * controlTextSizePreset — размер текста (TextSizePreset) для каждого размера контрола.
 * Связывает размер контрола с типографическим пресетом.
 */
export const controlTextSizePreset = {
  small: 'medium',
  medium: 'normal',
  large: 'normal',
} as const satisfies Record<SizePreset, TextSizePreset>;

/**
 * blockSizeRem — возвращает высоту контрола в rem для указанного размера.
 *
 * @param sizePreset — размер контрола ('small' | 'medium' | 'large')
 * @returns строка с высотой в rem (например, '2rem')
 */
export function blockSizeRem(sizePreset: SizePreset): string {
  return getSpacingValue(controlBlockSize[sizePreset]);
}

/**
 * radiusPreset — возвращает радиус скругления для строки-поля.
 * - Для 'round' — половина высоты контрола (calc(высота / 2))
 * - Для 'default' — фиксированное значение 8px (spacing 8)
 *
 * @param shape — форма ('default' | 'round')
 * @param sizePreset — размер контрола
 * @returns строка с CSS-значением радиуса
 */
export function radiusPreset(shape: ShapePreset, sizePreset: SizePreset): string {
  return shape === 'round'
    ? `calc(${blockSizeRem(sizePreset)} / 2)`
    : getSpacingValue(8);
}

/**
 * textSizePreset — возвращает размер текста (TextSizePreset) для указанного размера контрола.
 *
 * @param sizePreset — размер контрола (по умолчанию DEFAULT_SIZE_PRESET)
 * @returns TextSizePreset ('normal' | 'medium' | ...)
 */
export function textSizePreset(
  sizePreset: SizePreset = DEFAULT_SIZE_PRESET
): TextSizePreset {
  return controlTextSizePreset[sizePreset];
}

/**
 * controlValueTextStyles — генерирует полный текстовый стиль (font-size, font-weight, line-height)
 * для нативного input, где текст нельзя вынести в примитив Text.
 *
 * Единый источник типографики значения: контрол на голом input
 * использует этот стиль целиком, а не собирает его из частей.
 *
 * @param sizePreset — размер контрола (по умолчанию DEFAULT_SIZE_PRESET)
 * @returns строка с CSS-стилями для текста (каждый на новой строке)
 *
 * @example
 * const StyledInput = styled.input`
 *   ${controlValueTextStyles('large')}
 *   // другие стили
 * `;
 */
export function controlValueTextStyles(
  sizePreset: SizePreset = DEFAULT_SIZE_PRESET
): string {
  const preset = textSizePresets[controlTextSizePreset[sizePreset]];

  return [
    `font-size: ${preset.fontSize};`,
    `font-weight: ${preset.fontWeight};`,
    `line-height: ${preset.lineHeight};`,
  ].join('\n');
}

/**
 * valuePaddingInline — возвращает горизонтальный отступ (padding-inline)
 * для значения/опции в контроле.
 *
 * @param sizePreset — размер контрола (по умолчанию DEFAULT_SIZE_PRESET)
 * @returns значение отступа в пикселях (SpacingValue)
 */
export function valuePaddingInline(
  sizePreset: SizePreset = DEFAULT_SIZE_PRESET
): SpacingValue {
  return controlPaddingInline[sizePreset];
}

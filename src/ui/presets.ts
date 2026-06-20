import { spacingRem, type SpacingPx } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';

/** Форма строки-поля: прямоугольная со скруглением (`default`) или «таблетка» (`round`). */
export type ShapePreset = 'default' | 'round';

/** Единый размерный ряд контролов проекта. */
export type SizePreset = 'small' | 'medium' | 'large';

export const DEFAULT_SIZE_PRESET: SizePreset = 'large';
export const DEFAULT_SHAPE_PRESET: ShapePreset = 'default';

/**
 * Канонические оси контрола — источник истины размерного ряда. Каждый примитив
 * композирует только нужные ему оси (высоту, иконку, отступ, текст), а не весь объект.
 */
export const controlBlockSize = {
  small: 32,
  medium: 40,
  large: 48,
} as const satisfies Record<SizePreset, SpacingPx>;

/** Габарит глифа/иконки (svg заполняет родителя). */
export const controlIconSize = {
  small: 16,
  medium: 20,
  large: 20,
} as const satisfies Record<SizePreset, SpacingPx>;

export const controlPaddingInline = {
  small: 12,
  medium: 16,
  large: 16,
} as const satisfies Record<SizePreset, SpacingPx>;

export const controlTextSizePreset = {
  small: 'medium',
  medium: 'normal',
  large: 'normal',
} as const satisfies Record<SizePreset, TextSizePreset>;

/** Высота строки пресета в rem. */
export function blockSizeRem(sizePreset: SizePreset): string {
  return spacingRem(controlBlockSize[sizePreset]);
}

/** Радиус строки-поля по оси shape: round = половина высоты строки, default = spacing 8. */
export function radiusPreset(shape: ShapePreset, sizePreset: SizePreset): string {
  return shape === 'round' ? `calc(${blockSizeRem(sizePreset)} / 2)` : spacingRem(8);
}

/** Размер текста значения/опции для оси sizePreset. */
export function textSizePreset(
  sizePreset: SizePreset = DEFAULT_SIZE_PRESET
): TextSizePreset {
  return controlTextSizePreset[sizePreset];
}

/** Горизонтальный отступ значения/опции для оси sizePreset. */
export function valuePaddingInline(
  sizePreset: SizePreset = DEFAULT_SIZE_PRESET
): SpacingPx {
  return controlPaddingInline[sizePreset];
}

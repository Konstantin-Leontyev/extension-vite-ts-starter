/**
 * Файл: `src/ui/presets.ts`
 * Система размерных пресетов для контролов и примитивов на оси `SizePreset`.
 * Определяет единый ряд (`small`, `medium`, `large`): `minBlockSize`, `padding`, `textSize`, `shape`.
 *
 * Основные задачи:
 * 1. Определить типы `SizePreset` и `ShapePreset`
 * 2. Канонические оси: `minBlockSize`, `padding` (inline + block), `textSize`
 * 3. get* — получение значения по `sizePreset`, `resolveBlockRadius` — вычисление радиуса по формуле.
 *
 * Модель высоты:
 *  - `minBlockSize` — минимальная высота бокса
 *  - `padding.block` — вертикальные отступы внутри бокса
 *
 * При одной строке текст помещается в `minBlockSize`, отступы остаются в пределах заданной высоты.
 * При переносе строки контент растёт выше `minBlockSize`, а `padding.block` удерживает текст от прилипания к краям.
 *
 * Потребители: `@ui/button`, `@ui/input`, `@ui/tag`, `@ui/listbox`, `@ui/combobox`,
 * `@ui/toast`, `@ui/fieldset`, остальные kit-контролы через `getMinBlockSize` / `getPadding`.
 */

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';

/**
 * ShapePreset — тип, представляющий форму строки-поля.
 *  - `default` — прямоугольная, радиус — `getSpacingValue(8)` (`0.5rem`)
 *  - `round` — таблетка: `calc(min-block-size / 2)`
 */
export type ShapePreset = 'default' | 'round';

/**
 * SizePreset — тип, представляющий единый размерный ряд проекта.
 * Все размеры строятся на основе трёх предустановок: `small`, `medium`, `large`.
 */
export type SizePreset = 'small' | 'medium' | 'large';

/**
 * ControlPadding — тип, представляющий отступы контрола: значения для CSS-свойств
 * `padding-inline` (ключ `inline`) и `padding-block` (ключ `block`).
 */
export type ControlPadding = {
  block: string;
  inline: string;
};

/**
 * DEFAULT_SIZE_PRESET — значение по умолчанию для оси `sizePreset`.
 * `large` — используется в проекте как основной размер.
 */
export const DEFAULT_SIZE_PRESET: SizePreset = 'large';

/**
 * DEFAULT_SHAPE_PRESET — значение по умолчанию для оси `shape`.
 */
export const DEFAULT_SHAPE_PRESET: ShapePreset = 'default';

/**
 * minBlockSize — значение для оси `minBlockSize` по `sizePreset`.
 * При смене размера высота строки текста и отступы масштабируются синхронно.
 */
export const minBlockSize = {
  small: 32,
  medium: 40,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * padding — значения для оси `padding` по `sizePreset`:
 *  - Ключ `inline` → CSS-свойство `padding-inline`
 *  - Ключ `block` → CSS-свойство `padding-block`
 */
export const padding = {
  small: { inline: 12, block: 8 },
  medium: { inline: 16, block: 10 },
  large: { inline: 16, block: 14 },
} as const satisfies Record<SizePreset, { inline: SpacingValue; block: SpacingValue }>;

/**
 * textSize — значения для оси `textSize` по `sizePreset`.
 */
export const textSize = {
  small: 'medium',
  medium: 'normal',
  large: 'normal',
} as const satisfies Record<SizePreset, TextSizePreset>;

/**
 * getMinBlockSize — возвращает значение для CSS-свойства `min-block-size` по `sizePreset`.
 *
 * @param sizePreset — размер контрола
 * @returns CSS-длина в rem
 */
export function getMinBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(minBlockSize[sizePreset]);
}

/**
 * getPadding — возвращает значения для CSS-свойств `padding-inline` и `padding-block` для `sizePreset`.
 *
 * @param sizePreset — размер контрола
 * @returns значения для CSS-свойств `padding-inline` и `padding-block`
 */
export function getPadding(sizePreset: SizePreset): ControlPadding {
  const preset = padding[sizePreset];

  return {
    inline: getSpacingValue(preset.inline),
    block: getSpacingValue(preset.block),
  };
}

/**
 * getPaddingInline — возвращает значение для CSS-свойства `padding-inline` для `sizePreset`.
 *
 * @param sizePreset — размер контрола
 * @returns значение для CSS-свойства `padding-inline`
 */
export function getPaddingInline(sizePreset: SizePreset): string {
  return getPadding(sizePreset).inline;
}

/**
 * getPaddingBlock — возвращает значение для CSS-свойства `padding-block` для `sizePreset`.
 *
 * @param sizePreset — размер контрола
 * @returns значение для CSS-свойства `padding-block`
 */
export function getPaddingBlock(sizePreset: SizePreset): string {
  return getPadding(sizePreset).block;
}

/**
 * getTextSize — возвращает значение для оси `textSize` по `sizePreset`.
 *
 * @param sizePreset — размер контрола
 * @returns `TextSizePreset` (`normal` | `medium` | ...)
 */
export function getTextSize(sizePreset: SizePreset): TextSizePreset {
  return textSize[sizePreset];
}

/**
 * resolveBlockRadius — возвращает значение для CSS-свойства `border-radius` по `shape` и `minBlockSize`.
 *  - `round` — `calc(minBlockSize / 2)`
 *  - `default` — `getSpacingValue(8)` (`0.5rem`)
 *
 * @param shape — форма контрола
 * @param minBlockSize — значение CSS-свойства `min-block-size` (из `getMinBlockSize`)
 * @returns значение для CSS-свойства `border-radius`
 *
 * @example
 * resolveBlockRadius('round', '2rem') → 'calc(2rem / 2)'
 * resolveBlockRadius('default', '2rem') → '0.5rem'
 */
export function resolveBlockRadius(shape: ShapePreset, minBlockSize: string): string {
  return shape === 'round' ? `calc(${minBlockSize} / 2)` : getSpacingValue(8);
}

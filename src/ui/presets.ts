/**
 * Файл: `src/ui/presets.ts`
 * Определяет размерные пресеты компонентов: единый ряд `small`, `medium`, `large`,
 * который компонент выбирает через проп `sizePreset`.
 * Преобразует выбранный размер в согласованные значения высоты, отступов
 * и размера текста. Задаёт формы строки-поля для пропа `shape`.
 *
 * Основные задачи:
 * 1. Типизировать пресеты через `SizePreset`, `ShapePreset` и `ControlPadding`
 * 2. Хранить канонические значения в `minBlockSize`, `padding` и `textSize`
 * 3. Задать значения по умолчанию через `DEFAULT_SIZE_PRESET` и `DEFAULT_SHAPE_PRESET`
 * 4. Предоставить геттеры `getMinBlockSize`, `getPadding`, `getPaddingInline`, `getPaddingBlock` и `getTextSize`
 * 5. Предоставить `resolveBlockRadius` для вычисления радиуса по форме
 *
 * Модель высоты:
 *  - `minBlockSize` — минимальная высота бокса
 *  - `padding.block` — вертикальные отступы внутри бокса
 *
 * При одной строке текст помещается в `minBlockSize`, отступы остаются в пределах заданной высоты.
 * При переносе строки контент растёт выше `minBlockSize`, а `padding.block` удерживает текст от прилипания к краям.
 *
 * Потребители:
 *  - `@ui/button`, `@ui/input`, `@ui/tag`, `@ui/listbox`, `@ui/combobox`, `@ui/toast`, `@ui/fieldset` —
 *    задают размер через `sizePreset`
 *  - все `*.styles.ts` компонентов с пропом `sizePreset` — читают значения через геттеры
 *  - панели настроек витрины дизайн-системы — передают `SIZE_PRESET_KEYS` в `SizeListbox`
 *    и `SHAPE_PRESET_KEYS` в `ShapeListbox`
 */

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';

/**
 * ShapePreset — представляет форму строки-поля компонента.
 *
 * Доступные значения:
 *  - `default` — прямоугольник со скруглёнными углами
 *  - `round` — таблетка с полностью скруглёнными торцами
 *
 * Радиус для каждой формы вычисляет `resolveBlockRadius`.
 */
export type ShapePreset = 'default' | 'round';

/**
 * SizePreset — представляет единый размерный ряд проекта.
 * Используется как основной тип пропа `sizePreset` в компонентах.
 */
export type SizePreset = 'small' | 'medium' | 'large';

/**
 * ControlPadding — представляет готовые внутренние отступы компонента.
 * Значения — CSS-длины в rem, которые возвращает `getPadding`.
 *
 * @property inline — значение для CSS-свойства `padding-inline`
 * @property block — значение для CSS-свойства `padding-block`
 */
export type ControlPadding = {
  block: string;
  inline: string;
};

/**
 * DEFAULT_SIZE_PRESET — задаёт размер по умолчанию для пропа `sizePreset`.
 * Используется в компонентах, где размер не задан явно.
 */
export const DEFAULT_SIZE_PRESET: SizePreset = 'large';

/**
 * DEFAULT_SHAPE_PRESET — задаёт форму по умолчанию для пропа `shape`.
 * Используется в компонентах с поддержкой формы строки-поля.
 */
export const DEFAULT_SHAPE_PRESET: ShapePreset = 'default';

/**
 * SHAPE_PRESET_KEYS — задаёт перечень канонических форм строки-поля.
 * Используется в панелях настроек витрины дизайн-системы: `ShapeListbox` принимает его пропом `shapes`.
 */
export const SHAPE_PRESET_KEYS = Object.freeze([
  'default',
  'round',
] as const satisfies readonly ShapePreset[]);

/**
 * minBlockSize — хранит минимальную высоту бокса для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * При смене размера высота строки текста и отступы масштабируются синхронно.
 */
export const minBlockSize = Object.freeze({
  small: 32,
  medium: 40,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>);

/**
 * SIZE_PRESET_KEYS — формирует перечень канонических размеров из ключей `minBlockSize`.
 * Используется в панелях настроек витрины дизайн-системы: `SizeListbox` принимает его пропом `sizes`.
 */
export const SIZE_PRESET_KEYS = Object.freeze(Object.keys(minBlockSize) as SizePreset[]);

/**
 * padding — хранит внутренние отступы для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `inline` → значение для CSS-свойства `padding-inline`
 *  - `block` → значение для CSS-свойства `padding-block`
 */
export const padding = Object.freeze({
  small: Object.freeze({ inline: 12, block: 8 } as const),
  medium: Object.freeze({ inline: 16, block: 10 } as const),
  large: Object.freeze({ inline: 16, block: 14 } as const),
} as const satisfies Record<SizePreset, { inline: SpacingValue; block: SpacingValue }>);

/**
 * textSize — хранит размер текста для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — метка из `TextSizePreset` компонента Text.
 */
export const textSize = Object.freeze({
  small: 'medium',
  medium: 'normal',
  large: 'normal',
} as const satisfies Record<SizePreset, TextSizePreset>);

/**
 * getMinBlockSize — возвращает значение для CSS-свойства `min-block-size` по `sizePreset`.
 *
 * @param sizePreset — размер компонента
 * @returns CSS-длина в rem
 */
export function getMinBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(minBlockSize[sizePreset]);
}

/**
 * getPadding — возвращает значения для CSS-свойств `padding-inline` и `padding-block` по `sizePreset`.
 *
 * @param sizePreset — размер компонента
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
 * getPaddingInline — возвращает значение для CSS-свойства `padding-inline` по `sizePreset`.
 *
 * @param sizePreset — размер компонента
 * @returns значение для CSS-свойства `padding-inline`
 */
export function getPaddingInline(sizePreset: SizePreset): string {
  return getPadding(sizePreset).inline;
}

/**
 * getPaddingBlock — возвращает значение для CSS-свойства `padding-block` по `sizePreset`.
 *
 * @param sizePreset — размер компонента
 * @returns значение для CSS-свойства `padding-block`
 */
export function getPaddingBlock(sizePreset: SizePreset): string {
  return getPadding(sizePreset).block;
}

/**
 * getTextSize — возвращает размер текста по `sizePreset`.
 *
 * @param sizePreset — размер компонента
 * @returns метка размера текста из `TextSizePreset`
 */
export function getTextSize(sizePreset: SizePreset): TextSizePreset {
  return textSize[sizePreset];
}

/**
 * resolveBlockRadius — вычисляет значение для CSS-свойства `border-radius` по форме и высоте.
 *
 * Логика по форме:
 *  - `round` — `calc(minBlockSize / 2)`
 *  - `default` — `getSpacingValue(8)`, то есть `0.5rem`
 *
 * @param shape — форма компонента
 * @param minBlockSize — минимальная высота блока
 * @returns значение для CSS-свойства `border-radius`
 *
 * @example
 * resolveBlockRadius('round', '2rem') → 'calc(2rem / 2)'
 * resolveBlockRadius('default', '2rem') → '0.5rem'
 */
export function resolveBlockRadius(shape: ShapePreset, minBlockSize: string): string {
  return shape === 'round' ? `calc(${minBlockSize} / 2)` : getSpacingValue(8);
}

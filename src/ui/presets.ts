/**
 * Файл: `src/ui/presets.ts`
 * Определяет размерные пресеты компонентов: единый ряд `small`, `normal`, `large`,
 * который компонент выбирает через проп `sizePreset`.
 * Преобразует выбранный размер в согласованные значения высоты, отступов
 * и размера текста. Задаёт формы строки-поля для пропа `shape`.
 *
 * Основные задачи:
 * 1. Типизировать пресеты через `SizePreset` и `ShapePreset`
 * 2. Хранить канонические значения в `minBlockSize`, `padding` и `textSize`
 * 3. Задать значения по умолчанию через `DEFAULT_SIZE_PRESET` и `DEFAULT_SHAPE_PRESET`
 * 4. Предоставить перечни `SIZE_PRESET_KEYS` и `SHAPE_PRESET_KEYS`
 * 5. Предоставить геттеры `getMinBlockSize`, `getPadding`, `getPaddingInline`, `getPaddingBlock` и `getTextSize`
 * 6. Предоставить `resolveBlockRadius` для вычисления радиуса по форме
 *
 * Потребители:
 *  - контролы, например Button, Input и Tag — задают размер через `sizePreset`
 *  - все `*.styles.ts` компонентов с пропом `sizePreset` — читают значения через геттеры
 *  - панели настроек витрины дизайн-системы — передают `SIZE_PRESET_KEYS` в `SizeListbox`
 *    и `SHAPE_PRESET_KEYS` в `ShapeListbox`
 */

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';

/**
 * SizePreset — представляет единый размерный ряд проекта.
 * Используется как основной тип пропа `sizePreset` в компонентах.
 */
export type SizePreset = 'large' | 'normal' | 'small';

/**
 * minBlockSize — хранит минимальную высоту бокса для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * При смене размера высота строки текста и отступы масштабируются синхронно.
 */
export const minBlockSize = Object.freeze({
  small: 32,
  normal: 40,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>);

/**
 * SIZE_PRESET_KEYS — формирует перечень канонических размеров из ключей `minBlockSize`.
 * Используется в панелях настроек витрины дизайн-системы: `SizeListbox` принимает его пропом `sizes`.
 */
export const SIZE_PRESET_KEYS = Object.freeze(Object.keys(minBlockSize) as SizePreset[]);

/**
 * DEFAULT_SIZE_PRESET — задаёт размер по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
export const DEFAULT_SIZE_PRESET: SizePreset = 'normal';

/**
 * getMinBlockSize — возвращает значение для CSS-свойства `min-block-size` по `sizePreset`.
 *
 * @param sizePreset размер компонента
 * @returns CSS-длина в rem
 */
export function getMinBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(minBlockSize[sizePreset]);
}

/**
 * padding — хранит внутренние отступы для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `inline` → значение для CSS-свойства `padding-inline`
 *  - `block` → значение для CSS-свойства `padding-block`
 * Вместе с `minBlockSize` задаёт модель высоты бокса: при одной строке текст
 * помещается в `minBlockSize`, а отступы остаются в пределах заданной высоты.
 * При переносе строки контент растёт выше `minBlockSize`, и `padding.block`
 * удерживает текст от прилипания к краям.
 */
export const padding = Object.freeze({
  small: Object.freeze({ inline: 12, block: 8 } as const),
  normal: Object.freeze({ inline: 16, block: 10 } as const),
  large: Object.freeze({ inline: 20, block: 12 } as const),
} as const satisfies Record<SizePreset, { block: SpacingValue; inline: SpacingValue }>);

/**
 * ControlPadding — представляет готовые внутренние отступы компонента.
 * Значения — CSS-длины в rem, которые возвращает `getPadding`.
 *
 * @property block — значение для CSS-свойства `padding-block`
 * @property inline — значение для CSS-свойства `padding-inline`
 */
type ControlPadding = {
  block: string;
  inline: string;
};

/**
 * getPadding — возвращает значения для CSS-свойств `padding-inline` и `padding-block` по `sizePreset`.
 *
 * @param sizePreset размер компонента
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
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `padding-inline`
 */
export function getPaddingInline(sizePreset: SizePreset): string {
  return getPadding(sizePreset).inline;
}

/**
 * getPaddingBlock — возвращает значение для CSS-свойства `padding-block` по `sizePreset`.
 *
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `padding-block`
 */
export function getPaddingBlock(sizePreset: SizePreset): string {
  return getPadding(sizePreset).block;
}

/**
 * ShapePreset — представляет форму строки-поля компонента.
 * Радиус для каждой формы вычисляет `resolveBlockRadius`.
 *
 * Доступные значения:
 *  - `rounded` — прямоугольник со скруглёнными углами
 *  - `pill` — таблетка с полностью скруглёнными торцами
 */
export type ShapePreset = 'pill' | 'rounded';

/**
 * SHAPE_PRESET_KEYS — задаёт перечень канонических форм строки-поля.
 * Используется в панелях настроек витрины дизайн-системы: `ShapeListbox` принимает его пропом `shapes`.
 */
export const SHAPE_PRESET_KEYS = Object.freeze([
  'rounded',
  'pill',
] as const satisfies readonly ShapePreset[]);

/**
 * DEFAULT_SHAPE_PRESET — задаёт форму по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
export const DEFAULT_SHAPE_PRESET: ShapePreset = 'rounded';

/**
 * resolveBlockRadius — вычисляет значение для CSS-свойства `border-radius` по форме и высоте.
 *
 * Логика по форме:
 *  - `pill` — `calc(minBlockSize / 2)`
 *  - `rounded` — `getSpacingValue(8)`, то есть `0.5rem`
 *
 * @param shape форма компонента
 * @param minBlockSize минимальная высота блока
 * @returns значение для CSS-свойства `border-radius`
 *
 * @example
 * resolveBlockRadius('pill', '2rem') → 'calc(2rem / 2)'
 * resolveBlockRadius('rounded', '2rem') → '0.5rem'
 */
export function resolveBlockRadius(shape: ShapePreset, minBlockSize: string): string {
  return shape === 'pill' ? `calc(${minBlockSize} / 2)` : getSpacingValue(8);
}

/**
 * textSize — хранит размер текста для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — метка из `TextSizePreset` компонента Text.
 * Лестница: small → thin, normal → normal, large → medium. Пары размер и высота
 * строки — 12/16, 16/20 и 20/24.
 * Высота контрола: line-height + 2 × padding.block = minBlockSize.
 */
export const textSize = Object.freeze({
  small: 'thin',
  normal: 'normal',
  large: 'medium',
} as const satisfies Record<SizePreset, TextSizePreset>);

/**
 * getTextSize — возвращает размер текста по `sizePreset`.
 *
 * @param sizePreset размер компонента
 * @returns метка размера текста из `TextSizePreset`
 */
export function getTextSize(sizePreset: SizePreset): TextSizePreset {
  return textSize[sizePreset];
}

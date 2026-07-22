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
 * 4. Предоставить перечни `SIZE_PRESET_KEYS` и `SHAPE_PRESET_KEYS`
 * 5. Предоставить геттеры `getMinBlockSize`, `getPadding`, `getPaddingInline`, `getPaddingBlock` и `getTextSize`
 * 6. Предоставить `resolveBlockRadius` для вычисления радиуса по форме
 * 7. Предоставить `getControlBoxStyles` для сборки полного бокса однострочного контрола
 * 8. Предоставить `DEFAULT_SHOW_BORDER` и `getControlBorder` для рамки контрола
 *    вне layout-box
 *
 * Потребители:
 *  - контролы, например Button, Input и Tag — задают размер через `sizePreset`
 *  - все `*.styles.ts` компонентов с пропом `sizePreset` — читают значения через геттеры
 *  - панели настроек витрины дизайн-системы — передают `SIZE_PRESET_KEYS` в `SizeListbox`
 *    и `SHAPE_PRESET_KEYS` в `ShapeListbox`
 */

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTextProperties, type TextSizePreset } from '@ui/text';
import { type AppTheme } from '@ui/theme';

/**
 * SizePreset — представляет единый размерный ряд проекта.
 * Используется как основной тип пропа `sizePreset` в компонентах.
 */
export type SizePreset = 'large' | 'medium' | 'small';

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
 * DEFAULT_SIZE_PRESET — задаёт размер по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
export const DEFAULT_SIZE_PRESET: SizePreset = 'large';

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
 * Вместе с `minBlockSize` задаёт модель высоты бокса: при одной строке текст
 * помещается в `minBlockSize`, а отступы остаются в пределах заданной высоты.
 * При переносе строки контент растёт выше `minBlockSize`, и `padding.block`
 * удерживает текст от прилипания к краям.
 * Ключ — размер из `SizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `inline` → значение для CSS-свойства `padding-inline`
 *  - `block` → значение для CSS-свойства `padding-block`
 */
export const padding = Object.freeze({
  small: Object.freeze({ inline: 12, block: 8 } as const),
  medium: Object.freeze({ inline: 16, block: 10 } as const),
  large: Object.freeze({ inline: 16, block: 14 } as const),
} as const satisfies Record<SizePreset, { block: SpacingValue; inline: SpacingValue }>);

/**
 * ControlPadding — представляет готовые внутренние отступы компонента.
 * Значения — CSS-длины в rem, которые возвращает `getPadding`.
 *
 * @property block — значение для CSS-свойства `padding-block`
 * @property inline — значение для CSS-свойства `padding-inline`
 */
export type ControlPadding = {
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
 *
 * Доступные значения:
 *  - `rounded` — прямоугольник со скруглёнными углами
 *  - `pill` — таблетка с полностью скруглёнными торцами
 *
 * Радиус для каждой формы вычисляет `resolveBlockRadius`.
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
 */
export const textSize = Object.freeze({
  small: 'medium',
  medium: 'normal',
  large: 'normal',
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

/**
 * getControlBoxStyles — возвращает CSS-правила стандартного бокса однострочного контрола:
 * `min-block-size`, `padding-inline`, типографику через `getTextProperties(getTextSize(…))`
 * и `border-radius` через `resolveBlockRadius`.
 *
 * Границы применения:
 *  - полный стандартный бокс, например поле ввода и триггер, — `getControlBoxStyles`
 *  - часть набора, например квадрат из `getMinBlockSize` и `padding-inline` строки-опции, — отдельные геттеры
 *  - многострочный бокс с ростом контента — `getPadding` с парой `inline`/`block`
 *
 * `padding-block` не входит в набор: высоту однострочного контрола держит `min-block-size`,
 * центровку — сетка узла.
 *
 * @param sizePreset размер компонента
 * @param shape форма строки-поля
 * @returns CSS-правила, каждое с новой строки
 */
export function getControlBoxStyles(sizePreset: SizePreset, shape: ShapePreset): string {
  const styles = [
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    getTextProperties(getTextSize(sizePreset)),
    `border-radius: ${resolveBlockRadius(shape, getMinBlockSize(sizePreset))};`,
  ];

  return styles.join('\n');
}

/**
 * DEFAULT_SHOW_BORDER — задаёт показ кольца поверхности по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 * Проп `showBorder` подключается контролу осознанно: эталоны RoundButton и Input;
 * составные триггеры, например Listbox, Combobox, Stepper и RangeInput, проп не
 * получают без отдельного кейса. Оболочка композита без пропа зовёт
 * `getControlBorder` без второго аргумента.
 */
export const DEFAULT_SHOW_BORDER = true;

/**
 * getControlBorder — возвращает CSS-правило рамки контрола вне layout-box:
 * кольцо и тень поверхности одним `box-shadow`. Рамочный и безрамочный режимы
 * дают один content-box и один размер `Icon` на `100%`, без резерва
 * `border: 1px solid transparent`.
 *
 * При `showBorder` — кольцо `0 0 0 1px` цвета `border` и тень `shadow.surface`.
 * Без рамки — `box-shadow: none`. `border: none` вызывающий код пишет только там,
 * где layout-рамку даёт UA-стиль тега, например `input` и `dialog`: у `button` её
 * снял reset, у `div` рамки нет — повтор запрещён.
 *
 * @param theme текущая тема
 * @param showBorder включает рамку контрола
 * @returns CSS-правило `box-shadow`, с завершающей `;`
 */
export function getControlBorder(
  theme: AppTheme,
  showBorder: boolean = DEFAULT_SHOW_BORDER
): string {
  if (!showBorder) {
    return 'box-shadow: none;';
  }

  return `box-shadow: 0 0 0 1px ${theme.colors.border}, ${theme.shadow.surface};`;
}

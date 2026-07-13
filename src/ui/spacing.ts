/**
 * Файл: `src/ui/spacing.ts`
 * Содержит утилиты для работы с отступами.
 * Определяет, какие значения отступов доступны в проекте, как они задаются
 * через пропсы компонентов и как эти пропсы преобразуются в CSS-стили.
 *
 * Основные задачи:
 * 1. Хранить шкалу px → rem в `SPACING_VALUES`
 * 2. Типизировать spacing-пропсы через `SpacingProps` и `SpacingValue`
 * 3. Генерировать CSS-правила через `getSpacingStyles` и значения шкалы через `getSpacingValue`
 *
 * Потребители:
 *  - `@ui/layout` — реэкспортирует публичное API модуля
 *  - `@ui/presets` — использует шкалу в пресетах размеров
 *  - `@ui/positioning` — использует шкалу для `gap` и `inset`
 *  - компоненты со своими наборами размеров, например Tag, Switch и ProgressBar —
 *    получают значения шкалы через `getSpacingValue`
 */

/**
 * SPACING_VALUES — хранит шкалу всех доступных в проекте отступов.
 * Единый источник истины соответствия px → rem, где:
 *  - Ключ — значение в пикселях для пропсов любого компонента с `LayoutProps`,
 *    например `<Card padding={16} />`
 *  - Значение — CSS-длина в rem, например `0.25rem`, `1rem`
 *
 * rem — относительная единица, которая зависит от размера шрифта
 * корневого элемента `<html>` и позволяет сделать дизайн адаптивным.
 *
 * Шкала при root 16px:
 *  - 0–20: шаг 2px
 *  - 24–40: шаг 4px
 *  - от 48: шаг 8px
 *
 * Таблица приватна для модуля, доступ к отступам — только через `getSpacingValue`.
 */
// prettier-ignore
const SPACING_VALUES = {
  0: '0',         // 0px = 0rem
  2: '0.125rem',  // 2px = 0.125rem
  4: '0.25rem',   // 4px = 0.25rem
  6: '0.375rem',  // 6px = 0.375rem
  8: '0.5rem',    // 8px = 0.5rem
  10: '0.625rem', // 10px = 0.625rem
  12: '0.75rem',  // 12px = 0.75rem
  14: '0.875rem', // 14px = 0.875rem
  16: '1rem',     // 16px = 1rem
  18: '1.125rem', // 18px = 1.125rem
  20: '1.25rem',  // 20px = 1.25rem
  24: '1.5rem',   // 24px = 1.5rem
  28: '1.75rem',  // 28px = 1.75rem
  32: '2rem',     // 32px = 2rem
  36: '2.25rem',  // 36px = 2.25rem
  40: '2.5rem',   // 40px = 2.5rem
  48: '3rem',     // 48px = 3rem
  56: '3.5rem',   // 56px = 3.5rem
  64: '4rem',     // 64px = 4rem
  72: '4.5rem',   // 72px = 4.5rem
  80: '5rem',     // 80px = 5rem
} as const;

/**
 * SpacingValue — представляет все возможные числовые ключи из `SPACING_VALUES`,
 * например `4 | 8 | 16 | ... | 80`. TypeScript будет подсказывать только эти значения.
 * Это защищает от опечаток и гарантирует, что используется только разрешённый отступ.
 */
export type SpacingValue = keyof typeof SPACING_VALUES;

/**
 * SPACING_PROPERTIES — связывает имена пропсов с CSS-свойствами.
 * Необходим для динамической генерации CSS-стилей для каждого переданного пропса.
 *
 * Например:
 *  - Пропс `margin` → CSS-свойство `margin`
 *  - Пропс `marginBlock` → CSS-свойство `margin-block`
 */
const SPACING_PROPERTIES = {
  margin: 'margin',
  marginBlock: 'margin-block',
  marginBlockEnd: 'margin-block-end',
  marginBlockStart: 'margin-block-start',
  marginInline: 'margin-inline',
  marginInlineEnd: 'margin-inline-end',
  marginInlineStart: 'margin-inline-start',
  padding: 'padding',
  paddingBlock: 'padding-block',
  paddingBlockEnd: 'padding-block-end',
  paddingBlockStart: 'padding-block-start',
  paddingInline: 'padding-inline',
  paddingInlineEnd: 'padding-inline-end',
  paddingInlineStart: 'padding-inline-start',
} as const;

/**
 * SpacingProps — представляет пропсы отступов.
 * Имена свойств берутся из `SPACING_PROPERTIES`, значения из `SpacingValue`.
 * Используется в `LayoutProps` для всех компонентов, поддерживающих отступы.
 *
 * Пример: `{ margin: 16, paddingBlock: 8 }`.
 * TypeScript проверит, что `16` и `8` есть в `SPACING_VALUES`, а имена пропсов
 * `margin` и `paddingBlock` существуют в `SPACING_PROPERTIES`.
 */
export type SpacingProps = { [K in keyof typeof SPACING_PROPERTIES]?: SpacingValue };

/**
 * SPACING_PROPERTY_NAMES — хранит имена всех пропсов из `SPACING_PROPERTIES`.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * `LAYOUT_PROP_NAMES` из `@ui/layout` вместе с именами из `@ui/positioning` и `@ui/sizing`.
 *
 * Назначение: `margin`, `padding` и их логические варианты не являются DOM-атрибутами,
 * поэтому styled-components не должен передавать их на HTML-узел.
 * `shouldForwardProp` в корневом `Styled*` использует `LAYOUT_PROP_NAMES`,
 * а `splitLayoutProps` по этому же набору отделяет layout-пропсы от остальных,
 * например для обёртки Input и самого элемента `<input>`.
 */
export const SPACING_PROPERTY_NAMES = new Set<string>(Object.keys(SPACING_PROPERTIES));

/**
 * getSpacingValue — принимает метку шкалы и возвращает её значение в rem.
 *
 * @param value — метка шкалы отступов
 * @returns CSS-длина в rem, например `1rem`
 */
export function getSpacingValue(value: SpacingValue): string {
  return SPACING_VALUES[value];
}

/**
 * getSpacingStyles — преобразует spacing-пропсы в готовые CSS-правила.
 *
 * Как работает:
 * 1. Проходит по всем записям `SPACING_PROPERTIES`, где ключ — имя пропса,
 *    а значение — CSS-свойство.
 * 2. Для каждого пропса проверяет, передан ли он в `props`. Переданное значение,
 *    например `16`, преобразует в rem через `getSpacingValue` и формирует
 *    CSS-правило вида `margin: 1rem;`.
 * 3. Собирает такие правила в массив и склеивает через перенос строки.
 * 4. Отдаёт результат для подстановки в CSS-шаблон styled-компонента.
 *
 * @param props — объект со spacing-пропсами, например `{ margin: 16, padding: 8 }`
 * @returns CSS-правила, каждое с новой строки
 */
export function getSpacingStyles(props: SpacingProps): string {
  const rules: string[] = [];

  // Проходит по всем именам пропсов и их CSS-эквивалентам
  for (const [prop, property] of Object.entries(SPACING_PROPERTIES)) {
    // Берёт значение из переданных пропсов по имени prop
    const value = props[prop as keyof SpacingProps];

    // Если значение передано, то формирует CSS-правило
    if (value !== undefined) {
      // getSpacingValue(value) — например, для 16 даст 1rem
      rules.push(`${property}: ${getSpacingValue(value)};`);
    }
  }

  // Склеивает все правила в одну строку с переносами
  return rules.join('\n');
}

/**
 * Файл: `src/ui/spacing.ts`
 * Этот файл содержит утилиты для работы с отступами.
 * Он определяет, какие значения отступов доступны в проекте, как они задаются
 * через пропсы компонентов, и как превращать эти пропсы в реальные CSS-стили.
 *
 * Основные задачи:
 * 1. Хранить шкалу px → rem (`SPACING_VALUES`)
 * 2. Типизировать spacing-пропы (`SpacingProps`, `SpacingValue`)
 * 3. Генерировать CSS через `getSpacingStyles` и `getSpacingValue`
 *
 * Потребители: `@ui/layout`, `@ui/presets`, `@ui/positioning` (`gap`, `inset`),
 * локальные карты размеров в kit-модулях (Tag, Switch, ProgressBar и т.п.).
 */

/**
 * SPACING_VALUES — главный объект (словарь), где:
 *  - Ключ — это значение в пикселях, которое передаётся в пропсы,
 *    например `<Card padding={16} />` (или любой компонент с `LayoutProps`).
 *  - Значение — это CSS-длина в rem, например `0.25rem`, `1rem`.
 *
 * Почему rem? Это относительная единица, которая зависит от размера шрифта
 * корневого элемента `<html>`. Она позволяет сделать дизайн адаптивным.
 *
 * Все доступные отступы перечислены здесь — это единый источник истины,
 * где хранится соответствие px → rem.
 *
 * Шкала (при root 16px):
 *  - 0–20: шаг 2px
 *  - 24–40: шаг 4px
 *  - от 48: шаг 8px
 *
 * Таблица приватна для модуля, снаружи значения доступны только через `getSpacingValue(value)`.
 * А `as const` закрепляет для `TypeScript`, что значения и ключи строго фиксированы.
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
 * SpacingValue — тип, представляющий все возможные ключи (числа) из `SPACING_VALUES`.
 * Например, `4 | 8 | 16 | ... | 80`. `TypeScript` будет подсказывать только эти значения.
 * Это защищает от опечаток и гарантирует, что используется только разрешённый отступ.
 */
export type SpacingValue = keyof typeof SPACING_VALUES;

/**
 * SPACING_PROPERTIES — объект, связывающий имена пропсов с реальными CSS-свойствами.
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
 * SpacingProps — тип для пропсов отступов.
 * Имена свойств берутся из `SPACING_PROPERTIES`, значения — `SpacingValue`.
 *
 * Пример: `{ margin: 16, paddingBlock: 8 }`.
 * TypeScript проверит, что `16` и `8` есть в `SPACING_VALUES`, а имена пропсов
 * (`margin`, `paddingBlock`) существуют в `SPACING_PROPERTIES`.
 *
 * Используется в `LayoutProps` для всех компонентов, поддерживающих отступы.
 */
export type SpacingProps = { [K in keyof typeof SPACING_PROPERTIES]?: SpacingValue };

/**
 * SPACING_PROPERTY_NAMES — множество всех имён пропсов из `SPACING_PROPERTIES`.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * `LAYOUT_PROP_NAMES` (из `@ui/layout`) вместе с `@ui/positioning` и `@ui/sizing`.
 *
 * Назначение: `margin`, `padding` и их логические варианты не являются DOM-атрибутами,
 * поэтому `styled-components` не должен передавать их на HTML-узел.
 * `shouldForwardProp` в корневом `Styled*` использует `LAYOUT_PROP_NAMES`,
 * а `splitLayoutProps` по этому же набору отделяет layout-пропсы от остальных
 * (например, для обёртки Input и самого элемента `<input>`).
 *
 * Создаётся из `Object.keys(SPACING_PROPERTIES)`, чтобы при добавлении нового пропа
 * в карту не требовалось обновлять список вручную (`@ui/layout`).
 */
export const SPACING_PROPERTY_NAMES = new Set<string>(Object.keys(SPACING_PROPERTIES));

/**
 * getSpacingValue — принимает метку шкалы и возвращает её строковое представление в rem.
 *
 * @param value — один из допустимых ключей шкалы `SPACING_VALUES`
 * @returns строка с CSS-значением в rem
 */
export function getSpacingValue(value: SpacingValue): string {
  return SPACING_VALUES[value];
}

/**
 * getSpacingStyles — превращает объект `SpacingProps` в готовую строку CSS-стилей.
 *
 * Как она работает:
 * 1. Проходится по всем записям (ключ-значение) из `SPACING_PROPERTIES`.
 *    Ключ — это имя пропса (например, `margin`), значение — соответствующее CSS-свойство (`margin`);
 * 2. Для каждого пропса проверяется, передан ли он в объекте props.
 *    Если значение передано, берёт его (например, `16`),
 *    получает его эквивалент в rem с помощью `getSpacingValue(value)`,
 *    и формирует строку вида `margin: 1rem;`;
 * 3. Все такие строки собираются в массив и склеиваются через перенос строки.
 *
 * Результат — строка, которую можно вставить в атрибут `style` или в CSS-in-JS.
 *
 * @param props — объект с spacing-пропсами, например, `{ margin: 16, padding: 8 }`
 * @returns строка с CSS-правилами, каждая с новой строкой
 */
export function getSpacingStyles(props: SpacingProps): string {
  const rules: string[] = [];

  // Проходится по всем именам пропсов и их CSS-эквивалентам
  for (const [prop, property] of Object.entries(SPACING_PROPERTIES)) {
    // Берётся значение из переданных пропсов по имени `prop`
    const value = props[prop as keyof SpacingProps];

    // Если значение передано, то формируется CSS-правило
    if (value !== undefined) {
      // getSpacingValue(value) — например, для 16 даст 1rem
      rules.push(`${property}: ${getSpacingValue(value)};`);
    }
  }

  // Склеивает все правила в одну строку с переносами
  return rules.join('\n');
}

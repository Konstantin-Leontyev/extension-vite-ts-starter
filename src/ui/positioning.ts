/**
 * Файл: `src/ui/positioning.ts`
 * Этот файл содержит утилиты для работы с позиционированием и раскладкой.
 * Он определяет, какие CSS-свойства доступны для управления положением элемента,
 * как они задаются через пропсы компонентов, и как превращать эти пропсы
 * в реальные CSS-стили.
 *
 * Основные задачи:
 * 1. Типизировать positioning-пропы (`PositioningProps`)
 * 2. Связать пропсы с CSS-свойствами через `POSITIONING_PROPERTIES`
 * 3. Генерировать CSS через `getPositioningStyles`
 *
 * В отличие от `@ui/spacing` (фиксированная шкала) и `@ui/sizing` (свободные строки),
 * positioning объединяет:
 *  - пропы позиционирования (`position`, `inset`, `top`, `left` и т.д.)
 *  - пропы раскладки `flex`/`grid` (`display`, `flexDirection`, `alignItems`, `gap` и т.д.)
 *  - пропы наложения и переполнения (`zIndex`, `overflow`)
 *
 * Потребители: `@ui/layout`, корневые `Styled*` kit-модулей с раскладкой.
 */

import { type CSSProperties } from 'react';

import { getSpacingValue, type SpacingValue } from '@ui/spacing';

/**
 * InsetValue — тип, представляющий значения отступов позиционирования.
 * Это может быть `auto` или один из разрешённых ключей из `SPACING_VALUES` (`SpacingValue`).
 * Например: `auto`, `16`, `24`, `32`.
 */
export type InsetValue = 'auto' | SpacingValue;

/**
 * LayoutDisplay — тип, представляющий допустимые значения для CSS-свойства `display`.
 * Ограничены набором, который используется в проекте для построения сеток.
 */
export type LayoutDisplay = 'block' | 'flex' | 'grid' | 'inline-flex';

/**
 * LayoutPosition — тип, представляющий допустимые значения для CSS-свойства `position`.
 */
export type LayoutPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';

/**
 * PositioningProps — тип, представляющий пропсы для управления позиционированием и раскладкой.
 *
 * @property display — тип отображения (`block`, `flex`, `grid`, `inline-flex`)
 * @property position — тип позиционирования
 * @property zIndex — порядок наложения
 * @property inset — отступ со всех сторон (`auto` или число из шкалы)
 * @property top — отступ сверху
 * @property right — отступ справа
 * @property bottom — отступ снизу
 * @property left — отступ слева
 * @property flexDirection — направление flex-потока
 * @property flexWrap — перенос flex-элементов
 * @property alignItems — выравнивание по поперечной оси
 * @property justifyContent — выравнивание по основной оси
 * @property placeItems — сокращение для `align-items` + `justify-items`
 * @property placeSelf — сокращение для `align-self` + `justify-self`
 * @property alignSelf — выравнивание элемента по поперечной оси
 * @property justifySelf — выравнивание элемента по основной оси
 * @property gridTemplateRows — шаблон строк сетки
 * @property gridTemplateColumns — шаблон колонок сетки
 * @property gridAutoFlow — направление автоматического потока
 * @property gap — отступ между элементами (из шкалы `spacing`)
 * @property rowGap — отступ между строками
 * @property columnGap — отступ между колонками
 * @property overflow — управление переполнением
 *
 * Для `inset`-свойств: `auto` или число из `SPACING_VALUES`.
 * Для `gap`-свойств: только числа из `SPACING_VALUES`.
 * Для `raw`-свойств: значения передаются как есть (без преобразования через `getSpacingValue`).
 */
export type PositioningProps = {
  alignItems?: CSSProperties['alignItems'];
  alignSelf?: CSSProperties['alignSelf'];
  bottom?: InsetValue;
  columnGap?: SpacingValue;
  display?: LayoutDisplay;
  flexDirection?: CSSProperties['flexDirection'];
  flexWrap?: CSSProperties['flexWrap'];
  gap?: SpacingValue;
  gridAutoFlow?: CSSProperties['gridAutoFlow'];
  gridTemplateColumns?: CSSProperties['gridTemplateColumns'];
  gridTemplateRows?: CSSProperties['gridTemplateRows'];
  inset?: InsetValue;
  insetBlock?: InsetValue;
  insetBlockEnd?: InsetValue;
  insetBlockStart?: InsetValue;
  insetInline?: InsetValue;
  insetInlineEnd?: InsetValue;
  insetInlineStart?: InsetValue;
  justifyContent?: CSSProperties['justifyContent'];
  justifySelf?: CSSProperties['justifySelf'];
  left?: InsetValue;
  overflow?: CSSProperties['overflow'];
  placeItems?: CSSProperties['placeItems'];
  placeSelf?: CSSProperties['placeSelf'];
  position?: LayoutPosition;
  right?: InsetValue;
  rowGap?: SpacingValue;
  top?: InsetValue;
  zIndex?: CSSProperties['zIndex'];
};

/**
 * PositioningValueKind — тип, представляющий категорию значения для CSS-свойства.
 * Определяет, как нужно обрабатывать переданное значение:
 *  - `raw` — использовать как есть (строка)
 *  - `inset` — может быть `auto` или число из `SPACING_VALUES`
 *  - `spacing` — только число из `SPACING_VALUES` (через `getSpacingValue`)
 */
type PositioningValueKind = 'inset' | 'raw' | 'spacing';

/**
 * SPACING_PROPERTIES — объект, связывающий имена пропсов с CSS-свойствами.
 * Необходим для динамической генерации CSS-стилей по каждому переданному пропсу.
 *
 * Структура: [CSS-свойство, тип значения (`kind`)]
 *
 * Например:
 *  - Пропс `display` → CSS-свойство `display`, тип `raw` (значение как есть)
 *  - Пропс `inset` → CSS-свойство `inset`, тип `inset` (может быть `auto` или `spacing`)
 *  - Пропс `gap` → CSS-свойство `gap`, тип `spacing` (только из `SPACING_VALUES`)
 *
 * Порядок записей в объекте соответствует порядку генерации CSS-правил.
 * Внутри каждой логической группы шорткаты идут раньше своих лонгхендов:
 *  - `inset` → `top`/`right`/`bottom`/`left`
 *  - `gap` → `rowGap`/`columnGap`
 *
 * Это важно только для случаев, когда свойства могут переопределять друг друга.
 * Конструкция `as const satisfies` гарантирует, что объект содержит все ключи
 * из `PositioningProps` и только их, а `TypeScript` будет проверять соответствие
 * структуры типу.
 */
const POSITIONING_PROPERTIES = {
  display: ['display', 'raw'],
  position: ['position', 'raw'],
  zIndex: ['z-index', 'raw'],
  inset: ['inset', 'inset'],
  insetBlock: ['inset-block', 'inset'],
  insetBlockStart: ['inset-block-start', 'inset'],
  insetBlockEnd: ['inset-block-end', 'inset'],
  insetInline: ['inset-inline', 'inset'],
  insetInlineStart: ['inset-inline-start', 'inset'],
  insetInlineEnd: ['inset-inline-end', 'inset'],
  top: ['top', 'inset'],
  right: ['right', 'inset'],
  bottom: ['bottom', 'inset'],
  left: ['left', 'inset'],
  flexDirection: ['flex-direction', 'raw'],
  flexWrap: ['flex-wrap', 'raw'],
  alignItems: ['align-items', 'raw'],
  justifyContent: ['justify-content', 'raw'],
  placeItems: ['place-items', 'raw'],
  placeSelf: ['place-self', 'raw'],
  alignSelf: ['align-self', 'raw'],
  justifySelf: ['justify-self', 'raw'],
  gridTemplateRows: ['grid-template-rows', 'raw'],
  gridTemplateColumns: ['grid-template-columns', 'raw'],
  gridAutoFlow: ['grid-auto-flow', 'raw'],
  gap: ['gap', 'spacing'],
  rowGap: ['row-gap', 'spacing'],
  columnGap: ['column-gap', 'spacing'],
  overflow: ['overflow', 'raw'],
} as const satisfies Record<
  keyof PositioningProps,
  readonly [string, PositioningValueKind]
>;

/**
 * POSITIONING_PROPERTY_NAMES — множество всех имён пропсов из `POSITIONING_PROPERTIES`.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * `LAYOUT_PROP_NAMES` (из `@ui/layout`) вместе с `@ui/spacing` и `@ui/sizing`.
 *
 * Назначение: positioning-пропсы не являются DOM-атрибутами, поэтому `styled-components`
 * не должен передавать их на HTML-узел.
 * `shouldForwardProp` в корневом `Styled*` использует `LAYOUT_PROP_NAMES`,
 * а `splitLayoutProps` по этому же набору отделяет layout-пропсы от остальных.
 *
 * `Set` создаётся из `Object.keys(POSITIONING_PROPERTIES)`, чтобы при добавлении нового пропса
 * в карту не требовалось обновлять список вручную.
 */
export const POSITIONING_PROPERTY_NAMES = new Set<string>(
  Object.keys(POSITIONING_PROPERTIES)
);

/**
 * resolvePropertyValue — преобразует значение пропа в строку для правой части CSS-декларации.
 *
 * В зависимости от типа значения (`kind`):
 *  - `raw` — возвращает значение как есть (приводит к строке)
 *  - `inset` — если значение `auto`, возвращает `auto`; иначе преобразует через `getSpacingValue`
 *  - `spacing` — всегда преобразует через `getSpacingValue` (значение должно быть `SpacingValue`)
 *
 * Эта функция используется внутри `getPositioningStyles` для каждого пропса.
 *
 * @param kind — тип значения (`raw`, `inset`, `spacing`)
 * @param value — значение пропса (строка, число или `auto`)
 * @returns строка для CSS (например, `auto`, `1rem`, `flex`)
 */
function resolvePropertyValue(
  kind: PositioningValueKind,
  value: NonNullable<PositioningProps[keyof PositioningProps]>
): string {
  if (kind === 'raw') {
    return String(value);
  }

  if (value === 'auto') {
    return 'auto';
  }

  // Для `inset` и `spacing` значение должно быть `SpacingValue`
  return getSpacingValue(value as SpacingValue);
}

/**
 * getPositioningStyles — превращает объект `PositioningProps` в готовую строку CSS-стилей.
 * в готовую строку CSS-стилей.
 *
 * Как она работает:
 * 1. Проходит по всем записям (ключ-значение) из `POSITIONING_PROPERTIES`.
 *    Ключ — это имя пропса (например, `display`), значение — массив [CSS-свойство, `kind`];
 * 2. Для каждого пропса проверяется, передан ли он в объекте props.
 *    Если значение передано, `resolvePropertyValue` преобразует его
 *    в значение для CSS-свойства, и формируется строка вида `display: flex;`;
 * 3. Все такие строки собираются в массив и склеиваются через перенос строки.
 *
 * Результат — строка, которую можно вставить в атрибут `style` или в CSS-in-JS.
 *
 * @param props — объект с positioning-пропсами, например `{ display: 'flex', gap: 16 }`
 * @returns строка с CSS-правилами, каждая с новой строки
 */
export function getPositioningStyles(props: PositioningProps): string {
  const rules: string[] = [];

  for (const [prop, [property, kind]] of Object.entries(POSITIONING_PROPERTIES)) {
    const value = props[prop as keyof PositioningProps];

    if (value !== undefined) {
      rules.push(`${property}: ${resolvePropertyValue(kind, value)};`);
    }
  }

  return rules.join('\n');
}

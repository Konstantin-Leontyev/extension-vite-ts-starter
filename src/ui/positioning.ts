/**
 * Файл: `src/ui/positioning.ts`
 * Содержит утилиты для работы с позиционированием и раскладкой.
 * Определяет, какие CSS-свойства доступны для управления положением элемента,
 * как они задаются через пропсы компонентов и как эти пропсы преобразуются
 * в CSS-стили.
 *
 * В отличие от `@ui/spacing` с фиксированной шкалой и `@ui/sizing` со свободными
 * значениями, positioning объединяет:
 *  - пропсы позиционирования, например `position`, `inset`, `top`, `left`
 *  - пропсы раскладки flex и grid, например `display`, `flexDirection`, `alignItems`, `gap`
 *  - пропсы наложения и переполнения, например `zIndex`, `overflow`
 *
 * Основные задачи:
 * 1. Типизировать positioning-пропсы: `PositioningProps`, `InsetValue`, `LayoutDisplay`, `LayoutPosition`
 * 2. Связать пропсы с CSS-свойствами через `POSITIONING_PROPERTIES`
 * 3. Генерировать CSS-правила через `getPositioningStyles`
 * 4. Предоставить перечень имён пропсов через `POSITIONING_PROPERTY_NAMES`
 *
 * Потребители:
 *  - `@ui/layout` — реэкспортирует публичное API модуля
 *  - корневые `Styled*` компонентов — принимают раскладку через layout-пропсы
 */

import { type CSSProperties } from 'react';

import { getSpacingValue, type SpacingValue } from '@ui/spacing';

/**
 * InsetValue — представляет значение отступа позиционирования.
 * Допускает `auto` или ключ из шкалы `SPACING_VALUES`, например `16`, `24`, `32`.
 */
export type InsetValue = 'auto' | SpacingValue;

/**
 * LayoutDisplay — представляет допустимые значения CSS-свойства `display`.
 * Ограничен набором, который используется в проекте для построения сеток.
 */
export type LayoutDisplay = 'block' | 'flex' | 'grid' | 'inline-flex';

/**
 * LayoutPosition — представляет допустимые значения CSS-свойства `position`.
 */
export type LayoutPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';

/**
 * PositioningProps — представляет пропсы позиционирования и раскладки.
 *
 * @property display — тип отображения
 * @property position — тип позиционирования
 * @property zIndex — порядок наложения
 * @property inset — отступ со всех сторон
 * @property top — отступ сверху
 * @property right — отступ справа
 * @property bottom — отступ снизу
 * @property left — отступ слева
 * @property flexDirection — направление flex-потока
 * @property flexWrap — перенос flex-элементов
 * @property alignItems — выравнивание по поперечной оси
 * @property justifyContent — выравнивание по основной оси
 * @property placeItems — сокращение для `align-items` и `justify-items`
 * @property placeSelf — сокращение для `align-self` и `justify-self`
 * @property alignSelf — выравнивание элемента по поперечной оси
 * @property justifySelf — выравнивание элемента по основной оси
 * @property gridTemplateRows — шаблон строк сетки
 * @property gridTemplateColumns — шаблон колонок сетки
 * @property gridAutoFlow — направление автоматического потока
 * @property gap — отступ между элементами из шкалы spacing
 * @property rowGap — отступ между строками
 * @property columnGap — отступ между колонками
 * @property overflow — управление переполнением
 *
 * Для inset-свойств допускаются `auto` или ключ из `SPACING_VALUES`.
 * Для gap-свойств — только ключи из `SPACING_VALUES`.
 * Для raw-свойств значения передаются как есть, без преобразования через `getSpacingValue`.
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
 * PositioningValueKind — представляет категорию значения CSS-свойства.
 * Определяет способ обработки переданного значения:
 *  - `raw` — передаётся как есть
 *  - `inset` — допускает `auto` или ключ из `SPACING_VALUES`
 *  - `spacing` — только ключ из `SPACING_VALUES` через `getSpacingValue`
 */
type PositioningValueKind = 'inset' | 'raw' | 'spacing';

/**
 * POSITIONING_PROPERTIES — связывает имена пропсов с CSS-свойствами и категорией значения.
 * Необходим для динамической генерации CSS-стилей для каждого переданного пропса.
 *
 * Структура записи:
 *  - ключ — имя пропса
 *  - значение — CSS-свойство и категория `kind`
 *
 * Например:
 *  - Пропс `display` → CSS-свойство `display`, категория `raw`
 *  - Пропс `inset` → CSS-свойство `inset`, категория `inset`
 *  - Пропс `gap` → CSS-свойство `gap`, категория `spacing`
 *
 * Порядок записей соответствует порядку генерации CSS-правил.
 * Внутри каждой логической группы шорткаты идут раньше своих лонгхендов:
 *  - `inset` → `top`, `right`, `bottom`, `left`
 *  - `gap` → `rowGap`, `columnGap`
 *
 * Это важно только для случаев, когда свойства могут переопределять друг друга.
 *
 * Соответствие приватно для модуля, снаружи имена пропсов доступны через `POSITIONING_PROPERTY_NAMES`.
 * Конструкция `as const satisfies Record<keyof PositioningProps, …>` закрепляет
 * readonly-типы и гарантирует, что заданы все ключи `PositioningProps` и только они.
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
 * POSITIONING_PROPERTY_NAMES — хранит имена всех пропсов из `POSITIONING_PROPERTIES`.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * `LAYOUT_PROP_NAMES` из `@ui/layout` вместе с именами из `@ui/spacing` и `@ui/sizing`.
 *
 * Назначение: positioning-пропсы не являются DOM-атрибутами, поэтому styled-components
 * не должен передавать их на HTML-узел.
 * `shouldForwardProp` в корневом `Styled*` использует `LAYOUT_PROP_NAMES`,
 * а `splitLayoutProps` по этому же набору отделяет layout-пропсы от остальных.
 */
export const POSITIONING_PROPERTY_NAMES = new Set<string>(
  Object.keys(POSITIONING_PROPERTIES)
);

/**
 * resolvePropertyValue — преобразует значение пропса в правую часть CSS-декларации.
 *
 * В зависимости от категории `kind`:
 *  - `raw` — возвращает значение как есть
 *  - `inset` — для `auto` возвращает `auto`, иначе преобразует через `getSpacingValue`
 *  - `spacing` — всегда преобразует через `getSpacingValue`
 *
 * Используется внутри `getPositioningStyles` для каждого переданного пропса.
 *
 * @param kind — категория значения: `raw`, `inset` или `spacing`
 * @param value — значение пропса
 * @returns значение для правой части CSS-декларации, например `auto`, `1rem`, `flex`
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

  // Для inset и spacing значение должно быть SpacingValue
  return getSpacingValue(value as SpacingValue);
}

/**
 * getPositioningStyles — преобразует positioning-пропсы в готовые CSS-правила.
 *
 * Как работает:
 * 1. Проходит по всем записям `POSITIONING_PROPERTIES`, где ключ — имя пропса,
 *    а значение — CSS-свойство и категория `kind`.
 * 2. Для каждого пропса проверяет, передан ли он в `props`. Переданное значение
 *    преобразует через `resolvePropertyValue` и формирует CSS-правило вида `display: flex;`.
 * 3. Собирает такие правила в массив и склеивает через перенос строки.
 *
 * Результат подставляется в CSS-шаблон styled-компонента.
 *
 * @param props — объект с positioning-пропсами, например `{ display: 'flex', gap: 16 }`
 * @returns CSS-правила, каждое с новой строки
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

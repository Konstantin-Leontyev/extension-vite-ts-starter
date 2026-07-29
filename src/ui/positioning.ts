/**
 * Файл: `src/ui/positioning.ts`
 * Содержит утилиты для работы с позиционированием и раскладкой.
 * Определяет, какие CSS-свойства доступны для управления положением элемента,
 * как они задаются через пропсы компонентов и как эти пропсы преобразуются
 * в CSS-стили.
 * Объединяет три группы пропсов в отличие от `@ui/spacing` с фиксированной шкалой
 * и `@ui/sizing` со свободными значениями:
 *  - пропсы позиционирования, например `position`, `inset`, `top`, `left`
 *  - пропсы раскладки flex и grid, например `display`, `flexDirection`, `alignItems`, `gap`
 *  - пропсы наложения и переполнения, например `zIndex`, `overflow`
 *
 * Основные задачи:
 * 1. Типизировать positioning-пропсы через `PositioningProps`
 * 2. Связать пропсы с CSS-свойствами через `POSITIONING_PROPERTIES`
 * 3. Предоставить функцию `getPositioningStyles`
 * 4. Предоставить перечень имён пропсов через `POSITIONING_PROPERTY_NAMES`
 *
 * Потребители:
 *  - `@ui/layout` — включает positioning-пропсы в `LayoutProps` и вызывает
 *    `getPositioningStyles`
 *  - корневые `Styled*` компонентов — принимают раскладку через layout-пропсы
 */

import { type CSSProperties } from 'react';

import { getSpacingValue, type SpacingValue } from '@ui/spacing';

/**
 * InsetValue — представляет значение отступа позиционирования.
 * Допускает `auto` или ключ из шкалы `SPACING_VALUES`, например `16`, `24`, `32`.
 */
type InsetValue = 'auto' | SpacingValue;

/**
 * LayoutDisplay — представляет допустимые значения CSS-свойства `display`.
 * Ограничен набором, который используется в проекте для построения сеток.
 */
type LayoutDisplay = 'block' | 'flex' | 'grid' | 'inline-flex';

/**
 * LayoutPosition — представляет допустимые значения CSS-свойства `position`.
 */
type LayoutPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';

/**
 * PositioningProps — представляет пропсы позиционирования и раскладки.
 * Для inset-свойств допускаются `auto` или ключ из `SPACING_VALUES`.
 * Для gap-свойств — только ключи из `SPACING_VALUES`.
 * Для raw-свойств значения передаются как есть, без преобразования через `getSpacingValue`.
 *
 * @property alignContent — выравнивание строк flex/grid по поперечной оси
 * @property alignItems — выравнивание по поперечной оси
 * @property alignSelf — выравнивание элемента по поперечной оси
 * @property bottom — отступ снизу
 * @property columnGap — отступ между колонками
 * @property display — тип отображения
 * @property flex — сокращение для `flex-grow`, `flex-shrink` и `flex-basis`
 * @property flexBasis — базовая длина flex-элемента
 * @property flexDirection — направление flex-потока
 * @property flexGrow — коэффициент роста flex-элемента
 * @property flexShrink — коэффициент сжатия flex-элемента
 * @property flexWrap — перенос flex-элементов
 * @property gap — отступ между элементами
 * @property gridAutoFlow — направление автоматического потока
 * @property gridTemplateColumns — шаблон колонок сетки
 * @property gridTemplateRows — шаблон строк сетки
 * @property inset — отступ со всех сторон
 * @property insetBlock — отступ по блочной оси
 * @property insetBlockEnd — отступ с конца блочной оси
 * @property insetBlockStart — отступ с начала блочной оси
 * @property insetInline — отступ по строчной оси
 * @property insetInlineEnd — отступ с конца строчной оси
 * @property insetInlineStart — отступ с начала строчной оси
 * @property justifyContent — выравнивание по основной оси
 * @property justifySelf — выравнивание элемента по основной оси
 * @property left — отступ слева
 * @property overflow — управление переполнением
 * @property placeItems — сокращение для `align-items` и `justify-items`
 * @property placeSelf — сокращение для `align-self` и `justify-self`
 * @property position — тип позиционирования
 * @property right — отступ справа
 * @property rowGap — отступ между строками
 * @property top — отступ сверху
 * @property zIndex — порядок наложения
 */
export type PositioningProps = {
  alignContent?: CSSProperties['alignContent'];
  alignItems?: CSSProperties['alignItems'];
  alignSelf?: CSSProperties['alignSelf'];
  bottom?: InsetValue;
  columnGap?: SpacingValue;
  display?: LayoutDisplay;
  flex?: CSSProperties['flex'];
  flexBasis?: CSSProperties['flexBasis'];
  flexDirection?: CSSProperties['flexDirection'];
  flexGrow?: CSSProperties['flexGrow'];
  flexShrink?: CSSProperties['flexShrink'];
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
 * Порядок записей соответствует порядку генерации CSS-правил.
 * Внутри каждой логической группы шорткаты идут раньше своих лонгхендов —
 * это важно, когда свойства могут переопределять друг друга:
 *  - `inset` → `top`, `right`, `bottom`, `left`
 *  - `gap` → `rowGap`, `columnGap`
 *
 * Структура записи:
 *  - Ключ — имя пропса
 *  - Значение — CSS-свойство и категория `kind`
 *
 * Например:
 *  - Пропс `display` → CSS-свойство `display`, категория `raw`
 *  - Пропс `inset` → CSS-свойство `inset`, категория `inset`
 *  - Пропс `gap` → CSS-свойство `gap`, категория `spacing`
 *
 * Соответствие приватно для модуля, доступ к именам пропсов — только через `POSITIONING_PROPERTY_NAMES`.
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
  flex: ['flex', 'raw'],
  flexGrow: ['flex-grow', 'raw'],
  flexShrink: ['flex-shrink', 'raw'],
  flexBasis: ['flex-basis', 'raw'],
  alignContent: ['align-content', 'raw'],
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
 * resolvePropertyValue — преобразует значение пропса в значение для CSS-свойства.
 * Используется внутри `getPositioningStyles` для каждого переданного пропса.
 *
 * В зависимости от категории `kind`:
 *  - `raw` — возвращает значение как есть
 *  - `inset` — для `auto` возвращает `auto`, иначе преобразует через `getSpacingValue`
 *  - `spacing` — всегда преобразует через `getSpacingValue`
 *
 * @param kind категория значения: `raw`, `inset` или `spacing`
 * @param value значение пропса
 * @returns значение для CSS-свойства, например `auto`, `1rem`, `flex`
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

  return getSpacingValue(value as SpacingValue);
}

/**
 * getPositioningStyles — преобразует positioning-пропсы в готовые CSS-правила.
 *
 * Как работает:
 * 1. Проходит по всем записям `POSITIONING_PROPERTIES`, где ключ — имя пропса,
 *    а значение — CSS-свойство и категория `kind`
 * 2. Для каждого пропса проверяет, передан ли он в `props`. Переданное значение
 *    преобразует через `resolvePropertyValue` и формирует CSS-правило вида `display: flex;`
 * 3. Собирает такие правила в массив и склеивает через перенос строки
 * 4. Отдаёт результат для подстановки в CSS-шаблон styled-компонента
 *
 * @param props объект с positioning-пропсами, например `{ display: 'flex', gap: 16 }`
 * @returns CSS-правила, каждое с новой строки
 */
export function getPositioningStyles(props: PositioningProps): string {
  const styles: string[] = [];

  for (const [prop, [property, kind]] of Object.entries(POSITIONING_PROPERTIES)) {
    const value = props[prop as keyof PositioningProps];

    if (value !== undefined) {
      styles.push(`${property}: ${resolvePropertyValue(kind, value)};`);
    }
  }

  return styles.join('\n');
}

/**
 * Файл: positioning.ts
 * Этот файл содержит утилиты для работы с позиционированием и раскладкой (layout).
 * Он определяет, какие CSS-свойства доступны для управления положением элемента,
 * как они задаются через пропсы компонентов, и как превращать эти пропсы
 * в реальные CSS-стили.
 *
 * В отличие от spacing (фиксированная шкала) и sizing (свободные строки),
 * positioning объединяет:
 * - позиционирование (position, inset, top, left и т.д.)
 * - flexbox и grid свойства (display, flexDirection, alignItems, gap и т.д.)
 * - дополнительные свойства (zIndex, overflow)
 */

import { type CSSProperties } from 'react';

import { spacingRem, type SpacingPx } from '@ui/spacing';

/**
 * InsetValue — тип для значений отступов позиционирования.
 * Это может быть 'auto' или один из разрешённых ключей из SPACING_REM (SpacingPx).
 * Например: 'auto', 16, 24, 32.
 */
export type InsetValue = 'auto' | SpacingPx;

/**
 * LayoutDisplay — допустимые значения для CSS-свойства display.
 * Ограничены набором, который используется в проекте для построения сеток.
 */
export type LayoutDisplay = 'block' | 'flex' | 'grid' | 'inline-flex';

/**
 * LayoutPosition — допустимые значения для CSS-свойства position.
 */
export type LayoutPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';

/**
 * PositioningProps — тип, описывающий все пропсы для управления позиционированием
 * и раскладкой элемента.
 *
 * Пропсы разделены на несколько логических групп:
 * - display, position, zIndex — базовые свойства
 * - inset, top, right, bottom, left — позиционирование (с поддержкой 'auto' и spacing)
 * - flexDirection, flexWrap, alignItems, justifyContent, placeItems, placeSelf,
 *   alignSelf, justifySelf — flexbox свойства
 * - gridTemplateRows, gridTemplateColumns, gridAutoFlow — grid свойства
 * - gap, rowGap, columnGap — отступы между элементами (из шкалы spacing)
 * - overflow — управление переполнением
 *
 * Значения для inset-свойств (top, left, inset и т.д.) могут быть:
 * - 'auto' — автоматическое позиционирование
 * - числом из SPACING_REM — отступ в rem
 *
 * Для gap-свойств используются только значения из SPACING_REM.
 * Для raw-свойств значения передаются как есть (строка или число),
 * без преобразования через spacingRem. Это касается:
 * - position, display, zIndex (число)
 * - flexDirection, alignItems, justifyContent и других CSS-свойств,
 *   типизированных через CSSProperties
 */
export type PositioningProps = {
  alignItems?: CSSProperties['alignItems'];
  alignSelf?: CSSProperties['alignSelf'];
  bottom?: InsetValue;
  columnGap?: SpacingPx;
  display?: LayoutDisplay;
  flexDirection?: CSSProperties['flexDirection'];
  flexWrap?: CSSProperties['flexWrap'];
  gap?: SpacingPx;
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
  rowGap?: SpacingPx;
  top?: InsetValue;
  zIndex?: CSSProperties['zIndex'];
};

/**
 * PositioningValueKind — категория значения для CSS-свойства.
 * Определяет, как нужно обрабатывать переданное значение:
 * - 'raw' — использовать как есть (строка)
 * - 'inset' — может быть 'auto' или число из SPACING_REM
 * - 'spacing' — только число из SPACING_REM (через spacingRem)
 */
type PositioningValueKind = 'inset' | 'raw' | 'spacing';

/**
 * POSITIONING_CSS — объект, который связывает имена пропсов с реальными
 * CSS-свойствами и определяет, как обрабатывать значения.
 *
 * Структура: [CSS-свойство, тип значения (kind)]
 *
 * Например:
 *   - Пропс 'display' → CSS-свойство 'display', тип 'raw' (значение как есть)
 *   - Пропс 'inset' → CSS-свойство 'inset', тип 'inset' (может быть 'auto' или spacing)
 *   - Пропс 'gap' → CSS-свойство 'gap', тип 'spacing' (только из SPACING_REM)
 *
 * Порядок записей в объекте соответствует порядку генерации CSS-правил.
 * Внутри каждой логической группы шорткаты идут раньше своих лонгхендов:
 * - inset → top/right/bottom/left
 * - gap → rowGap/columnGap
 *
 * Это важно только для случаев, когда свойства могут переопределять друг друга.
 * Конструкция 'as const satisfies' гарантирует, что объект содержит все ключи
 * из PositioningProps и только их, а TypeScript будет проверять соответствие
 * структуры типу.
 */
const POSITIONING_CSS = {
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
 * POSITIONING_PROP_NAMES — это множество (Set) всех имён пропсов из POSITIONING_CSS.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * LAYOUT_PROP_NAMES (из @ui/layout) вместе с spacing и sizing.
 *
 * Назначение: positioning-пропсы не являются DOM-атрибутами, поэтому styled-components
 * не должен передавать их на HTML-узел.
 * shouldForwardProp в корневом Styled* использует LAYOUT_PROP_NAMES,
 * a splitLayoutProps по этому же набору отделяет layout-свойства от остальных.
 *
 * Set создаётся из Object.keys(POSITIONING_CSS), чтобы при добавлении нового пропса
 * в карту не требовалось обновлять список вручную.
 */
export const POSITIONING_PROP_NAMES = new Set<string>(Object.keys(POSITIONING_CSS));

/**
 * positioningValueCss — вспомогательная функция, которая преобразует значение
 * пропса в строку, пригодную для использования в CSS.
 *
 * В зависимости от типа значения (kind):
 * - 'raw' — возвращает значение как есть (приводит к строке)
 * - 'inset' — если значение 'auto', возвращает 'auto'; иначе преобразует через spacingRem
 * - 'spacing' — всегда преобразует через spacingRem (значение должно быть SpacingPx)
 *
 * Эта функция используется внутри getPositioningStyles для каждого пропса.
 *
 * @param kind — тип значения ('raw', 'inset', 'spacing')
 * @param value — значение пропса (строка, число или 'auto')
 * @returns строка для CSS (например, 'auto', '1rem', 'flex')
 */
function positioningValueCss(
  kind: PositioningValueKind,
  value: NonNullable<PositioningProps[keyof PositioningProps]>
): string {
  if (kind === 'raw') {
    return String(value);
  }

  if (value === 'auto') {
    return 'auto';
  }

  // Для inset и spacing значение должно быть SpacingPx
  return spacingRem(value as SpacingPx);
}

/**
 * getPositioningStyles — главная функция, которая превращает объект пропсов
 * в готовую строку CSS-стилей.
 *
 * Как она работает:
 * 1. Проходит по всем записям (ключ-значение) из POSITIONING_CSS.
 *    Ключ — это имя пропса (например, 'display'), значение — массив [CSS-свойство, kind];
 * 2. Для каждого пропса смотрит, передан ли он в объекте props.
 * 3. Если передан (не undefined), вызывает positioningValueCss для преобразования
 *    значения в правильный CSS-формат.
 * 4. Формирует строку вида "display: flex;" и добавляет в массив.
 * 5. Все такие строки собирает и склеивает через перенос строки.
 *
 * Результат — строка, которую можно вставить в атрибут style или в CSS-in-JS.
 *
 * @param props — объект с positioning-пропсами, например { display: 'flex', gap: 16 }
 * @returns строка с CSS-правилами, каждая с новой строки
 */
export function getPositioningStyles(props: PositioningProps): string {
  const rules: string[] = [];

  for (const [prop, [property, kind]] of Object.entries(POSITIONING_CSS)) {
    const value = props[prop as keyof PositioningProps];

    if (value !== undefined) {
      rules.push(`${property}: ${positioningValueCss(kind, value)};`);
    }
  }

  return rules.join('\n');
}

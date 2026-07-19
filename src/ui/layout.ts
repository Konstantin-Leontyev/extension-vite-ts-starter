/**
 * Файл: `src/ui/layout.ts`
 * Объединяет layout-утилиты проекта в единую точку входа из трёх модулей:
 *  - `@ui/spacing` — отступы по фиксированной шкале в rem
 *  - `@ui/sizing` — размеры со свободными строковыми значениями
 *  - `@ui/positioning` — позиционирование и раскладка
 *
 * Основные задачи:
 * 1. Реэкспортировать API из `@ui/spacing`, `@ui/sizing` и `@ui/positioning`
 * 2. Типизировать layout-пропсы через `LayoutProps`
 * 3. Объединить имена всех layout-пропсов в `LAYOUT_PROP_NAMES`
 * 4. Предоставить `getLayoutStyles` для генерации всех layout-правил
 * 5. Предоставить `splitLayoutProps` для разделения пропсов
 *
 * Потребители:
 *  - корневые `Styled*` компонентов — `shouldForwardProp` и `getLayoutStyles`
 *  - составные компоненты, например Input, Listbox и Stepper —
 *    разделяют пропсы через `splitLayoutProps`
 */

import {
  POSITIONING_PROPERTY_NAMES,
  getPositioningStyles,
  type PositioningProps,
} from '@ui/positioning';
import { SIZING_PROPERTY_NAMES, getSizingStyles, type SizingProps } from '@ui/sizing';
import {
  SPACING_PROPERTY_NAMES,
  getSpacingStyles,
  type SpacingProps,
} from '@ui/spacing';

export {
  SPACING_PROPERTY_NAMES,
  getSpacingStyles,
  getSpacingValue,
  type SpacingProps,
  type SpacingValue,
} from '@ui/spacing';

export {
  POSITIONING_PROPERTY_NAMES,
  getPositioningStyles,
  type InsetValue,
  type LayoutDisplay,
  type LayoutPosition,
  type PositioningProps,
} from '@ui/positioning';

export { SIZING_PROPERTY_NAMES, getSizingStyles, type SizingProps } from '@ui/sizing';

/**
 * LayoutProps — представляет объединённый набор layout-пропсов элемента.
 * Используется как основной тип для корневых компонентов с поддержкой layout.
 *
 * Объединяет три категории:
 *  - `SpacingProps` — отступы
 *  - `PositioningProps` — позиционирование и раскладка
 *  - `SizingProps` — размеры
 */
export type LayoutProps = SpacingProps & PositioningProps & SizingProps;

/**
 * LAYOUT_PROP_NAMES — объединяет имена всех layout-пропсов из трёх модулей.
 * Используется в `shouldForwardProp`, чтобы не передавать layout-пропсы на DOM-узел,
 * и в `splitLayoutProps` для отделения layout-пропсов от остальных.
 */
export const LAYOUT_PROP_NAMES = new Set<string>([
  ...SPACING_PROPERTY_NAMES,
  ...POSITIONING_PROPERTY_NAMES,
  ...SIZING_PROPERTY_NAMES,
]);

/**
 * splitLayoutProps — разделяет пропсы на layout и остальные.
 * Используется в компонентах-обёртках, когда layout-стили нужно применить к корневому
 * элементу, а остальные пропсы передать в DOM-узел или дочерний компонент.
 *
 * Результат содержит:
 *  - `layoutProps` — только layout-пропсы из `LAYOUT_PROP_NAMES`
 *  - `restProps` — все остальные пропсы без изменения типов
 *
 * @param props исходный объект пропсов, обычно все пропсы компонента
 * @returns объект с полями `layoutProps` и `restProps`
 *
 * @example
 * const { layoutProps, restProps } = splitLayoutProps(rest);
 */
export function splitLayoutProps<T extends Partial<LayoutProps>>(
  props: T
): { layoutProps: LayoutProps; restProps: Omit<T, keyof LayoutProps> } {
  const layoutProps: Record<string, unknown> = {};
  const restProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (LAYOUT_PROP_NAMES.has(key)) {
      layoutProps[key] = value;
    } else {
      restProps[key] = value;
    }
  }

  return {
    layoutProps: layoutProps as LayoutProps,
    restProps: restProps as Omit<T, keyof LayoutProps>,
  };
}

/**
 * getLayoutStyles — объединяет CSS-правила из модулей отступов, позиционирования и размеров.
 *
 * Как работает:
 * 1. Вызывает `getSpacingStyles`, `getPositioningStyles` и `getSizingStyles`
 * 2. Отбрасывает пустые результаты
 * 3. Склеивает оставшиеся правила через перенос строки
 * 4. Отдаёт результат для подстановки в CSS-шаблон styled-компонента
 *
 * @param props объект с layout-пропсами
 * @returns CSS-правила, каждое с новой строки
 */
export function getLayoutStyles(props: LayoutProps): string {
  return [getSpacingStyles(props), getPositioningStyles(props), getSizingStyles(props)]
    .filter(Boolean)
    .join('\n');
}

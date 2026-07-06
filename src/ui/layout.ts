/**
 * Файл: layout.ts
 * Этот файл является точкой входа для всех layout-утилит проекта.
 * Он объединяет функциональность из трёх модулей:
 * - spacing — отступы (margin, padding) с фиксированной шкалой в rem
 * - sizing — размеры (inlineSize, blockSize, min/max) со свободными строковыми значениями
 * - positioning — позиционирование и раскладка (flex, grid, position, inset)
 *
 * Основные задачи:
 * 1. Реэкспортировать публичный API дочерних модулей
 * 2. Определить объединённый тип LayoutProps
 * 3. Собрать единый набор имён LAYOUT_PROP_NAMES
 * 4. Предоставить функцию getLayoutStyles для генерации всех стилей сразу
 * 5. Предоставить функцию splitLayoutProps для разделения пропсов
 */

import {
  POSITIONING_PROP_NAMES,
  getPositioningStyles,
  type PositioningProps,
} from '@ui/positioning';
import { SIZING_PROP_NAMES, getSizingStyles, type SizingProps } from '@ui/sizing';
import { SPACING_PROP_NAMES, getSpacingStyles, type SpacingProps } from '@ui/spacing';

/**
 * Реэкспорты из модуля spacing (@ui/spacing)
 * Содержит утилиты для работы с отступами по фиксированной шкале.
 */
export {
  SPACING_PROP_NAMES,
  getSpacingStyles,
  spacingRem,
  type SpacingProps,
  type SpacingPx,
} from '@ui/spacing';

/**
 * Реэкспорты из модуля positioning (@ui/positioning)
 * Содержит утилиты для позиционирования, flexbox и grid.
 */
export {
  POSITIONING_PROP_NAMES,
  getPositioningStyles,
  type InsetValue,
  type LayoutDisplay,
  type LayoutPosition,
  type PositioningProps,
} from '@ui/positioning';

/**
 * Реэкспорты из модуля sizing (@ui/sizing)
 * Содержит утилиты для управления размерами элемента.
 */
export { SIZING_PROP_NAMES, getSizingStyles, type SizingProps } from '@ui/sizing';

/**
 * LayoutProps — объединённый тип всех пропсов для управления layout-элемента.
 * Включает в себя все пропсы из трёх категорий:
 * - SpacingProps — отступы (margin, padding)
 * - PositioningProps — позиционирование и раскладка (display, position, flex, grid)
 * - SizingProps — размеры (inlineSize, blockSize)
 *
 * Используется как основной тип для корневых компонентов, поддерживающих layout.
 */
export type LayoutProps = SpacingProps & PositioningProps & SizingProps;

/**
 * LAYOUT_PROP_NAMES — множество (Set) всех имён пропсов для layout.
 * Собирает имена из SPACING_PROP_NAMES, POSITIONING_PROP_NAMES и SIZING_PROP_NAMES.
 *
 * Используется для:
 * - shouldForwardProp в styled-components — чтобы не передавать layout-пропсы на DOM-узел
 * - splitLayoutProps — для отделения layout-пропсов от остальных
 *
 * Собран автоматически из трёх источников, что гарантирует синхронизацию
 * при добавлении новых пропсов в дочерние модули.
 */
export const LAYOUT_PROP_NAMES = new Set<string>([
  ...SPACING_PROP_NAMES,
  ...POSITIONING_PROP_NAMES,
  ...SIZING_PROP_NAMES,
]);

/**
 * getLayoutStyles — основная функция, которая объединяет стили из всех трёх модулей.
 *
 * Алгоритм работы:
 * 1. Вызывает getSpacingStyles, getPositioningStyles и getSizingStyles
 * 2. Каждая функция возвращает строку CSS-правил (или пустую строку)
 * 3. Фильтрует пустые строки
 * 4. Склеивает все строки через перенос строки
 *
 * Результат — единая строка со всеми CSS-стилями для переданных пропсов.
 *
 * @param props — объект с layout-пропсами (любой комбинацией из трёх категорий)
 * @returns строка с CSS-правилами, каждая с новой строки
 */
export function getLayoutStyles(props: LayoutProps): string {
  return [getSpacingStyles(props), getPositioningStyles(props), getSizingStyles(props)]
    .filter(Boolean)
    .join('\n');
}

/**
 * splitLayoutProps — утилита для разделения пропсов на две группы:
 * - layout — пропсы, относящиеся к layout (из LAYOUT_PROP_NAMES)
 * - rest — все остальные пропсы
 *
 * Используется в компонентах-обёртках, когда нужно отделить layout-стили
 * для корневого элемента от остальных пропсов (например, для передачи
 * атрибутов в DOM-узел или в дочерний компонент).
 *
 * Пример: StyledInputRoot принимает { value: 'text', padding: 16, ... }
 * splitLayoutProps отделит padding в layout, а value в rest.
 *
 * @param props — исходный объект пропсов (обычно все пропсы, переданные в компонент)
 * @returns объект с двумя полями:
 *   - layout — объект только с layout-пропсами
 *   - rest — объект со всеми остальными пропсами (без изменений типов)
 */
export function splitLayoutProps<T extends Partial<LayoutProps>>(
  props: T
): { layout: LayoutProps; rest: Omit<T, keyof LayoutProps> } {
  const layout: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (LAYOUT_PROP_NAMES.has(key)) {
      layout[key] = value;
    } else {
      rest[key] = value;
    }
  }

  return {
    layout: layout as LayoutProps,
    rest: rest as Omit<T, keyof LayoutProps>,
  };
}

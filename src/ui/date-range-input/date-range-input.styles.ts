/**
 * Файл: `src/ui/date-range-input/date-range-input.styles.ts`
 * Определяет внешний вид компонента DateRangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `DateRangeInputStyleProps`
 * 2. Предоставить styled-узлы `StyledDateRangeInputRoot`,
 *    `StyledDateRangeInputTriggerRow` и
 *    `StyledDateRangeInputPanel`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/date-range-input/index.tsx` — собирает компонент DateRangeInput
 */

import styled from 'styled-components';

import { getCssAnchorPlacementStyles } from '@ui/anchored-panel';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  getOpenControlRootStyles,
  getOpenControlStackedPanelStyles,
  getOpenControlTriggerRowStyles,
  type OpenControlSurfaceStyleProps,
} from '@ui/open-control';
import { type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * DateRangeInputStyleProps — представляет пропсы стилизации DateRangeInput и layout-пропсы.
 */
export type DateRangeInputStyleProps = LayoutProps & OpenControlSurfaceStyleProps;

/**
 * DATE_RANGE_INPUT_ROOT_PROP_NAMES — хранит имена layout-пропсов корня DateRangeInput.
 */
const DATE_RANGE_INPUT_ROOT_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES]);

/**
 * DATE_RANGE_INPUT_SURFACE_PROP_NAMES — хранит имена пропсов стилизации поверхности DateRangeInput.
 */
const DATE_RANGE_INPUT_SURFACE_PROP_NAMES = new Set<string>([
  'borderTone',
  'shape',
  'sizePreset',
]);

/**
 * StyledDateRangeInputRoot — задаёт корневой узел компонента DateRangeInput.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор и ширина
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledDateRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getOpenControlRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledDateRangeInputTriggerRow — задаёт ряд триггера компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `OpenControlSurfaceStyleProps`.
 *
 * Встроенные стили:
 *  - `grid-template-columns: minmax(0, 1fr) auto auto` при `[data-has-clear]` —
 *    сегменты, разделитель и сброс. Хелпер ряда даёт две колонки; третья
 *    пишется здесь, чтобы не усложнять общий хром open-control
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и
 *    `outline` фокуса
 */
export const StyledDateRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<OpenControlSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerRowStyles(props, 'trailing-only')}

  &[data-has-clear] {
    grid-template-columns: minmax(0, 1fr) auto auto;
  }
`;

/**
 * getDateRangeInputPanelStyles — возвращает CSS-правила для узла
 * `StyledDateRangeInputPanel`: стековый хром панели через
 * `getOpenControlStackedPanelStyles`, CSS-привязку к триггеру,
 * ограничение у края вьюпорта и запасные позиции `@position-try`.
 *
 * Как работает:
 * 1. Подставляет стековый хром панели через `getOpenControlStackedPanelStyles`
 * 2. Привязывает панель к триггеру через `getCssAnchorPlacementStyles` с
 *    `viewport-edge`
 * 3. Включает прокрутку `overflow-y: auto`
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputPanelStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme }
): string {
  return `
    ${getOpenControlStackedPanelStyles(props)}
    ${getCssAnchorPlacementStyles('viewport-edge')}
    min-inline-size: 0;
    overflow-y: auto;
  `;
}

/**
 * StyledDateRangeInputPanel — задаёт привязанную панель календаря компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `OpenControlSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getDateRangeInputPanelStyles` — стековый хром панели, CSS-привязка
 *    к триггеру, ограничение у края вьюпорта и запасные позиции `@position-try`
 */
export const StyledDateRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<OpenControlSurfaceStyleProps>`
  ${(props) => getDateRangeInputPanelStyles(props)}
`;

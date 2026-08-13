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

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  OPEN_CONTROL_PANEL_PADDING,
  OPEN_CONTROL_ROW_GAP,
  getOpenControlPortalPanelStyles,
  getOpenControlRootStyles,
  getOpenControlTriggerRowStyles,
  type OpenControlSurfaceStyleProps,
} from '@ui/open-control';
import { getSpacingValue } from '@ui/spacing';
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
const DATE_RANGE_INPUT_SURFACE_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * StyledDateRangeInputRoot — задаёт корневой узел компонента DateRangeInput.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор, ширина и подъём при открытии
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
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и
 *    `outline` фокуса
 */
export const StyledDateRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<OpenControlSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerRowStyles(props, 'trailing-only')}
`;

/**
 * getDateRangeInputPanelStyles — возвращает CSS-правила для узла
 * `StyledDateRangeInputPanel`: хром portal-панели через
 * `getOpenControlPortalPanelStyles` с отступом `OPEN_CONTROL_PANEL_PADDING`.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputPanelStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme }
): string {
  return getOpenControlPortalPanelStyles(
    props,
    getSpacingValue(OPEN_CONTROL_PANEL_PADDING)
  );
}

/**
 * StyledDateRangeInputPanel — задаёт портальную панель календаря компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `OpenControlSurfaceStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка календаря и ряда действий
 *  - `gap` — отступ между сеткой дней и SegmentButtonParts действий
 *  - `min-inline-size: 0` — предотвращает переполнение
 *
 * Генерация стилей:
 *  - `getDateRangeInputPanelStyles` — хром portal-панели через
 *    `getOpenControlPortalPanelStyles`
 */
export const StyledDateRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<OpenControlSurfaceStyleProps>`
  display: grid;
  gap: ${getSpacingValue(OPEN_CONTROL_ROW_GAP)};
  min-inline-size: 0;
  ${(props) => getDateRangeInputPanelStyles(props)}
`;

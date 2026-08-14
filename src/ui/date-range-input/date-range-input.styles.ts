/**
 * Файл: `src/ui/date-range-input/date-range-input.styles.ts`
 * Определяет внешний вид компонента DateRangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `DateRangeInputStyleProps`
 * 2. Предоставить styled-узлы `StyledDateRangeInputRoot`,
 *    `StyledDateRangeInputTriggerRow` и
 *    `StyledDateRangeInputPanel`
 * 3. Предоставить `DateRangeInputPositionTryStyle`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/date-range-input/index.tsx` — собирает компонент DateRangeInput
 */

import styled, { createGlobalStyle } from 'styled-components';

import { getCssAnchorBindingStyles } from '@ui/anchored-portal';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  getOpenControlRootStyles,
  getOpenControlStackedPortalPanelStyles,
  getOpenControlTriggerRowStyles,
  type OpenControlSurfaceStyleProps,
} from '@ui/open-control';
import { type AppTheme } from '@ui/theme';
import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

export { splitLayoutProps } from '@ui/layout';

/**
 * DATE_RANGE_INPUT_POSITION_TRY_ABOVE — задаёт имя запасной позиции панели над триггером.
 * Используется в `DATE_RANGE_INPUT_POSITION_TRY_CSS` и `getDateRangeInputPanelStyles`.
 */
const DATE_RANGE_INPUT_POSITION_TRY_ABOVE = '--date-range-input-above';

/**
 * DATE_RANGE_INPUT_POSITION_TRY_VIEWPORT — задаёт имя запасной позиции панели у края вьюпорта.
 * Используется в `DATE_RANGE_INPUT_POSITION_TRY_CSS` и `getDateRangeInputPanelStyles`.
 */
const DATE_RANGE_INPUT_POSITION_TRY_VIEWPORT = '--date-range-input-viewport';

/**
 * DATE_RANGE_INPUT_POSITION_TRY_CSS — задаёт запасные `@position-try` позиции панели DateRangeInput.
 * Первая позиция ставит панель над триггером, вторая прижимает к краю окна и ограничивает
 * высоту через `PORTAL_VIEWPORT_EDGE_INSET`.
 * Используется в `DateRangeInputPositionTryStyle`.
 */
const DATE_RANGE_INPUT_POSITION_TRY_CSS = `
  @position-try ${DATE_RANGE_INPUT_POSITION_TRY_ABOVE} {
    inset-block: auto anchor(start);
    margin-block: ${PORTAL_VIEWPORT_EDGE_INSET}px 0;
  }

  @position-try ${DATE_RANGE_INPUT_POSITION_TRY_VIEWPORT} {
    inset-block: ${PORTAL_VIEWPORT_EDGE_INSET}px auto;
    max-block-size: calc(100% - ${PORTAL_VIEWPORT_EDGE_INSET}px * 2);
    margin-block: 0;
  }
`;

/**
 * DateRangeInputPositionTryStyle — задаёт глобальные запасные `@position-try` позиции
 * панели DateRangeInput из `DATE_RANGE_INPUT_POSITION_TRY_CSS`.
 * Подключается в DateRangeInput из `src/ui/date-range-input/index.tsx`.
 */
export const DateRangeInputPositionTryStyle = createGlobalStyle`
  ${DATE_RANGE_INPUT_POSITION_TRY_CSS}
`;

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
 * `StyledDateRangeInputPanel`: стековый хром portal-панели через
 * `getOpenControlStackedPortalPanelStyles`, CSS-привязку к триггеру,
 * ограничение у края вьюпорта и запасные позиции `@position-try`.
 *
 * Как работает:
 * 1. Подставляет стековый хром панели через `getOpenControlStackedPortalPanelStyles`
 * 2. Привязывает панель к триггеру через `getCssAnchorBindingStyles`, `anchor(start)`,
 *    `clamp` по `PORTAL_VIEWPORT_EDGE_INSET` и `anchor-size(width)`
 * 3. Подставляет `position-try-fallbacks` из `DATE_RANGE_INPUT_POSITION_TRY_ABOVE` и
 *    `DATE_RANGE_INPUT_POSITION_TRY_VIEWPORT`
 * 4. Включает прокрутку `overflow-y: auto`
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputPanelStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme }
): string {
  return `
    ${getOpenControlStackedPortalPanelStyles(props)}
    ${getCssAnchorBindingStyles()}
    inset-block-start: anchor(start);
    inset-inline-start: clamp(
      ${PORTAL_VIEWPORT_EDGE_INSET}px,
      anchor(start),
      calc(100% - ${PORTAL_VIEWPORT_EDGE_INSET}px - anchor-size(width))
    );
    inline-size: anchor-size(width);
    min-inline-size: 0;
    margin-block-end: ${PORTAL_VIEWPORT_EDGE_INSET}px;
    overflow-y: auto;
    position-try-fallbacks: ${DATE_RANGE_INPUT_POSITION_TRY_ABOVE}, ${DATE_RANGE_INPUT_POSITION_TRY_VIEWPORT};
  `;
}

/**
 * StyledDateRangeInputPanel — задаёт портальную панель календаря компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `OpenControlSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getDateRangeInputPanelStyles` — стековый хром portal-панели, CSS-привязка
 *    к триггеру, ограничение у края вьюпорта и запасные позиции `@position-try`
 */
export const StyledDateRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<OpenControlSurfaceStyleProps>`
  ${(props) => getDateRangeInputPanelStyles(props)}
`;

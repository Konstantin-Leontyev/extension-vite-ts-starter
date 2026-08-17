/**
 * Файл: `src/ui/anchored-panel/position-try.ts`
 * Содержит запасные `@position-try` позиции панелей с CSS-привязкой к якорю.
 *
 * Основные задачи:
 * 1. Задать имена запасных позиций `ANCHORED_PANEL_POSITION_TRY_ABOVE` и
 *    `ANCHORED_PANEL_POSITION_TRY_VIEWPORT`
 * 2. Предоставить `AnchoredPanelPositionTryStyle`
 *
 * Потребители:
 *  - `src/context/theme/index.tsx` — подключает `AnchoredPanelPositionTryStyle`
 *  - `src/ui/anchored-panel/index.tsx` — реэкспортирует `AnchoredPanelPositionTryStyle`
 *  - `src/ui/anchored-panel/anchored-panel.styles.ts` — читает имена запасных позиций
 */

import { createGlobalStyle } from 'styled-components';

import { PANEL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

/**
 * ANCHORED_PANEL_POSITION_TRY_ABOVE — задаёт имя запасной `@position-try` позиции
 * перевёрнутой панели, накрывающей якорь.
 * Используется в `AnchoredPanelPositionTryStyle` и в `getCssAnchorPlacementStyles`.
 */
export const ANCHORED_PANEL_POSITION_TRY_ABOVE = '--anchored-panel-above';

/**
 * ANCHORED_PANEL_POSITION_TRY_VIEWPORT — задаёт имя запасной `@position-try` позиции
 * у верхнего края вьюпорта.
 * Используется в `AnchoredPanelPositionTryStyle` и в `getCssAnchorPlacementStyles`.
 */
export const ANCHORED_PANEL_POSITION_TRY_VIEWPORT = '--anchored-panel-viewport';

/**
 * AnchoredPanelPositionTryStyle — задаёт запасные `@position-try` позиции
 * панелей с CSS-привязкой к якорю.
 * Подключается в `ThemeProvider` из `src/context/theme/index.tsx`:
 * сначала `GlobalResetStyle`, затем `GlobalThemeStyle`,
 * затем `AnchoredPanelPositionTryStyle`.
 *
 * Устанавливает:
 *  - `--anchored-panel-above` — перевёрнутая панель накрывает якорь:
 *    нижний край панели к нижнему краю якоря, отступ
 *    `PANEL_VIEWPORT_EDGE_INSET` сверху
 *  - `--anchored-panel-viewport` — панель у верхнего края вьюпорта
 *    с ограничением высоты
 */
export const AnchoredPanelPositionTryStyle = createGlobalStyle`
  @position-try ${ANCHORED_PANEL_POSITION_TRY_ABOVE} {
    inset-block: auto anchor(end);
    margin-block: ${PANEL_VIEWPORT_EDGE_INSET}px 0;
  }

  @position-try ${ANCHORED_PANEL_POSITION_TRY_VIEWPORT} {
    inset-block: ${PANEL_VIEWPORT_EDGE_INSET}px auto;
    max-block-size: calc(100% - ${PANEL_VIEWPORT_EDGE_INSET}px * 2);
    margin-block: 0;
  }
`;

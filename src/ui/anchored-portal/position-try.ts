/**
 * Файл: `src/ui/anchored-portal/position-try.ts`
 * Содержит запасные `@position-try` позиции панелей с CSS-привязкой к якорю.
 *
 * Основные задачи:
 * 1. Задать имена запасных позиций `ANCHORED_PORTAL_POSITION_TRY_ABOVE` и
 *    `ANCHORED_PORTAL_POSITION_TRY_VIEWPORT`
 * 2. Предоставить `AnchoredPortalPositionTryStyle`
 *
 * Потребители:
 *  - `src/ui/anchored-portal/index.tsx` — подключает `AnchoredPortalPositionTryStyle`
 *    при открытой панели и реэкспортирует имена позиций
 */

import { createGlobalStyle } from 'styled-components';

import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

/**
 * ANCHORED_PORTAL_POSITION_TRY_ABOVE — задаёт имя запасной `@position-try` позиции
 * перевёрнутой панели, накрывающей якорь.
 * Используется в `AnchoredPortalPositionTryStyle` и в `position-try-fallbacks`
 * панелей Combobox, DateRangeInput и RangeInput.
 */
export const ANCHORED_PORTAL_POSITION_TRY_ABOVE = '--anchored-portal-above';

/**
 * ANCHORED_PORTAL_POSITION_TRY_VIEWPORT — задаёт имя запасной `@position-try` позиции
 * у верхнего края вьюпорта.
 * Используется в `AnchoredPortalPositionTryStyle` и в `position-try-fallbacks`
 * панелей Combobox, DateRangeInput и RangeInput.
 */
export const ANCHORED_PORTAL_POSITION_TRY_VIEWPORT = '--anchored-portal-viewport';

/**
 * AnchoredPortalPositionTryStyle — задаёт запасные `@position-try` позиции
 * панелей с CSS-привязкой к якорю.
 * Подключается в `AnchoredPortal` из `src/ui/anchored-portal/index.tsx` при
 * открытой панели.
 *
 * Устанавливает:
 *  - `--anchored-portal-above` — перевёрнутая панель накрывает якорь:
 *    нижний край панели к нижнему краю якоря, отступ
 *    `PORTAL_VIEWPORT_EDGE_INSET` сверху
 *  - `--anchored-portal-viewport` — панель у верхнего края вьюпорта
 *    с ограничением высоты
 */
export const AnchoredPortalPositionTryStyle = createGlobalStyle`
  @position-try ${ANCHORED_PORTAL_POSITION_TRY_ABOVE} {
    inset-block: auto anchor(end);
    margin-block: ${PORTAL_VIEWPORT_EDGE_INSET}px 0;
  }

  @position-try ${ANCHORED_PORTAL_POSITION_TRY_VIEWPORT} {
    inset-block: ${PORTAL_VIEWPORT_EDGE_INSET}px auto;
    max-block-size: calc(100% - ${PORTAL_VIEWPORT_EDGE_INSET}px * 2);
    margin-block: 0;
  }
`;

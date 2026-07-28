/**
 * Файл: `src/ui/shell.ts`
 * Задаёт общие метрики края вьюпорта для оболочки и оверлеев.
 *
 * Основные задачи:
 * 1. Экспортировать константу `VIEWPORT_EDGE_INSET`
 * 2. Экспортировать константу `PORTAL_VIEWPORT_EDGE_INSET`
 *
 * Потребители:
 *  - `@ui/sidebar` — зонный отступ края панели и контента
 *  - `@hooks/use-anchored-portal-position` — clamp в `placeCalendarPanel` и
 *    `clampPanelToViewport`
 *  - контролы с custom-позиционированием панели, например Listbox и Combobox —
 *    clamp панели от края вьюпорта
 *  - `src/components/profile-menu/index.tsx` — отступ панели от нижнего края вьюпорта
 *  - `src/pages/showcase/index.tsx` — отступ оболочки витрины
 */

import { type SpacingValue } from '@ui/spacing';

/**
 * VIEWPORT_EDGE_INSET — задаёт отступ от края вьюпорта для оболочки.
 * Ключ шкалы совпадает с px при root 16px — в JS-математике позиционирования
 * используется как число пикселей.
 */
export const VIEWPORT_EDGE_INSET: SpacingValue = 8;

/**
 * PORTAL_OUTLINE_OVERHANG_PX — задаёт вылет фокус-кольца панели за border-box:
 * `outline` 2px + `outline-offset` 2px из `getFocusRingStyles`.
 * Используется в `PORTAL_VIEWPORT_EDGE_INSET`.
 */
const PORTAL_OUTLINE_OVERHANG_PX = 4;

/**
 * PORTAL_VIEWPORT_EDGE_INSET — задаёт отступ clamp панелей портала от края вьюпорта.
 * Больше `VIEWPORT_EDGE_INSET` на вылет outline, чтобы кольцо оставалось внутри
 * отступа оболочки, а не заходило в него. Ключ шкалы совпадает с px при root 16px.
 */
export const PORTAL_VIEWPORT_EDGE_INSET: SpacingValue = (VIEWPORT_EDGE_INSET +
  PORTAL_OUTLINE_OVERHANG_PX) as SpacingValue;

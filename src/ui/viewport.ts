/**
 * Файл: `src/ui/viewport.ts`
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
 */

import { OUTLINE_OVERHANG_PX } from '@ui/outline';
import { type SpacingValue } from '@ui/spacing';

/**
 * VIEWPORT_EDGE_INSET — задаёт отступ от края вьюпорта для оболочки.
 * Ключ шкалы совпадает с px при root 16px — в JS-математике позиционирования
 * используется как число пикселей.
 */
export const VIEWPORT_EDGE_INSET: SpacingValue = 8;

/**
 * PORTAL_VIEWPORT_EDGE_INSET — задаёт отступ clamp панелей портала от края
 * вьюпорта: `VIEWPORT_EDGE_INSET` плюс вылет обводки, чтобы обводка панели
 * оставалась внутри отступа оболочки, а не заходила в него. Число px для
 * JS-математики позиционирования, в CSS-декларации не попадает.
 */
export const PORTAL_VIEWPORT_EDGE_INSET: number =
  VIEWPORT_EDGE_INSET + OUTLINE_OVERHANG_PX;

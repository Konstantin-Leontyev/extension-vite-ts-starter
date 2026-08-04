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
 *  - `src/context/toast/toast.styles.ts` — отступ контейнера уведомлений от края вьюпорта
 */

import { OUTLINE_OVERHANG_PX } from '@ui/outline';
import { type SpacingValue } from '@ui/spacing';

/**
 * VIEWPORT_EDGE_INSET — задаёт отступ от края вьюпорта для оболочки.
 * Ключ шкалы совпадает с px при root 16px — в JS-математике позиционирования
 * используется как число пикселей.
 * Используется в `@ui/sidebar` для зонного отступа края панели и контента и в
 * `src/context/toast/toast.styles.ts` для отступа контейнера уведомлений от края
 * вьюпорта.
 */
export const VIEWPORT_EDGE_INSET: SpacingValue = 8;

/**
 * PORTAL_VIEWPORT_EDGE_INSET — формирует отступ clamp панелей портала от края
 * вьюпорта из `VIEWPORT_EDGE_INSET` и `OUTLINE_OVERHANG_PX`, чтобы обводка панели
 * оставалась внутри отступа оболочки, а не заходила в него. Число px для
 * JS-математики позиционирования, в CSS-правиле не попадает.
 * Используется в `clampPanelToViewport` и `placeCalendarPanel` из
 * `@hooks/use-anchored-portal-position`, в контролах с custom-позиционированием
 * панели, например Listbox и Combobox, и в `src/components/profile-menu/index.tsx`.
 */
export const PORTAL_VIEWPORT_EDGE_INSET: number =
  VIEWPORT_EDGE_INSET + OUTLINE_OVERHANG_PX;

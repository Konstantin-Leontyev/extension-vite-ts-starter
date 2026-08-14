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
 *  - `@ui/listbox` — отступ в арифметике барабана
 *  - `@ui/combobox`, `@ui/date-range-input`, `@ui/range-input`,
 *    `src/components/profile-menu` и `src/ui/anchored-portal` —
 *    отступ CSS-привязки панели от края вьюпорта
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
 * CSS-привязки панелей и для арифметики барабана списка.
 * Используется в `@ui/listbox`, `@ui/combobox`, `@ui/date-range-input`,
 * `@ui/range-input`, `src/components/profile-menu` и
 * `src/ui/anchored-portal`.
 */
export const PORTAL_VIEWPORT_EDGE_INSET: number =
  VIEWPORT_EDGE_INSET + OUTLINE_OVERHANG_PX;

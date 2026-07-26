/**
 * Файл: `src/ui/shell.ts`
 * Задаёт общие метрики края вьюпорта для оболочки и оверлеев.
 *
 * Основные задачи:
 * 1. Экспортировать константу `VIEWPORT_EDGE_INSET`
 *
 * Потребители:
 *  - `@ui/sidebar` — зонный отступ края панели и контента
 *  - `@hooks/use-anchored-portal-position` — clamp в `placeCalendarPanel` и
 *    `clampPanelToViewport`
 *  - контролы с custom-позиционированием панели, например Listbox и Combobox —
 *    clamp панели от края вьюпорта
 *  - `src/components/profile-menu/index.tsx` — отступ панели от нижнего края вьюпорта
 *  - `src/pages/showcase/index.tsx` — padding оболочки витрины
 */

import { type SpacingValue } from '@ui/spacing';

/**
 * VIEWPORT_EDGE_INSET — задаёт отступ от края вьюпорта для оболочки и оверлеев.
 * Ключ шкалы совпадает с px при root 16px — в JS-математике позиционирования
 * используется как число пикселей.
 */
export const VIEWPORT_EDGE_INSET: SpacingValue = 8;

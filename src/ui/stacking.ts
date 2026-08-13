/**
 * Файл: `src/ui/stacking.ts`
 * Задаёт глобальную шкалу наложения слоёв оболочки.
 * Исключает локальные z-index внутри компонента, например `-1`, `0`, `1`, `2`:
 * они работают только внутри своего stacking context и в шкалу не входят.
 * Перечисляет шкалу снизу вверх со шагом 10 в ряду оболочки:
 *  - `STACKING_HEADER` — sticky-шапка
 *  - `STACKING_SIDEBAR` — выезжающая панель Sidebar на узком экране
 *
 * Основные задачи:
 * 1. Предоставить константы шкалы `STACKING_HEADER` и `STACKING_SIDEBAR`
 *
 * Потребители:
 *  - `src/components/header/header.styles.ts` — поднимает sticky-шапку над контентом
 *  - `src/ui/sidebar/sidebar.styles.ts` — поднимает панель Sidebar на узком экране
 */

/**
 * STACKING_HEADER — задаёт слой sticky-шапки над основным контентом.
 * Используется в `src/components/header/header.styles.ts`.
 */
export const STACKING_HEADER = 10;

/**
 * STACKING_SIDEBAR — задаёт слой выезжающей панели Sidebar на узком экране.
 * Используется в `src/ui/sidebar/sidebar.styles.ts`.
 */
export const STACKING_SIDEBAR = 20;

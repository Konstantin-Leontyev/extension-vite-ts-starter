/**
 * Файл: `src/ui/stacking.ts`
 * Задаёт глобальную шкалу наложения слоёв оболочки и оверлеев.
 * Исключает локальные z-index внутри компонента, например `-1`, `0`, `1`, `2`:
 * они работают только внутри своего stacking context и в шкалу не входят.
 *
 * Перечисляет шкалу снизу вверх. Шаг 10 в ряду оболочки. Портал и стек уведомлений —
 * отдельный ряд:
 *  - `STACKING_HEADER` — sticky-шапка
 *  - `STACKING_PROFILE_MENU` — fixed-меню профиля из шапки
 *  - `STACKING_SIDEBAR` — выезжающая панель сайдбара на узком экране
 *  - `STACKING_OPEN_CONTROL` — корень открытого контрола над соседями в потоке
 *  - `STACKING_PORTAL` — панель в `document.body`, например listbox, combobox,
 *    date-range-input и table
 *  - `STACKING_TOAST` — стек уведомлений над порталами
 *
 * Основные задачи:
 * 1. Экспортировать константы шкалы `STACKING_HEADER`, `STACKING_PROFILE_MENU`,
 *    `STACKING_SIDEBAR`, `STACKING_OPEN_CONTROL`, `STACKING_PORTAL` и `STACKING_TOAST`
 *
 * Потребители:
 *  - `src/components/header/header.styles.ts` — поднимает sticky-шапку над контентом
 *  - `src/components/profile-menu/index.tsx` — поднимает fixed-меню профиля над шапкой
 *  - `src/ui/sidebar/sidebar.styles.ts` — поднимает панель сайдбара на узком экране
 *  - контролы с `data-open` и панелями в портале, например listbox, combobox,
 *    date-range-input, range-input и table — поднимают корень и панель портала
 *  - `src/context/toast/toast.styles.ts` — поднимает стек уведомлений над порталами
 */

/**
 * STACKING_HEADER — задаёт слой sticky-шапки над основным контентом.
 */
export const STACKING_HEADER = 10;

/**
 * STACKING_PROFILE_MENU — задаёт слой fixed-меню профиля над шапкой.
 */
export const STACKING_PROFILE_MENU = 20;

/**
 * STACKING_SIDEBAR — задаёт слой выезжающей панели сайдбара на узком экране.
 */
export const STACKING_SIDEBAR = 30;

/**
 * STACKING_OPEN_CONTROL — задаёт слой корня открытого контрола над соседями в потоке.
 * Не путать со слоем панели в портале `STACKING_PORTAL`.
 */
export const STACKING_OPEN_CONTROL = 40;

/**
 * STACKING_PORTAL — задаёт слой панели в `document.body`,
 * например listbox, combobox, date-range-input, range-input и table.
 */
export const STACKING_PORTAL = 100;

/**
 * STACKING_TOAST — задаёт слой стека уведомлений над порталами.
 */
export const STACKING_TOAST = 150;

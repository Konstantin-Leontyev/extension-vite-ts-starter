/**
 * Файл: `src/ui/outline.ts`
 * Содержит обводку узла: генератор пары `outline` / `outline-offset` и метрики
 * обводки. Цвет задаёт вызывающий код токеном состояния: `focusOutline` для
 * `:focus-visible` и панелей, `invalidOutline` для невалидных полей.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getOutlineStyles`
 * 2. Экспортировать `OUTLINE_OFFSET` — отступ обводки по умолчанию
 * 3. Экспортировать `OUTLINE_OVERHANG_PX` — вылет обводки для JS-математики
 *
 * Потребители:
 *  - `src/ui/reset.ts` — глобальная обводка `:focus-visible`
 *  - styles-файлы контролов и панелей, например Switch, Stepper, Table
 *    и хром панели портала
 *  - `src/ui/segment-button-parts/segment-button-parts.styles.ts` — инверсия отступа
 *  - `src/ui/viewport.ts` — вылет обводки в отступе clamp панелей
 */

/**
 * OUTLINE_WIDTH_PX — задаёт толщину обводки в px. Источник для `OUTLINE_WIDTH`
 * и `OUTLINE_OVERHANG_PX`. Намеренно px, не шкала: обводка не растёт
 * с root font-size.
 */
const OUTLINE_WIDTH_PX = 2;

/**
 * OUTLINE_OFFSET_PX — задаёт отступ обводки от края узла в px.
 * Источник для `OUTLINE_OFFSET` и `OUTLINE_OVERHANG_PX`.
 */
const OUTLINE_OFFSET_PX = 2;

/**
 * OUTLINE_WIDTH — задаёт толщину обводки контролов и панелей.
 * Используется в `getOutlineStyles`.
 */
const OUTLINE_WIDTH = `${OUTLINE_WIDTH_PX}px`;

/**
 * OUTLINE_OFFSET — задаёт отступ обводки от края узла.
 * Используется в `getOutlineStyles` как значение по умолчанию.
 */
export const OUTLINE_OFFSET = `${OUTLINE_OFFSET_PX}px`;

/**
 * OUTLINE_OVERHANG_PX — задаёт вылет обводки за border-box: толщина плюс
 * отступ. Число px для JS-математики позиционирования — геометрия DOM
 * считается в px, в CSS-декларации не попадает.
 */
export const OUTLINE_OVERHANG_PX = OUTLINE_WIDTH_PX + OUTLINE_OFFSET_PX;

/**
 * getOutlineStyles — возвращает CSS-правила обводки: `outline` и
 * `outline-offset`. Толщина — `OUTLINE_WIDTH`. Отступ — `options.offset`
 * или `OUTLINE_OFFSET`.
 *
 * @param color цвет обводки, обычно `theme.colors.focusOutline` / `invalidOutline`
 * @param options опциональный `offset`, например инвертированный у Parts
 * @returns CSS-правила, каждое с новой строки
 */
export function getOutlineStyles(color: string, options?: { offset?: string }): string {
  const styles = [
    `outline: ${OUTLINE_WIDTH} solid ${color};`,
    `outline-offset: ${options?.offset ?? OUTLINE_OFFSET};`,
  ];

  return styles.join('\n');
}

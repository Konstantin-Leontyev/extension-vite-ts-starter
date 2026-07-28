/**
 * Файл: `src/ui/motion.ts`
 * Содержит генератор CSS-переходов и две сценарные длительности проекта.
 * Каркас оболочки, например шапка и сайдбар, передаёт `MOTION_SHELL_DURATION`.
 * Контролы передают `MOTION_CONTROL_DURATION`.
 * Под `prefers-reduced-motion` длительность удваивается через `calc`.
 * Не покрывает `animation`, например у Spinner — другой механизм.
 *
 * Основные задачи:
 * 1. Предоставить константы `MOTION_SHELL_DURATION` и `MOTION_CONTROL_DURATION`
 * 2. Предоставить функцию `getTransitionStyles`
 *
 * Потребители:
 *  - `src/ui/sidebar/sidebar.styles.ts` — анимирует выезд и сворачивание панели
 *  - `src/components/header/header.styles.ts` — анимирует сворачивание шапки в режиме `autoHide`
 *  - `src/ui/switch/switch.styles.ts` — ход заливки, рамки и бегунка
 *  - `src/ui/progress-bar/progress-bar.styles.ts` — ширина заливки
 *  - `src/ui/listbox/listbox.styles.ts` — hover фона опции
 *  - `src/ui/combobox/combobox.styles.ts` — hover фона опции
 *  - `src/ui/range-input/range-input.styles.ts` — hover фона пресета
 */

/**
 * MOTION_SHELL_DURATION — задаёт длительность переходов каркаса оболочки:
 * выезд панели Sidebar, сворачивание шапки.
 */
export const MOTION_SHELL_DURATION = '0.3s';

/**
 * MOTION_CONTROL_DURATION — задаёт длительность отклика контролов:
 * Switch, ProgressBar и hover строк-опций.
 */
export const MOTION_CONTROL_DURATION = '0.15s';

/**
 * MOTION_EASING — задаёт кривую переходов.
 * Используется в `getTransitionStyles`.
 */
const MOTION_EASING = 'ease';

/**
 * getTransitionStyles — возвращает CSS-правила перехода для указанных свойств.
 * Под `prefers-reduced-motion: reduce` длительность удваивается через `calc`.
 *
 * @param properties анимируемые CSS-свойства: одно или список через запятую
 * @param duration длительность перехода: `MOTION_SHELL_DURATION` или `MOTION_CONTROL_DURATION`
 * @returns CSS-правила, каждое с новой строки
 */
export function getTransitionStyles(properties: string, duration: string): string {
  const styles = [
    `transition: ${properties} ${duration} ${MOTION_EASING};`,
    `@media (prefers-reduced-motion: reduce) {`,
    `transition-duration: calc(${duration} * 2);`,
    `}`,
  ];

  return styles.join('\n');
}

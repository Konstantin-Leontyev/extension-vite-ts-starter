/**
 * Файл: `src/ui/motion.ts`
 * Содержит генератор CSS-переходов и две сценарные длительности проекта.
 * Не покрывает `animation`, например у Spinner — другой механизм.
 *
 * Основные задачи:
 * 1. Предоставить константы `MOTION_SHELL_DURATION` и `MOTION_CONTROL_DURATION`
 * 2. Предоставить функцию `getTransitionStyles`
 *
 * Потребители:
 *  - стили компонентов, например Sidebar — задают CSS-переходы через `getTransitionStyles`
 */

/**
 * MOTION_SHELL_DURATION — задаёт длительность переходов каркаса оболочки,
 * например выезда панели Sidebar и сворачивания шапки.
 * Используется как аргумент `duration` в вызовах `getTransitionStyles`.
 */
export const MOTION_SHELL_DURATION = '0.3s';

/**
 * MOTION_CONTROL_DURATION — задаёт длительность отклика контролов,
 * например Switch, ProgressBar и строк-опций при наведении.
 * Используется как аргумент `duration` в вызовах `getTransitionStyles`.
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
  return `
    transition: ${properties} ${duration} ${MOTION_EASING};

    @media (prefers-reduced-motion: reduce) {
      transition-duration: calc(${duration} * 2);
    }
  `;
}

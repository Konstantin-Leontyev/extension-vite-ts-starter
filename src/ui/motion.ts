/**
 * Файл: `src/ui/motion.ts`
 * Содержит генератор каркасных переходов оболочки.
 * Определяет единые длительность и кривую структурных анимаций: шапка и панель
 * сайдбара анимируются одним прогоном и обязаны совпадать.
 * Не покрывает микровзаимодействия, например `hover`, прогресс и ход тумблера Switch, —
 * они намеренно быстрее и задаются локально в стилях компонентов.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getShellTransitionStyles`
 *
 * Потребители:
 *  - `src/ui/sidebar/sidebar.styles.ts` — анимирует выезд и сворачивание панели
 *  - `src/components/header/header.styles.ts` — анимирует сворачивание шапки в режиме `autoHide`
 */

/**
 * SHELL_MOTION_DURATION — задаёт длительность каркасных анимаций оболочки.
 * Используется в `getShellTransitionStyles`.
 */
const SHELL_MOTION_DURATION = '0.3s';

/**
 * SHELL_MOTION_EASING — задаёт кривую каркасных анимаций оболочки.
 * Используется в `getShellTransitionStyles`.
 */
const SHELL_MOTION_EASING = 'ease';

/**
 * SHELL_MOTION_REDUCED_DURATION — задаёт длительность каркасных анимаций при
 * `prefers-reduced-motion`. Длительность удваивается, движение не отключается.
 * Используется в `getShellTransitionStyles`.
 */
const SHELL_MOTION_REDUCED_DURATION = '0.6s';

/**
 * getShellTransitionStyles — возвращает CSS-правила перехода для каркасного свойства.
 * Под `prefers-reduced-motion: reduce` длительность удваивается.
 *
 * @param property анимируемое CSS-свойство, например `transform`
 * @returns CSS-правила, каждое с новой строки
 */
export function getShellTransitionStyles(property: string): string {
  const styles = [
    `transition: ${property} ${SHELL_MOTION_DURATION} ${SHELL_MOTION_EASING};`,
    `@media (prefers-reduced-motion: reduce) {`,
    `transition-duration: ${SHELL_MOTION_REDUCED_DURATION};`,
    `}`,
  ];

  return styles.join('\n');
}

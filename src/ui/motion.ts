/**
 * Файл: `src/ui/motion.ts`
 * Содержит генератор CSS-переходов и две длительности проекта.
 * Каркас оболочки, например шапка и сайдбар, зовёт без длительности — дефолт `MOTION_DURATION`.
 * Микровзаимодействия передают `MOTION_MICRO_DURATION`.
 * Под `prefers-reduced-motion` длительность удваивается через `calc`.
 * Не покрывает `animation`, например у Spinner — другой механизм.
 *
 * Основные задачи:
 * 1. Предоставить константы `MOTION_DURATION` и `MOTION_MICRO_DURATION`
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
 * MOTION_DURATION — задаёт длительность переходов каркаса оболочки.
 * Дефолт `getTransitionStyles`, когда вызывающий код не передал длительность.
 */
export const MOTION_DURATION = '0.3s';

/**
 * MOTION_MICRO_DURATION — задаёт длительность микровзаимодействий.
 * Используется вторым аргументом `getTransitionStyles` в Switch, ProgressBar
 * и hover строк-опций.
 */
export const MOTION_MICRO_DURATION = '0.15s';

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
 * @param duration длительность перехода. По умолчанию `MOTION_DURATION`
 * @returns CSS-правила, каждое с новой строки
 */
export function getTransitionStyles(
  properties: string,
  duration: string = MOTION_DURATION
): string {
  const styles = [
    `transition: ${properties} ${duration} ${MOTION_EASING};`,
    `@media (prefers-reduced-motion: reduce) {`,
    `transition-duration: calc(${duration} * 2);`,
    `}`,
  ];

  return styles.join('\n');
}

/**
 * Файл: `src/icons/chevron-up.tsx`
 * Предоставляет svg-иконку шеврона вверх.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ChevronUpIcon
 *
 * Потребители:
 *  - `src/ui/stepper/index.tsx` — показывает стрелку увеличения
 *  - `src/pages/showcase/table-demo/index.tsx` — показывает состояние раскрытия строки
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

/**
 * ChevronUpIcon — отображает svg-иконку шеврона вверх.
 *
 * @example
 * <Icon>
 *   <ChevronUpIcon />
 * </Icon>
 */
export function ChevronUpIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 15L12 9L5 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Файл: `src/icons/chevron-right.tsx`
 * Предоставляет svg-иконку шеврона вправо.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ChevronRightIcon
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — показывает переход на следующий месяц
 */

/**
 * ChevronRightIcon — отображает svg-иконку шеврона вправо.
 *
 * @example
 * <Icon>
 *   <ChevronRightIcon />
 * </Icon>
 */
export function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5L15 12L9 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

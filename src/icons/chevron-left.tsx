/**
 * Файл: `src/icons/chevron-left.tsx`
 * Предоставляет svg-иконку шеврона влево.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ChevronLeftIcon
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — показывает переход на предыдущий месяц
 */

/**
 * ChevronLeftIcon — отображает svg-иконку шеврона влево.
 *
 * @example
 * <Icon>
 *   <ChevronLeftIcon />
 * </Icon>
 */
export function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L9 12L15 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

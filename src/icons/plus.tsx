/**
 * Файл: `src/icons/plus.tsx`
 * Предоставляет svg-иконку плюса.
 *
 * Основные задачи:
 * 1. Экспортировать компонент PlusIcon
 *
 * Потребители:
 *  - `src/ui/table/index.tsx` — показывает действие добавления строки в шапке и футере
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

/**
 * PlusIcon — отображает svg-иконку плюса.
 *
 * @example
 * <Icon>
 *   <PlusIcon />
 * </Icon>
 */
export function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12L19 12M12 5L12 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

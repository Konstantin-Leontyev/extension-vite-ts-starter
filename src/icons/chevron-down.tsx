/**
 * Файл: `src/icons/chevron-down.tsx`
 * Предоставляет svg-иконку шеврона вниз.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ChevronDownIcon
 *
 * Потребители:
 *  - контролы с раскрытием, например Listbox, Combobox и RangeInput — показывают направление
 *  - `src/ui/stepper/index.tsx` — показывает стрелку уменьшения
 *  - `src/pages/showcase/table-demo/index.tsx` — показывает состояние раскрытия строки
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

/**
 * ChevronDownIcon — отображает svg-иконку шеврона вниз.
 *
 * @example
 * <Icon>
 *   <ChevronDownIcon />
 * </Icon>
 */
export function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 9L12 15L5 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

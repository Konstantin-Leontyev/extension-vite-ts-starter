/**
 * Файл: `src/icons/check.tsx`
 * Предоставляет svg-иконку галочки.
 *
 * Основные задачи:
 * 1. Экспортировать компонент CheckIcon
 *
 * Потребители:
 *  - контролы выбора, например Listbox и Combobox — показывают выбранный пункт
 */

/**
 * CheckIcon — отображает svg-иконку галочки.
 *
 * @example
 * <Icon>
 *   <CheckIcon />
 * </Icon>
 */
export function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Файл: `src/icons/close.tsx`
 * Предоставляет svg-иконку закрытия.
 *
 * Основные задачи:
 * 1. Экспортировать компонент CloseIcon
 *
 * Потребители:
 *  - контролы с очисткой и закрытием, например Modal, DateRangeInput и RangeInput —
 *    показывают действие закрытия
 *  - `src/components/profile-menu/index.tsx` — показывает действие закрытия
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 *  - `src/icons/index.ts` — реэкспортирует `CloseIcon`
 */

/**
 * CloseIcon — отображает svg-иконку закрытия.
 *
 * @example
 * <Icon>
 *   <CloseIcon />
 * </Icon>
 */
export function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 5L5 19M5 5L19 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

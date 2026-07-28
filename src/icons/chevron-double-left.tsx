/**
 * Файл: `src/icons/chevron-double-left.tsx`
 * Предоставляет svg-иконку двойного шеврона влево.
 *
 * Основные задачи:
 * 1. Экспортировать компонент `ChevronDoubleLeftIcon`
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — навигация на предыдущий год
 *  - `src/icons/index.ts` — реэкспортирует `ChevronDoubleLeftIcon`
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * ChevronDoubleLeftIcon — отображает svg-иконку двойного шеврона влево.
 *
 * @example
 * <Icon>
 *   <ChevronDoubleLeftIcon />
 * </Icon>
 */
export function ChevronDoubleLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <path
          d="M13 19L7 12L13 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M16.9998 19L10.9998 12L16.9998 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

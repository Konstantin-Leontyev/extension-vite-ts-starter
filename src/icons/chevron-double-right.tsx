/**
 * Файл: `src/icons/chevron-double-right.tsx`
 * Предоставляет svg-иконку двойного шеврона вправо.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ChevronDoubleRightIcon
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — показывает переход на следующий год
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * ChevronDoubleRightIcon — отображает svg-иконку двойного шеврона вправо.
 *
 * @example
 * <Icon>
 *   <ChevronDoubleRightIcon />
 * </Icon>
 */
export function ChevronDoubleRightIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <path
          d="M11 19L17 12L11 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M6.99976 19L12.9998 12L6.99976 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

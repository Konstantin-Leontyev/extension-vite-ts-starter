/**
 * Файл: `src/icons/clock.tsx`
 * Предоставляет svg-иконку часов.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ClockIcon
 *
 * Потребители:
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * ClockIcon — отображает svg-иконку часов.
 *
 * @example
 * <Icon>
 *   <ClockIcon />
 * </Icon>
 */
export function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M12 8V12L14.5 14.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

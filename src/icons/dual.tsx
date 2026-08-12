/**
 * Файл: `src/icons/dual.tsx`
 * Предоставляет svg-иконку dual-текста.
 *
 * Основные задачи:
 * 1. Экспортировать компонент DualIcon
 *
 * Потребители:
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * DualIcon — отображает svg-иконку dual-текста.
 *
 * @example
 * <Icon>
 *   <DualIcon />
 * </Icon>
 */
export function DualIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path d="M19 14L5 14" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M19 6L5 6" strokeLinecap="round" strokeWidth="1.5" />
      </g>
      <g stroke="currentColor">
        <path d="M19 10L5 10" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M19 18L5 18" strokeLinecap="round" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

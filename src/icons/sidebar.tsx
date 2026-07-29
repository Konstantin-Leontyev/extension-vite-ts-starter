/**
 * Файл: `src/icons/sidebar.tsx`
 * Предоставляет svg-иконку боковой панели.
 *
 * Основные задачи:
 * 1. Экспортировать компонент SidebarIcon
 *
 * Потребители:
 *  - `src/ui/sidebar/index.tsx` — показывает кнопку открытия панели
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * SidebarIcon — отображает svg-иконку боковой панели.
 *
 * @example
 * <Icon>
 *   <SidebarIcon />
 * </Icon>
 */
export function SidebarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path d="M15 21L15 3" strokeLinecap="round" strokeWidth="1.5" />
      </g>
      <g stroke="currentColor">
        <path
          d="M2 11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H14C17.7712 3 19.6569 3 20.8284 4.17157C22 5.34315 22 7.22876 22 11V13C22 16.7712 22 18.6569 20.8284 19.8284C19.6569 21 17.7712 21 14 21H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V11Z"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

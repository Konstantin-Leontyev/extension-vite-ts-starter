/**
 * Файл: `src/icons/avatar.tsx`
 * Предоставляет svg-иконку аватара.
 *
 * Основные задачи:
 * 1. Экспортировать компонент AvatarIcon
 *
 * Потребители:
 *  - `src/components/profile-menu/index.tsx` — показывает аватар в меню
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * AvatarIcon — отображает svg-иконку аватара.
 *
 * @example
 * <Icon>
 *   <AvatarIcon />
 * </Icon>
 */
export function AvatarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"
          strokeWidth="1.5"
        />
      </g>
      <g stroke="currentColor">
        <circle cx="12" cy="6" r="4" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

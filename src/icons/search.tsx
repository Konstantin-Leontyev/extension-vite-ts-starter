/**
 * Файл: `src/icons/search.tsx`
 * Предоставляет svg-иконку поиска.
 *
 * Основные задачи:
 * 1. Экспортировать компонент SearchIcon
 *
 * Потребители:
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 *  - `src/icons/index.ts` — реэкспортирует `SearchIcon`
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * SearchIcon — отображает svg-иконку поиска.
 *
 * @example
 * <Icon>
 *   <SearchIcon />
 * </Icon>
 */
export function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <circle cx="11.5" cy="11.5" r="9.5" strokeWidth="1.5" />
      </g>
      <g stroke="currentColor">
        <path d="M20 20L22 22" strokeLinecap="round" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

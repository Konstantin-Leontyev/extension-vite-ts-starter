/**
 * Файл: `src/icons/contrast.tsx`
 * Предоставляет svg-иконку контраста.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ContrastIcon
 *
 * Потребители:
 *  - `src/components/theme-toggle/index.tsx` — показывает переключение темы
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * ContrastIcon — отображает svg-иконку контраста.
 *
 * @example
 * <Icon>
 *   <ContrastIcon />
 * </Icon>
 */
export function ContrastIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor" opacity={ICON_MUTED_LAYER_OPACITY}>
        <path d="M12 2a10 10 0 0 1 0 20Z" />
      </g>
      <g stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

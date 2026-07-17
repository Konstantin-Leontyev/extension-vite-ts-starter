/**
 * Файл: `src/icons/upload.tsx`
 * Предоставляет svg-иконку загрузки.
 *
 * Основные задачи:
 * 1. Экспортировать компонент `UploadIcon`
 *
 * Потребители:
 *  - `src/pages/design-system/showcase-icon-options.tsx` — включает в опции витрины
 *  - `src/icons/index.ts` — реэкспортирует `UploadIcon`
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * UploadIcon — отображает svg-иконку загрузки.
 *
 * @example
 * <Icon>
 *   <UploadIcon />
 * </Icon>
 */
export function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
      <g stroke="currentColor">
        <path
          d="M12 16V3M12 3L16 7.375M12 3L8 7.375"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

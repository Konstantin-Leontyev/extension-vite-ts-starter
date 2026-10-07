/**
 * Файл: `src/icons/subtitles.tsx`
 * Предоставляет svg-иконку субтитров.
 *
 * Основные задачи:
 * 1. Экспортировать компонент SubtitlesIcon
 *
 * Потребители:
 *  - `src/pages/showcase/showcase-icon-options.tsx` — включает в опции витрины
 */

import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

/**
 * SubtitlesIcon — отображает svg-иконку субтитров.
 *
 * @example
 * <Icon>
 *   <SubtitlesIcon />
 * </Icon>
 */
export function SubtitlesIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <path
          d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
          strokeWidth="1.5"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor" strokeLinecap="round">
        <path d="M10 17H6" strokeWidth="1.5" />
        <path d="M14 13.25H18" strokeWidth="1.5" />
        <path d="M14 17H12.5" strokeWidth="1.5" />
        <path d="M9.5 13.25H11.5" strokeWidth="1.5" />
        <path d="M18 17H16.5" strokeWidth="1.5" />
        <path d="M6 13.25H7" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

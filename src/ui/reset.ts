/**
 * Файл: reset.ts
 * Глобальные стили сброса и нормализации для всего приложения.
 * Базируется на styled-normalize и расширяет его кастомными правилами.
 *
 * Что здесь настроено:
 * - box-sizing: border-box для всех элементов
 * - Скроллбар с тонкой полосой и цветом из темы
 * - Базовая сетка для body (grid-оболочка приложения: шапка + контент)
 * - Сброс отступов у заголовков, параграфов, списков
 * - Удаление маркеров у списков
 * - Блочное отображение для мультимедиа; svg — базовый габарит 24×24 (viewBox набора)
 * - Наследование шрифта и цвета для форм
 * - Стили для кнопок (убраны дефолтные бордеры и фон)
 * - Состояния disabled (opacity + cursor)
 * - Стили для ссылок (цвет, подчёркивание, hover/focus)
 * - Фокус-кольца для интерактивных элементов (с цветами из темы)
 * - Стили для полей ввода с aria-invalid="true"
 * - Утилитарный класс .visually-hidden для скрытия элементов
 *   визуально, но с сохранением доступности для скринридеров
 */

import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { getSpacingValue } from '@ui/spacing';
import { DISABLED_OPACITY, getTheme } from '@ui/theme';

/**
 * GlobalResetStyle — компонент для внедрения глобальных стилей.
 * createGlobalStyle из styled-components создаёт <style> в <head>,
 * который применяется ко всему приложению.
 * ${normalize} вставляет базовый сброс браузерных стилей,
 * а последующие правила переопределяют и дополняют его.
 *
 * Подключается один раз в ThemeProvider (`context/theme/index.tsx`):
 * сначала GlobalResetStyle, затем GlobalThemeStyle.
 */
export const GlobalResetStyle = createGlobalStyle`
  ${normalize}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Скроллбар: thin + scrollbar-color — бегунок из токена темы, прозрачный трек. */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${(props) => getTheme(props).colors.scrollbarThumb} transparent;
  }

  html {
    text-size-adjust: 100%;
  }

  body {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    min-inline-size: 320px;
    min-block-size: 100dvb;
    margin: 0;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  li,
  blockquote,
  figure {
    padding: 0;
    margin: 0;
  }

  ul,
  ol {
    list-style: none;
  }

  img,
  picture,
  svg,
  video,
  canvas {
    display: block;
    max-inline-size: 100%;
  }

  svg {
    inline-size: ${getSpacingValue(24)};
    block-size: ${getSpacingValue(24)};
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: none;
  }

  button:disabled,
  input:disabled {
    cursor: not-allowed;
    opacity: ${DISABLED_OPACITY};
  }

  a {
    color: inherit;
    text-decoration: none;
    text-decoration-skip-ink: auto;
  }

  a:not(:disabled):hover,
  a:focus-visible {
    color: ${(props) => getTheme(props).colors.primary};
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid ${(props) => getTheme(props).colors.focusRing};
    outline-offset: 2px;
  }

  input[aria-invalid='true'],
  input[aria-invalid='true']:focus,
  input[aria-invalid='true']:focus-visible,
  textarea[aria-invalid='true'],
  textarea[aria-invalid='true']:focus,
  textarea[aria-invalid='true']:focus-visible,
  select[aria-invalid='true'],
  select[aria-invalid='true']:focus,
  select[aria-invalid='true']:focus-visible {
    outline: 2px solid ${(props) => getTheme(props).colors.invalidRing};
    outline-offset: 2px;
  }

  .visually-hidden {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
    clip-path: inset(50%);
  }
`;

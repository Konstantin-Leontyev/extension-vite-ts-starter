/**
 * Файл: `src/ui/reset.ts`
 * Определяет глобальный сброс и нормализацию стилей браузера для всего приложения.
 *
 * Основные задачи:
 * 1. Предоставить глобальные стили сброса через `GlobalResetStyle`
 *
 * Потребители:
 *  - `ThemeProvider` из `src/context/theme/index.tsx` — подключает `GlobalResetStyle`
 *    один раз на всё приложение
 */

import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { getOutlineStyles } from '@ui/outline';
import { DISABLED_OPACITY, getTheme } from '@ui/theme';

/**
 * APP_MIN_INLINE_SIZE — задаёт минимальную ширину приложения.
 * Используется в `GlobalResetStyle`.
 */
const APP_MIN_INLINE_SIZE = '320px';

/**
 * GlobalResetStyle — задаёт сброс и нормализацию браузерных стилей.
 * `createGlobalStyle` создаёт `<style>` в `<head>`, действующий на всё приложение.
 * `${normalize}` вставляет базовый сброс из styled-normalize.
 * Последующие правила переопределяют и дополняют его.
 * Подключается в `ThemeProvider` из `src/context/theme/index.tsx`:
 * сначала `GlobalResetStyle`, затем `GlobalThemeStyle`.
 *
 * Устанавливает:
 *  - `box-sizing: border-box` для всех элементов
 *  - скроллбар через `scrollbar-width: thin` и `scrollbar-color` —
 *    бегунок из темы, прозрачный трек
 *  - базовую сетку для `<body>` — grid-оболочка приложения: шапка и контент
 *  - сброс отступов у заголовков, параграфов, списков и удаление маркеров списков
 *  - блочное отображение и зажим мультимедиа по обеим осям через
 *    `max-inline-size: 100%` и `max-block-size: 100%` для `<img>`, `<picture>`,
 *    `<video>`, `<canvas>`, `<svg>`
 *  - наследование шрифта и цвета для элементов форм
 *  - сброс UA `padding-block` у `input`, `textarea` и `select` —
 *    высоту однострочного контрола держит `min-block-size`, вертикальный
 *    отступ задаёт компонент при многострочной модели
 *  - сброс дефолтных рамок и фона кнопок
 *  - состояния `disabled` — курсор и прозрачность из `DISABLED_OPACITY`.
 *    Три контракта. `:disabled` — сам нативный элемент. `label:has(:disabled)` —
 *    label-обёртка контрола с подписью. `[data-disabled]` — оболочка композитного
 *    контрола, объявляющая состояние атрибутом. Двойное приглушение `input`
 *    и `button` внутри обёрток компенсируется `opacity: 1`
 *  - стили для ссылок: цвет, подчёркивание, наведение, фокус
 *  - обводку `outline` и `outline-offset` для `:focus-visible` интерактивных
 *    элементов через `getOutlineStyles` с цветом `focusOutline` из темы
 *  - ту же обводку для полей с `aria-invalid="true"` через `getOutlineStyles`
 *    с цветом `invalidOutline` из темы
 *  - утилитарный класс `.visually-hidden` — скрывает элемент визуально,
 *    сохраняя доступность для скринридеров
 */
export const GlobalResetStyle = createGlobalStyle`
  ${normalize}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

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
    min-inline-size: ${APP_MIN_INLINE_SIZE};
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
    max-block-size: 100%;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  input,
  textarea,
  select {
    padding-block: 0;
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

  label:has(:disabled),
  [data-disabled] {
    cursor: not-allowed;
    opacity: ${DISABLED_OPACITY};
  }

  :is(label:has(:disabled), [data-disabled]) :is(input, button):disabled {
    opacity: 1;
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
    ${(props) => getOutlineStyles(getTheme(props).colors.focusOutline)}
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
    ${(props) => getOutlineStyles(getTheme(props).colors.invalidOutline)}
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

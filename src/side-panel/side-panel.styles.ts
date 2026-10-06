/**
 * Файл: `src/side-panel/side-panel.styles.ts`
 * Определяет внешний вид компонента SidePanelApp.
 *
 * Основные задачи:
 * 1. Предоставить глобальные стили `GlobalSidePanelStyle`
 * 2. Предоставить styled-узел `StyledSidePanel`
 *
 * Потребители:
 *  - `src/side-panel/app.tsx` — собирает компонент SidePanelApp
 */

import styled, { createGlobalStyle } from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * GlobalSidePanelStyle — задаёт прозрачный фон страницы `chrome.sidePanel`.
 * Перекрывает заливку `<body>` из `GlobalThemeStyle`, чтобы была видна
 * собственная заливка панели браузера, а не фон темы.
 * Подключается в `SidePanelApp` из `src/side-panel/app.tsx`.
 *
 * Устанавливает:
 *  - `background-color: transparent` на `<html>` и `<body>` — страница без собственной заливки
 */
export const GlobalSidePanelStyle = createGlobalStyle`
  html,
  body {
    background-color: transparent;
  }
`;

/**
 * StyledSidePanel — задаёт корневой узел компонента SidePanelApp.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка страницы по умолчанию
 *  - `gap` — отступ между детьми
 */
export const StyledSidePanel = styled.main`
  display: grid;
  gap: ${getSpacingValue(12)};
`;

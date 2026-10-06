/**
 * Файл: `src/side-panel/main.tsx`
 * Монтирует страницу `chrome.sidePanel` и подключает провайдер темы.
 *
 * Основные задачи:
 * 1. Монтировать React-приложение в узел `#root`
 * 2. Обернуть страницу `chrome.sidePanel` в `ThemeProvider`
 *
 * Потребители:
 *  - `src/side-panel/index.html` — подключает скрипт точки входа
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@context/theme';

import { SidePanelApp } from './app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SidePanelApp />
    </ThemeProvider>
  </StrictMode>
);

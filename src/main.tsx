/**
 * Файл: `src/main.tsx`
 * Монтирует корень React-приложения и подключает провайдеры контекста.
 *
 * Основные задачи:
 * 1. Монтировать React-приложение в узел `#root`
 * 2. Обернуть приложение в `ThemeProvider`
 * 3. Обернуть приложение в `ToastProvider`
 * 4. Подключить маршрутизацию через `RouterProvider`
 *
 * Потребители:
 *  - `index.html` в корне проекта — подключает скрипт точки входа
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@components/router';
import { ThemeProvider } from '@context/theme';
import { ToastProvider } from '@context/toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);

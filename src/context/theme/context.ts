/**
 * Файл: `src/context/theme/context.ts`
 * Определяет контекст темы приложения.
 *
 * Основные задачи:
 * 1. Типизировать режим темы через `ThemeMode`
 * 2. Типизировать API чтения и переключения темы через `ThemeContextValue`
 * 3. Предоставить контекст `ThemeContext`
 *
 * Потребители:
 *  - `src/context/theme/index.tsx` — наполняет контекст в `ThemeProvider`
 *  - `src/hooks/use-theme-mode.ts` — читает контекст в хуке `useThemeMode`
 */

import { createContext } from 'react';

/** ThemeMode — представляет режим темы. */
export type ThemeMode = 'dark' | 'light';

/**
 * ThemeContextValue — представляет API контекста темы.
 *
 * @property mode — текущий режим темы
 * @property onThemeChange — обработчик переключения режима темы
 */
export type ThemeContextValue = {
  mode: ThemeMode;
  onThemeChange: () => void;
};

/**
 * ThemeContext — предоставляет доступ к API чтения и переключения темы.
 * Читается через хук `useThemeMode`, который проверяет наличие провайдера.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

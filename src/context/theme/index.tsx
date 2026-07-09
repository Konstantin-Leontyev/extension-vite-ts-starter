/**
 * Файл: context/theme/index.tsx
 * Провайдер темы для приложения.
 * Управляет состоянием темы, синхронизирует с localStorage и подключает styled-components.
 *
 * Основные задачи:
 * 1. Хранить текущий режим темы в состоянии
 * 2. Сохранять выбор темы в localStorage (переживает перезагрузку)
 * 3. Подключать глобальные стили (GlobalResetStyle + GlobalThemeStyle)
 * 4. Предоставлять API для переключения темы через контекст
 *
 * Потребители: корень приложения (`main.tsx`).
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { GlobalResetStyle } from '@ui/reset';
import {
  GlobalThemeStyle,
  styledDarkTheme,
  styledLightTheme,
  type AppTheme,
} from '@ui/theme';

import { ThemeContext, type ThemeContextValue, type ThemeMode } from './context';

type ThemeProviderProps = {
  children: ReactNode;
};

/** Ключ, под которым выбранная тема переживает перезагрузку страницы. */
const THEME_STORAGE_KEY = 'app-theme';

/**
 * readStoredMode — читает сохранённую тему из localStorage.
 * При отсутствии значения или некорректном формате возвращает светлую тему.
 *
 * @returns сохранённый режим темы или 'light'
 */
function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return stored === 'dark' || stored === 'light' ? stored : 'light';
}

/**
 * ThemeProvider — провайдер темы для всего приложения.
 * Оборачивает приложение, предоставляет доступ к теме через контекст
 * и подключает глобальные стили.
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode);

  /* Сохраняем выбор темы — побочный эффект без влияния на разметку. */
  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const theme: AppTheme = mode === 'light' ? styledLightTheme : styledDarkTheme;

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      mode,
      onThemeChange: () => {
        setMode((current) => (current === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        <GlobalResetStyle />
        <GlobalThemeStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

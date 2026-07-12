/**
 * Файл: `src/context/theme/index.tsx`
 * Предоставляет компонент ThemeProvider для управления темой приложения.
 * Хранит выбранный режим темы и передаёт его в styled-components.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ThemeProvider
 * 2. Типизировать пропсы через `ThemeProviderProps`
 * 3. Сохранять выбор темы в `localStorage`, чтобы он переживал перезагрузку
 * 4. Подключать глобальные стили: сначала `GlobalResetStyle`, затем `GlobalThemeStyle`
 * 5. Предоставлять API переключения темы через `ThemeContext`
 *
 * Потребители:
 *  - `src/main.tsx` — оборачивает приложение провайдером
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

/**
 * ThemeProviderProps — представляет пропсы компонента ThemeProvider.
 *
 * @property children — дочерние элементы приложения
 */
type ThemeProviderProps = {
  children: ReactNode;
};

/** THEME_STORAGE_KEY — задаёт ключ для сохранения выбранной темы в `localStorage`. */
const THEME_STORAGE_KEY = 'app-theme';

/**
 * readStoredMode — возвращает сохранённый режим темы из `localStorage`.
 * При отсутствии значения или некорректном формате возвращает светлую тему.
 *
 * @returns сохранённый режим темы или `light`
 */
function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return stored === 'dark' || stored === 'light' ? stored : 'light';
}

/**
 * ThemeProvider — оборачивает приложение контекстом темы.
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode);

  // Сохраняет выбор темы — побочный эффект без влияния на разметку
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

/**
 * Файл: `src/hooks/use-theme.ts`
 * Предоставляет чтение и переключение темы из `ThemeContext`.
 *
 * Основные задачи:
 * 1. Предоставить хук `useTheme`
 *
 * Потребители:
 *  - `src/components/theme-toggle/index.tsx` — читает режим темы и переключает его
 */

import { useContext } from 'react';

import { ThemeContext, type ThemeContextValue } from '@context/theme/context';

/**
 * useTheme — возвращает API чтения и переключения темы из `ThemeContext`.
 * Без `ThemeProvider` выбрасывает ошибку.
 *
 * @returns значение контекста темы
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

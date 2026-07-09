/**
 * Файл: context/theme/context.ts
 * Контекст для управления темой приложения (светлая/тёмная).
 *
 * Основные задачи:
 * 1. Определить тип ThemeMode — режим темы
 * 2. Определить тип ThemeContextValue — API для чтения и переключения темы
 * 3. Предоставить контекст ThemeContext
 *
 * Потребители: компоненты приложения через хук-обёртку,
 * ThemeProvider в корне приложения.
 */

import { createContext } from 'react';

/** Режим темы: светлая или тёмная. */
export type ThemeMode = 'dark' | 'light';

/** API контекста темы — текущий режим и функция переключения. */
export type ThemeContextValue = {
  mode: ThemeMode;
  onThemeChange: () => void;
};

/**
 * ThemeContext — контекст для доступа к текущей теме и переключения.
 * Используется через хук-обёртку, проверяющую наличие провайдера.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

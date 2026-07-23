/**
 * Файл: `src/components/router/use-shell-outlet-context.ts`
 * Предоставляет тип и хук для чтения контекста outlet каркаса приложения.
 *
 * Основные задачи:
 * 1. Типизировать контекст через `ShellOutletContext`
 * 2. Предоставить хук `useShellOutletContext`
 *
 * Потребители:
 *  - `src/components/router/router-layout.tsx` — формирует контекст outlet по типу `ShellOutletContext`
 *  - `src/pages/showcase/index.tsx` — переключает режим шапки в витрине
 */

import { useOutletContext } from 'react-router-dom';

/**
 * ShellOutletContext — представляет контекст outlet каркаса приложения.
 * Поля `autoHide` и `isHeaderSettingsOpen` нужны витрине дизайн-системы для настройки
 * шапки в реальном времени.
 *
 * @property autoHide — включает автоскрытие шапки
 * @property isHeaderSettingsOpen — включает открытое состояние панели настроек шапки в витрине
 * @property setAutoHide — меняет значение `autoHide`
 * @property setIsHeaderSettingsOpen — меняет значение `isHeaderSettingsOpen`
 */
export type ShellOutletContext = {
  autoHide: boolean;
  isHeaderSettingsOpen: boolean;
  setAutoHide: (value: boolean) => void;
  setIsHeaderSettingsOpen: (value: boolean) => void;
};

/**
 * useShellOutletContext — возвращает контекст outlet каркаса приложения.
 *
 * @returns контекст с состоянием шапки и функциями его изменения
 */
export function useShellOutletContext(): ShellOutletContext {
  return useOutletContext<ShellOutletContext>();
}

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
 *  - `src/pages/design-system/index.tsx` — переключает режим хедера в витрине
 */

import { useOutletContext } from 'react-router-dom';

/**
 * ShellOutletContext — представляет контекст outlet каркаса приложения.
 * Поля `autoHide` и `headerSettingsOpen` нужны витрине дизайн-системы для настройки
 * хедера в реальном времени.
 *
 * @property autoHide — включает автоскрытие шапки
 * @property headerSettingsOpen — включает панель настроек хедера в витрине
 * @property setAutoHide — меняет значение `autoHide`
 * @property setHeaderSettingsOpen — меняет значение `headerSettingsOpen`
 */
export type ShellOutletContext = {
  autoHide: boolean;
  headerSettingsOpen: boolean;
  setAutoHide: (value: boolean) => void;
  setHeaderSettingsOpen: (value: boolean) => void;
};

/**
 * useShellOutletContext — возвращает контекст outlet каркаса приложения.
 *
 * @returns контекст с состоянием шапки и функциями его изменения
 */
export function useShellOutletContext(): ShellOutletContext {
  return useOutletContext<ShellOutletContext>();
}

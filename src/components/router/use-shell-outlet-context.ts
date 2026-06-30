import { useOutletContext } from 'react-router-dom';

/**
 * Каркас (RouterLayout) хранит вид хедера и отдаёт его страницам через Outlet context.
 * Поля autoHide и headerSettingsOpen нужны только странице дизайн-системы — она вживую
 * переключает режим хедера. Обычным страницам этот контекст не нужен.
 */
export type ShellOutletContext = {
  autoHide: boolean;
  headerSettingsOpen: boolean;
  setAutoHide: (value: boolean) => void;
  setHeaderSettingsOpen: (value: boolean) => void;
};

export function useShellOutletContext(): ShellOutletContext {
  return useOutletContext<ShellOutletContext>();
}

import { useOutletContext } from 'react-router-dom';

/**
 * Вид хедера живёт в каркасе (RouterLayout) и отдаётся страницам через Outlet.
 * `autoHide` / `headerSettingsOpen` нужны витрине ДС; продуктовым страницам — не обязательны.
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

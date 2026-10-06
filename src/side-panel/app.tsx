/**
 * Файл: `src/side-panel/app.tsx`
 * Предоставляет компонент SidePanelApp для отображения страницы `chrome.sidePanel`.
 *
 * Основные задачи:
 * 1. Экспортировать компонент SidePanelApp
 *
 * Потребители:
 *  - `src/side-panel/main.tsx` — монтирует `SidePanelApp`
 */

import { CloseIcon, SearchIcon, SettingsIcon } from '@icons';
import { Toolbar } from '@ui/toolbar';

import { GlobalSidePanelStyle, StyledSidePanel } from './side-panel.styles';

/**
 * SidePanelApp — отображает страницу `chrome.sidePanel`.
 *
 * @example
 * <SidePanelApp />
 */
export function SidePanelApp() {
  return (
    <>
      <GlobalSidePanelStyle />
      <StyledSidePanel>
        <Toolbar
          actions={[
            { ariaLabel: 'Search', icon: <SearchIcon /> },
            { ariaLabel: 'Settings', icon: <SettingsIcon /> },
            { ariaLabel: 'Close', icon: <CloseIcon /> },
          ]}
          ariaLabel="Toolbar"
        />
      </StyledSidePanel>
    </>
  );
}

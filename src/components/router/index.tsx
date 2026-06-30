import { useCallback, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '@components/header';
import { ModelDownloadGate } from '@components/model-download-gate';

import { type ShellOutletContext } from './use-shell-outlet-context';

const DESIGN_SYSTEM_PATH = '/design-system';

/**
 * Каркас приложения. Хедер по умолчанию работает в режиме autoHide — уезжает наверх,
 * освобождая место для рабочей области. Это поведение задаётся пропом <Header autoHide />.
 *
 * Состояние autoHide и headerSettingsOpen, переключатель и развилка шестерёнки существуют
 * только ради витрины дизайн-системы — показать проп вживую. В продуктовом коде эта обвязка
 * не нужна: достаточно <Header autoHide />. Не переносить переключатель в продуктовый код.
 */
export function RouterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [autoHide, setAutoHide] = useState(true);
  const [headerSettingsOpen, setHeaderSettingsOpen] = useState(false);

  const isDesignSystem = location.pathname === DESIGN_SYSTEM_PATH;

  /* Обвязка ВИТРИНЫ: на странице ДС шестерёнка открывает панель настроек хедера (где
     живьём виден autoHide), на остальных — ведёт на ДС. В реальном проекте такой развилки
     не нужно — поведение хедера задаётся пропом <Header autoHide />. */
  const handleSettingsClick = useCallback((): void => {
    if (isDesignSystem) {
      setHeaderSettingsOpen(true);
      return;
    }

    navigate(DESIGN_SYSTEM_PATH);
  }, [isDesignSystem, navigate]);

  const outletContext = useMemo<ShellOutletContext>(
    () => ({ autoHide, headerSettingsOpen, setAutoHide, setHeaderSettingsOpen }),
    [autoHide, headerSettingsOpen]
  );

  return (
    <ModelDownloadGate>
      <Header
        autoHide={autoHide}
        settingsLabel={isDesignSystem ? 'Header settings' : 'Design system'}
        onSettingsClick={handleSettingsClick}
      />
      <Outlet context={outletContext} />
    </ModelDownloadGate>
  );
}

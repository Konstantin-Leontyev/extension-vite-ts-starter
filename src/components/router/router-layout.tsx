/**
 * Файл: `src/components/router/router-layout.tsx`
 * Предоставляет компонент RouterLayout для отображения каркаса приложения с шапкой
 * и outlet страниц.
 *
 * Основные задачи:
 * 1. Экспортировать компонент RouterLayout
 * 2. Передавать состояние шапки страницам через контекст outlet
 *
 * Потребители:
 *  - `src/components/router/router.tsx` — монтирует layout как корневой элемент маршрутов
 */

import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '@components/header';
import { ModelDownloadGate } from '@components/model-download-gate';

import { type ShellOutletContext } from './use-shell-outlet-context';

/** DESIGN_SYSTEM_PATH — задаёт путь маршрута витрины дизайн-системы. */
const DESIGN_SYSTEM_PATH = '/design-system';

/**
 * RouterLayout — отображает каркас приложения с шапкой и outlet страниц.
 *
 * @example
 * <RouterLayout />
 */
export function RouterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [autoHide, setAutoHide] = useState(true);
  const [headerSettingsOpen, setHeaderSettingsOpen] = useState(false);

  const isDesignSystem = location.pathname === DESIGN_SYSTEM_PATH;

  // Обвязка витрины: на странице дизайн-системы шестерёнка открывает панель настроек хедера,
  // где в реальном времени виден autoHide; на остальных страницах ведёт на витрину.
  // В продуктовом коде такой развилки не нужно — поведение хедера задаётся пропом autoHide у Header.
  // Не переносить развилку в продуктовый код.
  const handleSettingsClick = (): void => {
    if (isDesignSystem) {
      setHeaderSettingsOpen(true);
      return;
    }

    navigate(DESIGN_SYSTEM_PATH);
  };

  const outletContext: ShellOutletContext = {
    autoHide,
    headerSettingsOpen,
    setAutoHide,
    setHeaderSettingsOpen,
  };

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

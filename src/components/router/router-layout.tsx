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
 *  - `src/components/router/router.tsx` — рендерит layout как корневой элемент маршрутов
 */

import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '@components/header';
import { ModelDownloadGate } from '@components/model-download-gate';

import { type ShellOutletContext } from './use-shell-outlet-context';

/**
 * SHOWCASE_PATH — задаёт путь маршрута витрины дизайн-системы.
 * Используется в `RouterLayout` для сравнения с текущим путём и перехода на витрину.
 */
const SHOWCASE_PATH = '/showcase';

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
  const [isHeaderSettingsOpen, setIsHeaderSettingsOpen] = useState(false);

  const isShowcase = location.pathname === SHOWCASE_PATH;

  // Обвязка витрины: на витрине дизайн-системы шестерёнка открывает панель настроек шапки,
  // где в реальном времени виден autoHide. На остальных страницах ведёт на витрину.
  // В продуктовом коде такой развилки не нужно — поведение шапки задаётся пропом autoHide у Header.
  // Не переносить развилку в продуктовый код.
  /**
   * handleSettingsClick — открывает панель настроек шапки на витрине или переходит
   * на витрину с остальных страниц.
   */
  const handleSettingsClick = (): void => {
    if (isShowcase) {
      setIsHeaderSettingsOpen(true);
      return;
    }

    navigate(SHOWCASE_PATH);
  };

  const outletContext: ShellOutletContext = {
    autoHide,
    isHeaderSettingsOpen,
    setAutoHide,
    setIsHeaderSettingsOpen,
  };

  return (
    <ModelDownloadGate>
      <Header
        autoHide={autoHide}
        settingsLabel={isShowcase ? 'Header settings' : undefined}
        onSettingsClick={handleSettingsClick}
      />
      <Outlet context={outletContext} />
    </ModelDownloadGate>
  );
}

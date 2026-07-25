/**
 * Файл: `src/components/router/router.tsx`
 * Определяет конфигурацию hash-маршрутизатора приложения.
 *
 * Основные задачи:
 * 1. Предоставить объект `router` для `RouterProvider`
 *
 * Потребители:
 *  - `src/components/router/index.tsx` — реэкспортирует `router`
 */

import { createHashRouter } from 'react-router-dom';

import { HomePage } from '@pages/home';
import { PrivacyPage } from '@pages/privacy';
import { ShowcasePage } from '@pages/showcase';
import { TermsPage } from '@pages/terms';

import { RouterLayout } from './router-layout';

/**
 * router — задаёт конфигурацию hash-маршрутов приложения.
 * Корневой маршрут рендерит `RouterLayout`, дочерние — страницы.
 * Используется в `RouterProvider` из `src/main.tsx`.
 */
export const router = createHashRouter([
  {
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <ShowcasePage />,
        path: 'showcase',
      },
      {
        element: <PrivacyPage />,
        path: 'privacy',
      },
      {
        element: <TermsPage />,
        path: 'terms',
      },
    ],
    element: <RouterLayout />,
  },
]);

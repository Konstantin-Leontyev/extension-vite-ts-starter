/**
 * Файл: `src/components/router/index.tsx`
 * Объединяет конфигурацию маршрутов и контекст outlet в единую точку входа.
 *
 * Основные задачи:
 * 1. Реэкспортировать конфигурацию `router`
 * 2. Реэкспортировать хук `useShellOutletContext`
 *
 * Потребители:
 *  - `src/main.tsx` — подключает `router` через `RouterProvider`
 *  - `src/pages/design-system/index.tsx` — читает контекст outlet для настроек шапки
 */

import { router } from './router';
import { useShellOutletContext } from './use-shell-outlet-context';

export { router, useShellOutletContext };

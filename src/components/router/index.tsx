/**
 * Файл: `src/components/router/index.tsx`
 * Объединяет конфигурацию маршрутов и контекст outlet в единую точку входа.
 *
 * Основные задачи:
 * 1. Реэкспортировать конфигурацию `router`
 * 2. Реэкспортировать хук `useShellOutletContext` и тип `ShellOutletContext`
 *
 * Потребители:
 *  - `src/main.tsx` — подключает `router` через `RouterProvider`
 *  - `src/pages/design-system/index.tsx` — читает контекст outlet для настроек шапки
 */

import { router } from './router';
import {
  useShellOutletContext,
  type ShellOutletContext,
} from './use-shell-outlet-context';

/* eslint-disable react-refresh/only-export-components -- реэкспорт конфигурации маршрутов и хука контекста */
export { router, useShellOutletContext, type ShellOutletContext };

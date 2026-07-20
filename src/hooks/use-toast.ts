/**
 * Файл: `src/hooks/use-toast.ts`
 * Предоставляет хук показа и закрытия уведомлений из `ToastContext`.
 *
 * Основные задачи:
 * 1. Предоставить хук `useToast`
 *
 * Потребители:
 *  - `src/pages/design-system` — показывает уведомления из витрины
 */

import { useContext } from 'react';

import { ToastContext, type ToastContextValue } from '@context/toast/context';

/**
 * useToast — возвращает API показа и закрытия уведомлений из `ToastContext`.
 * Без `ToastProvider` выбрасывает ошибку.
 *
 * @returns значение контекста уведомлений
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

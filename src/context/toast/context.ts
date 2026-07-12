/**
 * Файл: `src/context/toast/context.ts`
 * Определяет контекст для уведомлений приложения.
 * Предоставляет единую точку входа для показа уведомлений из любого компонента.
 *
 * Основные задачи:
 * 1. Типизировать параметры показа уведомления через `ToastInput`
 * 2. Типизировать API показа уведомления через `ToastContextValue`
 * 3. Предоставить контекст `ToastContext`
 *
 * Потребители:
 *  - `src/context/toast/index.tsx` — наполняет контекст в `ToastProvider`
 *  - `src/hooks/use-toast.ts` — читает контекст в хуке `useToast`
 */

import { createContext } from 'react';

import { type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

/**
 * ToastInput — представляет параметры уведомления.
 *
 * @property message — текст уведомления
 * @property sizePreset — размер уведомления
 * @property tone — семантический тон
 */
export type ToastInput = {
  message: string;
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * ToastContextValue — представляет API контекста уведомлений.
 *
 * @property showToast — показывает уведомление
 */
export type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

/**
 * ToastContext — предоставляет доступ к API показа уведомлений.
 * Читается через хук `useToast`, который проверяет наличие провайдера.
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

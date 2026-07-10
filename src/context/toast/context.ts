/**
 * Файл: context/toast/context.ts
 * Контекст для управления тостами в приложении.
 * Предоставляет единую точку входа для показа уведомлений из любого компонента.
 *
 * Основные задачи:
 * 1. Определить тип ToastInput — запрос на показ тоста
 * 2. Определить тип ToastContextValue — API для показа тоста
 * 3. Предоставить контекст ToastContext
 *
 * Потребители: компоненты приложения через `useToast()` хук,
 * `ToastProvider` в корне приложения.
 */

import { createContext } from 'react';

import { type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

/**
 * ToastInput — запрос на показ тоста.
 *
 * @property message — текст уведомления
 * @property sizePreset — размер тоста (из канона `SizePreset`)
 * @property tone — семантический тон (`default` — нейтральный)
 */
export type ToastInput = {
  message: string;
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * ToastContextValue — API контекста тостов.
 *
 * @property showToast — функция для показа уведомления
 */
export type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

/**
 * ToastContext — контекст для доступа к API показа тостов.
 * Используется через хук-обёртку, проверяющую наличие провайдера.
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

import { createContext } from 'react';

import { type TonePreset } from '@ui/tones';

/** Запрос на показ тоста: текст + семантический тон (default — нейтральный). */
export type ToastInput = {
  message: string;
  tone?: TonePreset;
};

export type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

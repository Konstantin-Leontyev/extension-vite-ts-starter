/**
 * Файл: `src/context/toast/index.tsx`
 * Предоставляет компонент ToastProvider для показа уведомлений.
 * Управляет очередью активных уведомлений, автоскрытием и закрытием
 * по клику и по Escape.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ToastProvider
 * 2. Типизировать пропсы через `ToastProviderProps`
 * 3. Предоставить метод `showToast` через `ToastContext`
 * 4. Автоматически скрывать уведомления через `TOAST_DURATION_MS`
 * 5. Закрывать все уведомления по Escape
 * 6. Рендерить стек уведомлений в дереве провайдера после `children` через
 *    `POPOVER_MANUAL` и `showPopover` из `@ui/popover`
 *
 * Потребители:
 *  - `src/main.tsx` — оборачивает приложение провайдером
 */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { POPOVER_MANUAL, showPopover } from '@ui/popover';
import { Toast } from '@ui/toast';

import { ToastContext, type ToastContextValue, type ToastInput } from './context';
import { StyledToastViewport } from './toast.styles';

/**
 * TOAST_DURATION_MS — задаёт время автоскрытия уведомления.
 * Используется в `showToast` при запуске таймера.
 */
const TOAST_DURATION_MS = 5000;

/**
 * ActiveToast — представляет активное уведомление в очереди.
 *
 * @property id — уникальный идентификатор уведомления
 */
type ActiveToast = ToastInput & { id: string };

/**
 * ToastProviderProps — представляет пропсы компонента ToastProvider.
 *
 * @property children — дочерние элементы приложения
 */
type ToastProviderProps = {
  children: ReactNode;
};

/**
 * ToastProvider — оборачивает приложение контекстом показа уведомлений.
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const hasToasts = toasts.length > 0;
  const timersRef = useRef<Map<string, number>>(new Map());
  const viewportRef = useRef<HTMLDivElement>(null);

  /**
   * dismiss — закрывает уведомление по id.
   * Удаляет уведомление из состояния и очищает таймер автоскрытия.
   *
   * @param id идентификатор уведомления
   */
  function dismiss(id: string): void {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }

  /**
   * showToast — добавляет новое уведомление в очередь.
   * Генерирует уникальный id, добавляет в состояние и запускает таймер автоскрытия.
   *
   * @param input параметры уведомления
   */
  function showToast(input: ToastInput): void {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...input, id }]);

    const timer = window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    timersRef.current.set(id, timer);
  }

  /**
   * Клавиатурная альтернатива клику: `Escape` закрывает всю стопку.
   * Без `preventDefault` — другие обработчики `Escape` на странице продолжают работать.
   * Срабатывает только при наличии уведомлений.
   */
  useEffect(() => {
    const timers = timersRef.current;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape' || timers.size === 0) {
        return;
      }

      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      setToasts([]);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  /**
   * Показывает стек уведомлений через `showPopover` до отрисовки кадра.
   * Нативный popover в режиме `POPOVER_MANUAL` сам стек не открывает.
   */
  useLayoutEffect(() => {
    if (!hasToasts) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    showPopover(viewport);
  }, [hasToasts]);

  const value: ToastContextValue = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {hasToasts && (
        <StyledToastViewport popover={POPOVER_MANUAL} ref={viewportRef}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              size={toast.size}
              tone={toast.tone}
              onClick={() => dismiss(toast.id)}
            >
              {toast.message}
            </Toast>
          ))}
        </StyledToastViewport>
      )}
    </ToastContext.Provider>
  );
}

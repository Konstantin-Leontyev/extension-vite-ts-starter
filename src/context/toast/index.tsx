/**
 * Файл: context/toast/index.tsx
 * Провайдер тостов для приложения.
 * Управляет очередью активных тостов, автоскрытием и закрытием по клику/Esc.
 *
 * Основные задачи:
 * 1. Хранить список активных тостов в состоянии
 * 2. Предоставлять метод showToast для добавления нового тоста
 * 3. Автоматически скрывать тосты через TOAST_DURATION_MS
 * 4. Закрывать все тосты по Escape
 * 5. Рендерить тосты в портале поверх всех слоёв
 *
 * Потребители: корень приложения (`main.tsx`).
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { Toast } from '@ui/toast';

import { ToastContext, type ToastContextValue, type ToastInput } from './context';
import { StyledToastViewport } from './toast.styles';

/** TOAST_DURATION_MS — время автоскрытия тоста (5 секунд). */
const TOAST_DURATION_MS = 5000;

/** ActiveToast — активный тост с уникальным идентификатором. */
type ActiveToast = ToastInput & { id: string };

/**
 * ToastProviderProps — пропсы компонента ToastProvider.
 *
 * @property children — дочерние элементы приложения
 */
type ToastProviderProps = {
  children: ReactNode;
};

/**
 * ToastProvider — провайдер контекста тостов.
 * Оборачивает приложение и управляет отображением уведомлений.
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  /**
   * dismiss — закрывает тост по id.
   * Удаляет тост из состояния и очищает таймер автоскрытия.
   *
   * @param id — идентификатор тоста
   */
  const dismiss = useCallback((id: string): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  /**
   * showToast — добавляет новый тост в очередь.
   * Генерирует уникальный id, добавляет в состояние и запускает таймер автоскрытия.
   *
   * @param input — параметры тоста (сообщение, размер, тон)
   */
  const showToast = useCallback(
    (input: ToastInput): void => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...input, id }]);

      const timer = window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  /**
   * Клавиатурная альтернатива клику: Esc закрывает всю стопку.
   * Без preventDefault — другие Esc-обработчики страницы продолжают работать.
   * Срабатывает только при наличии тостов.
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

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 &&
        createPortal(
          <StyledToastViewport>
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                sizePreset={toast.sizePreset}
                tone={toast.tone}
                onClick={() => dismiss(toast.id)}
              />
            ))}
          </StyledToastViewport>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

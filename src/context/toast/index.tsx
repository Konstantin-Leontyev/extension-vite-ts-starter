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

/** Автоскрытие тоста — единый интервал (5 c). */
const TOAST_DURATION_MS = 5000;

type ActiveToast = ToastInput & { id: string };

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);

    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (input: ToastInput): void => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...input, id }]);

      const timer = window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  // Клавиатурная альтернатива клику: Esc закрывает всю стопку (без preventDefault —
  // другие Esc-обработчики страницы продолжают работать). Срабатывает только при тостах.
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

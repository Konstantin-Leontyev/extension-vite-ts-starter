/**
 * Файл: `src/components/model-download-gate/use-browser-ai-bootstrap.ts`
 * Предоставляет хук `useBrowserAiBootstrap` для проверки доступности и загрузки локальной
 * языковой модели.
 *
 * Основные задачи:
 * 1. Предоставить хук `useBrowserAiBootstrap`
 *
 * Потребители:
 *  - `src/components/model-download-gate/index.tsx` — управляет фазами экрана загрузки модели
 */

import { useEffect, useRef, useState } from 'react';

import {
  checkBrowserAiAvailability,
  createBrowserAiSession,
  type BrowserAiSession,
} from '@services/browser-ai';

/**
 * BrowserAiBootstrapPhase — представляет фазу подготовки локальной языковой модели.
 */
type BrowserAiBootstrapPhase =
  | 'checking'
  | 'download-required'
  | 'downloading'
  | 'error'
  | 'ready'
  | 'unavailable';

/**
 * BrowserAiBootstrapState — представляет состояние хука `useBrowserAiBootstrap`.
 *
 * @property error — последняя ошибка загрузки или проверки
 * @property loadedRatio — доля загруженной модели, от 0 до 1
 * @property phase — текущая фаза подготовки модели
 * @property retryDownload — обработчик повторной загрузки после ошибки
 * @property startDownload — обработчик запуска загрузки модели
 */
type BrowserAiBootstrapState = {
  error: Error | null;
  loadedRatio: number;
  phase: BrowserAiBootstrapPhase;
  retryDownload: () => void;
  startDownload: () => void;
};

/**
 * useBrowserAiBootstrap — возвращает состояние подготовки локальной языковой модели и действия
 * загрузки.
 *
 * Как работает:
 * 1. При монтировании проверяет доступность через `checkBrowserAiAvailability`
 * 2. Выставляет фазу `ready`, `unavailable` или `download-required`
 * 3. По `startDownload` и `retryDownload` создаёт сессию через `createBrowserAiSession`
 *    и отслеживает прогресс
 * 4. После успешной загрузки уничтожает сессию-пробник и переводит фазу в `ready`
 * 5. При размонтировании уничтожает активную сессию
 *
 * @returns текущая фаза, прогресс, ошибка и действия загрузки
 */
export function useBrowserAiBootstrap(): BrowserAiBootstrapState {
  const [phase, setPhase] = useState<BrowserAiBootstrapPhase>('checking');
  const [loadedRatio, setLoadedRatio] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const activeSessionRef = useRef<BrowserAiSession | null>(null);

  /**
   * Проверяет доступность локальной модели при монтировании.
   * Отмена через флаг `cancelled` игнорирует результат после размонтирования.
   */
  useEffect(() => {
    let cancelled = false;

    async function probeAvailability(): Promise<void> {
      setPhase('checking');
      setError(null);

      try {
        const availability = await checkBrowserAiAvailability();

        if (cancelled) {
          return;
        }

        if (availability === 'unavailable') {
          setPhase('unavailable');
          return;
        }

        if (availability === 'available') {
          setPhase('ready');
          return;
        }

        setPhase('download-required');
      } catch (probeError) {
        if (cancelled) {
          return;
        }

        if (probeError instanceof Error) {
          setError(probeError);
        }

        setPhase('error');
      }
    }

    void probeAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  async function runDownload(): Promise<void> {
    activeSessionRef.current?.destroy();
    activeSessionRef.current = null;

    setPhase('downloading');
    setLoadedRatio(0);
    setError(null);

    try {
      const session = await createBrowserAiSession({
        onDownloadProgress: (ratio) => {
          setLoadedRatio(ratio);
        },
      });

      activeSessionRef.current = session;
      session.destroy();
      activeSessionRef.current = null;
      setLoadedRatio(1);
      setPhase('ready');
    } catch (downloadError) {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;

      if (downloadError instanceof Error) {
        setError(downloadError);
      }

      setPhase('error');
    }
  }

  function startDownload(): void {
    void runDownload();
  }

  function retryDownload(): void {
    void runDownload();
  }

  /**
   * Уничтожает активную сессию при размонтировании.
   */
  useEffect(() => {
    return () => {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;
    };
  }, []);

  return {
    error,
    loadedRatio,
    phase,
    retryDownload,
    startDownload,
  };
}

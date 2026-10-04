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

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  checkBrowserAiAvailability,
  createBrowserAiSession,
  normalizeBrowserAiError,
  type BrowserAiError,
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
 * @property startDownload — обработчик запуска загрузки модели
 */
type BrowserAiBootstrapState = {
  error: BrowserAiError | null;
  loadedRatio: number;
  phase: BrowserAiBootstrapPhase;
  startDownload: () => void;
};

/**
 * resolveBrowserAiError — преобразует неизвестную ошибку в `BrowserAiError`.
 * `normalizeBrowserAiError` выбрасывает типизированную ошибку: вызов перехватывает её
 * и возвращает значением.
 * Используется при проверке доступности и в `startDownload`.
 *
 * @param error исходная ошибка неизвестного вида
 * @param operation краткое имя операции для текста сообщения
 * @returns типизированная ошибка Browser AI
 */
function resolveBrowserAiError(error: unknown, operation: string): BrowserAiError {
  try {
    normalizeBrowserAiError(error, operation);
  } catch (normalizedError) {
    return normalizedError as BrowserAiError;
  }
}

/**
 * useBrowserAiBootstrap — возвращает состояние подготовки локальной языковой модели и действие
 * загрузки.
 *
 * Как работает:
 * 1. При монтировании проверяет доступность через `checkBrowserAiAvailability`
 * 2. Для `available` выставляет фазу `ready`, для `unavailable` — `unavailable`,
 *    для `downloadable` — `download-required`. Для `downloading` вызывает `startDownload`.
 *    При ошибке проверки заполняет поле `error` и выставляет фазу `error`
 * 3. `startDownload` передаёт `AbortSignal` в `createBrowserAiSession` и пишет долю
 *    загрузки из `onDownloadProgress`. Повторный вызов во время загрузки новую сессию
 *    не создаёт
 * 4. После успешной загрузки уничтожает сессию-пробник и, пока загрузка ещё текущая,
 *    переводит фазу в `ready`
 * 5. Пока загрузка текущая, ошибка, включая обрыв, заполняет поле `error` и ставит
 *    фазу `error`. После размонтирования и смены поколения фазу и ошибку не пишет
 * 6. При размонтировании прерывает загрузку и уничтожает активную сессию
 *
 * @returns текущая фаза, прогресс, ошибка и действие загрузки
 */
export function useBrowserAiBootstrap(): BrowserAiBootstrapState {
  const [phase, setPhase] = useState<BrowserAiBootstrapPhase>('checking');
  const [loadedRatio, setLoadedRatio] = useState(0);
  const [error, setError] = useState<BrowserAiError | null>(null);
  const activeSessionRef = useRef<BrowserAiSession | null>(null);
  const downloadAbortRef = useRef<AbortController | null>(null);
  const downloadGenerationRef = useRef(0);
  const isDownloadingRef = useRef(false);
  const isMountedRef = useRef(true);

  const startDownload = useCallback(async (): Promise<void> => {
    if (isDownloadingRef.current || !isMountedRef.current) {
      return;
    }

    isDownloadingRef.current = true;
    downloadGenerationRef.current += 1;
    const generation = downloadGenerationRef.current;
    downloadAbortRef.current?.abort();

    const abortController = new AbortController();
    downloadAbortRef.current = abortController;

    function isCurrentDownload(): boolean {
      return isMountedRef.current && downloadGenerationRef.current === generation;
    }

    activeSessionRef.current?.destroy();
    activeSessionRef.current = null;

    setPhase('downloading');
    setLoadedRatio(0);
    setError(null);

    try {
      const session = await createBrowserAiSession({
        onDownloadProgress: (ratio) => {
          if (!isCurrentDownload()) {
            return;
          }

          setLoadedRatio(ratio);
        },
        signal: abortController.signal,
      });

      activeSessionRef.current = session;
      session.destroy();
      activeSessionRef.current = null;

      if (!isCurrentDownload()) {
        return;
      }

      setLoadedRatio(1);
      setPhase('ready');
    } catch (downloadError) {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;

      if (!isCurrentDownload()) {
        return;
      }

      const normalizedError = resolveBrowserAiError(downloadError, 'session creation');

      setError(normalizedError);
      setPhase('error');
    } finally {
      if (downloadGenerationRef.current === generation) {
        isDownloadingRef.current = false;
      }
    }
  }, []);

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

        if (availability === 'downloading') {
          void startDownload();
          return;
        }

        setPhase('download-required');
      } catch (probeError) {
        if (cancelled) {
          return;
        }

        setError(resolveBrowserAiError(probeError, 'availability check'));
        setPhase('error');
      }
    }

    void probeAvailability();

    return () => {
      cancelled = true;
    };
  }, [startDownload]);

  /**
   * Прерывает загрузку и уничтожает активную сессию при размонтировании.
   * Сменяет поколение загрузки, чтобы поздний результат не записал фазу и ошибку.
   */
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      isDownloadingRef.current = false;
      downloadGenerationRef.current += 1;
      downloadAbortRef.current?.abort();
      downloadAbortRef.current = null;
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;
    };
  }, []);

  return {
    error,
    loadedRatio,
    phase,
    startDownload,
  };
}

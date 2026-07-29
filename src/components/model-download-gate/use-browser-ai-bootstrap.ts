// TODO: ручное ревью — components/model-download-gate/use-browser-ai-bootstrap.ts
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  checkBrowserAiAvailability,
  createBrowserAiSession,
  type BrowserAiSession,
} from '@services/browser-ai';

export type BrowserAiBootstrapPhase =
  | 'checking'
  | 'download-required'
  | 'downloading'
  | 'error'
  | 'ready'
  | 'unavailable';

type BrowserAiBootstrapState = {
  error: Error | null;
  loadedRatio: number;
  phase: BrowserAiBootstrapPhase;
  retryDownload: () => void;
  startDownload: () => void;
};

export function useBrowserAiBootstrap(): BrowserAiBootstrapState {
  const [phase, setPhase] = useState<BrowserAiBootstrapPhase>('checking');
  const [loadedRatio, setLoadedRatio] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const activeSessionRef = useRef<BrowserAiSession | null>(null);

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

  const runDownload = useCallback(async () => {
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
  }, []);

  const startDownload = useCallback(() => {
    void runDownload();
  }, [runDownload]);

  const retryDownload = useCallback(() => {
    void runDownload();
  }, [runDownload]);

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

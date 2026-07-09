import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import {
  checkBrowserAiAvailability,
  createBrowserAiSession,
  type BrowserAiAvailability,
  type BrowserAiSession,
} from '@services/browser-ai';
import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { ProgressBar } from '@ui/progress-bar';
import { Spinner } from '@ui/spinner';
import { Text } from '@ui/text';

const SMOKE_PROBE_TITLE_ID = 'browser-ai-smoke-probe-title';
const SMOKE_PROMPT = 'Reply with exactly: OK';

type SmokeProbePhase =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'prompting'
  | 'done'
  | 'error';

type SmokeProbeState = {
  availability: BrowserAiAvailability | null;
  downloadRatio: number;
  errorMessage: string | null;
  phase: SmokeProbePhase;
  promptResponse: string | null;
};

const INITIAL_SMOKE_PROBE_STATE: SmokeProbeState = {
  availability: null,
  downloadRatio: 0,
  errorMessage: null,
  phase: 'idle',
  promptResponse: null,
};

export function BrowserAiSmokeProbe() {
  if (!import.meta.env.DEV) {
    return null;
  }

  return <BrowserAiSmokeProbeActive />;
}

function BrowserAiSmokeProbeActive() {
  const theme = useTheme();
  const [state, setState] = useState<SmokeProbeState>(INITIAL_SMOKE_PROBE_STATE);
  const activeSessionRef = useRef<BrowserAiSession | null>(null);

  const isRunning =
    state.phase === 'checking' ||
    state.phase === 'downloading' ||
    state.phase === 'prompting';

  const runSmokeTest = useCallback(async () => {
    activeSessionRef.current?.destroy();
    activeSessionRef.current = null;

    setState({
      ...INITIAL_SMOKE_PROBE_STATE,
      phase: 'checking',
    });

    try {
      const availability = await checkBrowserAiAvailability();

      if (availability === 'unavailable') {
        setState({
          ...INITIAL_SMOKE_PROBE_STATE,
          availability,
          errorMessage: 'LanguageModel is unavailable in this browser context.',
          phase: 'error',
        });
        return;
      }

      setState((current) => ({
        ...current,
        availability,
        phase: availability === 'available' ? 'prompting' : 'downloading',
      }));

      const session = await createBrowserAiSession({
        onDownloadProgress: (loadedRatio) => {
          setState((current) => ({
            ...current,
            downloadRatio: loadedRatio,
            phase: 'downloading',
          }));
        },
      });

      activeSessionRef.current = session;

      setState((current) => ({
        ...current,
        phase: 'prompting',
      }));

      const promptResponse = await session.prompt(SMOKE_PROMPT);

      session.destroy();
      activeSessionRef.current = null;

      setState((current) => ({
        ...current,
        downloadRatio: 1,
        phase: 'done',
        promptResponse: promptResponse.trim(),
      }));
    } catch (error) {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;

      setState((current) => ({
        ...current,
        errorMessage: error instanceof Error ? error.message : 'Smoke test failed.',
        phase: 'error',
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;
    };
  }, []);

  return (
    <Card
      gap={12}
      padding={16}
      title="Browser AI smoke test (dev)"
      titleId={SMOKE_PROBE_TITLE_ID}
    >
      <Text as="p" color={theme.colors.muted} sizePreset="normal">
        Checks availability, creates a session, and runs a hello prompt. Visible only in
        dev builds.
      </Text>

      <Button disabled={isRunning} tone="primary" onClick={() => void runSmokeTest()}>
        Run smoke test
      </Button>

      {state.phase === 'checking' && (
        <Spinner aria-labelledby={SMOKE_PROBE_TITLE_ID} sizePreset="medium" />
      )}

      {state.phase === 'downloading' && (
        <ProgressBar
          aria-labelledby={SMOKE_PROBE_TITLE_ID}
          showLabel={true}
          value={state.downloadRatio}
        />
      )}

      {state.phase === 'prompting' && (
        <Text as="p" sizePreset="normal">
          Prompting…
        </Text>
      )}

      {state.availability != null && (
        <Text as="p" sizePreset="medium">
          availability: {state.availability}
        </Text>
      )}

      {state.promptResponse != null && (
        <Text as="p" sizePreset="normal">
          prompt response: {state.promptResponse}
        </Text>
      )}

      {state.errorMessage != null && (
        <Text as="p" color={theme.colors.danger} sizePreset="normal">
          {state.errorMessage}
        </Text>
      )}
    </Card>
  );
}

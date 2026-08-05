/**
 * Файл: `src/pages/showcase/browser-ai-smoke-probe/index.tsx`
 * Предоставляет компонент BrowserAiSmokeProbe для отображения зонда Prompt API в витрине.
 *
 * Основные задачи:
 * 1. Экспортировать компонент BrowserAiSmokeProbe
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — встраивает зонд в витрину дизайн-системы
 */

import { useEffect, useRef, useState } from 'react';

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

/**
 * SMOKE_PROBE_TITLE_ID — задаёт id заголовка карточки зонда для связи с `aria-labelledby`
 * индикаторов прогресса и ожидания.
 */
const SMOKE_PROBE_TITLE_ID = 'browser-ai-smoke-probe-title';

/**
 * TEST_PROMPT — задаёт текст пробного запроса к модели.
 */
const TEST_PROMPT = 'Hi — which model are you?';

/**
 * TEST_SYSTEM_PROMPT — задаёт скрытую системную инструкцию пробной сессии.
 * В карточке витрины не отображается.
 */
const TEST_SYSTEM_PROMPT =
  'Keep the entire reply under 200 characters. Plain text only.';

/**
 * CARD_DESCRIPTION — задаёт описательный подзаголовок карточки, пока нет ответа и запрос
 * не выполняется.
 */
const CARD_DESCRIPTION =
  'Download the model, or run a hello prompt when it is already available.';

/**
 * SmokeProbePhase — представляет фазу зонда Prompt API.
 */
type SmokeProbePhase =
  | 'checking'
  | 'done'
  | 'downloading'
  | 'error'
  | 'prompting'
  | 'ready';

/**
 * SmokeProbeState — представляет состояние зонда Browser AI.
 *
 * @property availability — последнее полученное состояние доступности модели
 * @property downloadRatio — доля загруженной модели, от 0 до 1
 * @property errorMessage — текст ошибки прогона
 * @property phase — текущая фаза прогона
 * @property promptResponse — текстовый ответ пробного запроса
 */
type SmokeProbeState = {
  availability: BrowserAiAvailability | null;
  downloadRatio: number;
  errorMessage: null | string;
  phase: SmokeProbePhase;
  promptResponse: null | string;
};

/**
 * INITIAL_SMOKE_PROBE_STATE — задаёт начальное состояние зонда Browser AI.
 */
const INITIAL_SMOKE_PROBE_STATE: SmokeProbeState = {
  availability: null,
  downloadRatio: 0,
  errorMessage: null,
  phase: 'checking',
  promptResponse: null,
};

/**
 * needsModelDownload — возвращает, нужна ли загрузка модели по состоянию доступности.
 *
 * @param availability состояние доступности модели
 * @returns `true`, когда модель ещё не готова к prompt
 */
function needsModelDownload(availability: BrowserAiAvailability): boolean {
  return availability === 'downloadable' || availability === 'downloading';
}

/**
 * BrowserAiSmokeProbe — отображает зонд Prompt API в витрине.
 * До загрузки модели предлагает `Download model`. После — текст промпта и `Run prompt`.
 * Во время запроса подзаголовок скрыт, в теле карточки только Spinner с подписью `Thinking...`.
 * Ответ — подзаголовок `Answer` и текст модели. Системную инструкцию длины ответа в UI не показывает.
 *
 * @example
 * <BrowserAiSmokeProbe />
 */
export function BrowserAiSmokeProbe() {
  const [state, setState] = useState<SmokeProbeState>(INITIAL_SMOKE_PROBE_STATE);
  const activeSessionRef = useRef<BrowserAiSession | null>(null);

  const isBusy =
    state.phase === 'checking' ||
    state.phase === 'downloading' ||
    state.phase === 'prompting';

  /**
   * Проверяет доступность модели при монтировании.
   * Отмена через флаг `cancelled` игнорирует результат после размонтирования.
   */
  useEffect(() => {
    let cancelled = false;

    async function probeAvailability(): Promise<void> {
      setState(INITIAL_SMOKE_PROBE_STATE);

      try {
        const availability = await checkBrowserAiAvailability();

        if (cancelled) {
          return;
        }

        setState({
          ...INITIAL_SMOKE_PROBE_STATE,
          availability,
          phase: 'ready',
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          ...INITIAL_SMOKE_PROBE_STATE,
          errorMessage:
            error instanceof Error ? error.message : 'Availability check failed.',
          phase: 'error',
        });
      }
    }

    void probeAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Уничтожает активную сессию при размонтировании.
   */
  useEffect(() => {
    return () => {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;
    };
  }, []);

  async function runDownload(): Promise<void> {
    activeSessionRef.current?.destroy();
    activeSessionRef.current = null;

    setState((current) => ({
      ...current,
      downloadRatio: 0,
      errorMessage: null,
      phase: 'downloading',
      promptResponse: null,
    }));

    try {
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
      session.destroy();
      activeSessionRef.current = null;

      const availability = await checkBrowserAiAvailability();

      setState({
        availability,
        downloadRatio: 1,
        errorMessage: null,
        phase: 'ready',
        promptResponse: null,
      });
    } catch (error) {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;

      setState((current) => ({
        ...current,
        errorMessage: error instanceof Error ? error.message : 'Download failed.',
        phase: 'error',
      }));
    }
  }

  async function runPrompt(): Promise<void> {
    activeSessionRef.current?.destroy();
    activeSessionRef.current = null;

    setState((current) => ({
      ...current,
      errorMessage: null,
      phase: 'prompting',
      promptResponse: null,
    }));

    try {
      const session = await createBrowserAiSession({
        systemPrompt: TEST_SYSTEM_PROMPT,
      });
      activeSessionRef.current = session;

      const promptResponse = await session.prompt(TEST_PROMPT);

      session.destroy();
      activeSessionRef.current = null;

      setState((current) => ({
        ...current,
        phase: 'done',
        promptResponse: promptResponse.trim(),
      }));
    } catch (error) {
      activeSessionRef.current?.destroy();
      activeSessionRef.current = null;

      setState((current) => ({
        ...current,
        errorMessage: error instanceof Error ? error.message : 'Prompt failed.',
        phase: 'error',
      }));
    }
  }

  function handleDownload(): void {
    void runDownload();
  }

  function handleRunPrompt(): void {
    void runPrompt();
  }

  async function retryFromError(): Promise<void> {
    setState(INITIAL_SMOKE_PROBE_STATE);

    try {
      const availability = await checkBrowserAiAvailability();

      setState({
        ...INITIAL_SMOKE_PROBE_STATE,
        availability,
        phase: 'ready',
      });
    } catch (error) {
      setState({
        ...INITIAL_SMOKE_PROBE_STATE,
        errorMessage:
          error instanceof Error ? error.message : 'Availability check failed.',
        phase: 'error',
      });
    }
  }

  function handleRetry(): void {
    void retryFromError();
  }

  const isIdle = state.phase === 'ready' || state.phase === 'done';
  const showDownloadAction =
    state.availability != null && needsModelDownload(state.availability) && isIdle;
  const showPromptText =
    state.availability === 'available' &&
    (state.phase === 'ready' || state.phase === 'error') &&
    state.promptResponse == null;
  const showPromptAction =
    state.availability === 'available' &&
    state.phase === 'ready' &&
    state.promptResponse == null;
  const showUnavailableAction = state.availability === 'unavailable' && isIdle;
  const showAnswer = state.promptResponse != null;
  const cardSubtitle = showAnswer
    ? 'Answer'
    : state.phase === 'prompting'
      ? undefined
      : CARD_DESCRIPTION;

  return (
    <Card
      as="section"
      padding={16}
      subtitle={cardSubtitle}
      title="Browser AI test"
      titleId={SMOKE_PROBE_TITLE_ID}
    >
      {state.phase === 'checking' && <Spinner aria-labelledby={SMOKE_PROBE_TITLE_ID} />}

      {showDownloadAction && (
        <Button
          alignSelf="center"
          disabled={isBusy}
          tone="primary"
          onClick={handleDownload}
        >
          Download model
        </Button>
      )}

      {showPromptText && <Text as="p">{TEST_PROMPT}</Text>}

      {showPromptAction && (
        <Button
          alignSelf="center"
          disabled={isBusy}
          tone="primary"
          onClick={handleRunPrompt}
        >
          Run prompt
        </Button>
      )}

      {showUnavailableAction && (
        <Button alignSelf="center" disabled tone="primary">
          Model unavailable
        </Button>
      )}

      {state.phase === 'error' && (
        <Button
          alignSelf="center"
          disabled={isBusy}
          tone="primary"
          onClick={handleRetry}
        >
          Try again
        </Button>
      )}

      {state.phase === 'downloading' && (
        <ProgressBar
          aria-labelledby={SMOKE_PROBE_TITLE_ID}
          value={state.downloadRatio}
        />
      )}

      {state.phase === 'prompting' && (
        <Spinner alignSelf="center" ariaLabel="Thinking...">
          Thinking...
        </Spinner>
      )}

      {showAnswer && <Text as="p">{state.promptResponse}</Text>}

      {state.errorMessage != null && (
        <Text as="p" tone="danger">
          {state.errorMessage}
        </Text>
      )}
    </Card>
  );
}

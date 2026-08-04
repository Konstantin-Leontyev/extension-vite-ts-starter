/**
 * Файл: `src/services/browser-ai/session.ts`
 * Определяет создание сессии Prompt API и проверку доступности локальной языковой модели.
 *
 * Основные задачи:
 * 1. Типизировать сессию через `BrowserAiSession`
 * 2. Предоставить функцию `checkBrowserAiAvailability`
 * 3. Предоставить функцию `createBrowserAiSession`
 *
 * Потребители:
 *  - `src/services/browser-ai/index.ts` — реэкспортирует публичное API сессии
 */

import { hasBrowserAiSupport } from './capability';
import {
  BrowserAiUnavailableError,
  normalizeBrowserAiError,
  parseStructuredResponse,
} from './errors';
import {
  type BrowserAiAvailability,
  type BrowserAiPromptOptions,
  type BrowserAiSessionOptions,
} from './types';

/**
 * ENGLISH_TEXT_MODALITIES — представляет модальности текстового ввода и вывода на английском
 * для Prompt API.
 * Используется в `LanguageModel.availability` и `LanguageModel.create`.
 */
const ENGLISH_TEXT_MODALITIES = {
  expectedInputs: [{ type: 'text' as const, languages: ['en'] }],
  expectedOutputs: [{ type: 'text' as const, languages: ['en'] }],
};

/**
 * BrowserAiSession — представляет сессию локальной языковой модели.
 *
 * @property destroy — освобождает ресурсы модели
 * @property prompt — отправляет текстовый запрос и возвращает текстовый ответ
 * @property promptStructured — отправляет запрос со схемой `responseConstraint` и разбирает
 *   JSON-ответ. Форму ответа во время выполнения не проверяет: параметр типа отражает только
 *   ожидание вызывающего кода
 */
export type BrowserAiSession = {
  destroy: () => void;
  prompt: (input: string, options?: BrowserAiPromptOptions) => Promise<string>;
  promptStructured: <T>(
    input: string,
    schema: Record<string, unknown>,
    options?: Omit<BrowserAiPromptOptions, 'responseConstraint'>
  ) => Promise<T>;
};

/**
 * probeBrowserAiAvailability — возвращает состояние доступности локальной модели.
 *
 * @returns состояние из `BrowserAiAvailability`
 */
async function probeBrowserAiAvailability(): Promise<BrowserAiAvailability> {
  if (!hasBrowserAiSupport()) {
    return 'unavailable';
  }

  return LanguageModel.availability(ENGLISH_TEXT_MODALITIES);
}

/**
 * checkBrowserAiAvailability — возвращает состояние доступности локальной модели.
 *
 * @returns состояние из `BrowserAiAvailability`
 */
export async function checkBrowserAiAvailability(): Promise<BrowserAiAvailability> {
  return probeBrowserAiAvailability();
}

/**
 * createBrowserAiSession — создаёт сессию локальной языковой модели Prompt API.
 * При отсутствии поддержки или недоступности модели выбрасывает `BrowserAiUnavailableError`.
 *
 * Как работает:
 * 1. Проверяет наличие `LanguageModel` через `hasBrowserAiSupport`
 * 2. Запрашивает доступность через `probeBrowserAiAvailability`
 * 3. Создаёт модель через `LanguageModel.create` с текстовыми модальностями и режимом
 *    `most-predictable`. При `systemPrompt` передаёт его первым сообщением `initialPrompts`
 * 4. Подписывает монитор на `downloadprogress`, если передан `onDownloadProgress`
 * 5. Возвращает объект сессии с `prompt`, `promptStructured` и `destroy`
 *
 * @param options опции создания сессии и отслеживания загрузки
 * @returns сессия `BrowserAiSession`
 */
export async function createBrowserAiSession(
  options: BrowserAiSessionOptions = {}
): Promise<BrowserAiSession> {
  if (!hasBrowserAiSupport()) {
    throw new BrowserAiUnavailableError(
      'LanguageModel is not available in this context.'
    );
  }

  const availability = await probeBrowserAiAvailability();

  if (availability === 'unavailable') {
    throw new BrowserAiUnavailableError(
      'On-device language model is unavailable on this device.'
    );
  }

  let model: LanguageModel;

  try {
    model = await LanguageModel.create({
      ...ENGLISH_TEXT_MODALITIES,
      // Extension-only: samplingMode не поддерживается в обычном веб-контексте vite-ts-starter-lite.
      samplingMode: 'most-predictable',
      signal: options.signal,
      initialPrompts:
        options.systemPrompt != null
          ? [{ role: 'system', content: options.systemPrompt }]
          : undefined,
      monitor: options.onDownloadProgress
        ? (monitor) => {
            monitor.addEventListener('downloadprogress', (event) => {
              options.onDownloadProgress?.(event.loaded);
            });
          }
        : undefined,
    });
  } catch (error) {
    normalizeBrowserAiError(error, 'session creation');
  }

  return {
    async prompt(input, promptOptions) {
      try {
        return await model.prompt(input, {
          signal: promptOptions?.signal,
          responseConstraint: promptOptions?.responseConstraint,
          omitResponseConstraintInput: promptOptions?.omitResponseConstraintInput,
        });
      } catch (error) {
        normalizeBrowserAiError(error, 'prompt');
      }
    },
    async promptStructured<T>(
      input: string,
      schema: Record<string, unknown>,
      promptOptions?: Omit<BrowserAiPromptOptions, 'responseConstraint'>
    ): Promise<T> {
      let result: string;

      try {
        result = await model.prompt(input, {
          signal: promptOptions?.signal,
          responseConstraint: schema,
          omitResponseConstraintInput: promptOptions?.omitResponseConstraintInput,
        });
      } catch (error) {
        normalizeBrowserAiError(error, 'structured prompt');
      }

      return parseStructuredResponse<T>(result, 'structured prompt');
    },
    destroy() {
      model.destroy();
    },
  };
}

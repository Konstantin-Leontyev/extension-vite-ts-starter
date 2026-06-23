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

const ENGLISH_TEXT_MODALITIES = {
  expectedInputs: [{ type: 'text' as const, languages: ['en'] }],
  expectedOutputs: [{ type: 'text' as const, languages: ['en'] }],
};

export type BrowserAiSession = {
  prompt: (input: string, options?: BrowserAiPromptOptions) => Promise<string>;
  /**
   * Parses JSON via `responseConstraint`; runtime shape is not validated — `T` is caller intent only.
   */
  promptStructured: <T>(
    input: string,
    schema: Record<string, unknown>,
    options?: Omit<BrowserAiPromptOptions, 'responseConstraint'>
  ) => Promise<T>;
  destroy: () => void;
};

async function probeBrowserAiAvailability(): Promise<BrowserAiAvailability> {
  if (!hasBrowserAiSupport()) {
    return 'unavailable';
  }

  return LanguageModel.availability(ENGLISH_TEXT_MODALITIES);
}

export async function checkBrowserAiAvailability(): Promise<BrowserAiAvailability> {
  return probeBrowserAiAvailability();
}

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
      // Extension-only: `samplingMode` is not supported in generic web contexts (vite-ts-starter-lite).
      samplingMode: 'most-predictable',
      signal: options.signal,
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

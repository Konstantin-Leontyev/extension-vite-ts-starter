/**
 * Файл: `src/services/browser-ai/errors.ts`
 * Определяет типизированные ошибки Browser AI и хелперы нормализации и разбора ответа.
 *
 * Основные задачи:
 * 1. Типизировать ошибки через `BrowserAiError`
 * 2. Предоставить классы `BrowserAiUnavailableError`, `BrowserAiAbortedError`,
 *    `BrowserAiQuotaError`, `BrowserAiParseError` и `BrowserAiOperationError`
 * 3. Предоставить функции `normalizeBrowserAiError` и `parseStructuredResponse`
 *
 * Потребители:
 *  - `src/services/browser-ai/session.ts` — нормализует ошибки сессии и разбирает
 *    структурированные ответы
 */

/**
 * STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH — задаёт максимальную длину фрагмента сырого ответа
 * в `BrowserAiParseError`.
 * Используется в `truncateStructuredResponseSnippet` при сохранении `rawResponseSnippet`.
 */
const STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH = 500;

/**
 * BrowserAiUnavailableError — представляет ошибку недоступности локальной языковой модели.
 */
export class BrowserAiUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiUnavailableError';
  }
}

/**
 * BrowserAiAbortedError — представляет ошибку отмены операции Browser AI.
 */
export class BrowserAiAbortedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiAbortedError';
  }
}

/**
 * BrowserAiQuotaError — представляет ошибку превышения окна контекста модели.
 *
 * @property requested — запрошенный размер входа
 * @property contextWindow — размер окна контекста модели
 */
export class BrowserAiQuotaError extends Error {
  readonly requested: number;
  readonly contextWindow: number;

  constructor(
    message: string,
    requested: number,
    contextWindow: number,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'BrowserAiQuotaError';
    this.requested = requested;
    this.contextWindow = contextWindow;
  }
}

/**
 * BrowserAiParseError — представляет ошибку разбора структурированного ответа модели.
 *
 * @property rawResponseSnippet — усечённый фрагмент сырого ответа для диагностики
 */
export class BrowserAiParseError extends Error {
  readonly rawResponseSnippet: string;

  constructor(message: string, rawResponse: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiParseError';
    this.rawResponseSnippet = truncateStructuredResponseSnippet(rawResponse);
  }
}

/**
 * BrowserAiOperationError — представляет общую ошибку операции Browser AI.
 */
export class BrowserAiOperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiOperationError';
  }
}

/**
 * BrowserAiError — представляет объединение всех типизированных ошибок Browser AI.
 */
export type BrowserAiError =
  | BrowserAiAbortedError
  | BrowserAiOperationError
  | BrowserAiParseError
  | BrowserAiQuotaError
  | BrowserAiUnavailableError;

/**
 * truncateStructuredResponseSnippet — возвращает сырой ответ, усечённый до
 * `STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH`.
 *
 * @param rawResponse полный сырой ответ модели
 * @returns исходная строка или усечённый фрагмент с многоточием
 */
function truncateStructuredResponseSnippet(rawResponse: string): string {
  if (rawResponse.length <= STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH) {
    return rawResponse;
  }

  return `${rawResponse.slice(0, STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH)}…`;
}

/**
 * normalizeBrowserAiError — приводит неизвестную ошибку к типизированному классу Browser AI
 * и выбрасывает её.
 * Уже нормализованные ошибки пробрасывает без обёртки.
 *
 * Как работает:
 * 1. Если ошибка уже принадлежит семейству Browser AI, выбрасывает её как есть
 * 2. Для `DOMException` с именем `AbortError` выбрасывает `BrowserAiAbortedError`
 * 3. Для `DOMException` с именем `QuotaExceededError` выбрасывает `BrowserAiQuotaError`
 *    с полями квоты
 * 4. Для остальных `DOMException` и `Error` выбрасывает `BrowserAiOperationError`
 * 5. Для прочих значений выбрасывает `BrowserAiOperationError` с общим текстом
 *
 * @param error исходная ошибка неизвестного вида
 * @param operation краткое имя операции для текста сообщения
 */
export function normalizeBrowserAiError(error: unknown, operation: string): never {
  if (
    error instanceof BrowserAiUnavailableError ||
    error instanceof BrowserAiAbortedError ||
    error instanceof BrowserAiQuotaError ||
    error instanceof BrowserAiParseError ||
    error instanceof BrowserAiOperationError
  ) {
    throw error;
  }

  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      throw new BrowserAiAbortedError(`Browser AI ${operation} was aborted.`, {
        cause: error,
      });
    }

    if (error.name === 'QuotaExceededError') {
      const quotaError = error as DOMException & {
        contextWindow?: number;
        requested?: number;
      };

      throw new BrowserAiQuotaError(
        `Browser AI ${operation} exceeded the context window.`,
        quotaError.requested ?? 0,
        quotaError.contextWindow ?? 0,
        { cause: error }
      );
    }

    throw new BrowserAiOperationError(
      `Browser AI ${operation} failed: ${error.message}`,
      {
        cause: error,
      }
    );
  }

  if (error instanceof Error) {
    throw new BrowserAiOperationError(
      `Browser AI ${operation} failed: ${error.message}`,
      {
        cause: error,
      }
    );
  }

  throw new BrowserAiOperationError(
    `Browser AI ${operation} failed with an unknown error.`
  );
}

/**
 * parseStructuredResponse — преобразует сырой JSON-ответ модели в значение ожидаемого типа.
 * Форму ответа во время выполнения не проверяет: параметр типа отражает только ожидание
 * вызывающего кода.
 *
 * @template T ожидаемая форма результата
 * @param rawResponse сырой текстовый ответ модели
 * @param operation краткое имя операции для текста ошибки разбора
 * @returns результат `JSON.parse` в ожидаемом типе
 */
export function parseStructuredResponse<T>(rawResponse: string, operation: string): T {
  try {
    return JSON.parse(rawResponse) as T;
  } catch (parseError) {
    normalizeBrowserAiError(
      new BrowserAiParseError(
        `Failed to parse structured browser AI response during ${operation}.`,
        rawResponse,
        { cause: parseError }
      ),
      operation
    );
  }
}

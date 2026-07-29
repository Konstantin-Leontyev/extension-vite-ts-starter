// TODO: ручное ревью — services/browser-ai/errors.ts

export const STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH = 500;

export class BrowserAiUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiUnavailableError';
  }
}

export class BrowserAiAbortedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiAbortedError';
  }
}

export class BrowserAiQuotaExceededError extends Error {
  readonly requested: number;
  readonly contextWindow: number;

  constructor(
    message: string,
    requested: number,
    contextWindow: number,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'BrowserAiQuotaExceededError';
    this.requested = requested;
    this.contextWindow = contextWindow;
  }
}

export class BrowserAiParseError extends Error {
  readonly rawResponseSnippet: string;

  constructor(message: string, rawResponse: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiParseError';
    this.rawResponseSnippet = truncateStructuredResponseSnippet(rawResponse);
  }
}

export class BrowserAiOperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'BrowserAiOperationError';
  }
}

export type BrowserAiError =
  | BrowserAiAbortedError
  | BrowserAiOperationError
  | BrowserAiParseError
  | BrowserAiQuotaExceededError
  | BrowserAiUnavailableError;

function truncateStructuredResponseSnippet(rawResponse: string): string {
  if (rawResponse.length <= STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH) {
    return rawResponse;
  }

  return `${rawResponse.slice(0, STRUCTURED_RESPONSE_SNIPPET_MAX_LENGTH)}…`;
}

export function normalizeBrowserAiError(error: unknown, operation: string): never {
  if (
    error instanceof BrowserAiUnavailableError ||
    error instanceof BrowserAiAbortedError ||
    error instanceof BrowserAiQuotaExceededError ||
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

      throw new BrowserAiQuotaExceededError(
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

/** Runtime shape is not validated; `T` reflects the caller's expected schema only. */
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

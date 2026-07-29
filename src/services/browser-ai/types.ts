// TODO: ручное ревью — services/browser-ai/types.ts

export type BrowserAiAvailability =
  | 'available'
  | 'downloadable'
  | 'downloading'
  | 'unavailable';

/** `loaded` from Prompt API download progress (0–1). */
export type BrowserAiDownloadProgressHandler = (loadedRatio: number) => void;

export type BrowserAiSessionOptions = {
  onDownloadProgress?: BrowserAiDownloadProgressHandler;
  signal?: AbortSignal;
};

export type BrowserAiPromptOptions = {
  omitResponseConstraintInput?: boolean;
  responseConstraint?: Record<string, unknown>;
  signal?: AbortSignal;
};

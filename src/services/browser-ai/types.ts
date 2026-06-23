export type BrowserAiAvailability =
  | 'unavailable'
  | 'downloadable'
  | 'downloading'
  | 'available';

/** `loaded` from Prompt API download progress (0–1). */
export type BrowserAiDownloadProgressHandler = (loadedRatio: number) => void;

export type BrowserAiSessionOptions = {
  signal?: AbortSignal;
  onDownloadProgress?: BrowserAiDownloadProgressHandler;
};

export type BrowserAiPromptOptions = {
  signal?: AbortSignal;
  responseConstraint?: Record<string, unknown>;
  omitResponseConstraintInput?: boolean;
};

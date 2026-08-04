/**
 * Файл: `src/services/browser-ai/types.ts`
 * Определяет типы публичного контракта Browser AI: доступность модели, опции сессии и prompt.
 *
 * Основные задачи:
 * 1. Типизировать доступность модели через `BrowserAiAvailability`
 * 2. Типизировать обработчик прогресса загрузки через `BrowserAiDownloadProgressHandler`
 * 3. Типизировать опции сессии через `BrowserAiSessionOptions`
 * 4. Типизировать опции prompt через `BrowserAiPromptOptions`
 *
 * Потребители:
 *  - `src/services/browser-ai/session.ts` — принимает опции сессии и prompt
 *  - `src/services/browser-ai/index.ts` — реэкспортирует `BrowserAiAvailability`
 */

/**
 * BrowserAiAvailability — представляет состояние доступности локальной языковой модели Prompt API.
 */
export type BrowserAiAvailability =
  | 'available'
  | 'downloadable'
  | 'downloading'
  | 'unavailable';

/**
 * BrowserAiDownloadProgressHandler — представляет обработчик прогресса загрузки модели.
 * Аргумент — доля загруженного из события `downloadprogress` Prompt API, от 0 до 1.
 */
export type BrowserAiDownloadProgressHandler = (loadedRatio: number) => void;

/**
 * BrowserAiSessionOptions — представляет опции создания сессии Browser AI.
 *
 * @property onDownloadProgress — обработчик прогресса загрузки модели
 * @property signal — сигнал отмены создания сессии
 * @property systemPrompt — системная инструкция сессии через `initialPrompts` Prompt API
 */
export type BrowserAiSessionOptions = {
  onDownloadProgress?: BrowserAiDownloadProgressHandler;
  signal?: AbortSignal;
  systemPrompt?: string;
};

/**
 * BrowserAiPromptOptions — представляет опции одного вызова prompt.
 *
 * @property omitResponseConstraintInput — включает скрытие схемы `responseConstraint` из входного текста модели
 * @property responseConstraint — JSON Schema для структурированного ответа
 * @property signal — сигнал отмены prompt
 */
export type BrowserAiPromptOptions = {
  omitResponseConstraintInput?: boolean;
  responseConstraint?: Record<string, unknown>;
  signal?: AbortSignal;
};

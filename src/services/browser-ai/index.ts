/**
 * Файл: `src/services/browser-ai/index.ts`
 * Содержит точку входа сервиса Browser AI: реэкспорт проверки доступности, создания сессии,
 * классов ошибок, нормализации и публичных типов.
 *
 * Основные задачи:
 * 1. Реэкспортировать `checkBrowserAiAvailability` и `createBrowserAiSession`
 * 2. Реэкспортировать типы `BrowserAiAvailability`, `BrowserAiError` и `BrowserAiSession`
 * 3. Реэкспортировать классы `BrowserAiUnavailableError`, `BrowserAiAbortedError`,
 *    `BrowserAiQuotaError`, `BrowserAiParseError` и `BrowserAiOperationError`
 * 4. Реэкспортировать `normalizeBrowserAiError`
 *
 * Потребители:
 *  - `src/components/model-download-gate/use-browser-ai-bootstrap.ts` — проверяет доступность,
 *    создаёт сессию при загрузке модели и нормализует ошибки
 *  - `src/pages/showcase/browser-ai-smoke-probe/index.tsx` — выполняет дымовой прогон Prompt API
 *    в витрине
 */

import {
  BrowserAiAbortedError,
  BrowserAiOperationError,
  BrowserAiParseError,
  BrowserAiQuotaError,
  BrowserAiUnavailableError,
  normalizeBrowserAiError,
  type BrowserAiError,
} from './errors';
import {
  checkBrowserAiAvailability,
  createBrowserAiSession,
  type BrowserAiSession,
} from './session';
import { type BrowserAiAvailability } from './types';

export {
  BrowserAiAbortedError,
  BrowserAiOperationError,
  BrowserAiParseError,
  BrowserAiQuotaError,
  BrowserAiUnavailableError,
  checkBrowserAiAvailability,
  createBrowserAiSession,
  normalizeBrowserAiError,
  type BrowserAiAvailability,
  type BrowserAiError,
  type BrowserAiSession,
};

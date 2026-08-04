/**
 * Файл: `src/services/browser-ai/index.ts`
 * Содержит точку входа сервиса Browser AI: реэкспорт проверки доступности, создания сессии
 * и публичных типов.
 *
 * Основные задачи:
 * 1. Реэкспортировать `checkBrowserAiAvailability` и `createBrowserAiSession`
 * 2. Реэкспортировать типы `BrowserAiAvailability` и `BrowserAiSession`
 *
 * Потребители:
 *  - `src/components/model-download-gate/use-browser-ai-bootstrap.ts` — проверяет доступность
 *    и создаёт сессию при загрузке модели
 *  - `src/pages/showcase/browser-ai-smoke-probe/index.tsx` — выполняет дымовой прогон Prompt API
 *    в витрине
 */

import {
  checkBrowserAiAvailability,
  createBrowserAiSession,
  type BrowserAiSession,
} from './session';
import { type BrowserAiAvailability } from './types';

export {
  checkBrowserAiAvailability,
  createBrowserAiSession,
  type BrowserAiAvailability,
  type BrowserAiSession,
};

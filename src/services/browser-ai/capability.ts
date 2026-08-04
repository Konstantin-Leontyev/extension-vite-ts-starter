/**
 * Файл: `src/services/browser-ai/capability.ts`
 * Определяет проверку наличия Prompt API `LanguageModel` в текущем контексте.
 *
 * Основные задачи:
 * 1. Предоставить функцию `hasBrowserAiSupport`
 *
 * Потребители:
 *  - `src/services/browser-ai/session.ts` — проверяет поддержку перед созданием сессии
 *    и проверкой доступности
 */

/**
 * hasBrowserAiSupport — возвращает, доступен ли глобальный `LanguageModel` в текущем контексте.
 *
 * @returns `true`, если `LanguageModel` есть в `globalThis`
 */
export function hasBrowserAiSupport(): boolean {
  return 'LanguageModel' in globalThis;
}

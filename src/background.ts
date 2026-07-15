/**
 * Файл: `src/background.ts`
 * Обрабатывает клик по иконке расширения в service worker.
 *
 * Основные задачи:
 * 1. Открывать вкладку с интерфейсом по клику на иконку расширения
 *
 * Потребители:
 *  - `src/manifest.json` — регистрирует файл как service worker
 */

/**
 * handleActionClick — открывает вкладку с интерфейсом расширения.
 */
function handleActionClick(): void {
  void chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
}

chrome.action.onClicked.addListener(handleActionClick);

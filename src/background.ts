/**
 * Файл: `src/background.ts`
 * Задаёт открытие страницы `chrome.sidePanel` по клику на иконку расширения в service worker.
 *
 * Основные задачи:
 * 1. Открывать страницу `chrome.sidePanel` по клику на иконку расширения
 *
 * Потребители:
 *  - `src/manifest.json` — регистрирует файл как service worker
 */

/**
 * Открывает страницу `chrome.sidePanel` по клику на иконку расширения.
 */
void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

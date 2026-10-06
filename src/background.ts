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
 * Создаёт вкладку по адресу `index.html` пакета расширения.
 */
function handleActionClick(): void {
  void chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
}

/**
 * Клик по иконке расширения вызывает `handleActionClick`.
 */
chrome.action.onClicked.addListener(handleActionClick);

/**
 * Код ниже закомментирован, чтобы не мешать работе стартера и демонстрации витрины.
 * В продукте его берут как готовую механику и не придумывают реализацию заново:
 * клик по иконке расширения открывает `chrome.sidePanel`.
 * Порт, вкладки и список субтитров в пример не входят.
 */
// void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

/**
 * Файл: `playwright.config.ts` в корне проекта
 * Задаёт запуск Playwright-прохода доступности.
 * Поднимает Vite через `npm run dev`, читает origin из вывода и отдаёт его сценариям.
 *
 * Основные задачи:
 * 1. Задать каталог сценариев `e2e/a11y` и репортёр `list`
 * 2. Поднять `webServer` Vite и прочитать origin из stdout
 *
 * Потребители:
 *  - команда `test:a11y` из `package.json` — запускает `playwright test` с этим конфигом
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  testDir: './e2e/a11y',
  use: {
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: false,
    stdout: 'pipe',
    timeout: 180_000,
    wait: {
      stdout: /Local:\s+\S*?(?<vite_origin>https?:\/\/(?:localhost|127\.0\.0\.1):\d+)/,
    },
  },
});

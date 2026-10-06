# Side Panel — нативный хост панели

Второй хост панели — нативный `chrome.sidePanel`. Окно делит сам браузер:
страница вкладки не оборачивается и не сдвигается. Компонент `@ui/sidebar`
этот сценарий не покрывает и остаётся каркасом собственных страниц приложения.

## Что есть

### 1. Манифест (`src/manifest.json`)

- Ключ `"side_panel": { "default_path": "src/side-panel/index.html" }`.
- Permission `"sidePanel"`.

### 2. Точка входа

- `index.html` и `main.tsx` — отдельная страница расширения. Сборку
  подхватывает `vite-plugin-web-extension` по ссылке из манифеста.
- Провайдер — `ThemeProvider` стартера. `GlobalResetStyle` и
  `GlobalThemeStyle` подключает он.

### 3. Каркас страницы

- `GlobalSidePanelStyle` задаёт прозрачный фон `html` и `body`, чтобы
  просвечивал хром панели Chrome.
- Корень — `StyledSidePanel`: `<main>` с сеткой и отступом между детьми.
- Наполнение — `Toolbar` из `@ui/toolbar` с коротким рядом действий-заглушкой:
  поиск, настройки, закрытие. Ширину задаёт браузер.

### 4. Background (`src/background.ts`)

- `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` —
  открытие панели по клику на иконку расширения.

## Вне объёма

- Инъекция панели в DOM чужих страниц.
- Рендер перехваченной страницы внутри собственного контейнера.
- Изменения `@ui/sidebar`.
- Порт к background, привязка вкладки и чтение содержимого вкладки.

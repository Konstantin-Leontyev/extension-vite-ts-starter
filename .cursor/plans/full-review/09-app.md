# Полное ревью · область 09 — прикладной слой вокруг примитивов

**Проект:** `extension-vite-ts-starter`
**Область:** `src/components/**`, `src/context/**`, `src/hooks/**`, `src/services/**`, `src/pages/home`, `src/pages/privacy`, `src/pages/terms`, `src/main.tsx`, `src/background.ts`
**Вне зоны:** витрина и `src/ui/**` — только как эталон
**Режим:** только анализ; код не правился; линтеры не гонялись; полный аудит `comments.mdc` не гонялся (только противоречия комментария коду)

---

## Находки

1. [UI · a11y] `src/components/profile-menu/index.tsx:197–207`
   **Что не так:** панель — `role="dialog"` + `aria-modal={true}`, но в `AnchoredPortal` не передан `onOpenFocus`. Фокус остаётся на триггере; Tab-trap висит на `panelRef` и не удерживает клавиатуру, пока фокус вне панели. Эталонные anchored-виджеты всегда передают `onOpenFocus`.
   **Как должно быть:** при открытии перевести фокус в панель; возврат на триггер уже даёт `returnFocusRef`.
   **Канон:** §13.4; distill semantic / popover ARIA.

2. [UI · дубль] `home.styles.ts:24–27` / `privacy.styles.ts:24–27` / `terms.styles.ts:24–27`
   **Что не так:** три байт-в-байт одинаковых `styled.main` (`display: grid` + `padding: getSpacingValue(16)`).
   **Как должно быть:** один общий корневой узел страницы (`StyledAppPage`), тонкие `index.tsx`.
   **Канон:** §1.1; дубли.

3. [UI · дубль] `profile-menu/index.tsx:166–179` vs `hooks/use-anchored-open.ts:26–48`
   **Что не так:** локальные `useState` + `handleClose` / `handleToggle` повторяют контракт `useAnchoredOpen`.
   **Как должно быть:** взять хук; `triggerRef` оставить локальным.
   **Канон:** §13.4; дубли.

4. [БИЗНЕС-ЛОГИКА · краевой] `components/model-download-gate/use-browser-ai-bootstrap.ts:118–147`
   **Что не так:** у `probeAvailability` есть флаг `cancelled`, у `runDownload` — нет: после размонтирования состояние всё ещё пишется, повторный клик запускает вторую параллельную загрузку.
   **Как должно быть:** `AbortSignal` + поколение запроса; игнор результата после unmount; guard на время загрузки.
   **Канон:** §9.2; §13.7.

5. [БЕКЕНД · API] `services/browser-ai/index.ts:24–29` vs `errors.ts:26–99`
   **Что не так:** классы ошибок не реэкспортируются барелем — `catch` требует deep-import.
   **Как должно быть:** реэкспорт классов ошибок из `@services/browser-ai`.
   **Канон:** §2.4; §13.7.

6. [UI · мёртвый экспорт] `services/browser-ai/errors.ts:94–99` (`BrowserAiError`)
   **Что не так:** union экспортирован, никем не импортируется.
   **Как должно быть:** в публичный барель и реальные сигнатуры либо снять `export`.
   **Канон:** §2.4.

7. [UI · landmarks] `model-download-gate.styles.ts:26` / `index.tsx:167–169`
   **Что не так:** активный гейт — единственный view, но корень `div`, страничного `<main>` нет.
   **Как должно быть:** корень активного гейта — `<main>`.
   **Канон:** distill semantic / landmarks.

8. [UI · a11y] `pages/home/index.tsx:24–26`
   **Что не так:** `<main>` без заголовка страницы; Privacy и Terms дают `h1`.
   **Как должно быть:** `Text as="h1"` или скрытый заголовок.
   **Канон:** distill semantic / landmarks.

9. [БИЗНЕС-ЛОГИКА · краевой] `use-browser-ai-bootstrap.ts:87–97`
   **Что не так:** `'downloadable'` и `'downloading'` дают одну фазу — при идущей загрузке снова кнопка Download.
   **Как должно быть:** `'downloading'` → фаза загрузки с прогрессом.
   **Канон:** §13.7.

10. [БИЗНЕС-ЛОГИКА · краевой] `use-browser-ai-bootstrap.ts:98–107`, `:138–146`
    **Что не так:** в `catch` в состояние кладётся только `instanceof Error`, иначе ошибка без текста.
    **Как должно быть:** нормализация или запасной `Error` с текстом.
    **Канон:** §13.7.

11. [UI · дубль обработчиков] `use-browser-ai-bootstrap.ts:150–156`
    **Что не так:** `startDownload` и `retryDownload` идентичны.
    **Как должно быть:** один колбэк либо разная семантика.
    **Канон:** дубли.

12. [БИЗНЕС-ЛОГИКА · краевой] `context/theme/index.tsx:47–54`, `:72–74`
    **Что не так:** `localStorage` без `try/catch` — падение при блокировке storage.
    **Как должно быть:** try/catch и запасное хранение в памяти.
    **Канон:** §9.2.

---

## Дубли и вынос

| Что | Где сейчас | Куда выносить |
|-----|------------|---------------|
| `styled.main` + padding страницы | home / privacy / terms | общий `StyledAppPage` |
| open-state + close/toggle + panelRef | `profile-menu/index.tsx` | `@hooks/use-anchored-open` |
| `startDownload` ≡ `retryDownload` | `use-browser-ai-bootstrap.ts` | один колбэк |
| Маппинг availability → «нужна загрузка» | bootstrap / smoke-probe | чистая функция у `@services/browser-ai` |

Не дефект: локальный `applyProfileMenuPanelPosition`; `body:has(> header[…])` при `<body id="root">`. Противоречий комментариев коду не найдено.

---

## Кандидаты в канон

1. Полноэкранный gate-view обязан дать один `<main>`.
2. App anchored-dialog в `components/` — тот же контракт §13.4 (`onOpenFocus`, `useAnchoredOpen`).
3. §13.7: классы ошибок драйвера реэкспортируются барелем.
4. Общий styled-корень для страниц-заглушек.
5. Таблица `BrowserAiAvailability` → UI-фаза, где `downloading` ≠ `downloadable`.

---

## Требует решения пользователя

1. Жёсткий production-гейт против мягкого обхода без Prompt API.
2. Только `StyledAppPage` или ещё общий компонент страницы-заглушки с заголовком.
3. Поведение темы при недоступном `localStorage`: молча светлая или сигнал пользователю.

---

## Итог

Требуется исправление находок 1–12. Мемоизация в области без нарушений §9.1. `background.ts` и `main.tsx` — замечаний нет. Смешение UI и логики у гейта приемлемо: фазы в компоненте, загрузка в хуке и сервисе.

**Подпись:** Ревьюер cursor-grok-4.5 (project-reviewer)

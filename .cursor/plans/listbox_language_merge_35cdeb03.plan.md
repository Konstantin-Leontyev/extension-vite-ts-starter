---
name: Listbox language merge
overview: Combobox вливается в Listbox. LocalePicker — обёртка с полным iso-639-1 по умолчанию. Витрина и снимки — срез из 10 локалей (пример среза). Тот же срез вложен в превью Toolbar через слот control. Снимки Listbox → LocalePicker → Toolbar по очереди, отдельными субагентами.
todos:
  - id: canon-listbox
    content: "Этап 1: канон — все пункты этого файла"
    status: completed
  - id: merge-listbox
    content: "Этап 2: слить Listbox + снимок Listbox"
    status: completed
  - id: locale-picker
    content: "Этап 3: LocalePicker, срез 10, секция витрины + снимок"
    status: completed
  - id: toolbar-slot
    content: "Этап 4: слот Toolbar, LocalePicker в превью, снимок Toolbar"
    status: completed
  - id: lite-parity
    content: "Паритет lite — снят с очереди, не делать"
    status: cancelled
isProject: false
---

# Слияние списка и выбор языка

Справочник действий. Лид режет этапы в промпты оркестратору. Один этап — один прогон оркестратора (coder → commenter → узкий ревьюер на дубли). Снимки доступности — после ревью лида по полному диффу этапа, отдельным субагентом, не внутри оркестратора кода.

## Термины

- **Наш API** — пропсы Listbox и LocalePicker (`showSearch`, `options`, `appearance`).
- **API либы имён** — функции пакета `iso-639-1`. Их импортирует только модуль перечня языков.
- **Компонент** — корень контрола. Снимок и клавиши — только он.
- **Виджет** — карточка секции витрины. Рамку не снимать и не обходить.
- **Панель настроек** — `*-settings/`. Не виджет и не компонент.
- **Срез витрины** — ровно 10 кодов, файл витрины. Пример, как продукт передаёт короткий `options`. Дефолт LocalePicker по-прежнему полный перечень либы.

## Нативный select

Не используется. Панель — `ul` и строки. Имя — **Listbox**. Combobox удаляется. `as` тег списка не переключает.

## Две техники

1. **`appearance` на Listbox:** `field` | `icon`, дефолт `field`. LocalePicker пробрасывает, своего вида не заводит. SearchField и Input `appearance` не получают. Общий примитив «вид» не выносится.
2. **Слот Toolbar.** `actions`: обычное действие или `{ control: ReactNode }`. Язык пропом Toolbar не вшивается. В `IconButtonRow` дефолта языка нет: Card, Modal, Sidebar его не получают.

## Пакеты

| Слой | seolizer сейчас | стартер |
| --- | --- | --- |
| Коды и имена | Таблица `LOCALES`, без `iso-639-1` | `iso-639-1`, полный перечень в модуле |
| Флаги | `country-flag-icons` | Тот же пакет. Эталон: seolizer `locale-switcher` |
| Контрол | Combobox + `option.icon` | Listbox / LocalePicker |
| Semrush `db` | В `LOCALES` | В стартер не копировать |

Импорт: `import ISO6391 from 'iso-639-1'`. Не принимает default — адаптер в модуле перечня. Нет SVG — глиф Earth. `language-subtag-registry` и `pk-lang-codes` не ставить.

## Контракт Listbox

1. `showSearch: boolean`, дефолт `false`. Чекбокс панели витрины Listbox = этот проп.
2. Прокрутка: 6 строк, обычный скролл. Барабан снимается. Пропа `scrollable` нет.
3. `multiple` / `inlineCheckbox` от поиска не зависят.
4. В строке **либо** `option.icon`, **либо** чекбокс. Тип запрещает оба сразу.
5. LocalePicker: флаг в каждой строке; на экране родное имя; поиск по родному, английскому и коду; `showSearch` всегда `true`; дефолт `options` — весь `getAllCodes()` с флагами.
6. Секция Combobox снимается. Секция Listbox. Секция LocalePicker со срезом.
7. [`showcase-icon-options.tsx`](src/pages/showcase/showcase-icon-options.tsx): `COMBOBOX_OPTIONS` → `ICON_OPTIONS`, тип `ListboxOption`.

## Срез витрины — 10 кодов

Файл только витрины (не `@ui/`), например `src/pages/showcase/locale-slice.ts`. Собирает `options` через тот же модуль перечня / флаги, что LocalePicker. Коды зафиксированы:

`en`, `ru`, `de`, `fr`, `es`, `ja`, `zh`, `ar`, `pt`, `ko`

Секция LocalePicker и превью Toolbar берут этот срез. Полный перечень в открытый снимок и в обход не попадает.

## Снимки доступности

Корень компонента, не карточка. Открытый полный iso-639-1 не снимать.

- **Listbox** (этап 2): закрытый триггер; открытая панель без поиска; открытая с поиском. После ревью лида — `npx playwright test e2e/a11y/listbox.spec.ts` (сценарий по образцу закрытых виджетов).
- **LocalePicker** (этап 3): закрытый; открытый со срезом (поиск + 10 строк с флагами). Свой сценарий `e2e/a11y/locale-picker.spec.ts`.
- **Toolbar** (этап 4): закрытый ряд — вложенный LocalePicker (вид `icon`) плюс четыре иконки. Сценарий [`toolbar.spec.ts`](e2e/a11y/toolbar.spec.ts): одна остановка Tab, стрелки / Home / End по ряду включая триггер выбора языка. Панель языка в снимке Toolbar не открывать. Открытое дерево, поиск и обход 10 строк — только `locale-picker.spec.ts`.
- **Чья клавиша.** Пока выбор языка закрыт и фокус на его триггере в Toolbar: стрелки (включая вниз) двигают ряд, как у остальных действий §11.4. Открывает `Enter` / пробел. Когда панель уже открыта — стрелки принадлежат списку (§11.5). В сценарии Toolbar допустим короткий дым: `Enter` на триггере → панель видна → `Escape` → фокус снова на триггере. Обход опций и второй снимок открытого выбора языка оттуда не делать.

## Этап 1 — канон

[`project.mdc`](.cursor/rules/project.mdc), [`showcase.mdc`](.cursor/rules/showcase.mdc): контракт, две техники, срез 10, слот, LocalePicker в секции и в превью Toolbar, XOR, пакеты. §11.5 без барабана и без отдельного Combobox. Панель Listbox — `Show search`. Код не писать.

**Промпт:** coder — только эти два `.mdc`. commenter на них. Узкий прогон на дубли.

## Этап 2 — Listbox

- [`src/ui/listbox`](src/ui/listbox/index.tsx): `showSearch`, icon XOR checkbox, скролл 6, `appearance`.
- Combobox витрины → Listbox. Удалить [`src/ui/combobox`](src/ui/combobox).
- Icon-options → `ICON_OPTIONS`.
- Пакеты языков не ставить. Тип `Toolbar.actions` не менять.
- После ревью лида — субагент снимка Listbox.

**Промпт кода:** `src/ui/listbox/**`, удаление combobox, `src/pages/showcase/**` импорты Combobox. Этап 3 не открывать.

## Этап 3 — LocalePicker и срез

- `npm install iso-639-1 country-flag-icons` без опций.
- Модуль перечня + язык→страна + флаг. Эталон seolizer, без `db`.
- LocalePicker пробрасывает `appearance` и `options`.
- Срез 10 в файле витрины. Секция LocalePicker на срезе.
- После ревью лида — субагент снимка LocalePicker.

**Промпт кода:** импорт default `iso-639-1`; адаптер при ошибке tsc. Toolbar.actions и снимок Toolbar не трогать.

## Этап 4 — Toolbar

- `IconButtonRowAction`: действие или `{ control }`. Слот в обходе стрелок. Фокус — первая `button` внутри `control`.
- Превью Toolbar: первый элемент — `{ control: <LocalePicker appearance="icon" options={срез} /> }`. Остальные четыре — IconRowGroup как сейчас.
- После ревью лида — субагент: правка `toolbar.spec.ts` + пересъём `toolbar.json`. Панель языка не открывать.

**Промпт кода:** `src/ui/icon-button-row/**`, [`src/ui/toolbar`](src/ui/toolbar/index.tsx), сборка превью в [`src/pages/showcase/index.tsx`](src/pages/showcase/index.tsx) и [`toolbar-settings`](src/pages/showcase/toolbar-settings/index.tsx). Listbox/LocalePicker не переписывать.

## Этап 5 — lite

Снят с очереди. `vite-ts-starter-lite` не трогаем. Шаг 4 витрины — [16-remaining-route.md](.cursor/plans/full-review/16-remaining-route.md).

## Граница плана

- Caption-downloader не входит.
- seolizer — **project-puller**: `LOCALES`/`db` остаются; Combobox → Listbox / LocalePicker.

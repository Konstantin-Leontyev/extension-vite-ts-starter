# Полное ревью · область 03 — открывающиеся контролы и портал

**Проект:** `extension-vite-ts-starter`
**Область:** `src/ui/listbox`, `src/ui/combobox`, `src/ui/range-input`, `src/ui/date-range-input`, `src/ui/anchored-portal`
**Эталон (без замечаний по нему):** `src/ui/open-control.ts`
**Дата:** 2026-08-12

---

## Находки

### 1. `src/ui/listbox/index.tsx:586` / отсутствие обработчиков панели

**Что не так:** У Listbox на триггере только `Escape` / `Enter` / `Space`. В панели нет `ArrowDown` / `ArrowUp` / `Home` / `End`; с триггера нет `ArrowDown` для открытия. Навигация — только Tab по фокусируемым опциям. Combobox при этом держит полный ряд стрелок и `aria-activedescendant`.

**Как должно быть:** Для `role="listbox"` — стрелочная навигация по опциям (и открытие по `ArrowDown` с триггера), в духе §13.4 и паритета с Combobox там, где модель списка общая.

**Канон:** §13.4; сверка контролов (клавиатура панели).

### 2. `src/ui/combobox/index.tsx:574`

**Что не так:** Поиск в панели — `SearchField` с `aria-controls` / `aria-expanded` / `aria-activedescendant`, но без `role="combobox"` и без `aria-autocomplete`. Триггер остаётся `aria-haspopup="listbox"`, а фокус при открытии уходит в search — классический combobox-паттерн на поле не замкнут.

**Как должно быть:** На поле поиска (или на узле, который APG считает combobox) — `role="combobox"`, `aria-autocomplete="list"` (и согласованные `aria-*`), либо явно зафиксированный альтернативный контракт в каноне.

**Канон:** §13.4, §11.

### 3. `src/ui/listbox/listbox.styles.ts:159` · `:273` · `:322`

**Что не так:** Вид и отступы `Text` / цвет `Icon` задаются селекторами родителя: `[data-slot='label']` (padding, min-inline-size, z-index) и `[data-slot='check']` (color на hover/focus). Combobox уже кладёт padding на `StyledComboboxValue` и layout-пропы на `Text`/`Icon` в JSX.

**Как должно быть:** По лестнице §8.4 — layout и вид ребёнка пропом в JSX; для подсветки выбора — канал или проп, а не адресация `[data-slot]` из генератора родителя. Эталон раскладки значения — Combobox.

**Канон:** §8.4; §10 (исключение inverse при primary-подсветке ряда — про цвет, не про селектор).

### 4. `src/ui/combobox/combobox.styles.ts:372`

**Что не так:** Тот же обход лестницы: `&[data-active] … [data-slot='check'] { color: inherit }` и hover/focus-ветки красят Icon селектором.

**Как должно быть:** Состояние опции → канал или проп Icon; без CSS-адресации чужого слота.

**Канон:** §8.4.

### 5. `src/ui/range-input/index.tsx:582`

**Что не так:** На ряде-триггере выставляется `data-active={isActive}`, но в `range-input.styles.ts` / `open-control` селекторов на `data-active` нет. Атрибут мёртвый (в Combobox `data-active` живёт на опции и читается стилями).

**Как должно быть:** Либо стили/поведение, завязанные на атрибут, либо удаление атрибута.

**Канон:** §10 (декларация/механика, которая не применяется); §9.1 (состояние без потребителя).

### 6. `src/ui/combobox/index.tsx:344`

**Что не так:** Есть `searchInputRef`, но `focusComboboxSearch` ищет `input[type="search"]` через `querySelector` по панели. Хрупкая связь с разметкой `SearchField` при уже имеющемся ref.

**Как должно быть:** Фокус через `searchInputRef.current?.focus()` (или стабильный контракт ref у `SearchField`).

**Канон:** §13.4 (фокус при открытии); дух §8.4.

### 7. `src/ui/date-range-input/index.tsx:400`

**Что не так:** `Enter` в панели различает Reset / Close / Set сравнением `textContent` кнопки с константами лейблов. Ломается при смене текста, i18n и совпадении подписи.

**Как должно быть:** Стабильный признак действия (`data-action`, отдельный handler на кнопке, `type`/`name`) — не текст узла.

**Канон:** §13.4; §12 п. 14; кандидат в канон — запрет матчинга UI-действия по `textContent`.

### 8. `src/ui/range-input/index.tsx:252` (тип `RangeInputProps`)

**Что не так:** В отличие от Listbox / Combobox / DateRangeInput, корень не принимает `ComponentPropsWithRef<'div'>` (нет транзита `id`, `data-*`, `aria-*` на оболочку). При общей семье open-control API корня разошлись.

**Как должно быть:** Тот же контракт корневого `div`, что у соседних open-контролов, либо явное решение «RangeInput — без DOM-остатка».

**Канон:** §8.1; §1.1 (каскад паттерна).

### 9. КОММЕНТАРИИ · `listbox.styles.ts:129` · `combobox.styles.ts:129` · `range-input.styles.ts:132`

**Что не так:** JSDoc генераторов триггера обещает «шов и канал состояний». В теле генератора шва нет — рамка секции на `Icon` (`showBorder`), как в `icons.mdc`. Комментарий противоречит коду.

**Как должно быть:** Описание = раскладка + канал `--icon-state-background`; шов не упоминать как ответственность генератора триггера.

**Канон:** `comments.mdc` §1.7; `icons.mdc`.

### 10. `src/ui/listbox/index.tsx:619` vs `src/ui/combobox/index.tsx:607` (разметка опций)

**Что не так:** После перевода поиска Combobox на `SearchField` самодельной строки поиска не осталось (следов `StyledComboboxSearch*` нет — ок). Но единообразие **списка** с Listbox потеряно сильнее, чем требует наличие поиска:

| Аспект | Listbox | Combobox |
|--------|---------|----------|
| `role="option"` | на `<li>` | на `<button>`, `<li role="presentation">` |
| Активный элемент | DOM-фокус | `data-active` + `aria-activedescendant` |
| Клавиатура панели | нет стрелок | полный ряд |
| Галочка | колонка grid | `marginInlineStart="auto"` во flex |
| Подсветка check | `color: inverse` селектором | `color: inherit` селектором |

**Как должно быть:** Общая сателлитная модель опции (разметка + active + check) для обоих; отличия — только слой поиска и фильтрации.

**Канон:** §13.4; §1.1; distill anchored-portal / open-control паритет.

### 11. `listbox/index.tsx:22` / `combobox/index.tsx:22` vs `range-input/index.tsx:242` / `date-range-input/index.tsx:16`

**Что не так:** Две публичные схемы включения сброса: `showClear` (Listbox, Combobox) против «кнопка есть, если передан `onClear`» (RangeInput, DateRangeInput). Одна роль UX — два API.

**Как должно быть:** Одна ось (предпочтительно явный `showClear` + `onClear` по контракту), либо записанное исключение в каноне.

**Канон:** §12 п. 2; §8.1.

---

## Дубли и вынос

1. **Хром кнопки-триггера (grid + `getIconPositionStyles` + канал `--icon-state-background`)**
   Почти дословно: `getListboxTriggerStyles` (`listbox.styles.ts:146`), `getComboboxTriggerStyles` (`combobox.styles.ts:146`), `getRangeInputTriggerStyles` (`range-input.styles.ts:149`).
   **Куда:** `getOpenControlTriggerStyles` в `src/ui/open-control.ts` (параметр `textAlign`: `start` | `center`).

2. **`resolve*BlockRadius` = `resolveBlockRadius(shape, getMinBlockSize(sizePreset))`**
   Listbox `:67`, Combobox `:67`, RangeInput `:67`, DateRangeInput `:82`.
   **Куда:** `resolveOpenControlBlockRadius` в `@ui/open-control`.

3. **`getListboxTextSize` / `getComboboxTextSize` / `getRangeInputTextSize`**
   Один lookup `getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET)`.
   **Куда:** `getOpenControlTextSize` в `@ui/open-control`.

4. **`LISTBOX_PANEL_MAX_OPTION_ROWS` и `COMBOBOX_PANEL_MAX_OPTION_ROWS` (= 6)**
   `listbox.styles.ts:195`, `combobox.styles.ts:275`.
   **Куда:** `OPEN_CONTROL_PANEL_MAX_OPTION_ROWS` в `@ui/open-control`.

5. **Поверхность опции: `::before` inset/radius/transition + surface + min-block-size**
   `getListboxOptionSurfaceBaseStyles` (`listbox.styles.ts:257`) и тело `getComboboxOptionStyles` (`combobox.styles.ts:341`). Range preset (`range-input.styles.ts:283`) — тот же каркас с вуалью вместо primary.
   **Куда:** хелпер в `@ui/open-control` (базовый слой + параметр заливки hover: `primary` | `veil`).

6. **JSX сброса выбора (`Icon as="button"` + `data-slot="clear"` + `resolveClearAriaLabel` + `CloseIcon`)**
   Listbox `:492`, Combobox `:325`, RangeInput `:555` (DateRange — вариант с составным aria-label).
   **Куда:** общий узел clear в `@ui/open-control` или `@ui/a11y`; `handleClear` оставлять локально.

7. **Измерение/позиционирование панели** — разведено через `positionStrategy`, дублей нет; край везде `PORTAL_VIEWPORT_EDGE_INSET`.

8. **Dismiss / focus-trap** — всё через `AnchoredPortal`, локальных копий нет. Замечаний нет.

9. **Следы самодельного поиска Combobox** — не осталось; расхождение с Listbox в модели опций и клавиатуры (находка 10).

---

## Кандидаты в канон

1. **Дубли** — новый подраздел чеклиста с критериями из задания ревью.
2. **Паритет open-control панели:** клавиатура списка, роль и место `option`, канал active, clear API — зафиксировать «общее vs допустимые отличия».
3. **Запрет матчинга действия панели по `textContent`** (находка 7).
4. **Combobox + SearchField:** при врезке примитива поиска в портал обязательны `role="combobox"` / `aria-autocomplete`.
5. **Уточнение §8.4 vs §10:** primary-подсветка обязывает inverse по контрасту, но путь применения — проп или канал, не селектор.

---

## Требует решения пользователя

1. **API сброса:** унифицировать на `showClear` + `onClear` или записать исключение для range/date.
2. **Модель активного пункта Listbox:** подтянуть к Combobox или оставить DOM-фокус, добавив стрелки.
3. **RangeInput и DOM-остаток корня:** добавлять ли транзит атрибутов как у соседей.
4. **Вынос общего хрома в `open-control.ts`:** одним каскадом или поэтапно.

---

## AnchoredPortal (кратко)

`anchored-portal/index.tsx` + `getPortalPanelStyles`: dismiss, focus-trap, позиционирование, `onOpenFocus` и `openFocusDeps` собраны правильно; виджеты портал не копируют. Отдельных дефектов модуля не зафиксировано.

---

## Итог

Требуется исправление: 11 находок плюс блок дублей. Портал и отказ от самодельного поиска Combobox в порядке; основные риски — a11y клавиатуры и ролей, лестница §8.4 на опциях, мёртвый `data-active` у RangeInput, расхождение API clear и копипаст хрома триггера.

**Подпись:** Ревьюер Cursor Grok 4.5 (project-reviewer)

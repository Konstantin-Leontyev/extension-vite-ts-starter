# Полное ревью · область 10 — сквозные дубли между компонентами

**Проект:** `extension-vite-ts-starter`
**Область:** повторы поверх границ модулей в `src/**` (CSS-блоки, логика, хелперы-двойники, магические литералы, обёртки без задачи)
**Канон:** `project.mdc` (преамбула, глоссарий, §2, §4, §7, §8, §10, §12), `icons.mdc`, `canon-ui-checklist.md`
**Режим:** только анализ; код не правился; линтеры не гонялись; комментарии не проверялись.

---

## Метод и охват поиска

1. Grep по всему `src/**` на маркеры общих модулей и паттернов: хелперы пресетов и хрома (`getMinBlockSize`, `getPaddingInline`, `resolveBlockRadius`, `getBorderStyles`, `getOutlineStyles`, `getTextProperties`, `splitLayoutProps`, `getIconPositionStyles`, `resolveIconStateBackground`, `getPortalPanelStyles`, `getOpenControl*`); портал, dismiss и фокус (`AnchoredPortal`, `createPortal`, `dismissZoneRefs`, `Escape`, `useAnchoredOpen`, `useAnchoredDismiss`, `placeCalendarPanel`, `matchTriggerRect`, `getBoundingClientRect`); список и клавиатура (`activeIndex`, стрелки, `rovingFocus`, `scrollIntoView`); clear, подпись и ошибка (`data-slot='clear'`, `data-has-clear`, `resolveClearAriaLabel`, `FieldLabel`, `FieldError`, `aria-describedby`); натив (`appearance: none`, `::-webkit-search`, `visually-hidden`); двойники и литералы (`get*TextSize`, `resolve*BlockRadius`, `PANEL_MAX_OPTION_ROWS`, `MIN_VISIBLE_OPTION_ROWS`, `debounce`, `getSpacingValue(4|12|16)`).
2. Сопоставление совпадений диффом фрагментов: `listbox` ↔ `combobox` ↔ `range-input` ↔ `date-range-input`; `search-field` ↔ `input`; `sidebar` ↔ `scroll-port`; локальные `apply*PanelPosition` ↔ `@hooks/use-anchored-portal-position`.
3. Инвентаризация уже вынесенного, чтобы не считать долгом: `@ui/open-control`, `@ui/anchored-portal` и `getPortalPanelStyles`, хуки anchored, `@ui/a11y`, хелперы секции Icon, `@ui/presets` / `@ui/border` / `@ui/outline` / `@ui/viewport`.
4. Вне охвата: внутрипакетные повторы, полнота API отдельного пакета, витрина как потребитель, комментарии, линт.

---

## Находки

### 1. Тонкие обёртки `resolve*BlockRadius` с одним телом

**Где:** `listbox.styles.ts:67-68`, `combobox.styles.ts:67-68`, `range-input.styles.ts:67-71`, `date-range-input.styles.ts:82-90`; потребление колбэка — `listbox.styles.ts:124`, `combobox.styles.ts:124`, `range-input.styles.ts:127`, `date-range-input.styles.ts:120-123`.

**Совпадение:** тело `resolveBlockRadius(shape, getMinBlockSize(sizePreset))` — адаптер под слот `resolveBorderRadius`.

**Предложение:** `resolveOpenControlBlockRadius` в `@ui/open-control` или `@ui/presets`; у DateRangeInput оставить тонкую обёртку только ради локальных дефолтов, саму формулу не копировать.

### 2. Тонкие мосты `get*TextSize` → `getTextSize`

**Где:** `button:56-57`, `checkbox:68-69`, `combobox:56-57`, `listbox:56-57`, `progress-bar:54-55`, `radio-button:54-55`, `range-input:56-57`, `segment-button:43-44`, `spinner:76-77`, `stepper:49-50`, `switch:103-104`, `toast:39-40`. Отклонения с другим дефолтом: `table.styles.ts:82-83`, `calendar-panel.styles.ts:148-149`, `tag.styles.ts:112`.

**Предложение:** оставить. Мост — публичный контракт пакета для витрины и drill-down текста; схлопывание ломает discoverability.

### 3. CSS-поверхность строки опции и пресета (`::before` + inset 4)

**Где:** `listbox.styles.ts:257-286`, `:303-326`; `combobox.styles.ts:335-377`; `range-input.styles.ts:283-313`.

**Совпадение:** каркас строки — `position: relative; z-index: 0; min-block-size; background surface; &::before { inset: spacing(4); z-index: -1; pointer-events: none; border-radius: calc(radius − 4); transition }`, сброс outline, заливка подложки на hover и focus-visible.

**Расхождение:** Listbox — grid со слотами и подсветка `primary` / текст `inverse`; Combobox — flex и `data-active`; RangeInput — без check-слота и подсветка `veil`.

**Предложение:** общий `getSelectableRowSurfaceStyles({ borderRadius, highlight })` в `@ui/open-control` или `@ui/surface`; раскладку слотов оставить локальной.

### 4. Константа максимума видимых строк панели = 6

**Где:** `listbox.styles.ts:195` и формула `:225`; `combobox.styles.ts:275` и формула `:300`; рядом `combobox/index.tsx:76` — `MIN_VISIBLE_OPTION_ROWS = 4`.

**Предложение:** общая константа в `@ui/open-control`; минимум видимых строк класть рядом как соседнюю шкалу.

### 5. Локальный clamp и позиционирование панели Combobox мимо общего хелпера

**Где:** `combobox/index.tsx:226-256` — `applyComboboxPanelPosition` с собственным clamp и physical `left` / `width` / `top` / `maxHeight`; `hooks/use-anchored-portal-position.ts:64-104` — приватный `clampPanelToViewport`, `:121-143` — `placeCalendarPanel`, `:151-157` — `matchTriggerRect`; уже на shared — DateRangeInput и RangeInput; частичный долг записи геометрии — `listbox/index.tsx:386-403`; другая модель — `table/index.tsx:591-631`.

**Предложение:** расширить `@hooks/use-anchored-portal-position` (экспорт clamp и/или `placeTriggerAlignedPanel` с опцией минимума строк), перевести Combobox; у Listbox унифицировать только запись геометрии в логических свойствах; Table оставить локально.

### 6. Оболочка кнопки-триггера с каналом шеврона

**Где:** `listbox.styles.ts:146-170`, `combobox.styles.ts:146-167`, `range-input.styles.ts:149-170`.

**Совпадение:** `display: grid` + `getIconPositionStyles()` + `align-items: center` + `min-inline-size: 0` + запись канала на hover и focus-visible + `outline: none`.

**Предложение:** `getOpenControlChevronTriggerStyles(theme, iconTone, options?)` в `@ui/open-control`; React-компонент триггера не заводить (`icons.mdc`).

### 7. JSX шеврона и clear у трёх контролов

**Где:** `listbox/index.tsx:477-507`, `combobox/index.tsx:310-340`, `range-input/index.tsx:427-444` и `:555-569`; иначе — `search-field/index.tsx:203-220`, `date-range-input`.

**Предложение:** оставить локальную сборку: общий React-компонент запрещён каноном, фабрика JSX дала бы обёртку без задачи.

### 8. Каскад padding edge: Sidebar и ScrollPort

**Где:** `scroll-port.styles.ts:78-115`, `sidebar.styles.ts:186-217`.

**Предложение:** каркас `resolvePaddingEdge(props, edge, defaults)` в `@ui/spacing`; дефолты краёв — параметр пакета.

### 9. Типографика и плейсхолдер нативного поля: Input и SearchField

**Где:** `input.styles.ts:128-167`, `search-field.styles.ts:234-263` (хром ряда — `:146-181`).

**Расхождение по существу:** Input — носитель рамки контрола; SearchField — прозрачное поле внутри ряда со скрытием UA-крестика.

**Предложение:** опционально вынести `getNativeTextFieldContentStyles`; хром и webkit оставить локально. Допустимо не делать.

### 10. Сетка clear у SearchField против open-control

**Где:** `open-control.ts:94-102`, `search-field.styles.ts:172-173`.

**Предложение:** оставить: у SearchField три трека с ведущей иконкой, у open-control — двухколоночная модель; расширять контракт при втором потребителе.

### 11. Магические литералы шкалы панели и строки

**Где:** inset подсветки `getSpacingValue(4)` — `listbox:279,283`, `combobox:354,358`, `range-input:301,305`; зазор `getSpacingValue(12)` — `listbox:267`, `combobox:345`, `range-input:260,338,353`, `date-range-input:163`; padding панели `getSpacingValue(16)` — `range-input:261`, `date-range-input:143`.

**Предложение:** именованные константы рядом с open-control вместе с выносом находок 3 и 4.

### 12. Склейка `aria-describedby` и id ошибки

**Где:** `input/index.tsx:85-91` (полный merge), `range-input/index.tsx:675,690` (без merge), таблица — проброс готовых id.

**Предложение:** оставить; при втором потребителе — `joinAriaIds` в `@ui/a11y`.

### 13. Клавиатурная навигация списка и ряда

**Где:** `combobox/index.tsx:195-207`, `:427-478`; `icon-button-row/index.tsx:140-166`, `:239-275`; `listbox/index.tsx:415-421`.

**Предложение:** не выносить — разные a11y-модели.

### 14. Локальный Escape на триггере при общем dismiss

**Где:** `listbox/index.tsx:586-588`, `combobox/index.tsx:480-483`, `hooks/use-anchored-dismiss.ts:75-78`.

**Предложение:** оставить либо точечно убрать локальную ветку после проверки сценария «фокус на триггере, панель открыта».

### 15. Обёртки без собственной задачи

**Проверено:** `field-label/index.tsx:65-80`, `field-error/index.tsx:104+`, `segment-button/index.tsx:78-117`; `styled(StyledIcon)` в `src/ui/**` не найдено. Замечаний нет.

### 16. Локальные копии инфраструктуры portal и dismiss

**Проверено:** `createPortal` только в `anchored-portal/index.tsx`; Toast — отдельный тип слоя; локальных копий focus-trap и dismiss нет. Единственный позиционный долг — находка 5.

### 17. Скрытие нативных элементов управления

**Где:** `checkbox.styles.ts:274`, `radio-button.styles.ts:126`, `search-field.styles.ts:251-252`, `switch/index.tsx:82`, `reset.ts:189`.

**Предложение:** оставить — одна техника, разные цели.

---

## Ранжирование — наибольший выигрыш при выносе

| Ранг | Находка | Что выносить | Выигрыш | Риск |
|------|---------|--------------|---------|------|
| 1 | 5 | Экспорт clamp и place в хук позиционирования; Combobox, логическая запись у Listbox | Убирает расхождение с каноном портала | Средний: геометрия панели |
| 2 | 3 + 11 | `getSelectableRowSurfaceStyles` + константы inset/gap/padding | Один контракт подсветки строки | Средний: не склеить `primary` и `veil` |
| 3 | 6 + 1 | Хром chevron-триггера и общий резолв радиуса | Добивает начатый open-control | Низкий |
| 4 | 4 | Общая константа максимума строк | Убирает дрейф числа 6 | Низкий |
| 5 | 8 | `resolvePaddingEdge` в `@ui/spacing` | Чистая формула без UI-регрессий | Низкий |
| 6 | 9 | Кусок стилей нативного текстового поля | Малый объём | Низкий, можно не делать |

---

## Выносить не надо

| Тема | Находки | Почему |
|------|---------|--------|
| Мосты `get[Имя]TextSize` | 2 | Публичный контракт имени пакета; тело-делегат ожидаем |
| JSX шеврона и clear | 7 | Общий React-триггер запрещён каноном; фабрика = обёртка без задачи |
| Трёхколоночная сетка SearchField | 10 | Другая композиция, один потребитель |
| Merge `aria-describedby` | 12 | Реальный merge только у Input |
| Клавиатура Combobox / IconButtonRow / Listbox | 13 | Разные a11y-модели |
| Двойной Escape | 14 | Поведение не расходится |
| FieldLabel / FieldError / SegmentButton | 15 | Собственная роль контракта |
| Второй portal/dismiss стек | 16 | Уже централизовано |
| `appearance: none` и visually-hidden | 17 | Одна техника, разные цели |
| Алгоритм circular panel Listbox | часть 5 | Уникальная раскладка |
| Панели add/edit таблицы | часть 5 | Другая модель якоря |

Debounce как сквозной дубль не найден.

---

## Кандидаты в канон

1. **Мосты `get[Имя]TextSize`** — зафиксировать: каждый контрол экспортирует мост имени, тело-делегат; общий экспорт «для всех» не вводить.
2. **Расширение `@ui/open-control`** — допустить общий резолв радиуса, стили chevron-триггера и каркас selectable-row с параметром подсветки; запрет React-компонента-триггера сохранить.
3. **Стратегии позиционирования портала** — новые панели «ширина = триггер» только через экспортируемые хелперы хука; уникальные алгоритмы остаются локальными, но clamp не копируют.
4. **Константы хрома панели** — именовать максимум строк, padding панели, inset подсветки и зазор.
5. **Padding-edge cascade** — общий `resolvePaddingEdge` в `@ui/spacing`, дефолты краёв параметром пакета.

---

## Итог области

Учтено 17 находок. К действию в первую очередь: 5, 3, 6, 1, 4, 8 (опционально 9 и 11 вместе с 3). Остальное — осмысленные расхождения, преждевременный вынос или уже покрыто общими модулями.

**Подпись:** Ревьюер Cursor Grok 4.5 (project-reviewer · cross-duplication)

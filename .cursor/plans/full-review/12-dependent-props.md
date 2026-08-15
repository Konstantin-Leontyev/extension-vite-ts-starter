# Полное ревью · область 12 — зависимые пропы

**Проект:** `extension-vite-ts-starter`  
**Дата обхода:** 2026-08-15  
**Область:** публичные пропы `src/ui/**` (включая сателлиты), `src/components/**`, `src/context/**`  
**Канон приёма:** размеченное объединение на типе пропов примитива, как `SegmentButtonPartsSegments` (`src/ui/segment-button-parts/index.tsx:97-100`) и `StepperAccessibleName` (`src/ui/stepper/index.tsx:115-118`)  
**Режим:** только анализ; код не правился; решения и приоритеты не назначались.

---

## Метод и охват

1. Сняты публичные типы пропов всех `index.tsx` в `src/ui/**`, вложенных пакетов Table и CalendarPanel, `src/components/**` и `src/context/**`.
2. Для каждой пары «ведущий → зависимые» прочитана сборка JSX/стилей: зависимый без ведущего либо не попадает в дерево, либо пишется в разметку, либо меняет вид.
3. Вызовы искались по всему `src/**`, включая витрину `src/pages/showcase`. Утверждение «сломается» значит: текущий вызов передаёт зависимый при отсутствующем ведущем (в том числе `undefined` / `false` на ветке `never`).
4. Уже закрытые объединения (`SegmentButtonPartsSegments`, `StepperAccessibleName`, `TableProps` при `checkable`) в таблицу кандидатов не входят — они в §«Уже закрыто».

---

## Сводка

| Компонент | Ведущий | Зависимые | Цена |
|-----------|---------|-----------|------|
| Card | `title` | `titleAlign`, `titleId`, `titleSizePreset`, `titleTone` | высокая |
| Card | `subtitle` | `subtitleAlign`, `subtitleSizePreset`, `subtitleTone` | высокая |
| Button | `icon` | `iconFill`, `iconPosition`, `iconShape`, `iconTone` | средняя |
| SearchField | `showIcon` | `icon`, `iconPosition`, `iconShape` | средняя |
| Listbox | `multiple` | `inlineCheckbox` | средняя |
| SegmentButtonPartsAction | `icon` | `iconFill`, `iconPosition` | средняя |
| Checkbox | `children` | `textItalic`, `textSize`, `textTone` | средняя |
| RadioButton | `children` | `textItalic`, `textSize`, `textTone` | средняя |
| Switch | `children` | `textItalic`, `textSize`, `textTone` | средняя |
| Tag | `showDot` | `dotTone` | средняя |
| Tag | `children` | `textItalic`, `textSize`, `textTone` | средняя |
| ProgressBar | `showText` | `textItalic`, `textSize`, `textTone` | средняя |
| Table | `editable` | `addError`, `addHint`, `addRowActive`, `addRowSource`, `onAddCancel`, `onAddRow`, `renderAddCell`, `editError`, `editHint`, `editRowActive`, `editRowKey`, `onEditCancel`, `onEditRow`, `renderEditCell` | высокая |
| Table | `addRowActive` | `addRowSource`, `renderAddCell` | низкая |
| Table | `editRowActive` | `editRowKey` | низкая |
| TableCell | `head` | `scope` | низкая |
| ScrollPort | `showVeil` | `veilInsetInline` | низкая |
| BorderProps (сквозная) | `showBorder` | `borderTone`, `showShadow` | высокая |

**Групп-кандидатов:** 18.  
**Уже закрыто объединениями:** 3 (`SegmentButtonPartsSegments`, `StepperAccessibleName`, `Table`/`checkable`).  
**Каскад Card:** `ModalProps` = `CardForwardProps` (`src/ui/modal/index.tsx:65-80`); `SidebarProps` = `CardForwardProps` (`src/ui/sidebar/index.tsx:88-117`); `StyledProfileMenuPanel` = `styled(Card)` (`src/components/profile-menu/profile-menu.styles.ts:60`).

---

## Уже закрыто

### SegmentButtonParts · `SegmentButtonPartsSegments`

**Тип:** `SegmentButtonPartsSegments` / `SegmentButtonPartsProps` — `src/ui/segment-button-parts/index.tsx:97-116`.  
**Суть:** минимум два сегмента; `left` обязателен; `center` и `right` — взаимоисключающие наборы.  
**Наследник:** `SegmentButtonProps` берёт `center` / `left` / `right` через `Pick<SegmentButtonPartsProps, …>` (`src/ui/segment-button/index.tsx:58`) — объединение сохраняется. Сборка в `SegmentButton` кладёт `center` только при `center != null` (`:103`).

### Stepper · `StepperAccessibleName`

**Тип:** `StepperAccessibleName` / `StepperProps` — `src/ui/stepper/index.tsx:115-140`.  
**Суть:** ровно одно из `label` | `aria-label` | `aria-labelledby`.  
**Вызов:** витрина уже ветвит (`src/pages/showcase/index.tsx:1906-1908`).

### Table · `checkable`

**Тип:** `TableProps` — `src/ui/table/index.tsx:337-356` пересекается с `TableSelectionProps` (`:306-318`), где `checkable: true` тянет `getRowKey`, `onSelectedKeysChange`, `selectedKeys`.  
**Вызов:** `src/pages/showcase/table-demo/index.tsx:774-790` уже не кладёт selection-пропы при `!settings.checkable`.

---

## По компонентам

### Card · `CardProps` · `src/ui/card/index.tsx:95-109`

#### Группа `title` → `titleAlign`, `titleId`, `titleSizePreset`, `titleTone`

**Ведущий:** `title?: string` (`:103`).  
**Зависимые:** `titleAlign`, `titleId`, `titleSizePreset`, `titleTone` (`:104-107`).

**Без ведущего:** `hasHeader = Boolean(title || subtitle)` (`:134`). Узел заголовка рендерится только при `Boolean(title)` (`:150-159`). `titleAlign` / `titleId` / `titleSizePreset` / `titleTone` в разметку не попадают. Пустая строка (`Boolean('') === false`) ведёт себя так же, как отсутствие пропа. Молча игнорируется.

**Вызовы, которые сломает `{ title?: undefined; titleAlign?: never; … }`:** прямых «только `titleAlign` без `title`» нет. Витрина всегда кладёт `title={card.title}` вместе с `title*` (`src/pages/showcase/index.tsx:1438-1441`). `TitleGroup` может обнулить `title` до `''` (`src/pages/showcase/card-settings/index.tsx:230-234`); ветка `title: string` такое всё ещё примет — пустая строка объединением вида «есть / нет ключа» не закрывается.

**Цена:** высокая. Объединение на `CardProps` протекает в `Modal` (`src/ui/modal/index.tsx:65`), `Sidebar` (`src/ui/sidebar/index.tsx:88-90`) и `StyledProfileMenuPanel` (`src/components/profile-menu/profile-menu.styles.ts:60`). `Card` полиморфен по `as` и склеивает `ComponentPropsWithRef<T>` (`src/ui/card/index.tsx:109`) — спред нативных атрибутов мешает, `title` уже вырезан из нативного `title` (`:109`).

#### Группа `subtitle` → `subtitleAlign`, `subtitleSizePreset`, `subtitleTone`

**Ведущий:** `subtitle?: string` (`:99`).  
**Зависимые:** `subtitleAlign`, `subtitleSizePreset`, `subtitleTone` (`:100-102`).

**Без ведущего:** `subtitleNode` только при `Boolean(subtitle)` (`:136-145`). Зависимые не попадают в дерево. Молча игнорируется. Подзаголовок без заголовка законен: `hasHeader` истинен от одного `subtitle` (`:134`), узел уходит в первую строку (`:161`).

**Вызовы, которые сломаются:** витрина при выключенном `showSubtitle` передаёт `subtitle={undefined}` и одновременно `subtitleAlign` / `subtitleSizePreset` / `subtitleTone`:

- Card-превью — `src/pages/showcase/index.tsx:1434-1437`
- Modal-превью — `:1404-1407`

`ProfileMenu` передаёт `subtitle` и `subtitleAlign` вместе, без `title` (`src/components/profile-menu/index.tsx:193-194`) — это валидная ветка «есть subtitle».

**Цена:** высокая. Тот же каскад Card → Modal / Sidebar / styled Card. Витрина всегда спредит `subtitle*` из стейта, даже когда подзаголовок выключен.

`headerActions` от `title`/`subtitle` не зависит: `IconButtonRow` рисуется всегда (`src/ui/card/index.tsx:170-177`), пустой ряд возвращает `null` (`src/ui/icon-button-row/index.tsx:235-237`).

---

### Modal · `ModalProps` · `src/ui/modal/index.tsx:75-80`

Собственных групп нет: `title*` / `subtitle*` приходят из `CardForwardProps` (`:65`).  
`titleId` пересчитывается: `title ? (titleIdProp ?? generatedTitleId) : undefined` (`:102`). Без `title` свой `titleId` в `aria-labelledby` диалога не попадает (`:138`), в Card уходит `undefined` (`:150`).  
`closeAriaLabel` всегда применяется к кнопке закрытия (`:47`, `:142`) — ведущего «есть заголовок» у него нет.

**Вызовы:** только витрина (`src/pages/showcase/index.tsx:1400-1415`) — ломается на группе `subtitle` Card, см. выше.  
**Цена:** высокая за счёт наследования Card, не из-за числа собственных вызовов.

---

### Sidebar · `SidebarProps` · `src/ui/sidebar/index.tsx:106-117`

Снова `CardForwardProps` без `titleId` (`:88-90`). Внутренний `titleId = title && id ? \`${id}-title\` : undefined` (`:151`). Без `title` `aria-labelledby` слота пуст (`:218`), в Card уходит `undefined` (`:232`).  
`icon` / `iconAriaLabel` всегда на кнопке сворачивания, дефолты на `:76` и `:82`.

**Вызовы:** `src/pages/showcase/index.tsx:1361-1373` — только `title={panelTitle}`, без `title*` / `subtitle*`. `panelTitle` бывает `undefined` (`:976-980`). Объединение Card само по себе этот вызов не ломает.  
**Цена:** средняя как каскад; собственных ломающихся вызовов нет.

---

### Button · `ButtonProps` · `src/ui/button/index.tsx:74-85`

**Ведущий:** `icon?: ReactNode` (`:76`).  
**Зависимые:** `iconFill`, `iconPosition`, `iconShape`, `iconTone` (`:77-79`; `iconTone` в `ButtonStyleProps`, `src/ui/button/button.styles.ts:122`).

**Без ведущего:** `hasIcon = Boolean(icon)` (`src/ui/button/index.tsx:125`). `iconNode` не создаётся (`:128`). `iconPosition` не на что применить (`:157`, `:168`). `iconFill` / `iconShape` остаются на несозданном Icon. `iconTone` пробрасывается в `StyledButton` (`:149`), но `getButtonStyles` читает его только внутри `getButtonSplitStyles` при `hasIcon` (`src/ui/button/button.styles.ts:284-285`). Молча игнорируется, вид кнопки без иконки не ломается.

`children` обязателен (`src/ui/button/index.tsx:75`) — `text*` всегда есть куда применить. `label` независим: `FieldLabel` сам гасит пустое содержимое.

**Вызовы, которые сломаются:** витрина при `withIcon === false` всё равно кладёт `iconPosition` и `iconShape` (`src/pages/showcase/index.tsx:1651-1655`). Остальные `<Button>` в `src/**` иконку не передают и `icon*` не трогают (`src/components/model-download-gate/index.tsx:232-244`, `src/pages/showcase/table-demo/index.tsx:795-805`, `src/ui/range-input/index.tsx:712-723`, панели настроек).

**Цена:** средняя. Спред витрины ломается; продуктовые вызовы чистые. Объединение не течёт в чужие типы — RangeInput собирает Button явно.

---

### SearchField · `SearchFieldProps` · `src/ui/search-field/index.tsx:116-132`

**Ведущий:** `showIcon` (дефолт `true`, `:85`, `:165`).  
**Зависимые только секции иконки:** `icon`, `iconPosition`, `iconShape`.  
`iconFill` и `iconTone` **не** входят в группу: они красят и секцию, и кнопку сброса (`:211-212`, `:231`).

**Без ведущего (`showIcon={false}`):** `iconNode` не создаётся (`:189`). `icon` / `iconPosition` / `iconShape` некуда применить. Молча игнорируется. `clearShape` живёт отдельно: считается всегда (`:174`), в DOM попадает только при `value.length > 0` (`:181`, `:205`) — ведущий здесь runtime-значение, не проп.

**Вызовы, которые сломаются:** витрина при любом `showIcon` кладёт `iconPosition` и `iconShape` (`src/pages/showcase/index.tsx:1511-1520`).  
**Не сломается:** Combobox — `showIcon={false}` без `icon*` (`src/ui/combobox/index.tsx:491-506`).

**Цена:** средняя. Каскад в Combobox уже соблюдает ветку. Витрина спредит позицию и форму всегда.

---

### Listbox · `ListboxProps` · `src/ui/listbox/index.tsx:147-163`

**Ведущий:** `multiple` (дефолт на `:95`, чтение на `:467`).  
**Зависимый:** `inlineCheckbox` (`:152`). Документация типа: «Без `multiple` чекбоксы не показываются» (`:137-138`).

**Без ведущего:** `showCheckbox = multiple && inlineCheckbox` (`:691`). Чекбоксы не рисуются. Молча игнорируется.  
`iconFill` / `iconPosition` / `iconTone` всегда на шевроне — ведущего «показать шеврон» нет. `showClear` — сам флаг показа, отдельных `clear*` нет.

**Вызовы, которые сломаются:** витрина всегда передаёт `inlineCheckbox={listbox.inlineCheckbox}` (`src/pages/showcase/index.tsx:1540`). При `multiple === false` стейт сбрасывает флаг в `false` (`:1048-1049`), но `inlineCheckbox={false}` на ветке `inlineCheckbox?: never` — ошибка типа. Панель настроек держит чекбокс `inlineCheckbox` (`src/pages/showcase/listbox-settings/index.tsx:113-115`).

**Цена:** средняя. Один превью-вызов + панель; спред `inlineCheckbox={false}` обязателен к правке.

---

### Combobox · `ComboboxProps` · `src/ui/combobox/index.tsx:143-160`

Группы «ведущий → оформление части» нет: `icon*` всегда на шевроне, `showClear` без сателлитов, `ComboboxOption.icon` без `icon*`.  
`label` и `aria-label` оба необязательны (`:144`, `:150`) — см. §5.  
Вложенный SearchField: `showIcon={false}` без зависимых (`:501`).

---

### RangeInput · `RangeInputProps` · `src/ui/range-input/index.tsx:256-278`

`title: string` обязателен (`:273`) — `titleAlign` / `titleSizePreset` / `titleTone` (`RangeInputTitleProps`, `:228-232`) всегда есть куда применить (`:665-669`). Кандидат на объединение `title` / `title*` это не.  
`onClear` включает кнопку сброса (`:430`) без отдельных `clear*`.  
`errorPlaceholder` / `reserveErrorSpace` имеют смысл без текста ошибки — см. §4.

---

### DateRangeInput · `DateRangeInputProps` · `src/ui/date-range-input/index.tsx:176-199`

`startLabel` / `endLabel` всегда идут в `title` сегментов и в `aria-label` сброса (`:474`, `:489`, `:524`), дефолты на `:97`, `:109`. Без дней они не бессмысленны.  
`onClear` — флаг показа сброса через наличие колбэка (`:353`), сателлитов нет.  
`buttonShape` / `dayShape` — переопределения `shape`, не часть, которая появляется по условию (`:348-349`).  
Пары значений и колбэков — §5.

---

### CalendarPanel · `CalendarPanelProps` · `src/ui/date-range-input/calendar-panel/index.tsx:108-118`

`rangeStart` / `rangeEnd` / `minDay` / `maxDay` — границы данных, не оформление отсутствующей части. Группы нет.

---

### SegmentButtonParts · `SegmentButtonPartsAction` · `src/ui/segment-button-parts/index.tsx:73-91`

**Ведущий:** `icon?: ReactNode` (`:80`).  
**Зависимые:** `iconFill`, `iconPosition` (`:81-82`). `tone` красит и сегмент, и иконку (`:194`) — свой смысл без `icon`.

**Без ведущего:** `hasIcon = Boolean(icon)` (`:190`). `iconNode` нет (`:191`). `iconPosition` только раскладывает этот узел (`:222`, `:233`). Выравнивание текста смотрит на `hasIcon`, не на `iconPosition` (`:224`). Молча игнорируется.

**Вызовы, которые сломаются:** витрина всегда кладёт `iconPosition` на left / center / right, даже когда `*WithIcon` выключен (`src/pages/showcase/index.tsx:1703-1706`, `:1720-1723`, `:1734-1737`).  
**Не сломаются:** DateRangeInput (иконка всегда есть, `:469`, `:484`); ProfileMenu (иконка + `iconFill` + `iconPosition` вместе, `src/components/profile-menu/index.tsx:214-217`).

**Цена:** средняя. Тип действия общий для `SegmentButton` и прямых вызовов Parts. Спред витрины ломается на трёх сегментах.

`SegmentButton` (`src/ui/segment-button/index.tsx:53-62`) своих групп не добавляет: сегменты уже закрыты Pick, `label` независим.

---

### Checkbox · `CheckboxProps` · `src/ui/checkbox/index.tsx:64-72`

**Ведущий:** `children` (`:65`).  
**Зависимые:** `textItalic`, `textSize`, `textTone` (`:66-68`).

**Без ведущего:** `hasText = Boolean(children)` (`:94`). Возвращается один `StyledCheckboxControl` (`:107-108`). `text*` в дерево не попадают. Молча игнорируется. Layout-пропы без подписи тоже отбрасываются: контрол получает весь `rest` (`:103`).

**Вызовы, которые сломаются:** витрина всегда передаёт `textItalic` / `textSize` / `textTone` и гасит подпись через `{checkbox.showText && checkbox.text}` (`src/pages/showcase/index.tsx:1781-1787`). То же в панелях, где Checkbox — контрол настройки, обычно с `children`.

**Цена:** средняя. Витринное превью ломается; панели настроек почти всегда с подписью.

---

### RadioButton · `RadioButtonProps` · `src/ui/radio-button/index.tsx:51-59`

Та же схема, что у Checkbox: без `children` — один кружок (`:86-87`), `text*` не применяются (`:93-99`).

**Вызовы, которые сломаются:** два превью в витрине (`src/pages/showcase/index.tsx:1800-1806`, `:1811-1819`). Fieldset-демо всегда с подписью (`:1837-1852`).

**Цена:** средняя.

---

### Switch · `SwitchProps` · `src/ui/switch/index.tsx:52-60`

Без `children` дорожка остаётся, `Text` не создаётся (`:84-92`). `text*` молча игнорируются. В отличие от Checkbox, обёртка `StyledSwitchRoot` есть всегда (`:81`).

**Вызовы, которые сломаются:** `src/pages/showcase/index.tsx:1920-1926`.  
`src/pages/showcase/header-settings/index.tsx:38` — с подписью, не ломается.

**Цена:** средняя. Доступное имя без `children` не требуется типом — §5.

---

### Tag · `TagProps` · `src/ui/tag/index.tsx:56-64`

#### Группа `showDot` → `dotTone`

**Ведущий:** `showDot` (дефолт `true`, `:70`, `:83`).  
**Зависимый:** `dotTone` (`:58`).

**Без ведущего:** `StyledTagDot` не создаётся (`:93`). `dotTone` некуда передать. Молча игнорируется.

**Вызовы, которые сломаются:** витрина всегда кладёт `dotTone={tag.dotTone}` (`src/pages/showcase/index.tsx:1754`) при переключаемом `showDot` (`:1758`).

#### Группа `children` → `textItalic`, `textSize`, `textTone`

Без `children` `Text` нет (`:94-102`).  
**Сломается:** те же строки `:1761-1767` (`showText && tag.text` при живых `text*`).

**Цена:** средняя, оба раза из-за спреда витрины.

---

### ProgressBar · `ProgressBarProps` · `src/ui/progress-bar/index.tsx:60-68`

**Ведущий:** `showText` (дефолт `true`, `:44`, `:80`).  
**Зависимые:** `textItalic`, `textSize`, `textTone` (`:62-64`).

**Без ведущего:** блок `{showText && ( <Text …> )}` (`:105-115`) не рендерится. Молча игнорируется. Процент в `aria-valuenow` остаётся (`:99`).

**Вызовы, которые сломаются:** витрина всегда передаёт `text*` (`src/pages/showcase/index.tsx:1861-1865`).  
`src/components/model-download-gate/index.tsx:228` — без `text*`, не ломается.

**Цена:** средняя.

---

### Spinner · `SpinnerProps` · `src/ui/spinner/index.tsx:67-77`

`text*` без `children` **не** бессмысленны, если `reserveTextSpace`: пустой `Text` с `minBlockSize` всё равно создаётся (`:100-124`). Объединение `children` → `text*` отрезает этот режим. См. §4.  
Витрина спредит `text*` при выключенном `showText` (`src/pages/showcase/index.tsx:1879-1884`) — это ловушка спреда, не повод для объединения.

---

### Toast · `ToastProps` · `src/ui/toast/index.tsx:39-47`

`children` обязателен (`:40`). `text*` всегда применяются (`:77-83`). Группы нет.  
`ToastInput` (`src/context/toast/context.ts:32-39`) — `message` обязателен, та же картина.

---

### Fieldset · `FieldsetProps` · `src/ui/fieldset/index.tsx:57-67`

`label: string` обязателен (`:59`). `legendItalic` / `legendSizePreset` / `legendTone` всегда на `<legend>` (`:87-94`). Группы нет.  
`borderTone` здесь не пара к `showBorder`: рамка рисуется всегда (`src/ui/fieldset/fieldset.styles.ts:117`).

---

### FieldError · `FieldErrorProps` · `src/ui/field-error/index.tsx:68-90`

`children`, `placeholder` и `reserveErrorSpace` — три независимых способа показать полоску (`:115`). `placeholder` без ошибки — серая подсказка (`:134`). Объединение «ошибка → placeholder / reserve» вредно. См. §4.

---

### FieldLabel · `FieldLabelProps` · `src/ui/field-label/index.tsx:50-56`

Без `children` компонент возвращает `null` (`:66-68`) — `htmlFor` не попадает в DOM. Формально `children` ведёт `htmlFor`. Все поля всегда передают оба (`Input` `:95`, `Button` `:146`, `SearchField` `:227`, `Listbox` `:884`, `Combobox` `:432`, `RangeInput` `:586`, `SegmentButton` `:114`, `DateRangeInput` `:503`, `Stepper` `:351`). Объединение заставит каждый контрол условно не передавать `htmlFor`. См. §4.

---

### Input · `InputProps` · `src/ui/input/index.tsx:59-65`

`errorPlaceholder` и `reserveErrorSpace` работают без `error` (через FieldError). `invalid` включает обводку без текста (`:55`, `:87`). `label` независим. Кандидата «error → errorPlaceholder» нет. См. §4.  
Витрина спредит все четыре (`src/pages/showcase/index.tsx:1486-1491`).

---

### Table · `TableProps` / `TableAddProps` / `TableEditProps` · `src/ui/table/index.tsx:244-334`

#### Группа `editable` → add/edit API

**Ведущий:** `editable?: boolean` (`:331`), дефолт `false` (`:619`).  
**Зависимые:** все поля `TableAddProps` и `TableEditProps` (`:244-281`).

**Без ведущего:** `addRowActive = editable && addRowActiveProp` и далее (`:639-642`). Колбэки и флаги панелей обнуляются. Кнопка «+» не рисуется (`:792`). Молча игнорируется.

**Вызовы, которые сломаются:** нет. `table-demo` уже спредит add/edit только при `settings.editable` (`src/pages/showcase/table-demo/index.tsx:756-772`). Других потребителей Table в `src/**` нет.

**Цена:** высокая по ширине объединения и спреду, низкая по числу правок. Объединение большое: две панели, хинты, ошибки, рендереры. `addHint` / `editHint` имеют смысл без `addError` / `editError` (плейсхолдер полоски, `:961`) — внутри add/edit их резать от ошибки нельзя.

#### Группа `addRowActive` → `addRowSource`, `renderAddCell`

Панель появляется при `addRowActive && addRowSource !== undefined && renderAddCell !== undefined` (`:693`). Без флага `addRowSource` не двигает якорь (`:687-688`). Молча игнорируется. В `table-demo` три пропа идут пакетом (`:758-768`).

**Цена:** низкая.

#### Группа `editRowActive` → `editRowKey`

Панель при `editRowActive && editRowKey !== undefined` (`:695`). Без ключа якоря нет (`:1121`). Молча игнорируется.  
**Цена:** низкая.

`TableColumn.header` обязателен (`:165`) — `headerAlign` всегда к чему применить (`:850`).

---

### TableCell · `TableCellProps` · `src/ui/table/table-cell/index.tsx:33-39`

**Ведущий:** `head?: boolean` (`:34`).  
**Зависимый:** `scope` (`:35`).

**Без ведущего:** `as` остаётся `td` (`:53`), `scope` уходит в `...props` на `<td>`. Попадает в разметку, для `td` атрибут не штатный.

**Вызовы, которые сломаются:** нет. Table сам пишет `scope` только при `head` (`src/ui/table/index.tsx:828`, `:838`, `:851`). Внешних `<TableCell scope>` нет.

**Цена:** низкая.

---

### TableInlineField, TableGroupCell, TableNestedCell, TableMemberPrefix

Публичные пропы без пар «ведущий → оформление отсутствующей части». `nestDepth` обязателен (`src/ui/table/table-nested-cell/index.tsx:30`).

---

### ScrollPort · `ScrollPortProps` · `src/ui/scroll-port/index.tsx:54-60` + `ScrollPortStyleProps` `:36-39`

**Ведущий:** `showVeil` (дефолт включён, `scroll-port.styles.ts:163`).  
**Зависимый:** `veilInsetInline`.

**Без ведущего:** геометрия вуали не пишется (`scroll-port.styles.ts:233`); `veilInsetInline` не читается. Молча игнорируется. Дата-атрибуты краёв тоже снимаются (`src/ui/scroll-port/index.tsx:95-98`).

**Вызовы, которые сломаются:** нет. `veilInsetInline` нигде в `src/**` не передаётся.  
**Цена:** низкая.

---

### IconButtonRow · `IconButtonRowProps` / `IconButtonRowAction` · `src/ui/icon-button-row/index.tsx:54-94`

У ряда нет зависимых от `actions` настроек части.  
У действия `ariaLabel` необязателен (`:57`); без него кнопка `aria-hidden` (`:283`) и выпадает из roving (`:117`). Это не «оформление без части», а обязательное имя — §5.

---

### Toolbar · `ToolbarProps` · `src/ui/toolbar/index.tsx:44-52`

`ariaLabel: string` уже обязателен (`:47`). `actionShape` — переопределение `shape` (`:71`), не условная часть. Группы-кандидата нет. Рамка — сквозная `BorderProps`, см. ниже.

---

### Icon · `IconProps` · `src/ui/icon/index.tsx:79-82`

Полиморфен по `as`. При `as === 'button'` подставляется только `type` (`:107-114`); `aria-label` тип не требует. См. §4 и §5.  
`iconFill` без цветного `iconTone` имеет свой смысл (глиф, `icon.styles.ts:212`). `showHover` и `interactive` — два независимых канала (`:424`).  
Рамка — сквозная `BorderProps`.

---

### Text · `TextProps` · `src/ui/text/index.tsx:58-61`

Полиморфен по `as`. Стилевые пропы имеют смысл на любом теге. Группы нет. См. §4.

---

### AnchoredPortal · `AnchoredPortalProps` · `src/ui/anchored-portal/index.tsx:79-90`

`onOpenFocus` / `openFocusDeps` срабатывают только при `open` (`:164-166`). Колбэки при закрытой панели не «ошибка API», а обычный controlled-паттерн. `dismissActive` сознательно может расходиться с `open` (`:69-70`, `:119`). Объединение вредно. См. §4.

---

### Header · `HeaderProps` · `src/components/header/index.tsx:61-68`

`settingsLabel` и `onSettingsClick` имеют дефолты (`:49`, `:136`). Ведущего, без которого они бессмысленны, нет.  
`autoHide` включает обработчики наведения (`:111-113`) — это поведение флага, не оформление отсутствующей части.

---

### ProfileMenu · `ProfileMenuProps` · `src/components/profile-menu/index.tsx:117-120`

Только layout + нативные атрибуты `div`. Контентных зависимых пропов нет. Панель — `styled(Card)` и попадёт под объединение Card.

---

### ThemeToggle

Пропов нет (`src/components/theme-toggle/index.tsx:36`).

---

### ModelDownloadGate · `ModelDownloadGateProps`

Только `children`. Card внутри вызывается с `title` и `titleId` вместе (`src/components/model-download-gate/index.tsx:168-173`).

---

### ToastProvider / ThemeProvider

Только `children` (`src/context/toast/index.tsx:46-48`, `src/context/theme/index.tsx:32-34`).

---

### Сквозная группа рамки · `BorderProps` · `src/ui/border.ts:48-52`

**Ведущий:** `showBorder`.  
**Зависимые:** `borderTone`, `showShadow`.

**Без ведущего:** `getBorderStyles` при `!showBorder` возвращает `box-shadow: none` и не читает тон и тень (`src/ui/border.ts:102-103`). Молча игнорируется. Потребители: Card (`card.styles.ts:100`), Input (`input.styles.ts:152`), SearchField (`search-field.styles.ts:172`), Icon (`icon.styles.ts:432`), Tag (`tag.styles.ts:265`), Toolbar (`toolbar.styles.ts:106`). Table зовёт `getBorderStyles(theme, showBorder, false)` без `borderTone` (`table.styles.ts:184`) — у Table этой пары нет.

**Вызовы, которые сломаются:** витрина на Card / Input / SearchField / Icon / Tag / Toolbar всегда спредит тройку из стейта, в том числе при `showBorder={false}` (например `src/pages/showcase/index.tsx:1432-1433`, `:1493-1494`, `:1519-1521`, `:1674-1683`, `:1757-1759`, `:1470-1474`). Combobox передаёт SearchField `showBorder={false}` без `borderTone` / `showShadow` (`src/ui/combobox/index.tsx:500`) — не ломается.

**Цена:** высокая. Один тип `BorderProps` тянется через шесть примитивов и Card-обёртки. Дефолт `showBorder` часто `true`: вызов `<Card borderTone="primary">` без явного `showBorder` сейчас законен. Объединение вида `{ showBorder: false; borderTone?: never }` ломает только явное `false` + тон/тень; наивное «все три всегда вместе» сломает и вызовы с одним `borderTone`.

---

## 4. Где объединение невозможно или вредно

| Место | Почему |
|-------|--------|
| `CardProps` + `as` (`src/ui/card/index.tsx:95-109`) | Корень полиморфен; `Omit<ComponentPropsWithRef<T>, …>` уже вырезает нативный `title`. Ужесточать `title*` можно, но спред остальных HTML-атрибутов от `T` остаётся. |
| `TextProps` / `IconProps` + `as` | Тот же полиморфизм (`src/ui/text/index.tsx:58-61`, `src/ui/icon/index.tsx:79-82`). Допустимые атрибуты тега меняются с `as`; отдельное объединение «контент → оформление» здесь нечему закрыть. |
| `Icon` `as="button"` → `aria-label` | Имя нужно интерактивной ветке, но `as` — дженерик. Пересечение с `ComponentPropsWithRef<T>` не даёт чистого `never` на `span`. Ближе к §5, чем к Card-`title`. |
| `FieldLabel` `children` → `htmlFor` | Без `children` узел не создаётся (`src/ui/field-label/index.tsx:66-68`). Все поля всегда передают `htmlFor` и иногда пустой `label`. Объединение заставит условно снимать `htmlFor` в Input, Button, SearchField, Listbox, Combobox, RangeInput, SegmentButton, DateRangeInput, Stepper. |
| `FieldError` / `Input` / `RangeInput` / `Table` add·edit хинты | `placeholder` / `errorPlaceholder` / `addHint` / `editHint` и `reserveErrorSpace` имеют смысл без текста ошибки (`src/ui/field-error/index.tsx:115`, `:134`; Input `:54-57`; Table `:235-236`). `invalid` на Input — обводка без текста (`:55`, `:87`). |
| `Spinner` `children` → `text*` | При `reserveTextSpace` пустой `Text` всё равно монтируется и принимает `text*` (`src/ui/spinner/index.tsx:100-124`). |
| `SearchField` `clearShape` | Форма сброса применяется при непустом `value` (`:181`, `:205`), не при отдельном флаге. `value` — контролируемая строка, её нельзя увести в `never`. |
| `AnchoredPortal` `open` → `onOpenFocus` / `openFocusDeps` | Колбэки передают всегда, `open` переключают. `dismissActive` может быть не равен `open` (`:69-70`). |
| `RangeInput` `title*` | `title` уже обязателен (`src/ui/range-input/index.tsx:273`). |
| `Fieldset` `legend*` | `label` уже обязателен (`src/ui/fieldset/index.tsx:59`). |
| `Toast` / `ToastInput` `text*` | `children` / `message` уже обязательны. |
| `BorderProps` без учёта дефолта | `showBorder` по умолчанию часто `true`. Запрет `borderTone` при отсутствующем ключе `showBorder` сломает нормальные вызовы с одним тоном. |

---

## 5. Родственные ловушки без объединения «ведущий → оформление»

### Обязательное доступное имя

| Место | Факт |
|-------|------|
| `StepperAccessibleName` | Уже закрыто (`src/ui/stepper/index.tsx:115-118`). |
| `Toolbar.ariaLabel` | Уже обязателен (`src/ui/toolbar/index.tsx:47`). |
| `IconButtonRowAction.ariaLabel` | Необязателен (`src/ui/icon-button-row/index.tsx:57`). Без имени: `aria-hidden` (`:283`), `tabIndex={-1}` (`:201`), вне roving (`:117`). Документация типа это описывает (`:47`). |
| `Icon` при `as="button"` | Тип не требует `aria-label` (`src/ui/icon/index.tsx:79-82`). Текущие вызовы в `src/**` имя кладут (Header `:158`, ThemeToggle `:41`, ProfileMenu `:156`, Table add `:794`, витрина Icon `:1672`, сбросы Listbox/Combobox/SearchField/RangeInput/DateRangeInput). |
| `Switch` без `children` | Пример в JSDoc допускает `aria-label` (`src/ui/switch/index.tsx:67`); тип его не требует. Канон в `00-plan.md` (шаг 0, `project.mdc §11`) уже фиксирует такой тип как долг. |
| `Checkbox` / `RadioButton` без `children` | Нативный `input`; `aria-label` не обязателен. Table всегда передаёт (`src/ui/table/index.tsx:372`). |
| `Listbox` | Триггер без `aria-label`; связь только через `FieldLabel` + `id` (`src/ui/listbox/index.tsx:884-898`). Без `label` видимого имени нет. |
| `Combobox` | `aria-label` и `label` оба опциональны (`src/ui/combobox/index.tsx:144`, `:150`). На триггере `aria-label={ariaLabel}` (`:445`); список берёт `label ?? placeholder` (`:509`). |
| `ProgressBar` | `aria-label` / `aria-labelledby` опциональны, приходят из `div` (`src/ui/progress-bar/index.tsx:78-79`). Витрина и гейт передают `aria-labelledby`. |
| `Spinner.ariaLabel` | Дефолт `'Loading'` (`src/ui/spinner/index.tsx:43`, `:87`) — тип не заставляет выбрать имя. |

### Взаимоисключающие булевы и наборы

| Место | Факт |
|-------|------|
| `SegmentButtonPartsSegments` | Уже закрыто. |
| `Table` `checkable` | Уже закрыто. |
| Listbox `multiple` / `inlineCheckbox` | Не взаимоисключение, а зависимость (см. группу выше). Витрина при включении чекбоксов сама ставит `multiple: true` (`src/pages/showcase/index.tsx:1053-1054`). |
| Stepper `label` / `aria-label` / `aria-labelledby` | Уже взаимоисключение. |

### Пропы, которые обязаны идти парой

| Место | Факт |
|-------|------|
| DateRangeInput `startDay` ↔ `endDay` | Оба опциональны с дефолтом `''` (`src/ui/date-range-input/index.tsx:317-327`). Панель коммитит оба края (`:398-399`). Один день без второго — валидный черновик (`:380-383`). |
| DateRangeInput `onStartDayChange` / `onEndDayChange` | Оба опциональны (`:195-196`). `handleCommit` зовёт их через `?.` (`:398-399`): без колбэка выбор в панели не выходит наружу, вид не ломается. Витрина передаёт оба (`src/pages/showcase/index.tsx:1639-1640`). |
| CalendarPanel `rangeStart` / `rangeEnd` | Независимые границы; один без другого допустим (`src/ui/date-range-input/calendar-panel/index.tsx:151-157`). |
| Table `onAddRow` без `editable` | Кнопка «+» не появляется (`src/ui/table/index.tsx:639-641`, `:792`). При `editable` без `onAddRow` кнопка видна и `disabled` (`:241`, `:796`) — пара «флаг режима + колбэк», не оформление. |
| IconButtonRowAction `title` и `ariaLabel` | `title` из `ariaLabel` не выводится (`src/ui/icon-button-row/index.tsx:52`). Это не пара и не зависимость. |

---

## Компоненты без групп-кандидатов

Просмотрены, пар «ведущий → оформление отсутствующей части» нет (уже закрытые объединения и случаи из §4/§5 сюда не входят):

- `Text`
- `Toast` и `ToastInput` / `ToastProvider`
- `Fieldset`
- `Toolbar`
- `CalendarPanel`
- `TableInlineField`, `TableGroupCell`, `TableNestedCell`, `TableMemberPrefix`
- `IconButtonRow` (сам ряд; действие — §5)
- `SegmentButton` (сегменты уже закрыты на Parts)
- `Stepper` (имя уже закрыто)
- `RangeInput` (`title` обязателен)
- `Combobox` (нет оформления без части)
- `DateRangeInput` (лейблы и shape-оверрайды имеют смысл сами)
- `Header`
- `ProfileMenu` (как компонент; панель наследует Card)
- `ThemeToggle`
- `ModelDownloadGate`
- `ThemeProvider`

`Input`, `FieldError`, `FieldLabel`, `Spinner`, `AnchoredPortal`, `Icon` — ловушка спреда или a11y есть, но объединение «ведущий → зависимые» либо вредно, либо не выражается (см. §4–5).

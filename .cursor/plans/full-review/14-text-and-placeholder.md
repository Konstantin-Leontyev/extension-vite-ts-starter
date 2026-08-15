# Полное ревью · область 14 — текст и плейсхолдер

**Проект:** `extension-vite-ts-starter`  
**Дата обхода:** 2026-08-15  
**Канон:** `caption-downloader/.cursor/rules/project.mdc` §7.6, §7.8, §8.6, §8.7; `showcase.mdc` (текстовая группа, порядок полей)  
**Режим:** только инвентаризация; код не правился.

## Метод и охват

1. Прочитаны публичные типы и сборка JSX всех `src/ui/**/index.tsx` (включая сателлиты Table и CalendarPanel) и `src/components/**`.
2. Для каждой тройки `textTone` / `textSize` / `textItalic` / `textAlign` и вторичных префиксов (`title*`, `subtitle*`, `legend*`, `error*`, `startLabel`, `endLabel`) сверены тип, деструктуризация и узел, куда проп уходит.
3. Плейсхолдер искался по `placeholder`, `searchPlaceholder`, `fromPlaceholder`, `toPlaceholder`, `errorPlaceholder`, `DATE_PLACEHOLDER` и `::placeholder` во всём `src/**` проекта.
4. Флаги показа — публичные пропы примитивов и ключи `*WidgetState` панелей `src/pages/showcase/*-settings`.
5. Потребители тройки и плейсхолдера дополнительно искались в соседних репозиториях воркспейса: `сaption-downloader`, `yt-lodger`, `seolizer`.

**Вне зоны чтения целиком:** `src/ui/fonts/**`, `src/icons/**/*.svg`, корневые конфиги.

**Потребители вне стартера.** Искал по `textTone` / `textSize` / `textItalic` / `textAlign` / `placeholder` в `сaption-downloader`, `yt-lodger`, `seolizer`. В `yt-lodger` совпадений нет. В `сaption-downloader` — своя урезанная копия kit (`src/ui/tag`, `src/ui/text`, `src/ui/card`), не импорт из стартера. В `seolizer/frontend` — параллельная копия тех же примитивов, не вызов стартера. Живой потребитель API стартера в этом обходе — витрина `src/pages/showcase` и внутренние вызовы внутри `src/ui/**` / `src/components/**` / `src/context/toast`.

**Компоненты без собственного видимого текста** (в таблицы раздела 1 не входят): `Icon`, `Toolbar` (только `ariaLabel`), `ScrollPort`, `AnchoredPortal`, `IconButtonRow`, `Header`, `ThemeToggle`, `Router`.

---

## Раздел 1 — тройка текста

Легенда колонок «отдаёт»: `да` — публичный проп с этим именем; `нет` — в типе нет; `вшит` — значение зашито в сборке, наружу не отдаётся; `своё имя` — тот же смысл под другим именем (`tone` / `sizePreset` / `italic` / `align` у самого Text; `title*` / `subtitle*` / `legend*`).

Мост размера: `get[Имя]TextSize` в `*.styles.ts`, реэкспорт из бареля. У Input и SearchField моста компонента нет — типографика поля идёт через `getTextProperties(getTextSize(sizePreset))` из `@ui/presets` (§7.8).

### 1.1. Примитивы с основным текстом

| Компонент | Смысл текста | textTone | textSize | textItalic | textAlign | Мост размера | Витрина |
|-----------|--------------|----------|----------|------------|-----------|--------------|---------|
| Text `src/ui/text/index.tsx:89-107` | пользовательский контент (`children`) | своё имя `tone` (`text.styles.ts`) | своё имя `sizePreset` | своё имя `italic` | своё имя `align` | нет (сам источник типографики) | `text-settings/index.tsx:60-85`: `text-group` с пустым `labelPrefix`; Sample / Size / Align / Tone / Show ellipsis / Show italic. Флага показа нет |
| Tag `src/ui/tag/index.tsx:67-114` | пользовательский контент (`children`); без `children` — только точка `:103` | да, пакет `ChildrenTextProps` `:68` | да | да | нет | `getTagTextSize` `tag.styles.ts:112`, реэкспорт `:120` | `tag-settings/index.tsx:147-170`: Show text + Text / Text size / Text tone / Show italic |
| Toast `src/ui/toast/index.tsx:39-84` | пользовательский контент (`children`); в runtime — `toast.message` → `children` (`src/context/toast/index.tsx:151-153`) | да `:43` | да | да | нет | `getToastTextSize` `toast.styles.ts:39`, реэкспорт `:89` | `toast-settings/index.tsx:87-106`: Text / Text size / Text tone / Show italic. Флага показа нет |
| Spinner `src/ui/spinner/index.tsx:67-125` | служебная подпись (`children`); пустой Text при `reserveTextSpace` без текста `:111-124` | да, дефолт `muted` `:55,93` | да | да | вшит `center` `:113` | `getSpinnerTextSize` `spinner.styles.ts:76`, реэкспорт `:131` | `spinner-settings/index.tsx:93-115`: Show text + Text / Text size / Text tone / Show italic; отдельно `Reserve text space` `:119` |
| ProgressBar `src/ui/progress-bar/index.tsx:62-131` | генерируемая строка `{percent}%` `:129`; ведущий — `showText` | да, дефолт `muted` `:51,100` | да | да | нет | `getProgressBarTextSize` `progress-bar.styles.ts:54`, реэкспорт `:137` | `progress-bar-settings/index.tsx:123-139`: Show text + Text size / Text tone / Show italic; инпута содержимого нет |
| Checkbox `src/ui/checkbox/index.tsx:59-114` | служебная подпись (`children`); без `children` — один бокс `:99` | да, пакет `ChildrenTextProps`, дефолт `muted` `:54,81` | да | да | нет | `getCheckboxTextSize` `checkbox.styles.ts:68`, реэкспорт `:123` | `checkbox-settings/index.tsx:129-140`: Show text + Text / Text size / Text tone / Show italic |
| RadioButton `src/ui/radio-button/index.tsx:46-93` | служебная подпись (`children`); без `children` — один кружок `:78` | да, пакет `ChildrenTextProps`, дефолт `muted` `:41,65` | да | да | нет (канон §7.6: прижата к кружку) | `getRadioButtonTextSize` `radio-button.styles.ts:54`, реэкспорт `:97` | `radio-button-settings/index.tsx:109-125`: Show text + Text A / Text B / Text size / Text tone / Show italic |
| Switch `src/ui/switch/index.tsx:47-86` | служебная подпись (`children`); корень всегда `label` `:73` | да, пакет `ChildrenTextProps`, дефолт `muted` `:42,66` | да | да | нет | `getSwitchTextSize` `switch.styles.ts:103`, реэкспорт `:90` | `switch-settings/index.tsx:96-118`: Show text + Text / Text size / Text tone / Show italic |
| Button · лейбл `src/ui/button/index.tsx:97-187` | пользовательский контент (`children` обязателен `:98`) | да `:102` | да | да | вшит `center` `:179` | `getButtonTextSize` `button.styles.ts:56`, реэкспорт `:195` | `button-settings/index.tsx:135-154`: Text / Text size / Text tone / Show italic. Флага показа нет |
| SegmentButton `src/ui/segment-button/index.tsx:53-117` | пользовательский контент сегментов (`left`/`center`/`right.label`) | нет на корне; тон — поле действия `SegmentButtonPartsAction.textTone` `segment-button-parts/index.tsx:104` | да `:56` | да `:55` | вшит в части: `center` без иконки `segment-button-parts/index.tsx:243` | `getSegmentButtonTextSize` `segment-button.styles.ts:43`, реэкспорт `:123` | `segment-button-settings/index.tsx:228-275`: Left/Center/Right text + Left/Center/Right text tone + Text size + Show italic |
| SegmentButtonParts `src/ui/segment-button-parts/index.tsx:129-250` | пользовательский контент (`action.label` обязателен `:99`) | да, на действии `:104`; резолв `:201-207` | да, обязателен на ряде `:133` | да на ряде `:132` | вшит `center` без иконки `:243` | нет своего; размер приходит снаружи готовым | секции нет (сателлит; виден в SegmentButton и DateRangeInput) |
| Stepper · значение `src/ui/stepper/index.tsx:131-389` | значение поля (`value` → строка в `<input>` `:380`) + суффикс (`suffix` → Text `:385-393`) | да `:183`; на поле через `getTextToneColor` `stepper.styles.ts:293-297`; суффикс `textTone ?? muted` `:389` | да; резолв один раз `:194` | да; на поле `:364` и суффиксе `:387` | да; `justify-content` ячейки `stepper.styles.ts:212` | `getStepperTextSize` `stepper.styles.ts:49`, реэкспорт из бареля | `stepper-settings/index.tsx:142-168`: `labelPrefix="Value"` — Value / Value size / Value align / Value tone / Show italic. Флага показа нет |
| Input · значение `src/ui/input/index.tsx:59-102` | значение нативного поля (`value` через rest `<input>`) | нет | нет (типографика `getTextProperties(getTextSize(sizePreset))` `input.styles.ts:148`) | да, `InputStyleProps` `input.styles.ts:55`, правило `:164-166` | да, `InputStyleProps` `:54`, правило `:160-162` | нет `getInputTextSize` | `input-settings/index.tsx:119-132`: `labelPrefix="Text"` — Text / Text align / Show italic; `showOptionsWithEmptyContent`. Флага показа нет |
| SearchField · значение `src/ui/search-field/index.tsx:136-269` | значение нативного поля (`value` обязателен `:143`) | нет | нет (типографика `getTextProperties(getTextSize(sizePreset))` `search-field.styles.ts:250`) | да, `SearchFieldStyleProps` `:60`, правило `:263-265` | да, `SearchFieldStyleProps` `:59`, правило `:259-261` | нет `getSearchFieldTextSize` | `search-field-settings/index.tsx:159-172`: `labelPrefix="Text"` — Text / Text align / Show italic; `showOptionsWithEmptyContent`. Флага показа нет |
| Listbox · триггер `src/ui/listbox/index.tsx:161-926` | выбранная подпись опции или плейсхолдер `:925` | нет (тон `muted` только у пустого триггера `:923`) | нет (внутри `getOpenControlTextSize` `:493`) | нет | нет | `getOpenControlTextSize` `open-control.ts:134` — не реэкспорт бареля Listbox | `listbox-settings`: текстовой группы нет; есть `Placeholder:` `:131-137` |
| Combobox · триггер `src/ui/combobox/index.tsx:143-468` | выбранный `label` опции или плейсхолдер `:467` | нет (тон `muted` у пустого `:465`) | нет (внутри `getOpenControlTextSize` `:219`) | нет | нет | тот же `getOpenControlTextSize` | `combobox-settings`: текстовой группы нет; Placeholder / Search placeholder / Empty message `:123-145` |
| Combobox · пустой поиск `src/ui/combobox/index.tsx:514-524` | генерируемая/переданная строка `emptyMessage`, дефолт `'Nothing found'` `:91` | вшит `muted` `:521` | вшит мостом `:520` | нет | нет | `getOpenControlTextSize` | инпут `Empty message:` `:139-145` |
| RangeInput · триггер `src/ui/range-input/index.tsx:256-615` | активный лейбл `formatActiveLabel` или `placeholder` `:432` | нет (тон `muted` у неактивного `:612`) | нет (внутри `getRangeInputTextSize` `:433`) | нет | нет | `getRangeInputTextSize` `range-input.styles.ts:52` | `range-input-settings`: текстовой группы триггера нет; инпут `Placeholder:` `:165-171` |
| DateRangeInput · сегменты `src/ui/date-range-input/index.tsx:202-517` | генерируемая дата или `DATE_PLACEHOLDER` `'DD.MM.YY'` `calendar-panel/day.ts:23` | нет на корне; вшит `muted` при пустом дне `:473,488` | нет (внутри `getSegmentButtonTextSize` `:354`) | нет | нет | `getSegmentButtonTextSize` | `date-range-input-settings`: текстовой группы сегментов нет |
| Table · ячейки `src/ui/table/index.tsx:688+` | пользовательский контент колонок / `renderCell`; заголовки `column.header` | нет | нет наружу; контекст рендера `{ textSize }` `:569`; мост `:688` | нет | нет на Table; на ячейке `TableCell.textAlign` / `column.align` | `getTableTextSize` `table.styles.ts:82` | `table-settings/index.tsx:76+`: Size / рамка / режимы; текстовой группы нет |
| TableCell `src/ui/table/table-cell/index.tsx:48-68` | слот `children` (обычно внутренний Text) | нет | нет | нет | да, `TableCellAlign` `table-cell.styles.ts:23,43` | нет | секции нет (сателлит) |
| TableInlineField `src/ui/table/table-inline-field/index.tsx:28-58` | значение нативного поля | нет | да, `textSize` `table-inline-field.styles.ts:27` | нет | да `:26` | нет; дефолт `'normal'` `:39` | секции нет; поля в `table-demo/index.tsx:570+` |
| CalendarPanel `src/ui/date-range-input/calendar-panel/index.tsx:179-342` | генерируемые строки: месяц `:243`, дни недели `WEEKDAY_LABELS` `:283`, номер дня `:341` | нет (weekdays вшит `muted` `:290`) | нет (внутри `getCalendarPanelTextSize` `:179`) | нет | вшит `center` у месяца и weekdays `:237,286` | `getCalendarPanelTextSize` `calendar-panel.styles.ts:148` | секции нет (сателлит DateRangeInput) |

### 1.2. Вторичные тексты с префиксом

| Компонент · элемент | Смысл | Тон | Размер | Курсив | Выравнивание | Мост | Витрина |
|---------------------|-------|-----|--------|--------|--------------|------|---------|
| Button · `label` `button/index.tsx:99,166` | служебная подпись над контролом | вшит FieldLabel `muted` `field-label/index.tsx:42` | вшит `thin` `:36` | нет на Button; FieldLabel пропускает `italic` через rest `:53-56` | нет на Button; FieldLabel пропускает `align` | нет | `control-group` → `Label:` (`button-settings`, слот 1) |
| SegmentButton · `label` `segment-button/index.tsx:54,114` | служебная подпись над рядом | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` |
| Input · `label` `input/index.tsx:63,95` | служебная подпись над полем | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` `input-settings/index.tsx:93-100` |
| Input · `error` `input/index.tsx:60,103-109` | строка ошибки (`children` FieldError) | вшит FieldError `danger` `field-error/index.tsx:52` | вшит `thin` `:46` | запрещён каноном §7.6; в типе Input нет `errorItalic` | вшит `center` `:40` | нет | `text-group` `labelPrefix="Error"` + `show.label="Invalid"` `input-settings/index.tsx:141-154`; без size/align/italic/tone |
| Input · `errorPlaceholder` `input/index.tsx:61,105` | подсказка полоски, пока нет ошибки | вшит FieldError `muted` `:58` | вшит `thin` | нет | вшит `center` | нет | `field-error-group` → `Reserved space placeholder:` `input-settings/index.tsx:134-138` |
| SearchField · `label` `search-field/index.tsx:140,244` | служебная подпись над полем | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` |
| Listbox · `label` `listbox/index.tsx:167,897` | служебная подпись над триггером | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` |
| Combobox · `label` `combobox/index.tsx:150` | служебная подпись над триггером | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` |
| RangeInput · `label` `range-input/index.tsx:267` | служебная подпись над триггером | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` |
| RangeInput · `title` `range-input/index.tsx:228-231,664-672` | заголовок панели (обязателен `:273`) | да `titleTone` | да `titleSizePreset` | нет `titleItalic` | да `titleAlign`, дефолт в `index.tsx:387` | нет | `title-group` `labelPrefix="Title"` `range-input-settings/index.tsx:173-183`; флага `show` нет (заголовок обязателен) |
| RangeInput · `fromPlaceholder` / `toPlaceholder` | плейсхолдер полей панели | см. раздел 2 (нативный Input) | следует `inputSizePreset` | нет своих | нет своих | нет | инпуты `From placeholder:` / `To placeholder:` `:199-213` |
| RangeInput · `errorPlaceholder` `:262,706` | подсказка полоски панели | вшит FieldError `muted` | вшит `thin` | нет | вшит `center` | нет | `field-error-group` `:285-289` |
| RangeInput · `buttonText` / `buttonTextTone` `:718` | пользовательский контент кнопки Apply | да `buttonTextTone` → `Button.textTone` | нет (размер кнопки `buttonSizePreset`) | нет | нет | нет | инпуты `Button text:` / `Button text tone:` `:236-250` |
| RangeInput · `validationMessages` | генерируемые строки встроенной валидации | нет | нет | нет | нет | нет | три инпута `:252-283` |
| DateRangeInput · `label` `:191,503` | служебная подпись над рядом | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` |
| DateRangeInput · `startLabel` `:198,328,474` | нативный `title` начального сегмента + фрагмент `aria-label` сброса; видимым лейблом не является `:173-174` | нет | нет | нет | нет | нет | инпут `Start label:` `date-range-input-settings/index.tsx:98-104` |
| DateRangeInput · `endLabel` `:190,318,489` | нативный `title` конечного сегмента + фрагмент `aria-label` сброса | нет | нет | нет | нет | нет | инпут `End label:` `:106-112` |
| Card · `title` `card/index.tsx:94-108,193-203` | служебный заголовок (`<h2>`) | да `titleTone` | да `titleSizePreset`, дефолт `'bold'` `:70,173` | нет `titleItalic` | да `titleAlign` | нет | `title-group` `labelPrefix="Title"` + витринный `showTitle` `card-settings/index.tsx:115-129` |
| Card · `subtitle` `card/index.tsx:119-131,179-188` | служебный подзаголовок (`<p>`) | да `subtitleTone`, дефолт `muted` `:76,169` | да `subtitleSizePreset` | нет `subtitleItalic` | да `subtitleAlign` | нет | `title-group` `labelPrefix="Subtitle"` + витринный `showSubtitle` `:131-145` |
| Modal · `title*` / `subtitle*` `modal/index.tsx:72,97-108` | проброс `CardTitleProps` / `CardSubtitleProps` | да | да | нет | да | нет | `modal-settings/index.tsx:96-117`: две `title-group` + `showTitle` / `showSubtitle` |
| Sidebar · `title*` / `subtitle*` `sidebar/index.tsx:89-109` | проброс Card без `titleId` | да | да | нет | да | нет | панели витрины нет |
| Fieldset · `label` / `legend*` `fieldset/index.tsx:57-95` | служебный заголовок в `<legend>`; `label` обязателен `:59` | да `legendTone`, дефолт `muted` `:46,82` | да `legendSizePreset`, дефолт `thin` `:40,81` | да `legendItalic` `:60` | нет `legendAlign` | нет | `text-group` `labelPrefix="Legend"` `fieldset-settings/index.tsx:75-93`: Legend / Legend size / Legend tone / Show italic. Флага показа нет |
| FieldLabel `field-label/index.tsx:50-80` | служебная подпись; без `children` — `null` `:66` | вшит `muted` `:42`; `tone` снят из rest `:55` | вшит `thin` `:36`; `sizePreset` снят `:55` | да, через rest (`italic` не в Omit) | да, через rest (`align` не в Omit) | нет | секции нет (сателлит) |
| FieldError `field-error/index.tsx:68-136` | строка ошибки (`children: string`) или подсказка `placeholder` | вшит: ошибка `danger` `:52`, подсказка `muted` `:58`; `tone` снят `:88` | вшит `thin` `:46`; `sizePreset` снят `:86` | снят `italic` `:84` | вшит `center` `:40`; `align` снят `:75` | нет | секции нет; потребители — Input, RangeInput, Table |
| Table · `addHint` / `editHint` `table/index.tsx:282-318,993` | подсказка полоски add/edit → `FieldError.placeholder` | вшит FieldError `muted` | вшит `thin` | нет | вшит `center` | нет | в `table-settings` контролов нет; дефолты `:187-194` |
| Stepper · `label` `stepper/index.tsx:118,351` | служебная подпись; одна из веток `StepperAccessibleName` | вшит FieldLabel | вшит FieldLabel | нет | нет | нет | `control-group` → `Label:` |
| Stepper · `suffix` `stepper/index.tsx:138,385-393` | служебная единица рядом со значением | делит `textTone` значения, иначе `muted` `:389` | делит резолвленный `textSize` `:388` | делит `textItalic` `:387` | двигается вместе с парой через `textAlign` ячейки | тот же `getStepperTextSize` | инпут `Suffix:` `stepper-settings/index.tsx:134-140` (слот value, не текстовая группа) |

### 1.3. Виджеты `src/components/**`

| Компонент | Смысл текста | Тройка наружу | Мост | Витрина |
|-----------|--------------|---------------|------|---------|
| ProfileMenu `src/components/profile-menu/index.tsx:193-244` | генерируемые строки: `Hello, {displayName}!` `:208`; `subtitle={displayEmail}` `:193`; ссылки `Privacy Policy` / `Terms of Service` `:84-85` | нет; зашиты `sizePreset="extraBold"` / `"thin"`, `align="center"`, `tone="muted"` у разделителя | нет | секции нет |
| ModelDownloadGate `src/components/model-download-gate/index.tsx:101-239` | генерируемые заголовок Card и абзацы по фазе; кнопка `Download` / `Update Chrome` | нет; Card `title` без `title*`; ProgressBar без `text*` | нет | секции нет |
| Header `src/components/header/index.tsx` | доступное имя кнопки настроек, не видимый текст | нет | нет | `header-settings`: только `Auto-hide` |

### 1.4. Пакет `ChildrenTextProps`

Тип: `src/ui/text/index.tsx:68-80`. Ветки: есть `children` — `textItalic` / `textSize` / `textTone` допустимы; нет `children` — все три `?: never`. `textAlign` в пакет не входит.

Подключение пересечением: Tag `:68`, Checkbox `:60`, RadioButton `:47`, Switch `:48`.

ProgressBar — своё объединение `ProgressBarShowTextProps` с ведущим `showText` `:62-74`, не `ChildrenTextProps`.

Spinner — плоские опциональные `text*` без объединения `:70-73` (канон §8.7: `text*` у Spinner имеют смысл при `reserveTextSpace` без `children`).

---

## Раздел 2 — плейсхолдер

Найденные носители (поиск `placeholder` / `::placeholder` / `DATE_PLACEHOLDER` / `searchPlaceholder` / `fromPlaceholder` / `toPlaceholder` / `errorPlaceholder` / `addHint` / `editHint` в `src/**`).

### 2.1. Нативный атрибут `placeholder` на `<input>`

| Компонент | Как попадает в разметку | Стили | Где лежат | Настраиваемость снаружи | Витрина | Типографика поля на плейсхолдере | Тон плейсхолдера |
|-----------|-------------------------|-------|-----------|-------------------------|---------|----------------------------------|------------------|
| Input | rest нативного `<input>`: `InputProps` = `Omit<ComponentPropsWithRef<'input'>, …>` `input/index.tsx:65`; атрибут уходит в `StyledInputControl` `:96-102`. Пример в шапке `:71` | на поле: `getTextProperties(getTextSize(sizePreset))` `input.styles.ts:148`; условно `text-align` `:160-162` и `font-style: italic` `:164-166`. На псевдоэлементе: только `color: muted` `:153` | `src/ui/input/input.styles.ts:148-166` | строка — нативный `placeholder`; курсив и выравнивание — `textItalic` / `textAlign` на том же `<input>` (наследуются псевдоэлементом). Отдельного `placeholderTone` / `placeholderItalic` нет | инпут `Placeholder:` `input-settings/index.tsx:111-117`; типографика поля — Text-группа `:119-132` | **да, фактом кода:** `font-size` / `font-weight` / `line-height` пишутся на самом `input` (`:148`), не на `::placeholder`. `text-align` и `font-style: italic` тоже на `input` (`:160-166`). Псевдоэлемент эти свойства не перебивает — наследует | **нет своего тона:** `::placeholder` красит только `theme.colors.muted` (`:153`). Пропа `textTone` у Input нет; цвет значения и цвет плейсхолдера разведены |
| SearchField | rest нативного `<input type="search">`: `SearchFieldProps` включает `Omit<ComponentPropsWithRef<'input'>, …>` `search-field/index.tsx:146-149`; атрибут в `StyledSearchFieldControl` `:255-269` | на поле: `getTextProperties(getTextSize(sizePreset))` `search-field.styles.ts:250`; условно `text-align` `:259-261` и `font-style: italic` `:263-265`. На псевдоэлементе: только `color: muted` `:254` | `src/ui/search-field/search-field.styles.ts:250-265` | строка — нативный `placeholder`; курсив и выравнивание — `textItalic` / `textAlign`. Своих `placeholder*` нет | инпут `Placeholder:` `search-field-settings/index.tsx:151-157`; типографика — Text-группа `:159-172` | **да:** те же три свойства `getTextProperties` и условные `text-align` / `italic` на `input` (`:250,259-265`) | **нет своего тона:** `::placeholder { color: muted }` `:254`. Пропа `textTone` нет |
| TableInlineField | rest нативного `<input>`: `Omit<ComponentPropsWithRef<'input'>, …>` `table-inline-field/index.tsx:28-32`; пример `placeholder="Product"` `:39` | на поле: `getTextProperties(textSize)` `table-inline-field.styles.ts:57`; условно `text-align` `:72-74`. На псевдоэлементе: только `color: muted` `:69`. Пропа `textItalic` нет — курсив на поле не пишется | `src/ui/table/table-inline-field/table-inline-field.styles.ts:56-74` | строка — нативный `placeholder`; размер — `textSize`; выравнивание — `textAlign`. Курсива и тона нет | панели нет; демо `table-demo/index.tsx:570,599,623,662,698,722` | **частично:** размер (`getTextProperties`) и `text-align` на `input`. Курсива в генераторе нет | **нет своего тона:** `::placeholder { color: muted }` `:69` |
| Combobox · поиск | проп `searchPlaceholder` (дефолт `'Search…'` `:103`) → `SearchField placeholder={searchPlaceholder}` `combobox/index.tsx:496` | стили SearchField, см. строку выше | `search-field.styles.ts:254` | да, проп `searchPlaceholder` `:154` | инпут `Search placeholder:` `combobox-settings/index.tsx:131-137` | как у SearchField (наследует типографику поля поиска; `textAlign`/`textItalic` Combobox в SearchField не передаёт — дефолт поля) | как у SearchField: `muted` через `::placeholder` |
| RangeInput · поля from/to | пропы `fromPlaceholder` / `toPlaceholder` (обязательны `:264,274`) → `Input placeholder={…}` `range-input/index.tsx:678,693` | стили Input, см. первую строку | `input.styles.ts:153` | да, два обязательных пропа | инпуты `From placeholder:` / `To placeholder:` `range-input-settings/index.tsx:199-213` | как у Input; RangeInput не передаёт в эти Input `textAlign` / `textItalic` | как у Input: `muted` через `::placeholder` |

В `src/ui/reset.ts` правил `::placeholder` нет (поиск по файлу — пусто).

### 2.2. Наш текстовый узел (подпись пустого значения)

| Компонент | Как попадает в разметку | Стили | Где лежат | Настраиваемость снаружи | Витрина | Типографика | Тон |
|-----------|-------------------------|-------|-----------|-------------------------|---------|-------------|-----|
| Listbox | проп `placeholder` (дефолт `'Select…'` `:103`) рендерится детьми `Text`: `{triggerLabel ?? placeholder}` `listbox/index.tsx:919-926` | `Text` с `ellipsis`, `sizePreset={textSizePreset}`, `tone={triggerLabel ? undefined : 'muted'}` `:919-923` | JSX `listbox/index.tsx:919-926`; размер — `getOpenControlTextSize` `:493` | да, проп `placeholder` `:170`. Тройки `text*` на триггере нет | инпут `Placeholder:` `listbox-settings/index.tsx:131-137` | размер следует `sizePreset` через мост. Курсива и выравнивания нет | тон `muted` только пока нет `triggerLabel`; отдельного пропа тона нет |
| Combobox · триггер | проп `placeholder` (дефолт `'Select…'` `:97`) → `{selectedOption?.label ?? placeholder}` `combobox/index.tsx:461-468` | `Text` с `ellipsis`, `sizePreset={textSizePreset}`, `tone={selectedOption ? undefined : 'muted'}` `:461-465` | JSX `combobox/index.tsx:461-468` | да, проп `placeholder` `:153` | инпут `Placeholder:` `combobox-settings/index.tsx:123-129` | размер через `getOpenControlTextSize`. Курсива и выравнивания нет | `muted` при отсутствии выбора |
| RangeInput · триггер | обязательный проп `placeholder` `:270`; `triggerLabel = isActive ? formatActiveLabel(committed) : placeholder` `:432`; дети `Text` `:609-615` | `Text` с `ellipsis`, `sizePreset={textSizePreset}`, `tone={isActive ? undefined : 'muted'}` `:609-612` | JSX `range-input/index.tsx:609-615` | да, проп `placeholder` | инпут `Placeholder:` `range-input-settings/index.tsx:165-171` | размер через `getRangeInputTextSize`. Курсива и выравнивания нет | `muted` в неактивном состоянии |

### 2.3. Подсказка пустой полоски FieldError (не плейсхолдер значения)

| Компонент | Как попадает в разметку | Стили | Где лежат | Настраиваемость снаружи | Витрина | Типографика | Тон |
|-----------|-------------------------|-------|-----------|-------------------------|---------|-------------|-----|
| FieldError | проп `placeholder` → trim → дети `Text`, если нет ошибки `field-error/index.tsx:112-134` | `align=center`, `sizePreset=thin`, `tone=muted` при подсказке `:123-131` | `field-error/index.tsx:40-58,121-134` | да, проп `placeholder` `:71`. Вид полоски в пропах не отдаётся | секции нет | вшиты `thin` + `center`; курсив снят из типа `:84` | вшит `muted` для подсказки, `danger` для ошибки |
| Input | `errorPlaceholder` → `FieldError placeholder={errorPlaceholder}` `input/index.tsx:105` | стили FieldError | `field-error/index.tsx` | да, проп `errorPlaceholder` `:61` | `field-error-group` `input-settings/index.tsx:134-138` | вшиты | вшит |
| RangeInput | `errorPlaceholder` → `FieldError` `range-input/index.tsx:706` | стили FieldError | `field-error/index.tsx` | да, проп `errorPlaceholder` `:262` | `field-error-group` `range-input-settings/index.tsx:285-289` | вшиты | вшит |
| Table add/edit | `addHint` / `editHint` → `FieldError placeholder={isAdd ? addHint : editHint}` `table/index.tsx:993`; дефолты `:187-194` | стили FieldError; `reserveErrorSpace` без значения `:994` | `table/index.tsx:993-994` | да, пропы `addHint` / `editHint` при `editable` | в `table-settings` контролов нет | вшиты | вшит |

### 2.4. Генерируемая подпись пустого значения (не атрибут и не проп `placeholder`)

| Компонент | Как попадает в разметку | Стили | Где лежат | Настраиваемость снаружи | Витрина | Типографика | Тон |
|-----------|-------------------------|-------|-----------|-------------------------|---------|-------------|-----|
| DateRangeInput | `formatSegmentText` возвращает `DATE_PLACEHOLDER` (`'DD.MM.YY'`) при пустом ISO-дне `date-range-input/index.tsx:207-208`; это `label` сегмента `:472,487` | `textTone: muted` при пустом дне `:473,488`; размер `getSegmentButtonTextSize` `:354,517` | константа `calendar-panel/day.ts:23`; сборка `:463-491` | строка плейсхолдера не проп. `startLabel` / `endLabel` — только `title` и aria, не видимый текст `:173-174` | инпуты `Start label:` / `End label:` настраивают `title`, не `DD.MM.YY` | размер следует `sizePreset` сегментов. Курсива и выравнивания нет | вшит `muted` на пустом сегменте |

---

## Раздел 3 — псевдоэлемент `::placeholder`

### 3.1. Что проект уже задаёт

Во всём `src/**` ровно три вхождения `::placeholder`. Во всех трёх — одно свойство `color`. Правил `:placeholder-shown` нет. В `reset.ts` плейсхолдера нет.

| Файл | Строка | Правило | Контекст |
|------|--------|---------|----------|
| `src/ui/input/input.styles.ts` | 153 | `` `&::placeholder { color: ${theme.colors.muted}; }` `` | `getInputControlStyles`; рядом на том же `input` — `getTextProperties`, условные `text-align` и `font-style: italic` |
| `src/ui/search-field/search-field.styles.ts` | 254 | `` `&::placeholder { color: ${theme.colors.muted}; }` `` | `getSearchFieldControlStyles`; рядом — `getTextProperties`, условные `text-align` и `font-style: italic` |
| `src/ui/table/table-inline-field/table-inline-field.styles.ts` | 69 | `` `&::placeholder { color: ${theme.colors.muted}; }` `` | `getTableInlineFieldStyles`; рядом — `getTextProperties` и условный `text-align` |

Итого свойств через `::placeholder` в проекте: **1** (`color` → `theme.colors.muted`).

### 3.2. Что псевдоэлемент поддерживает по спецификации

Источник: [CSS Pseudo-Elements Module Level 4, §4.3 `::placeholder`](https://www.w3.org/TR/css-pseudo-4/#placeholder-pseudo) (WD 2025-06-27). Цитата спецификации: все свойства, применимые к `::first-line`, применимы и к `::placeholder`, **кроме** свойств из [CSS Inline Layout Module Level 3](https://www.w3.org/TR/css-inline-3/).

Список для `::first-line` — [§2.1.2](https://www.w3.org/TR/css-pseudo-4/#first-line-styling):

- все font-свойства ([CSS Fonts Level 4](https://www.w3.org/TR/css-fonts-4/)): в том числе `font-size`, `font-weight`, `font-style`, `font-family`, `font-variant`, `line-height` как часть шрифтовой группы;
- `color` и `opacity` ([CSS Color Level 4](https://www.w3.org/TR/css-color-4/));
- все background-свойства ([CSS Backgrounds Level 3](https://www.w3.org/TR/css-backgrounds-3/));
- typesetting-свойства инлайнов ([CSS Text Level 4](https://www.w3.org/TR/css-text-4/)): в том числе `letter-spacing`, `word-spacing`, `text-transform`, `text-indent` не из этого набора как box-свойство;
- все text-decoration-свойства ([CSS Text Decoration Level 4](https://www.w3.org/TR/css-text-decor-4/));
- `ruby-position` ([CSS Ruby Level 1](https://www.w3.org/TR/css-ruby-1/));
- прочие свойства, которые отдельные модули явно разрешают на `::first-line`.

Исключение для `::placeholder`: свойства [CSS Inline Layout Level 3](https://www.w3.org/TR/css-inline-3/) (`vertical-align`, `alignment-baseline` и родственные) **не** входят.

MDN ([`::placeholder`](https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder)): «Only the subset of CSS properties that apply to the `::first-line` pseudo-element can be used». Примеры на странице: `color`, `opacity`, `font-weight`, `font-size`, `font-style`.

Замечание спецификации в §4.3: авторы просят `text-align` в списке поддерживаемых свойств псевдоэлемента; отдельного разрешения в текущей редакции нет. В этом проекте `text-align` пишется на самом `input` (`input.styles.ts:160-162`, `search-field.styles.ts:259-261`, `table-inline-field.styles.ts:72-74`) и наследуется плейсхолдером как текст поля.

Практический вывод из кода + спецификации (без предложений): через `::placeholder` без подмены узла теоретически задаются цвет, прозрачность, шрифтовая тройка, `font-style`, декорации и фон подсказки. Выравнивание в текущей спецификации — свойство originating-элемента, не псевдоэлемента.

---

## Раздел 4 — флаги показа текста

| Компонент | Механика показа | Имя ключа | Витринный в JSDoc |
|-----------|-----------------|-----------|-------------------|
| ProgressBar | настоящий проп примитива: `showText` ведёт `ProgressBarShowTextProps` `progress-bar/index.tsx:62-74`; дефолт `true` `:45`; узел `{showText && ( <Text>…{percent}%</Text> )}` `:121` | `showText` | нет: `progress-bar-settings/index.tsx:32` — «включает подпись с процентом выполнения»; шапка стейта `:29` — «Ключи совпадают с именами пропов», без пометки «витринный» |
| Tag | показ = наличие `children`: `{Boolean(children) && <Text>}` `tag/index.tsx:103`. Пропа `showText` у Tag нет | `showText` в `TagWidgetState` | да: `tag-settings/index.tsx:32,41` — «витринный ключ показа текста» |
| Checkbox | показ = наличие `children`: без текста возвращается один бокс `checkbox/index.tsx:99-101` | `showText` в `CheckboxWidgetState` | да: `checkbox-settings/index.tsx:36,43` — «витринный ключ показа подписи» |
| RadioButton | показ = наличие `children`: без текста — один кружок `radio-button/index.tsx:78-80` | `showText` в `RadioButtonWidgetState` | да: `radio-button-settings/index.tsx:30,37` — «витринный ключ показа подписей» |
| Switch | показ = наличие `children`: `{Boolean(children) && <Text>}` `switch/index.tsx:76`. Корень всегда `label` | `showText` в `SwitchWidgetState` | да: `switch-settings/index.tsx:31,36` — «витринный ключ показа подписи» |
| Spinner | показ = `hasText \|\| reserveTextSpace` `spinner/index.tsx:99-100`. `reserveTextSpace` — настоящий проп `:70,89`. Пропа `showText` у Spinner нет | `showText` в `SpinnerWidgetState`; `reserveTextSpace` — проп | `showText` — да, витринный: `spinner-settings/index.tsx:30,34`. `reserveTextSpace` — нет, описан как проп `:33` |
| Card · title | показ = `Boolean(title)` `card/index.tsx:193`. Пропа `showTitle` у Card нет | `showTitle` в `CardWidgetState` | да: `card-settings/index.tsx:39,51` — «витринный ключ показа заголовка» |
| Card · subtitle | показ = `Boolean(subtitle)` `card/index.tsx:179` | `showSubtitle` в `CardWidgetState` | да: `card-settings/index.tsx:50` — «витринный ключ показа подзаголовка» |
| Modal · title / subtitle | проброс Card; показ = наличие `title` / `subtitle` | `showTitle` / `showSubtitle` в `ModalWidgetState` | да: `modal-settings/index.tsx:28,33-34` — «витринный ключ» |
| Input · ошибка | показ полоски = `hasError \|\| hasPlaceholder \|\| reserveErrorSpace` внутри FieldError `field-error/index.tsx:115`. `invalid` — проп обводки, не показа текста `input/index.tsx:62,87` | `invalid` в `InputWidgetState` используется как `show` текстовой группы Error `input-settings/index.tsx:149-153` | нет слова «витринный» у `invalid`: JSDoc `:39` — «включает обводку ошибки без текста». Механика чекбокса — проп `show` сателлита с `label: 'Invalid'` |
| Input · значение | неотключаемо: нативный `value` всегда на поле | — | флага показа нет; `showcase.mdc`: «Флага `Show text` нет» |
| SearchField · значение | неотключаемо: `value` обязателен | — | флага показа нет |
| Stepper · значение | неотключаемо: `value` обязателен | — | флага показа нет |
| Toast · сообщение | неотключаемо: `children` обязателен `toast/index.tsx:40` | — | флага показа нет |
| Button · лейбл | неотключаемо: `children` обязателен `button/index.tsx:98` | — | флага показа нет |
| Text | неотключаемо: весь компонент — текст | — | флага показа нет; `text-settings` без `show` |
| Fieldset · legend | неотключаемо: `label` обязателен `fieldset/index.tsx:59` | — | флага показа нет |
| RangeInput · title | неотключаемо: `title` обязателен `range-input/index.tsx:273` | — | флага `show` у `title-group` нет `range-input-settings/index.tsx:173-183` |
| FieldLabel | показ = наличие `children`; иначе `null` `field-label/index.tsx:66-68` | нет ключа | секции нет |
| FieldError | показ = ошибка или подсказка или резерв `field-error/index.tsx:115-118` | `reserveErrorSpace` — настоящий проп | у Input/RangeInput — проп, не витринный ключ (`field-error-group`) |
| Listbox / Combobox / RangeInput · триггер | подпись пустого значения = проп `placeholder` всегда в дереве; смена вида — наличие выбора, не флаг | — | флага показа плейсхолдера нет |
| DateRangeInput · сегменты | пустое значение → `DATE_PLACEHOLDER`; не флаг | — | флага нет |
| Table · hints | показ полоски = FieldError с `reserveErrorSpace` и `addHint`/`editHint` `table/index.tsx:993-994` | нет `show*` | в панели Table контролов показа текста нет |

Превью витрины ветвит витринные ключи в `src/pages/showcase/index.tsx:1448-1495` (`tagTextProps`, `checkboxTextProps`, `radioButtonA/BTextProps`, `switchTextProps`, `progressBarShowTextProps`) и `:1362-1386` (`cardTitleProps` / `modalTitleProps` по `showTitle` / `showSubtitle`). Spinner: `{spinner.showText && spinner.text}` `:1959`.

---

## Сводка числом

- Компонентов с видимым текстом в таблицах раздела 1: **28** строк основного текста + **24** строки вторичных + **3** виджета.
- Отдают полную тройку `textTone`+`textSize`+`textItalic` (без `textAlign`): Tag, Toast, Spinner, ProgressBar, Checkbox, RadioButton, Switch, Button.
- Отдают тройку плюс `textAlign`: только Stepper.
- Отдают только `textAlign`+`textItalic` (без тона и размера текста): Input, SearchField.
- Мостов `get[Имя]TextSize`: 12 (`getTagTextSize`, `getToastTextSize`, `getSpinnerTextSize`, `getProgressBarTextSize`, `getCheckboxTextSize`, `getRadioButtonTextSize`, `getSwitchTextSize`, `getButtonTextSize`, `getSegmentButtonTextSize`, `getStepperTextSize`, `getRangeInputTextSize`, `getTableTextSize`) + общие `getOpenControlTextSize`, `getCalendarPanelTextSize`.
- Носителей плейсхолдера: **5** нативных `<input>` (Input, SearchField, TableInlineField, Combobox-поиск, RangeInput from/to), **3** текстовых узла пустого триггера (Listbox, Combobox, RangeInput), **4** подсказки FieldError (сам FieldError, Input, RangeInput, Table hints), **1** генерируемая дата (`DATE_PLACEHOLDER`).
- Правил `::placeholder` в проекте: **3** файла, везде только `color: muted`.
- Настоящих проп-флагов показа текста: **1** (`ProgressBar.showText`). Витринных ключей показа текста/заголовка: **8** (`showText` у Tag/Checkbox/RadioButton/Switch/Spinner; `showTitle`/`showSubtitle` у Card и Modal).

**Подпись:** аудитор Cursor Grok 4.6

# Полное ревью · область 13 — покрытие витрины

**Проект:** `/Users/konstantin/Projects/extension-vite-ts-starter`
**Дата обхода:** 2026-08-15
**Метод:** сплошное чтение публичных типов примитивов (`src/ui/**/index.tsx` + `*.styles.ts`) и виджетов (`src/components/**/index.tsx`), сверка с панелями `src/pages/showcase/*-settings/` и превью в `src/pages/showcase/index.tsx`. Канон: `showcase.mdc` («Полнота панели», «Порядок полей — по пропам вида компонента», «Сателлиты витрины», «Ключи стейта = имена пропов») и `project.mdc` §8.7. Код не правился.
**Охват:** 24 панели (`button`, `card`, `checkbox`, `combobox`, `date-range-input`, `fieldset`, `header`, `icon`, `input`, `listbox`, `modal`, `progress`, `radio-button`, `range-input`, `search-field`, `segment-button`, `spinner`, `stepper`, `switch`, `table`, `tag`, `text`, `toast`, `toolbar`). Сателлиты без своих секций (`segment-button-parts`, `icon-button-row`, `calendar-panel`, `anchored-portal`, вложенные Table) — по панелям потребителей. Примитивы и виджеты без секции витрины перечислены в конце охвата, без таблиц полноты.

**Искал потребителей** в `extension-vite-ts-starter` (витрина + `src/ui` + `src/components`). Соседние репозитории воркспейса (`сaption-downloader`, `yt-lodger`, `seolizer`) на покрытие витрины стартера не влияют: панели живут только здесь.

---

## Условные обозначения

| Пометка | Смысл |
|---------|--------|
| контрол | есть контрол панели; в скобках лейбл |
| a11y | исключение «пропсы доступности» |
| буфер | исключение «буфер значения превью» |
| демо | исключение «демо-содержимое вложенных компонентов» |
| вшито | исключение «поведение, вшитое в примитив, не являющееся пропом» |
| дыра | ни под одно исключение канона не подходит |
| витринный | ключ стейта, не являющийся пропом примитива |

Пакет `LayoutProps` (spacing / positioning / sizing) — одна сводная строка на компонент. Пакеты `BorderProps` и `ChildrenTextProps` — по ключам. Колбэки (`onChange`, `onClose`, `onClear`, `onCommit`) и ref — не пропы вида; в таблицы не входят, кроме случаев, где наличие колбэка само по себе включает видимый режим (сброс).

---

## 1. Text

**Тип:** `TextProps` = `{ as? }` + `TextStyleProps` (`src/ui/text/index.tsx:89–92`, `text.styles.ts:231–242`).
**Панель:** `src/pages/showcase/text-settings/index.tsx:57–87`. Стейт: `TextWidgetState` `:31–38`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:` через `text-group`) | |
| `align` | да (`Align:`) | |
| `tone` | да (`Tone:`) | |
| `children` | да (`Sample:`) | |
| `ellipsis` | да (`Show ellipsis`) | |
| `italic` | да (`Show italic`) | |
| `color` | нет | дыра |
| `fontSize` | нет | дыра |
| `fontWeight` | нет | дыра |
| `lineHeight` | нет | дыра |
| `whiteSpace` | нет | дыра |
| `as` | нет | сводка: смена тега, не проп вида панели |
| `LayoutProps` | нет | сводка layout; слота в каноне нет |
| нативные атрибуты `span` | нет | сводка a11y/native |

Витринных ключей нет. JSDoc стейта (`:24–29`) совпадает с пропами.

---

## 2. Tag

**Тип:** `TagShowDotProps` + `ChildrenTextProps` + `TagStyleProps` + `BorderProps` (`src/ui/tag/index.tsx:54–73`, `tag.styles.ts:190–196`).
**Панель:** `tag-settings/index.tsx:84–172`. Стейт `:50–65`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `tone` | да (`Tone:`) | |
| `showBorder` / `showShadow` / `borderTone` | да (`Show border` / `Show shadow` / `Border tone:`) | |
| `showDot` | да (`Show dot`) | |
| `dotTone` | да (`Dot tone:`, при `showDot`) | |
| `tinted` | да (`Show tinted`) | |
| `children` | да (`Text:` + `Show text`) | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `span` | нет | сводка a11y/native |

Витринные: `showText`, `text` — помечены в JSDoc `:31–32`, `:41–43`.

---

## 3. Checkbox

**Тип:** `CheckboxStyleProps` + `ChildrenTextProps` + native `input` (`src/ui/checkbox/index.tsx:59–64`, `checkbox.styles.ts:135–140`).
**Панель:** `checkbox-settings/index.tsx:107–188`. Стейт `:51–63`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `inverted` | да (`Show inverted`) | |
| `children` | да (`Text:` + `Show text`) | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `checked` | да (`Checked`) | |
| `checkedMark` | да (`Checked mark:`, при `checked`) | |
| `uncheckedMark` | да (`Unchecked mark:`, при !`checked`) | |
| `disabled` | да (`Disabled`) | |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `input` (`name`, `onChange`, …) | нет | сводка a11y/native |

Витринные: `showText`, `text` — помечены `:35–36`, `:43`.

---

## 4. RadioButton

**Тип:** `RadioButtonStyleProps` + `ChildrenTextProps` + native `input` (`src/ui/radio-button/index.tsx:46–51`, `radio-button.styles.ts:88–90`).
**Панель:** `radio-button-settings/index.tsx:87–157`. Стейт `:45–56`. Превью — пара экземпляров (`showcase/index.tsx:1881–1898`).

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `children` | да (`Text A:` / `Text B:` + `Show text`) | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `checked` | да (`Selected:`) — через витринный `selected` | |
| `disabled` | да (`Disable A` / `Disable B`) | |
| `LayoutProps` | нет | сводка layout |
| нативные (`name`, `value`, `onChange`) | нет | сводка a11y/native; `name`/`value` — демо-обвязка пары |

Витринные: `showText`, `textA`, `textB` — помечены `:30–31`. `selected`, `disabledA`, `disabledB` — витринные (не имена пропов примитива); в шапке типа `:30–31` не названы витринными, в `@property` (`:34–36`) пометки «витринный ключ» нет.

---

## 5. Switch

**Тип:** `SwitchStyleProps` + `ChildrenTextProps` + native `input` (`src/ui/switch/index.tsx:47–52`, `switch.styles.ts:113–116`).
**Панель:** `switch-settings/index.tsx:76–139`. Стейт `:44–54`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `tone` | да (`Tone:`) | |
| `children` | да (`Text:` + `Show text`) | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `checked` | да (`Checked`) | |
| `disabled` | да (`Disabled`) | |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `input` | нет | сводка a11y/native |

Витринные: `showText`, `text` — помечены `:30–31`, `:36`.

---

## 6. Spinner

**Тип:** `SpinnerStyleProps` + `{ ariaLabel, children, reserveTextSpace, textItalic, textSize, textTone }` (`src/ui/spinner/index.tsx:67–77`, `spinner.styles.ts:86–89`).
**Панель:** `spinner-settings/index.tsx:73–127`. Стейт `:42–51`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `tone` | да (`Tone:`) | |
| `children` | да (`Text:` + `Show text`) | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `reserveTextSpace` | да (`Reserve text space`) | |
| `ariaLabel` | нет | a11y; в превью дефолт примитива `'Loading'` |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `div` | нет | сводка a11y/native |

Витринные: `showText`, `text` — помечены `:29–30`, `:34`.

---

## 7. Toast

**Тип:** `ToastStyleProps` + `{ children, textItalic, textSize, textTone }` (`src/ui/toast/index.tsx:39–47`, `toast.styles.ts:50–53`). Рамка в генераторе без публичных флагов (`toast.styles.ts:70–71`).
**Панель:** `toast-settings/index.tsx:67–108`. Стейт `:38–45`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `tone` | да (`Tone:`) | |
| `children` | да (`Text:` → ключ `message`) | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `LayoutProps` | нет | сводка layout |
| `role` / `aria-live` | нет | вшито: считаются из `tone` (`toast/index.tsx:65–67`) |
| нативные атрибуты `div` | нет | сводка a11y/native |

Ключ `message` — поле DTO `ToastInput`, не витринный в смысле UI-логики; помечен в JSDoc `:26–28`, `:31`.

---

## 8. ProgressBar

**Тип:** `ProgressBarStyleProps` + `ProgressBarShowTextProps` (`src/ui/progress-bar/index.tsx:62–84`, `progress-bar.styles.ts:83–87`).
**Панель:** `progress-bar-settings/index.tsx:94–141`. Стейт `:40–48`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `tone` | да (`Tone:`) | |
| `value` | да (`Value:`) | |
| `showText` | да (`Show text`) — настоящий проп | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `LayoutProps` | нет | сводка layout |
| `aria-label` / `aria-labelledby` | нет | a11y; превью: `aria-labelledby` на заголовок карточки (`showcase/index.tsx:1938`) |
| нативные атрибуты `div` | нет | сводка a11y/native |

Витринных ключей нет. JSDoc `:28–29` совпадает с пропами.

---

## 9. Fieldset

**Тип:** `{ children, label, legendItalic, legendSizePreset, legendTone }` + `FieldsetStyleProps` (`src/ui/fieldset/index.tsx:57–67`, `fieldset.styles.ts:79–81`).
**Панель:** `fieldset-settings/index.tsx:65–95`. Стейт `:36–43`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `borderTone` | да (`Border tone:`) | |
| `label` | да (`Legend:`) | |
| `legendSizePreset` | да (`Legend size:`) | |
| `legendTone` | да (`Legend tone:`) | |
| `legendItalic` | да (`Show italic`) | |
| `children` | нет | демо: группа RadioButton в превью (`showcase/index.tsx:1915–1930`) |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `fieldset` | нет | сводка a11y/native |

Витринный: `selected` — помечен `:24–25`, `:34`.

---

## 10. Button

**Тип:** `{ children, label, text* }` + `ButtonIconProps` + `ButtonStyleProps` (`src/ui/button/index.tsx:72–105`, `button.styles.ts:120–126`).
**Панель:** `button-settings/index.tsx:94–174`. Стейт `:55–72`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` | да (`Label:` в `control-group`) | |
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `tone` | да (`Tone:`) | |
| `icon` | да (`Show icon` + `Icon:`) | |
| `iconShape` | да (`Icon shape:`) | |
| `iconTone` | да (`Icon tone:`) | |
| `iconFill` | да (`Icon fill:`) | |
| `iconPosition` | да (`Icon position:`) | |
| `children` | да (`Text:`) | |
| `textSize` | да (`Text size:`) | |
| `textTone` | да (`Text tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `active` | да (`Active`) | |
| `disabled` | да (`Disabled`) | |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `button` (`type`, …) | нет | сводка a11y/native |

Витринные: `withIcon`, `iconKey`, `text` — помечены `:33–35`, `:41`, `:48`, `:53`.

---

## 11. Icon

**Тип:** `{ as? }` + `IconStyleProps` + `BorderProps` (`src/ui/icon/index.tsx:79–82`, `icon.styles.ts:334–342`).
**Панель:** `icon-settings/index.tsx:90–155`. Стейт `:59–71`. Превью: `as="button"` (`showcase/index.tsx:1786`).

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `iconTone` | да (`Tone:` при пустом `labelPrefix`) | |
| `iconFill` | да (`Fill:`) | |
| `children` | да (`Icon:`) | |
| `padding` | да (`Padding:`) — layout-ключ, вынесен отдельно | |
| `showBorder` / `showShadow` / `borderTone` | да (`Show border` / `Show shadow` / `Border tone:`) | |
| `showHover` | да (`Show hover`) | |
| `disabled` | да (`Disabled`) | |
| `interactive` | нет | дыра |
| `as` | нет | сводка: в превью зафиксирован `button` |
| прочий `LayoutProps` | нет | сводка layout |
| нативные / `aria-label` | нет | a11y; превью: фиксированный `DEMO_ICON_ARIA_LABEL` (`showcase/index.tsx:1785`) |

Витринный: `iconKey` — помечен `:42–43`, `:49`.

---

## 12. Card

**Тип:** `{ actionShape, as, children, headerActions }` + `CardTitleProps` + `CardSubtitleProps` + `CardStyleProps` без `hasHeader` + `BorderProps` (`src/ui/card/index.tsx:94–151`, `card.styles.ts:58–62`).
**Панель:** `card-settings/index.tsx:97–160`. Стейт `:61–78`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `showBorder` / `showShadow` / `borderTone` | да (`Show border` / `Show shadow` / `Border tone:`) | |
| `background` | да (`Background:`) | |
| `title` | да (`Title:` + `Show title`) | |
| `titleSizePreset` | да (`Title size:`) | |
| `titleAlign` | да (`Title align:`) | |
| `titleTone` | да (`Title tone:`) | |
| `subtitle` | да (`Subtitle:` + `Show subtitle`) | |
| `subtitleSizePreset` | да (`Subtitle size:`) | |
| `subtitleAlign` | да (`Subtitle align:`) | |
| `subtitleTone` | да (`Subtitle tone:`) | |
| `actionShape` | да (`Action shape:`) | |
| `headerActions` | да (`icon-row-group`: глиф / padding / Disable / удаление / добавление) | |
| `titleId` | нет | a11y |
| `as` | нет | сводка: смена тега |
| `children` | нет | демо: тело карточки в превью пустое (`showcase/index.tsx:1554–1563`) |
| `hasHeader` | нет | вшито: считается из `title`/`subtitle` (`card/index.tsx:177`) |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты корня | нет | сводка a11y/native |

Сателлит `icon-button-row` через эту панель: `actions.icon` / `iconPadding` / `disabled` / `shape` (как `actionShape`) — есть; `rovingFocus` — нет (у Card ряд без roving, `card/index.tsx:217–225`); `ariaLabel` / `ariaControls` / `ariaExpanded` / `title` — a11y (в сборщике `ariaLabel` = ключ глифа, `icon-row-group.ts:45`).

Витринные: `showTitle`, `showSubtitle` — помечены `:38–39`, `:50–51`. `headerActions` в стейте — демо-форма ряда, помечена `:40–41`.

---

## 13. Modal

**Тип:** `CardForwardProps` (Card без `children`/`headerActions`, с title/subtitle-объединениями) + `{ children, closeAriaLabel, onClose, open }` (`src/ui/modal/index.tsx:67–87`). Дефолт `showBorder = false` (`:62`, `:102`).
**Панель:** `modal-settings/index.tsx:80–128`. Стейт `:45–58`. Превью: `showcase/index.tsx:1538–1547` — `background`, `inlineSize` из витринного `sizePreset`, title/subtitle, `open`/`onClose`; рамки и `actionShape` нет.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `background` | да (`Background:`) | |
| `title` + `titleSizePreset` / `titleAlign` / `titleTone` | да (`title-group` + `Show title`) | |
| `subtitle` + `subtitle*` | да (`title-group` + `Show subtitle`) | |
| `showBorder` | нет | дыра |
| `showShadow` | нет | дыра |
| `borderTone` | нет | дыра |
| `actionShape` | нет | дыра |
| `open` | нет | буфер: открытие кнопкой «Open modal» (`showcase/index.tsx:1531–1536`) |
| `closeAriaLabel` | нет | a11y |
| `titleId` | нет | a11y; Modal считает сам (`modal/index.tsx:108`) |
| `as` | нет | сводка: смена тега Card |
| `children` | нет | демо: `DEMO_MODAL_BODY_TEXT` (`showcase/index.tsx:1546`) |
| `headerActions` | нет | вшито: Modal подставляет кнопку закрытия (`modal/index.tsx:143–150`) |
| `LayoutProps` (кроме витринной ширины) | нет | сводка layout |
| нативные атрибуты `dialog` | нет | сводка a11y/native |

Витринные: `showTitle`, `showSubtitle`, `sizePreset` — помечены `:27–29`, `:33–35`. `sizePreset` не проп Modal: витрина кладёт его в `inlineSize` (`showcase/index.tsx:1540`).

---

## 14. Toolbar

**Тип:** `{ actions, actionShape, ariaLabel }` + `ToolbarStyleProps` + `BorderProps` (`src/ui/toolbar/index.tsx:44–52`, `toolbar.styles.ts:46–51`).
**Панель:** `toolbar-settings/index.tsx:81–138`. Стейт `:50–59`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `showBorder` / `showShadow` / `borderTone` | да (`border-group`) | |
| `background` | да (`Background:`) | |
| `actionShape` | да (`Action shape:`) | |
| `actions` | да (`icon-row-group`) | |
| `ariaLabel` | нет | a11y |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `div` | нет | сводка a11y/native |

Сателлит `icon-button-row`: `rovingFocus` вшит в Toolbar (`toolbar/index.tsx:83`); глиф / padding / disable — в `icon-row-group`.

Витринных ключей нет. JSDoc `:36–38` про демо-форму `actions`.

---

## 15. Header

**Тип:** `{ autoHide, brand, center, leadingActions, onSettingsClick, settingsLabel }` (`src/components/header/index.tsx:61–68`).
**Панель:** `header-settings/index.tsx:35–42`. Типа `*WidgetState` нет.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `autoHide` | да (`Auto-hide`) | |
| `brand` | нет | демо: слот заполняет каркас страницы |
| `center` | нет | демо: слот каркаса |
| `leadingActions` | нет | демо: слот каркаса |
| `onSettingsClick` | нет | колбэк каркаса витрины |
| `settingsLabel` | нет | a11y |

Витринного типа стейта нет — помечать JSDoc негде.

---

## 16. Input

**Тип:** `InputStyleProps` + `BorderProps` + `{ error, errorPlaceholder, invalid, label, reserveErrorSpace }` + native `input` (`src/ui/input/index.tsx:59–65`, `input.styles.ts:50–56`).
**Панель:** `input-settings/index.tsx:90–165`. Стейт `:52–68`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` | да (`Label:`) | |
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `showBorder` / `showShadow` / `borderTone` | да (`border-group`) | |
| `placeholder` | да (`Placeholder:`) | |
| `value` | да (`Text:`) | |
| `textAlign` | да (`Text align:`) | |
| `textItalic` | да (`Show italic`) | |
| `reserveErrorSpace` | да (`Reserve error space`) | |
| `errorPlaceholder` | да (`Reserved space placeholder:`) | |
| `error` | да (`Error:`) | |
| `invalid` | да (`Invalid`) | |
| `disabled` | да (`Disabled`) | |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `input` | нет | сводка a11y/native |

Витринных ключей нет. JSDoc `:30–31` совпадает с пропами.

Сателлит `field-error`: `children` / `placeholder` / `reserveErrorSpace` закрыты этой панелью и панелью RangeInput.

---

## 17. SearchField

**Тип:** `{ clearShape, iconFill, iconTone, label, onChange, onClear, value }` + `SearchFieldShowIconProps` + `SearchFieldStyleProps` + `BorderProps` (`src/ui/search-field/index.tsx:111–149`, `search-field.styles.ts:55–61`).
**Панель:** `search-field-settings/index.tsx:103–183`. Стейт `:62–81`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` | да (`Label:`) | |
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `clearShape` | да (`Clear shape:`) | |
| `showBorder` / `showShadow` / `borderTone` | да (`border-group`) | |
| `showIcon` | да (`Show icon`) | |
| `icon` | да (`Icon:`) | |
| `iconShape` | да (`Icon shape:`) | |
| `iconTone` | да (`Icon tone:`) | |
| `iconFill` | да (`Icon fill:`) | |
| `iconPosition` | да (`Icon position:`) | |
| `placeholder` | да (`Placeholder:`) | |
| `value` | да (`Text:`) | |
| `textAlign` | да (`Text align:`) | |
| `textItalic` | да (`Show italic`) | |
| `disabled` | да (`Disabled`) | |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `input` | нет | сводка a11y/native |

Витринный: `iconKey` — помечен `:39–40`, `:47`.

---

## 18. Listbox

**Тип:** `ListboxStyleProps` + `ListboxMultipleProps` + поля значения/иконки/сброса (`src/ui/listbox/index.tsx:137–176`, `listbox.styles.ts:44–51`).
**Панель:** `listbox-settings/index.tsx:81–148`. Стейт `:46–59`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` | да (`Label:`) | |
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `iconTone` | да (`Icon tone:`) | |
| `iconFill` | да (`Icon fill:`) | |
| `iconPosition` | да (`Icon position:`) | |
| `multiple` | да (`Multiple`) | |
| `inlineCheckbox` | да (`Inline checkbox`, при `multiple`) | |
| `showClear` | да (`Show clear`) | |
| `placeholder` | да (`Placeholder:`) | |
| `disabled` | да (`Disabled`) | |
| `value` | нет | буфер; помечен `:44` |
| `defaultValue` | нет | буфер / неконтролируемый режим; превью контролируемое |
| `options` | нет | демо: `LISTBOX_DEMO_OPTIONS` |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `div` | нет | сводка a11y/native |

Витринных ключей кроме буфера `value` нет. `value` помечен как буфер, не как витринный ключ UI.

---

## 19. Combobox

**Тип:** `ComboboxStyleProps` + поля поиска/значения (`src/ui/combobox/index.tsx:143–160`, `combobox.styles.ts:47–54`).
**Панель:** `combobox-settings/index.tsx:84–156`. Стейт `:48–62`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` | да (`Label:`) | |
| `sizePreset` | да (`Size:`) | |
| `shape` | да (`Shape:`) | |
| `iconTone` / `iconFill` / `iconPosition` | да (`icon-group`) | |
| `showClear` | да (`Show clear`) | |
| `placeholder` | да (`Placeholder:`) | |
| `searchPlaceholder` | да (`Search placeholder:`) | |
| `emptyMessage` | да (`Empty message:`) | |
| `disabled` | да (`Disabled`) | |
| `value` | нет | буфер; помечен `:45` |
| `defaultValue` | нет | буфер / неконтролируемый режим |
| `options` | нет | демо; иконки опций — витринный `withIcon` |
| `'aria-label'` | нет | a11y |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `div` | нет | сводка a11y/native |

Витринные: `withIcon` — помечен `:30–31`, `:46`. Контрол: `Show option icons` (`:111`).

---

## 20. RangeInput

**Тип:** `RangeInputStyleProps` + `RangeInputButtonProps` + `RangeInputInputProps` + `RangeInputTitleProps` + поля диапазона (`src/ui/range-input/index.tsx:200–278`).
**Панель:** `range-input-settings/index.tsx:127–301`. Стейт `:78–105`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` / `sizePreset` / `shape` | да (`control-group`) | |
| `iconTone` / `iconFill` / `iconPosition` | да (`icon-group`) | |
| `onClear` (наличие) | да (`Show clear` → `withClear`) | |
| `placeholder` | да (`Placeholder:`) | |
| `title` / `titleAlign` / `titleSizePreset` / `titleTone` | да (`title-group`, без `show`) | |
| `inputSizePreset` | да (`Input size:`) | |
| `inputShape` | да (`Input shape:`) | |
| `fromPlaceholder` | да (`From placeholder:`) | |
| `toPlaceholder` | да (`To placeholder:`) | |
| `buttonSizePreset` | да (`Button size:`) | |
| `buttonShape` | да (`Button shape:`) | |
| `buttonTone` | да (`Button tone:`) | |
| `buttonText` | да (`Button text:`) | |
| `buttonTextTone` | да (`Button text tone:`) | |
| `validationMessages.emptyBounds` | да (`Validation empty bounds:`) | |
| `validationMessages.invalidFrom` | да (`From validation error:`) | |
| `validationMessages.invalidTo` | да (`To validation error:`) | |
| `reserveErrorSpace` / `errorPlaceholder` | да (`field-error-group`) | |
| `disabled` | да (`Disabled`) | |
| `buttonInlineSize` | нет | дыра |
| `buttonPaddingInline` | нет | дыра |
| `presets` | нет | дыра |
| `formatActiveLabel` | нет | дыра: публичный проп вида триггера; в превью зафиксирован `formatDemoRangeLabel` (`showcase/index.tsx:1704`) |
| `value` | нет | буфер; помечен `:75` |
| `defaultValue` | нет | буфер / неконтролируемый режим |
| `validate` | нет | колбэк; в превью зафиксирован `validateDemoRange` |
| `LayoutProps` | нет | сводка layout |

Витринные: `withClear` — помечен `:45–46`, `:76`.

---

## 21. DateRangeInput

**Тип:** `DateRangeInputStyleProps` + поля дней/подписей/форм (`src/ui/date-range-input/index.tsx:176–199`).
**Панель:** `date-range-input-settings/index.tsx:79–169`. Стейт `:44–57`. Превью всегда передаёт `onClear` (`showcase/index.tsx:1752–1755`).

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` / `sizePreset` / `shape` | да (`control-group`) | |
| `startLabel` | да (`Start label:`) | |
| `endLabel` | да (`End label:`) | |
| `startDay` | да (`Start day:`) | |
| `endDay` | да (`End day:`) | |
| `minDay` | да (`Min day:`) | |
| `maxDay` | да (`Max day:`) | |
| `dayShape` | да (`Day shape:`) | |
| `buttonShape` | да (`Button shape:`) | |
| `disabled` | да (`Disabled`) | |
| `onClear` (наличие) | нет | дыра: опциональный проп включает кнопку сброса; у RangeInput тот же режим вынесен как `Show clear` |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `div` | нет | сводка a11y/native |

Сателлит `calendar-panel` (`calendar-panel/index.tsx:108–118`, `calendar-panel.styles.ts:159–168`): `dayShape` / `shape` / `sizePreset` / `minDay` / `maxDay` / `rangeStart` / `rangeEnd` закрыты панелью хозяина (`date-range-input/index.tsx:558–566`: `dayShape`, `shape={shape}` хозяина). `viewMonth` — буфер панели. `onSelectDay` / `onViewMonthChange` / refs — не вид.

Витринных ключей нет. JSDoc `:28–29` совпадает с пропами.

---

## 22. Stepper

**Тип:** `StepperStyleProps` + `StepperAccessibleName` + `{ max, min, onChange, onCommit, step, suffix, value }` (`src/ui/stepper/index.tsx:115–156`, `stepper.styles.ts:72–78`).
**Панель:** `stepper-settings/index.tsx:82–178`. Стейт `:46–60`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` / `sizePreset` / `shape` | да (`control-group`) | |
| `min` | да (`Min:`) | |
| `max` | да (`Max:`) | |
| `step` | да (`Step:`) | |
| `suffix` | да (`Suffix:`) | |
| `value` | да (`Value:`) | |
| `textSize` | да (`Value size:`) | |
| `textAlign` | да (`Value align:`) | |
| `textTone` | да (`Value tone:`) | |
| `textItalic` | да (`Show italic`) | |
| `disabled` | да (`Disabled`) | |
| `aria-label` / `aria-labelledby` | нет | a11y; превью при пустом `label` кладёт `DEMO_STEPPER_ARIA_LABEL` (`showcase/index.tsx:1981–1983`) |
| `onCommit` | нет | колбэк, не вид |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `input` | нет | сводка a11y/native |

Витринных ключей нет.

---

## 23. SegmentButton

**Тип:** `{ label, textItalic, textSize }` + `shape`/`sizePreset` + `Pick<SegmentButtonPartsProps, 'center' \| 'left' \| 'right'>` (`src/ui/segment-button/index.tsx:53–62`).
**Панель:** `segment-button-settings/index.tsx:140–335`. Стейт `:75–109`.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `label` / `sizePreset` / `shape` | да (`control-group`) | |
| `left` / `center` / `right` как наличие среднего | да (`Segments:`) | |
| `*.tone` | да (`Left tone:` / `Center tone:` / `Right tone:`) | |
| `*.icon` / `iconFill` / `iconPosition` | да (`icon-group` с префиксом) | |
| `*.label` | да (`Left text:` / `Center text:` / `Right text:`) | |
| `*.textTone` | да (`Left text tone:` / …) | |
| `textSize` | да (`Text size:`) | |
| `textItalic` | да (`Show italic`) | |
| `*.active` | да (`Active left` / `center` / `right`) | |
| `*.disabled` | да (`Disable left` / `center` / `right`) | |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `div` | нет | сводка a11y/native |

Сателлит `segment-button-parts` (`segment-button-parts/index.tsx:62–135`): `ariaControls` / `ariaExpanded` / `ariaHaspopup` — a11y; `title` — a11y/native tooltip, контрола нет; `dataAction` / `onClick` / `onDoubleClick` / `onLongPress` / `ref` — не вид; `shape` частей вшит как `SEGMENT_BUTTON_PARTS_FLUSH_SHAPE` (`segment-button/index.tsx:99`).

Витринные: `segmentCount`, `*WithIcon`, `*IconKey` — помечены `:37–38`, `:44`, `:49`, `:59`, `:69`.

---

## 24. Table

**Тип:** `{ columns, numbered, rows }` + `TableEditableProps` + `TableStyleProps` + ветка `checkable` (`src/ui/table/index.tsx:245–395`, `table.styles.ts:161–166`).
**Панель:** `table-settings/index.tsx:76–162`. Стейт `:44–54`. Превью: `table-demo/index.tsx:747–785` — `numbered: false` всегда.

| Проп | Контрол | Исключение / дыра |
|------|---------|-------------------|
| `sizePreset` | да (`Size:`) | |
| `showBorder` | да (`Show border`) | |
| `striped` | да (`Striped`) | |
| `hoverHighlight` | да (`Hover highlight`) | |
| `checkable` | да (`Checkable`) | |
| `editable` | да (`Editable (add / edit)`) | |
| `numbered` | нет | дыра: проп есть; превью всегда `numbered: false` (`table-demo/index.tsx:749–752`); визуал нумерации идёт колонкой каталога от витринного `showIndexColumn` |
| `addError` | нет | дыра |
| `addHint` | нет | дыра |
| `editError` | нет | дыра |
| `editHint` | нет | дыра |
| `addRowActive` / `addRowSource` / `editRowActive` / `editRowKey` | нет | буфер: открываются кликом «+» / правки в демо |
| `selectedKeys` | нет | буфер выбора в превью |
| `columns` / `rows` | нет | демо: `table-demo` |
| `renderAddCell` / `renderEditCell` / `renderBulkSelectionActions` / `renderSelectedRowActions` | нет | демо |
| `getRowKey` / `getRowGroupMemberKeys` / `isRowSelectable` / `allSelectableKeys` | нет | демо / поведение демо-таблицы |
| `rowCheckboxColumnKey` | нет | закрыт витринным `separateCheckboxColumn` (не имя пропа) |
| `selectedRowActionsColumnKey` | нет | демо: колонка действий в `table-demo` |
| `LayoutProps` | нет | сводка layout |
| нативные атрибуты `table` + `aria-label` | нет | a11y; превью: `CATALOG_TABLE_DEMO_ARIA_LABEL` |

Вложенные без своих панелей, проверка по демо-потребителю `table-demo`:

- `TableCell` (`table-cell/index.tsx:35–53`, `table-cell.styles.ts:39`): `sizePreset` / `textAlign` / `ellipsis` / `nowrap` / `head` / `scope` — задаёт рендер колонок демо, контролов панели Table нет. `sizePreset` следует за `Size:` хозяина.
- `TableGroupCell` (`table-group-cell/index.tsx:26–28`): только `children` — демо.
- `TableNestedCell` (`table-nested-cell/index.tsx:28–31`): `nestDepth` — из данных строки демо, контрола нет.
- `TableInlineField` (`table-inline-field/index.tsx:28–32`, `table-inline-field.styles.ts:25–28`): `textAlign` / `textSize` — из контекста ячейки демо.
- `TableMemberPrefix` — нативных пропов вида нет.

Витринные: `showIndexColumn`, `continuousNumbering`, `separateCheckboxColumn` — помечены `:25–28`, `:32–40`.

---

## Компоненты без секции витрины

По `showcase.mdc` «Какие компоненты получают секцию» секции нет у сателлитов. Зафиксировано чтением `src/pages/showcase/*-settings/` и `WidgetSettingsKey` (`showcase/index.tsx:323–346`).

| Компонент | Путь типа | Секция | Как закрыты пропы вида |
|-----------|-----------|--------|------------------------|
| `segment-button-parts` | `src/ui/segment-button-parts/index.tsx:129` | нет | панель SegmentButton |
| `icon-button-row` | `src/ui/icon-button-row/index.tsx:85` | нет | панели Card и Toolbar |
| `calendar-panel` | `src/ui/date-range-input/calendar-panel/index.tsx:108` | нет | панель DateRangeInput |
| `anchored-portal` | `src/ui/anchored-portal/index.tsx:79` | нет | пропы показа/dismiss — не вид; потребители Listbox / Combobox / RangeInput / DateRangeInput / Table / ProfileMenu |
| Table nested | `src/ui/table/table-*/` | нет | `table-demo` + панель Table |
| `field-error` | `src/ui/field-error/index.tsx:68` | нет | панели Input и RangeInput |
| `field-label` | `src/ui/field-label/index.tsx:50` | нет | `Label:` в `control-group` |
| `sidebar` | `src/ui/sidebar/index.tsx:124` | нет | живой каркас витрины, не виджет-карточка |
| `scroll-port` | `src/ui/scroll-port/index.tsx:72` | нет | живой каркас; `showVeil` / `veilInsetInline` контрола панели не имеют |
| `theme-toggle` | `src/components/theme-toggle/index.tsx:36` | нет | публичных пропов вида нет |
| `profile-menu` | `src/components/profile-menu/index.tsx` | нет | только `LayoutProps`; слот Header |
| `model-download-gate` | `src/components/model-download-gate/index.tsx` | нет | `children` — слот приложения |
| `router` | `src/components/router/index.tsx` | нет | не UI-виджет |

---

## Дыры полноты

Список «компонент, проп, почему это дыра», по убыванию числа дыр.

### Text — 5

- `color` — публичный проп вида (`text.styles.ts:233`); контрола нет; не a11y, не буфер, не демо вложенного, не вшитое поведение.
- `fontSize` — то же (`:235`).
- `fontWeight` — то же (`:236`).
- `lineHeight` — то же (`:238`).
- `whiteSpace` — то же (`:241`).

### Table — 5

- `numbered` — публичный проп (`table/index.tsx:372`); в превью всегда `false` (`table-demo/index.tsx:752`); контрола с ключом `numbered` нет.
- `addError` — публичный проп полоски ошибки добавления (`table/index.tsx:314`); контрола нет.
- `addHint` — то же (`:315`).
- `editError` — то же (`:317`).
- `editHint` — то же (`:318`).

### Modal — 4

- `showBorder` — в `CardForwardProps` / дефолт Modal (`modal/index.tsx:62`, `:102`); в стейте и панели нет; превью не передаёт (`showcase/index.tsx:1538–1547`).
- `showShadow` — пакет рамки Card, проброшен в Modal; контрола нет.
- `borderTone` — то же.
- `actionShape` — проп Card, проброшен в Modal (`modal/index.tsx:67–72`); контрола нет.

### RangeInput — 4

- `buttonInlineSize` — публичный проп кнопки Apply (`range-input/index.tsx:201`); контрола нет.
- `buttonPaddingInline` — то же (`:202`).
- `presets` — публичный проп ряда пресетов (`:271`); контрола нет.
- `formatActiveLabel` — публичный проп текста триггера (`:243`, `:263`); контрола нет; в превью константа.

### DateRangeInput — 1

- `onClear` (наличие) — опциональный проп, включает кнопку сброса (`date-range-input/index.tsx:168–169`); в превью всегда передан; контрола режима нет.

### Icon — 1

- `interactive` — публичный проп канала состояний (`icon.styles.ts:338`); контрола нет; в превью не передаётся (`showcase/index.tsx:1784–1800`).

---

## Порядок полей

Канонические слоты (`showcase.mdc`): 1 size · 2 shape · 3 tone · 4 value · 5 режимы · 6 background · 7 text-group · 8 прочие текстовые флаги · 9 содержимое композиции · 10 состояния. При `label`+size+shape — `control-group`: `Label:` → `Size:` → `Shape:`.

Особо: где стоят **группа иконки**, **инпут плейсхолдера**, **форма кнопки сброса**, **флаг недоступного**.

| Панель | Фактический порядок (лейблы) | Расхождение со слотами | Icon group | Placeholder | Clear shape | Disabled |
|--------|------------------------------|------------------------|------------|-------------|-------------|----------|
| Text | Sample → Size → Align → Tone → Show ellipsis → Show italic (`text-settings/index.tsx:60–85`) | вырожденный случай группы; слотов 1–3 нет | нет | нет | нет | нет |
| Tag | Size → Shape → Tone → border-group → Show dot → Dot tone → Show tinted → text-group (`tag-settings:87–170`) | слоты 1–3–5–7; 4/6/8/9/10 пусты | нет | нет | нет | нет |
| Checkbox | Size → Show inverted → text-group → Checked → mark → Disabled (`checkbox-settings:110–186`) | 1 → 5 → 7 → 10 | нет | нет | нет | слот 10, `:179` |
| RadioButton | Size → Selected → text-group → Disable A → Disable B (`radio-button-settings:90–155`) | 1 → 4 → 7 → 10 | нет | нет | нет | слот 10 как Disable A/B |
| Switch | Size → Tone → text-group → Checked → Disabled (`switch-settings:79–137`) | 1 → 3 → 7 → 10 | нет | нет | нет | слот 10, `:130` |
| Spinner | Size → Tone → text-group → Reserve text space (`spinner-settings:76–125`) | 1 → 3 → 7 → 8 | нет | нет | нет | нет |
| Toast | Size → Tone → text-group (`toast-settings:70–106`) | 1 → 3 → 7 | нет | нет | нет | нет |
| ProgressBar | Size → Tone → Value → text-group (`progress-bar-settings:97–139`) | 1 → 3 → 4 → 7 | нет | нет | нет | нет |
| Fieldset | Border tone → legend text-group (`fieldset-settings:68–93`) | нет size/shape; `borderTone` первым, не в `border-group` | нет | нет | нет | нет |
| Button | control-group → Tone → icon-group → text-group → Active → Disabled (`button-settings:97–172`) | 1–2 (через CG) → 3 → ? → 7 → 10 | после Tone, до text-group (`:119`) | нет | нет | слот 10, `:165` |
| Icon | Size → Shape → icon-group → Padding → border-group → Show hover → Disabled (`icon-settings:93–153`) | 1 → 2 → icon → layout → 5 → 10; слота tone виджета нет (тон внутри icon-group) | после Shape, до Padding (`:110`) | нет | нет | слот 10, `:146` |
| Card | border-group → Background → Title → Subtitle → Action shape → icon-row-group (`card-settings:100–158`) | нет size/shape карточки; 5 → 6 → 7 → 9 | нет (есть Action shape + ряд) | нет | нет | нет; Disable action N в блоке элемента |
| Modal | Size → Background → Title → Subtitle (`modal-settings:83–126`) | `Size:` — витринный ключ ширины, не проп; рамки нет; 6 → 7 | нет | нет | нет | нет |
| Toolbar | Size → Shape → border-group → Background → Action shape → icon-row-group (`toolbar-settings:84–136`) | 1 → 2 → 5 → 6 → 9 | нет | нет | нет | нет; Disable в блоке действия |
| Header | Auto-hide (`header-settings:38`) | один флаг режима | нет | нет | нет | нет |
| Input | control-group → border-group → Placeholder → text-group → field-error-group → Error text-group → Disabled (`input-settings:93–163`) | CG → 5 → ? → 7 → 8 → 10 | нет | после border-group, до text-group (`:111`) | нет | слот 10, `:156` |
| SearchField | control-group → Clear shape → border-group → icon-group → Placeholder → text-group → Disabled (`search-field-settings:106–181`) | CG → 5 (clear) → 5 (border) → icon → ? → 7 → 10 | после border-group, до Placeholder (`:135`) | после icon-group, до text-group (`:151`) | сразу после CG, до border-group (`:119`) | слот 10, `:174` |
| Listbox | control-group → icon-group → Multiple → Inline checkbox → Show clear → Placeholder → Disabled (`listbox-settings:84–146`) | CG → icon → 5 → ? → 10 | после CG, до режимов (`:93`) | после Show clear, до Disabled (`:131`) | нет пропа `clearShape`; есть `Show clear` (`:122`) | слот 10, `:139` |
| Combobox | control-group → icon-group → Show option icons → Show clear → Placeholder → Search placeholder → Empty message → Disabled (`combobox-settings:87–154`) | CG → icon → 5 → тексты панели → 10 | после CG (`:96`) | после Show clear (`:123`) | нет пропа `clearShape`; есть `Show clear` (`:114`) | слот 10, `:147` |
| RangeInput | control-group → icon-group → Show clear → Placeholder → title-group → Input size/shape → From/To placeholder → Button size/shape/tone/text/text tone → validation ×3 → field-error-group → Disabled (`range-input-settings:130–299`) | field-error-group (слот 8) стоит после композиции панели (слот 9) | после CG (`:147`) | после Show clear, до Title (`:165`) | нет пропа `clearShape`; есть `Show clear` (`:156`) | слот 10, `:292` |
| DateRangeInput | control-group → Start label → End label → Start day → End day → Min day → Max day → Day shape → Button shape → Disabled (`date-range-input-settings:85–167`) | подписи (текст) и value-поля до режимов формы дня/кнопки; слот 4 после текстовых инпутов | нет | нет | нет | слот 10, `:160` |
| Stepper | control-group → Min → Max → Step → Suffix → value text-group → Disabled (`stepper-settings:85–176`) | совпадает с эталоном Stepper в каноне | нет | нет | нет | слот 10, `:170` |
| SegmentButton | control-group → Segments → Left tone → Left icon → [Center tone/icon] → Right tone → Right icon → text-group → Active/Disable left → [center] → Active/Disable right (`segment-button-settings:143–333`) | тона сегментов до icon-group сегмента, до общей text-group; состояния внизу | три экземпляра в зоне композиции, после `Segments:` (`:171`, `:193`, `:215`) | нет | нет | слот 10 как Disable left/center/right |
| Table | Size → Show border → Striped → Index column → Continuous numbering → Checkable → Separate checkbox column → Hover highlight → Editable (`table-settings:79–160`) | все флаги подряд после size; отдельного слота 10 нет | нет | нет | нет | нет |

---

## Витринные ключи

| Панель | Ключи | JSDoc типа стейта |
|--------|-------|-------------------|
| Tag | `showText`, `text` | помечены `:31–32`, `:41–43` |
| Checkbox | `showText`, `text` | помечены `:35–36`, `:43` |
| RadioButton | `showText`, `textA`, `textB` | помечены `:30–31` |
| RadioButton | `selected`, `disabledA`, `disabledB` | **не помечены** как витринные (`:34–36`) |
| Switch | `showText`, `text` | помечены `:30–31`, `:36` |
| Spinner | `showText`, `text` | помечены `:29–30`, `:34` |
| Toast | `message` | помечен как поле DTO, не как витринный UI-ключ (`:26–28`) |
| Fieldset | `selected` | помечен `:24–25`, `:34` |
| Button | `withIcon`, `iconKey`, `text` | помечены `:33–35`, `:41`, `:48`, `:53` |
| Icon | `iconKey` | помечен `:42–43`, `:49` |
| Card | `showTitle`, `showSubtitle` | помечены `:38–39`, `:50–51` |
| Modal | `showTitle`, `showSubtitle`, `sizePreset` | помечены `:27–29`, `:33–35` |
| SearchField | `iconKey` | помечен `:39–40`, `:47` |
| Combobox | `withIcon` | помечен `:30–31`, `:46` |
| RangeInput | `withClear` | помечен `:45–46`, `:76` |
| SegmentButton | `segmentCount`, `*WithIcon`, `*IconKey` | помечены `:37–38`, `:44–69` |
| Table | `showIndexColumn`, `continuousNumbering`, `separateCheckboxColumn` | помечены `:25–28`, `:32–40` |
| Listbox / Combobox / RangeInput | `value` | помечены как буфер превью, не как витринный UI-ключ |
| Header | — | типа `*WidgetState` нет |
| Text, ProgressBar, Input, Stepper, DateRangeInput, Toolbar | витринных UI-ключей нет | — |

---

## Спорные места

1. **Слот группы иконки.** `showcase.mdc` описывает сателлит `icon-group`, но не даёт ему номера среди слотов 1–10. Фактически: Button — между tone и text-group; Icon — между shape и padding/border; SearchField — между border-group и Placeholder; Listbox / Combobox / RangeInput — сразу после `control-group`; SegmentButton — в зоне композиции, по сегменту.
2. **Слот инпута плейсхолдера.** Канон говорит, что у Input плейсхолдер снаружи text-group и делит типографику с текстом поля; номера слота нет. Фактически: Input — после border-group; SearchField — после icon-group; Listbox / Combobox / RangeInput — после `Show clear`.
3. **Форма сброса без `Show clear`.** Эталон канона — пара `Show clear` → `Clear shape:`. У SearchField `onClear` обязателен, флага показа нет, `Clear shape:` стоит первым среди режимов, до `border-group`. У Listbox / Combobox / RangeInput есть `Show clear` и нет пропа `clearShape`.
4. **Layout-пакет.** Почти у всех примитивов `LayoutProps` публичны и без контролов. Канон исключения для layout не формулирует. Исключение в коде: `padding` у Icon вынесен в `Padding:` (`icon-settings/index.tsx:121`).
5. **Проп `as`.** Есть у Text, Icon, Card, Modal (форвард). Слота и исключения нет.
6. **Переопределения типографики Text** (`color`, `fontSize`, `fontWeight`, `lineHeight`, `whiteSpace`) vs семантические оси (`sizePreset`, `tone`, `align`, `italic`, `ellipsis`). Канон панели Text перечисляет только семантический набор. В таблице полноты они как дыры, потому что исключение не сформулировано.
7. **`formatActiveLabel` у RangeInput** — функция, но меняет видимый текст триггера. Граница «вид / поведение» в каноне не проведена.
8. **`numbered` vs `showIndexColumn` у Table.** Визуал нумерации в демо есть, но через другую колонку и витринный ключ; публичный проп `numbered` не крутится.
9. **`onClear` как режим.** У RangeInput наличие колбэка вынесено в `withClear`. У DateRangeInput тот же механизм без контрола. Канон говорит про `Show clear` у сброса выбора, не про DateRangeInput.
10. **`borderTone` у Fieldset** — не пакет `BorderProps` (нет `showBorder`/`showShadow`). Стоит первым, не в `border-group`. Слот: тон рамки vs режимы — не зафиксирован.
11. **`tinted` / `inverted` с лейблом `Show …`.** Контролы есть; канон глагола `Show` закреплён за `show*`. Это лейбл, не дыра полноты.
12. **Header** настраивает живой каркас, не карточку превью. Слоты 1–10 к одной панели из `Auto-hide` не приложимы.
13. **Sidebar / ScrollPort** применяются самостоятельно в каркасе витрины и секции не имеют. Признак «самостоятельно» vs «каркас страницы» канон не разводит.

---

## Сводка числом

Счёт: именованные пропы вида и текста из таблиц выше (пакеты рамки и тройки текста, value / disabled / режимы, поля сегментов и кнопки Apply). Вне счёта: сводные строки `LayoutProps`, нативные/ARIA, проп `as`, колбэки кроме наличия `onClear` как режима, витринные ключи.

| | Число |
|--|------:|
| Пропов вида/текста в охвате панелей | 306 |
| С контролом в панели | 270 |
| Под исключениями канона (буфер, демо, вшито) | 16 |
| Дыр полноты | 20 |

Сложение: 270 + 16 + 20 = 306.

Разбивка дыр: Text 5 · Table 5 · Modal 4 · RangeInput 4 · DateRangeInput 1 · Icon 1.

Разбивка исключений (16): Fieldset `children` · Card `children`, `hasHeader` · Modal `open`, `headerActions`, `children` · Header `brand`, `center`, `leadingActions` · Listbox `value`, `defaultValue`, `options` · Combobox `value`, `defaultValue`, `options` · RangeInput `value`.

Витринных ключей с контролом: 28. Без пометки «витринный ключ» в JSDoc: `selected`, `disabledA`, `disabledB` у RadioButton.

**Подпись:** аудитор Cursor Grok 4.6

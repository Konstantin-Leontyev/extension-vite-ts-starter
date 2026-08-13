# Ревью: поля ввода и переключатели

**Проект:** `extension-vite-ts-starter`
**Область:** `src/ui/input`, `src/ui/search-field`, `src/ui/stepper`, `src/ui/checkbox`, `src/ui/radio-button`, `src/ui/switch`, `src/ui/fieldset`, `src/ui/field-label`, `src/ui/field-error`
**Дата:** 2026-08-12

Общие оси (`presets`, `border`, `outline`, `layout`, `text`, `reset`) — эталон, замечания по ним не включены.

---

## Сверка трёх нативных полей (Input / SearchField / Stepper)

| Слой | Input | SearchField | Stepper |
|------|-------|-------------|---------|
| Носитель бокса | сам `<input>` | ряд `StyledSearchFieldRow` | оболочка `StyledStepperRoot` |
| `min-block-size` / радиус / `getBorderStyles` / `surface` | на контроле | на ряде | на оболочке |
| `padding-inline` | на контроле | на контроле | на ячейке значения |
| Фокус-контур | reset на `input:focus-visible` (при `showBorder`); при `!showBorder` — `outline: none` | `outline: none` на поле; `:focus-within` + `getOutlineStyles` на ряде при `showBorder` | `outline: none` на поле и кнопках; `:focus-within` на оболочке всегда |
| `BorderProps` | да | да (на ряде) | нет — по §7.2 |
| Текст значения | `getTextProperties(getTextSize)` | то же | `getTextProperties(textSize)` + `getTextToneColor` |
| `textAlign` | `CSSProperties['textAlign']` на поле | то же | `TextAlignPreset` → `justify-content` ячейки |

Обоснованные расхождения: композит vs одиночный input (бокс и фокус на оболочке); Stepper без `BorderProps`; `padding-inline` на ячейке из‑за `field-sizing: content` + суффикса; `textTone` только у Stepper (§7.6).

Необоснованные — в находках 1–2 и разделе «Дубли».

---

## Находки

1. **`src/ui/search-field/index.tsx:203–220`** · UI / icons
   **Что не так:** кнопка сброса собрана локально мимо контракта clear: `showBorder={false}`, `shape="round"`, `padding={SEARCH_FIELD_CLEAR_PADDING}` (`12`). У Listbox/Combobox clear — `showBorder` + `showShadow={false}`, форма и отступ окна из пресета Icon, без локального `padding`.
   **Как должно быть:** тот же контракт кнопки сброса, что у Listbox/Combobox (`icons.mdc`: рамка точечно у clear; окно из `sizePreset`). Отклонения — только после решения пользователя.
   **Якорь:** `icons.mdc` (кнопка сброса / рамка), §8.4.

2. **`src/ui/input/input.styles.ts:53`**, **`src/ui/search-field/search-field.styles.ts:58`** · UI
   **Что не так:** `textAlign?: CSSProperties['textAlign']` — широкий CSS-union. Stepper и витрина SearchField уже на `TextAlignPreset` (`start` | `center` | `end`).
   **Как должно быть:** публичный `textAlign` нативных полей — `TextAlignPreset` из `@ui/text`, как у Stepper/Text.
   **Якорь:** §7.6, §8.1.

3. **`src/ui/checkbox/checkbox.styles.ts:271`** · UI
   **Что не так:** `flex-shrink: 0` на боксе. Корень — `inline-grid`; у grid-item `flex-shrink` не действует. Явные `inline-size`/`block-size` и так фиксируют габарит.
   **Как должно быть:** декларацию убрать.
   **Якорь:** §10 (мёртвая декларация).

4. **`src/ui/radio-button/radio-button.styles.ts:123`** · UI
   **Что не так:** то же `flex-shrink: 0` при корне `inline-grid`.
   **Как должно быть:** убрать.
   **Якорь:** §10.

5. **`src/ui/search-field/search-field.styles.ts:65`** · UI
   **Что не так:** `SEARCH_FIELD_ROOT_PROP_NAMES = LAYOUT_PROP_NAMES` — промежуточный алиас без собственной нагрузки. Input подключает `LAYOUT_PROP_NAMES` напрямую.
   **Как должно быть:** `shouldForwardProp` через `LAYOUT_PROP_NAMES`, без зеркальной константы.
   **Якорь:** §12 п. 13.

6. **`src/ui/switch/index.tsx:69–94`** · UI / a11y
   **Что не так:** нет обязательного доступного имени. Без `children` и без `aria-label`/`aria-labelledby` остаётся немой `role="switch"`. Stepper это фиксирует типом `StepperAccessibleName`.
   **Как должно быть:** обязательное имя (дети и/или aria), по образцу Stepper, либо явное решение «имя только на вызывающем».
   **Якорь:** §11, §8.6.

7. **`src/ui/switch/switch.styles.ts:203`** · UI
   **Что не так:** дорожка рисует layout-`border: 1px solid` вместо `getBorderStyles` (box-shadow вне layout-box). Исключение §7.2 названо для Fieldset; Switch держит layout-border ради `TRACK_BORDER` в формуле `knobInset`.
   **Как должно быть:** либо канон признаёт Switch исключением с обоснованием, либо рамка через `getBorderStyles`, а inset бегунка — без вычитания layout-border.
   **Якорь:** §7.2, §7.3; см. «Требует решения пользователя».

8. **`src/ui/search-field/index.tsx:127–136`** · UI / дубль
   **Что не так:** локальный `assignRef` байт-в-байт с `src/ui/scroll-port/index.tsx:67–76`.
   **Как должно быть:** один хелпер (например `@ui/a11y` или тонкий `@ui/refs`), оба потребителя импортируют его.
   **Якорь:** дубли (инлайн-чеклист), §2.4.

---

## Дубли и вынос

1. **Корень поля «подпись + контрол»** — одинаковый блок в `StyledInputRoot` (`input.styles.ts:73–77`), `StyledSearchFieldRoot` (`search-field.styles.ts:83–87`), `StyledStepperFieldRoot` (`stepper.styles.ts:96–100`): `display: grid`, `gap: 8`, `inline-size: 100%`, `min-inline-size: 0`, `getLayoutStyles`.
   **Куда:** хелпер/сателлит вроде `getFieldStackStyles()` в `@ui/field-label` или новый ресурс `@ui/field-shell` (решение пользователя).

2. **Ряд «контрол + подпись»** — идентичны `StyledCheckboxRoot`, `StyledRadioButtonRoot`, `StyledSwitchRoot`: `inline-grid` + `grid-auto-flow: column` + `gap: 8` + `align-items: center` + `justify-content: start` + `cursor: pointer` + layout.
   **Куда:** общий хелпер `getChoiceControlRootStyles()` / styled-база в одном из трёх модулей с импортом соседей через barrel — или ресурс рядом с choice-контролами.

3. **Текстовый слой нативного `<input>`** — повторяются в `getInputControlStyles` и `getSearchFieldControlStyles`: `padding-inline` + `getTextProperties(getTextSize)` + `::placeholder { muted }` + условные `text-align` / `font-style: italic`.
   **Куда:** хелпер в `@ui/text` или `@ui/presets` (продолжение §7.2/§7.8: «вынос по правилу от двух потребителей»), напр. `getNativeInputValueStyles({ sizePreset, textAlign, textItalic, theme })`. Stepper подключать частично (italic/tone/properties без placeholder и padding).

4. **Оболочка однострочного композита** — пересечение `getSearchFieldRowStyles` / `getStepperRootStyles` / `getOpenControlTriggerRowStyles`: `min-block-size`, `border-radius`, `surface`, `getBorderStyles`, `overflow: hidden`, фокус через `:focus-within`. SearchField добавляет `BorderProps` и сетку иконки/clear.
   **Куда:** не смешивать слепо с `open-control` (там `data-open` и другая сетка clear); кандидат — общий «chromed field shell» после решения о границах opt-in рамки.

5. **Кнопка сброса SearchField** — см. находку 1: сущность clear уже есть у Listbox/Combobox; локальная сборка с другими пропами — не новый примитив, а расхождение контракта.

6. **`assignRef`** — см. находку 8.

Не дубли (намеренные мосты канона): `getCheckboxTextSize` / `getRadioButtonTextSize` / `getSwitchTextSize` / `getStepperTextSize` (§7.6); `DEFAULT_*_TEXT_TONE = muted` у choice-контролов; продуктовый `DEFAULT_SEARCH_FIELD_ICON_POSITION = 'start'` против `DEFAULT_ICON_POSITION = 'end'`.

---

## Кандидаты в канон

1. **Раздел «Дубли и лишние сущности»** в `canon-ui-checklist.md` этого репозитория (как в продуктовом чеклисте): повтор декларации хелпера, перекрывающий селектор, проигрыш reset по специфичности, копипаст блоков, локальная сборка вместо общего слота, обёртка без функции, ось-двойник.
2. **Контракт clear внутри строки поиска** (`icons.mdc` / §7.2): отличия от clear триггера open-control (рамка, `shape`, `padding`, `showHover`) — либо запретить, либо описать отдельный подвид «inline search clear».
3. **Общий корень field-stack и choice-row** — если вынос хелперов принят, зафиксировать эталон и потребителей в §7.6 / §2.2.
4. **`textAlign` нативных полей** — явно: только `TextAlignPreset`, не `CSSProperties['textAlign']` (§7.6/§8.1).
5. **Switch и layout-border** — исключение рядом с Fieldset в §7.2 либо запрет с миграцией на `getBorderStyles`.
6. **Обязательное доступное имя** у `role="switch"` / choice без `children` — расширение §8.6/§11 по образцу Stepper.

---

## Требует решения пользователя

1. **Clear в SearchField:** выровнять с Listbox/Combobox или официально закрепить отдельный вид (круг, `padding: 12`, без рамки, без hover-канала)? Сейчас код расходится с `icons.mdc`, комментарий про «перенос из Combobox» не совпадает с текущим clear триггера Combobox.
2. **Switch / layout-border:** оставить исключение ради формулы бегунка или уводить в `getBorderStyles`?
3. **Вынос field-stack / choice-row / native-input value styles:** делать хелперы сейчас или только зафиксировать долг в каноне?
4. **Chromeless focus (`showBorder={false}`):** Input и SearchField гасят контур и не дают замены — осознанная политика embedded или пробел a11y?
5. **Switch без обязательного accessible name:** ужесточать тип API или оставить на вызывающем?

---

## ЗАМЕЧАНИЯ (сводка для цикла правок)

1. [UI] `search-field/index.tsx:203` — clear мимо контракта icons (рамка / shape / padding).
2. [UI] `input.styles.ts:53`, `search-field.styles.ts:58` — `textAlign` не `TextAlignPreset`.
3. [UI] `checkbox.styles.ts:271`, `radio-button.styles.ts:123` — мёртвый `flex-shrink: 0`.
4. [UI] `search-field.styles.ts:65` — лишний алиас `SEARCH_FIELD_ROOT_PROP_NAMES`.
5. [UI] `switch/index.tsx:69` — нет обязательного accessible name.
6. [UI] `switch.styles.ts:203` — layout-border vs `getBorderStyles` (нужно решение).
7. [UI] `search-field/index.tsx:127` — дубль `assignRef` со scroll-port.

**ОК:** FieldLabel / FieldError соответствуют §7.6; Fieldset — эталон расширения тона §7.5; Stepper flex в value-ячейке обоснован; канал `--icon-state-background` у SearchField через `resolveIconStateBackground`; disabled через reset/`data-disabled`.

**Итог:** Требуется исправление находок 1–5 и 8; 6–7 — после решения пользователя. Выносы из «Дубли» — по приоритету после решений.

**Подпись:** Ревьюер Cursor Grok 4.5 (project-reviewer)

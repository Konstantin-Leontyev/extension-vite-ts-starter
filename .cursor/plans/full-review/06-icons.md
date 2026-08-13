# Полное ревью · область 06 — иконки, типографика и кнопки

**Проект:** `extension-vite-ts-starter`
**Область:** `src/ui/icon`, `src/icons` (компоненты + svg), `src/ui/text`, `src/ui/tag`, `src/ui/button`, `src/ui/segment-button`, `src/ui/segment-button-parts`, `src/ui/progress-bar`, `src/ui/spinner`
**Режим:** только анализ; код не правился; линтеры не гонялись.

---

## Находки

1. [UI · лестница владения] `src/ui/button/button.styles.ts:209–211` (+ JSX `src/ui/button/index.tsx:145`)
   **Что не так:** при `hasIcon` отступ лейбла задаётся селектором `[data-slot='label'] { padding-inline: … }` на дочерний `Text`. Это адресация вида ребёнка по `data-slot` из корня.
   **Как должно быть:** слот лейбла — свой styled-узел в `button.styles.ts` с `padding-inline` через `getPaddingInline` (§7.9: отступ строки значения на своём styled-узле, не layout-проп на Text); `Text` внутри — только типографика. Селектор `[data-slot='label']` для вида снять.
   **Канон:** §8.4 п. 1–2 / §7.9; `icons.mdc` (шов/окно — на Icon, не оправдание селектора лейбла).

2. [UI · согласование размера] `src/ui/tag/tag.styles.ts:320–333` (+ сборка `src/ui/tag/index.tsx:93`)
   **Что не так:** `StyledTagDot` габарит `0.5em` / `0.5em` от наследуемого `font-size`, а корень `StyledTag` `font-size` не задаёт. Точка — сиблинг `Text`, не потомок: масштаб точки следует ambient-типографике снаружи Tag, а не `sizePreset` / `textSize` метки. Комментарий узла это фиксирует как факт, не как инвариант размера.
   **Как должно быть:** размер точки связать с рядом метки (таблица/`getSpacingValue` по `sizePreset`, либо `font-size` на корне Tag из того же моста, что и текст), чтобы смена `sizePreset`/`textSize` меняла точку согласованно.
   **Канон:** §8.5 / §5.2 (источник размера один).

3. [UI · тип оси] `src/ui/text/text.styles.ts:232` (`align?: CSSProperties['textAlign']`)
   **Что не так:** публичный проп `align` шире канонического ряда `TextAlignPreset` (`start` / `center` / `end`) и перечня `TEXT_ALIGN_PRESET_KEYS`. Допускает `left`/`right`/`justify` и пр., которых нет в витрине и в контракте оси.
   **Как должно быть:** `align?: TextAlignPreset` (как у перечня для витрины); прямые CSS-переопределения — отдельные escape-пропы, если нужны.
   **Канон:** §8.1; чеклист — ось с юнионом не расширять голым/широким CSS-типом.

4. [UI · пакет иконок · svg-паритет] `src/icons/check.tsx`, `src/icons/plus.tsx`, `src/icons/contrast.tsx`
   **Что не так:** нет парных статичных `.svg`. У соседних моно (`close`, шевроны) и у dual-tone (`contrast` обязан иметь пару с литералом `0.4`) исходники есть. Пакет неоднороден: правки глифа/константы muted нечем зеркалить для этих трёх.
   **Как должно быть:** добавить `check.svg`, `plus.svg`, `contrast.svg` байт-в-байт с TSX (для contrast — `opacity="0.4"` = `ICON_MUTED_LAYER_OPACITY`).
   **Канон:** `icons.mdc` «Двухцветность» / «Общие требования»; единообразие пакета.

5. [UI · пакет иконок · порядок слоёв] `src/icons/chevron-double-left.tsx:30–45`, `src/icons/chevron-double-right.tsx:30–45` (и зеркала `.svg`)
   **Что не так:** приглушённый `<g opacity={ICON_MUTED_LAYER_OPACITY}>` идёт вторым, основной — первым. Во всём остальном наборе (включая новые `caption` / `clock` / `dual` / `earth`) muted → main. В зоне перекрытия штрихов верхний слой — muted, не основной.
   **Как должно быть:** как у остальных dual-tone: сначала muted, затем main; синхронно поправить `.svg`.
   **Канон:** `icons.mdc` «Двухцветность»; единообразие пакета.

6. [UI · дубль дефолта ребёнка] `src/ui/segment-button-parts/index.tsx:222`
   **Что не так:** `minInlineSize="0"` на `Text`, хотя `StyledText` уже несёт `min-inline-size: 0` в шаблоне (`text.styles.ts:353`). Проп ничего не меняет.
   **Как должно быть:** убрать проп; полагаться на базу Text (как Button).
   **Канон:** §8.2 (дубль дефолта вниз по дереву) / §10; дубли — декларация повторяет действующее значение ребёнка.

7. [UI · мёртвый атрибут] `src/ui/segment-button-parts/index.tsx:219`
   **Что не так:** `data-slot="label"` на Text сегмента ни один селектор в `segment-button-parts.styles.ts` не читает (в отличие от Button, где слот реально стилизуется). Мёртвая разметка.
   **Как должно быть:** снять атрибут, пока слот не участвует в CSS/хелпере; либо завести реальную роль слота и правила.
   **Канон:** §10 (недостижимое / без эффекта); дубли — сущность без функции.

8. [UI · дубль корня с подписью] `src/ui/button/button.styles.ts:141–149` ≡ `src/ui/segment-button/segment-button.styles.ts:71–79`
   **Что не так:** байт-в-байт один и тот же корень: `display: grid`, `gap: 8`, `inline-size: 100%`, `min-inline-size: 0`, `getLayoutStyles`. Тот же каркас уже у Input / SearchField (вне области, но подтверждает паттерн).
   **Как должно быть:** общий styled/хелпер «корень контрола с FieldLabel» в ресурсе или `@ui/field-label` / соседнем модуле; Button и SegmentButton подключают его.
   **Канон:** дубли — тот же блок в ≥2 местах; §2.1 (нейтральная общность в `ui/`).

9. [UI · дубль моста текста] `button.styles.ts:56–58`, `segment-button.styles.ts:43–45`, `progress-bar.styles.ts:54–56`, `spinner.styles.ts:76–78`
   **Что не так:** четыре идентичных однострочника `getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET)` под разными именами `get*TextSize`.
   **Как должно быть:** либо вызывать `getTextSize` напрямую в `index.tsx` с `?? DEFAULT_SIZE_PRESET`, либо один общий мост с опциональным аргументом в `@ui/presets` / `@ui/text`; локальный мост оставлять только при иной таблице (эталон — `getTagTextSize`).
   **Канон:** дубли; §7.2 / §4.4 (чтение через геттер канона, без копий-обёрток без своей таблицы).

10. [UI · слияние state-блоков] `src/ui/segment-button-parts/segment-button-parts.styles.ts:205–231`
    **Что не так:** при цветном `tone` + `hasIcon` два соседних rule-block на один и тот же селектор `&:not(:disabled):hover, &:focus-visible` — один пишет `background-color`, второй `--icon-state-background`. Механика живая, но дубль селектора в одном генераторе.
    **Как должно быть:** один блок селектора с обеими декларациями.
    **Канон:** дубли — тот же блок/селектор в ≥2 местах одного генератора; §12 п. 9.

11. [UI · shorthand фона] `src/ui/button/button.styles.ts:276–282`
    **Что не так:** покой — `background-color`, hover/active — shorthand `background`. Для нейтрали shorthand обязателен (`resolveVeilBackground`), для цветного и `active` — достаточно `background-color`; смешение шортката и longhand увеличивает риск сброса слоёв при смене веток.
    **Как должно быть:** `background` только там, где нужен градиент-вуаль; цветной hover/active — `background-color` (или единый контракт через хелпер поверхности).
    **Канон:** §10 / §14 (заливка состояний); модель 1 ховера.

12. [КОММЕНТАРИИ] `src/ui/icon/icon.styles.ts:17–23`
    **Что не так:** в «Потребители» styles-файла указаны Button / Listbox / Combobox / RangeInput и Card; фактически `getIconPositionStyles` / `resolveIconStateBackground` тянут также SearchField и SegmentButtonParts (через `@ui/icon` из styles).
    **Как должно быть:** дополнить список реальных потребителей хелперов секции.
    **Канон:** `comments.mdc` §1.7 (противоречие комментария коду).

---

## Пакет иконок (сводка единообразия)

| Проверка | Результат |
|----------|-----------|
| Структура TSX (viewBox 24, fill none, aria-hidden, без width/height) | OK у всех в области |
| Muted через `ICON_MUTED_LAYER_OPACITY` | OK; локальных литералов opacity в TSX нет |
| Новые `caption` / `clock` / `dual` / `earth` vs остальные dual-tone | Структура и порядок слоёв совпадают с copy/download/search; svg зеркалят `0.4` |
| svg ↔ tsx | Расхождение порядка слоёв только у double-chevron (находка 5); нет svg у check/plus/contrast (находка 4) |
| Потребитель без `@icons` | Не найдено |
| Иконка без потребителя | Не найдено: kit-новые и `Upload` живут в `showcase-icon-options`; остальные — в продуктовых/`ui` потребителях |
| `styled(StyledIcon)` / локальный seam | В области нет |

---

## Дубли и вынос

| Что | Где сейчас | Куда выносить |
|-----|------------|---------------|
| Корень FieldLabel + контрол (`grid` / `gap: 8` / ширина) | `StyledButtonRoot`, `StyledSegmentButtonRoot` (+ Input/SearchField вне области) | общий корень контрола с подписью |
| `get*TextSize` → `getTextSize(… ?? DEFAULT_SIZE_PRESET)` | button, segment-button, progress-bar, spinner (+ много соседей вне области) | прямой `getTextSize` или один мост в presets/text; исключение — Tag |
| Два hover/focus-блока сегмента | `getSegmentButtonPartsPartStyles` | один селектор |
| `minInlineSize={0}` на Text | segment-button-parts | удалить (база Text) |
| `[data-slot='label']` padding | Button (и Listbox вне области — тот же запах) | styled-слот лейбла / единый паттерн value-row |

Не дефект: `getIconPositionStyles` пишет `block-size: 100%` на слот поверх квадрата Icon — контракт `icons.mdc`, не дубль внутри одного генератора. Segment без `showBorder` на Icon — кластерная модель (не краевая секция), шов не требуется.

---

## Кандидаты в канон

1. **Раздел «Дубли и лишние сущности»** в `.cursor/skills/shared/canon-ui-checklist.md` этого репозитория — перенести инлайн-критерии задания (повтор вывода хелпера, перекрытие селектором, мёртвая декларация vs reset, копипаст блока, локальная сборка вместо примитива/слота, обёртка без функции, ось-двойник).
2. **Единый корень «подпись + контрол»** — зафиксировать в §2.2 / §7.2 как ресурс или обязательный паттерн (сейчас копируется Button / SegmentButton / Input / SearchField).
3. **Слот лейбла при split-секции Icon** — явно связать §7.9 и §8.4: при краевой секции Icon отступ строки значения живёт на styled-слоте лейбла, не на `[data-slot]` по Text; `data-slot='label'` не использовать как хук вида.
4. **Порядок dual-tone слоёв** — в `icons.mdc` явно: muted-группа всегда раньше main в DOM (сейчас следует из примеров, double-chevron нарушил).
5. **Парный `.svg` для каждой иконки набора** — обязателен и для mono (сейчас формулировка сильнее про dual-tone).
6. **Точка Tag** — в контракте Tag/эталоне: точка масштабируется от `sizePreset` (или от того же кегля, что текст метки), не от ambient `em` снаружи.

---

## Требует решения пользователя

1. **Вынос корня с FieldLabel** — общий модуль сейчас или оставить копипаст до отдельного рефактора всех FieldLabel-контролов (Button / SegmentButton / Input / SearchField / …)?
2. **Мосты `get*TextSize`** — схлопнуть в один API / прямые вызовы `getTextSize`, или сохранить per-component имена ради стабильного публичного реэкспорта витрины/`date-range-input`?
3. **Слот лейбла Button** — вводить `StyledButtonLabel` (или аналог) в рамках фикса §8.4, или сначала расширить канон исключением для `[data-slot='label']` (сейчас исключения нет; Listbox делает то же — каскад)?
4. **Kit-иконки только в витрине** (`caption`, `clock`, `dual`, `earth`, `upload`) — норма для стартера или ждать продуктового потребителя / не держать в наборе?

---

## Итог

Требуется исправление находок 1–12 (критичны для канона: 1, 2, 4, 5, 6; дубли/вынос: 8–10; тип/shorthand/комментарий: 3, 11, 12). Пакет новых иконок в целом совпадает с каноном dual-tone; провалы — отсутствие svg у check/plus/contrast и инверсия слоёв double-chevron.

**Подпись:** Ревьюер Cursor Grok 4.5

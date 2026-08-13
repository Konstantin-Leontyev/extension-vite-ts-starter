# Полное ревью · область 01 — оси и общие модули `src/ui/*.ts`

**Проект:** `extension-vite-ts-starter`
**Область:** `a11y.ts`, `border.ts`, `layout.ts`, `motion.ts`, `open-control.ts`, `outline.ts`, `positioning.ts`, `presets.ts`, `reset.ts`, `sizing.ts`, `spacing.ts`, `stacking.ts`, `surface.ts`, `theme.ts`, `tones.ts`, `viewport.ts`
**Режим:** только анализ; код не правился; линтеры не гонялись.

---

## Находки

1. [UI · дубль] `src/ui/presets.ts:172` / потребители `listbox.styles.ts:67`, `combobox.styles.ts:67`, `range-input.styles.ts:67`
   **Что не так:** три идентичных адаптера `resolve*BlockRadius(shape, sizePreset) → resolveBlockRadius(shape, getMinBlockSize(sizePreset))` и колбэк-слот `getOpenControlTriggerRowStyles(..., resolveBorderRadius)` с другой сигнатурой, чем у `resolveBlockRadius` (`SizePreset` vs CSS-строка). Общий мост в ресурсах отсутствует — каждый open-control копирует однострочник.
   **Как должно быть:** вынести `resolveControlBlockRadius(shape, sizePreset)` в `@ui/presets` (или дефолтный колбэк в `@ui/open-control`) и передавать его в `getOpenControlTriggerRowStyles`; локальные обёртки с иной геометрией (Toolbar, Icon, DateRange с локальными дефолтами) остаются.
   **Канон:** §7.2 / §7.7 / §13.4; дубли (инлайн-чеклист).

2. [UI · мёртвый экспорт] `src/ui/open-control.ts:45` (`OpenControlSurfaceStyleProps`)
   **Что не так:** тип экспортирован, но ни один файл репозитория его не импортирует. Listbox / Combobox / RangeInput / DateRangeInput заводят локальные `*SurfaceStyleProps` с теми же `shape` / `sizePreset` (+ свои поля) вместо пересечения с общим типом.
   **Как должно быть:** потребители расширяют `OpenControlSurfaceStyleProps` (`& { iconTone?: … }`); либо тип сделать внутренним, если наружу не нужен.
   **Канон:** §2.4; дубли — публичная ось/тип-двойник.

3. [UI · дубль хрома] `src/ui/open-control.ts:85–117` vs `src/ui/search-field/search-field.styles.ts:146–181` (и частично `input.styles.ts:128–167`)
   **Что не так:** ряд SearchField (и бокс Input) локально повторяет хром ряда open-control: `min-block-size`, `overflow: hidden`, `border-radius` через `resolveBlockRadius`, заливка `surface` / `transparent`, `getBorderStyles`, `:focus-within` + `getOutlineStyles`. Open-control закрывает только portal-триггеры; полевой хром остаётся копией.
   **Как должно быть:** общий генератор «поверхность контрола» в ресурсе (`@ui/open-control` или соседний модуль) с параметрами opt-in рамки / фона / clear-колонок; SearchField и при необходимости Input подключают его, open-control — частный случай с `data-open` и clear-ветками.
   **Канон:** §7.2 / §13.4; дубли — тот же блок в ≥2 местах.

4. [UI · обход хелпера] `src/ui/open-control.ts:108`
   **Что не так:** `background-color: ${theme.colors.surface}` при наличии `@ui/surface` (`getSurfaceBackgroundColor` + `DEFAULT_SURFACE_BACKGROUND = 'surface'`). Тот же литерал-ключ размазан по панелям/триггерам; ось заливки для Card/Toolbar уже централизована.
   **Как должно быть:** `getSurfaceBackgroundColor(theme, DEFAULT_SURFACE_BACKGROUND)` (или явный `'surface'`), чтобы смена дефолта/таблицы заливки не разъезжалась с open-control.
   **Канон:** §4.4 / §7.2 п. 7 (заливка ≠ рамка); дубли — сущность рядом с готовым хелпером.

5. [UI · дубль строки] `src/ui/a11y.ts:20` и `src/ui/a11y.ts:44`
   **Что не так:** `DEFAULT_CLEAR_ARIA_LABEL = 'Clear'`, но при непустой подписи префикс зашит литералом `` `Clear ${…}` ``, а не константой. Два источника одного слова; правка дефолта не меняет помеченную ветку.
   **Как должно быть:** `` `${DEFAULT_CLEAR_ARIA_LABEL} ${trimmed.replace(/:$/, '')}` ``.
   **Канон:** §8.2 / §12 п. 14 (магия/два источника); дубли — декларация повторяет соседнюю константу.

6. [КОММЕНТАРИИ] `src/ui/a11y.ts:9–13`
   **Что не так:** в «Потребители» нет `@ui/search-field`, хотя `search-field/index.tsx` вызывает `resolveClearAriaLabel`.
   **Как должно быть:** добавить SearchField в список потребителей.
   **Канон:** противоречие комментария коду (`comments.mdc` §1.7).

7. [КОММЕНТАРИИ] `src/ui/motion.ts:10–12`
   **Что не так:** потребители описаны как «например Sidebar»; фактически `MOTION_*` / `getTransitionStyles` тянут также Switch, ProgressBar, Listbox, Combobox, RangeInput, Header.
   **Как должно быть:** перечислить сценарные группы (shell / control) с реальными носителями.
   **Канон:** `comments.mdc` §1.7.

8. [КОММЕНТАРИИ] `src/ui/border.ts:13–19`
   **Что не так:** opt-in пакет `BorderProps` фактически есть у SearchField и Toolbar; шапка модуля называет только Card, Icon, Input, Tag. Канон §7.2.2 тоже неполный (см. кандидаты).
   **Как должно быть:** синхронизировать список примеров с реальными opt-in потребителями.
   **Канон:** `comments.mdc` §1.7; §7.2.2.

9. [UI · ось-двойник у потребителя] `src/ui/date-range-input/date-range-input.styles.ts:65–74`
   **Что не так:** `DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET = DEFAULT_SIZE_PRESET` и `DEFAULT_DATE_RANGE_INPUT_SHAPE = DEFAULT_SHAPE_PRESET` — публичный/модульный дефолт-двойник поверх дефолта хелпера без иной продуктовой нормы.
   **Как должно быть:** в деструктуризации/резолве сразу `DEFAULT_SIZE_PRESET` / `DEFAULT_SHAPE_PRESET`; локальная константа — только при отличии от канона (как `DEFAULT_TAG_SIZE_PRESET = 'tiny'`, `DEFAULT_ICON_SHOW_BORDER = false`).
   **Канон:** §8.2; дубли — свой дефолт поверх дефолта хелпера.

10. [UI · обход surface у потребителей] `input.styles.ts:150`, `search-field.styles.ts:170`
    **Что не так:** тернарник `showBorder ? theme.colors.surface : 'transparent'` дублирует семантику `SurfaceBackground` (`'surface' | 'transparent'`), уже закрытую `getSurfaceBackgroundColor`.
    **Как должно быть:** `getSurfaceBackgroundColor(theme, showBorder ? 'surface' : 'transparent')` либо общий хром из п. 3.
    **Канон:** §4.4; дубли.

---

## Дубли и вынос

| Что | Где сейчас | Куда выносить |
|-----|------------|---------------|
| `resolveBlockRadius(shape, getMinBlockSize(sizePreset))` | listbox / combobox / range-input (+ близкий date-range) | `@ui/presets` → `resolveControlBlockRadius`; дефолт колбэка в `@ui/open-control` |
| Тип `shape` + `sizePreset` поверхности | локальные `*SurfaceStyleProps` ×4 | пересечение с `OpenControlSurfaceStyleProps` |
| Хром ряда: min-block / radius / surface / border / focus-within | `open-control.ts`, `search-field.styles.ts`, частично `input.styles.ts` | общий генератор поверхности контрола рядом с open-control |
| Заливка `surface` / `transparent` | open-control, input, search-field, portal-панели | `@ui/surface` (`getSurfaceBackgroundColor`) |
| Литерал `'Clear'` рядом с `DEFAULT_CLEAR_ARIA_LABEL` | `a11y.ts` | одна константа в обеих ветках |
| Alias-дефолты shape/size | date-range-input | удалить; брать `DEFAULT_*` из `@ui/presets` |

Не дефект (защита канона): `getPaddingBlock` без внешних вызовов — §4.4 явно сохраняет симметричную пару с `getPaddingInline`.

---

## Кандидаты в канон

1. **Раздел «Дубли и лишние сущности»** в `.cursor/skills/shared/canon-ui-checklist.md` этого репозитория отсутствует (в продуктовом чеклисте уже есть). Перенести инлайн-критерии из задания ревью целиком.
2. **§7.2.2 opt-in `BorderProps`:** дополнить SearchField и Toolbar (фактические потребители); иначе канон врёт относительно кода.
3. **Глоссарий vs практика «ось»:** глоссарий запрещает слово «ось» в тексте и идентификаторах, при этом §2.5 / маршруты / §7.* сами говорят «оси». Нужна согласованная формулировка.
4. **Мост `resolveControlBlockRadius`:** зафиксировать в §7.7 / §13.4 как канонический колбэк для `getOpenControlTriggerRowStyles`, чтобы не плодить локальные однострочники.
5. **Граница `@ui/surface`:** когда фиксированная заливка `surface` пишется через `getSurfaceBackgroundColor`, а когда допустим прямой `theme.colors.surface` (панели без оси `background`).

---

## Требует решения пользователя

1. **Префикс clear при кастомном fallback:** при `resolveClearAriaLabel(label, 'Clear search')` и непустом `label` получается `Clear <label>`, не `Clear search <label>`. Нужна ли отдельная ось «глагол сброса» / шаблон, или EN-префикс `Clear` навсегда общий?
2. **Объём выноса хрома SearchField/Input в open-control:** один генератор на все полевые поверхности или только выравнивание SearchField под open-control без трогания Input?
3. **Термин «ось» в глоссарии** — см. кандидат 3; без решения пользователя агентам нельзя единообразно править комментарии вроде `border.ts:42` («ось управления»).

---

## Итог

Требуется исправление находок 1–10 (ядро — дубли радиуса/хрома/surface и мёртвый тип open-control; комментарии 6–8 — синхронизация с потребителями).

**Подпись:** Ревьюер cursor-grok-4.5 (project-reviewer)

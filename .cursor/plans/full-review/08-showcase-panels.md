# Полное ревью · область 08 — панели настроек витрины и демо

**Проект:** `extension-vite-ts-starter`
**Область:** все `src/pages/showcase/*-settings/**`, `table-demo/**`, `browser-ai-smoke-probe/**`
**Вне зоны (только эталон):** каркас витрины, `index.tsx`, общие сателлиты-группы
**Режим:** только анализ; код не правился; линтеры не гонялись.

---

## Находки

1. [UI · полнота панели] `modal-settings/index.tsx:81–130` (тип `ModalWidgetState` `:47–59`)
   **Что не так:** `Modal` пробрасывает Card-пропсы, включая пакет рамки (дефолт `showBorder = false`). В стейте и панели этих ключей нет, `BorderGroup` не подключён — ось рамки не демонстрируется.
   **Как должно быть:** добавить ключи рамки с дефолтами компонента, вставить `BorderGroup` после `Size:` перед `Background:`; превью в каркасе пробрасывает тот же набор.
   **Канон:** `showcase.mdc` — «Полнота панели», «Группа рамки».

2. [UI · фолбэк в JSX панели] `date-range-input-settings/index.tsx:143`
   **Что не так:** `value={state.dayShape ?? state.shape}` — запасное значение оси прямо в панели.
   **Как должно быть:** в контрол уходит значение как есть; фолбэк — внутри сателлита.
   **Канон:** `showcase.mdc` — «Дефолты стейта = дефолты компонента».

3. [UI · порядок полей] `date-range-input-settings/index.tsx:92–145`
   **Что не так:** после `ControlGroup` идут текстовые подписи, затем value, затем режим формы — слоты переставлены.
   **Как должно быть:** `ControlGroup` → value → режимы → текстовые подписи → `Disabled`.
   **Канон:** `showcase.mdc` — «Порядок полей по осям примитива».

4. [UI · лейбл] `checkbox-settings/index.tsx:126` — у пропа `inverted` подпись `Show inverted`; префикс `Show` закреплён за `show*`.
   **Как должно быть:** `Inverted`.
   **Канон:** `showcase.mdc` — лейблы.

5. [UI · лейбл] `tag-settings/index.tsx:144` — у `tinted` подпись `Show tinted`, при том что соседний `showDot` даёт `Show dot`.
   **Как должно быть:** `Tinted`.

6. [UI · лейбл] `table-settings/index.tsx:110` — ключ `showIndexColumn`, подпись `Index column` без глагола показа.
   **Как должно быть:** `Show index column`.

7. [UI · дубль] `icon-settings/index.tsx:45–56` и `card-settings/index.tsx:51–56`
   **Что не так:** механика «padding → ключ ряда через `getIconPadding` + `find`» скопирована в две панели.
   **Как должно быть:** общий хелпер витрины с параметрами перечня и fallback.
   **Канон:** дубли.

8. [UI · дубль лейблов text-group] явные `label: 'Text:'` / `'Text tone:'` при дефолтном `labelPrefix`: `button-settings:131–144`, `tag-settings:150–167`, `checkbox-settings:132–148`, `switch-settings:99–115`, `spinner-settings:96–112`, `toast-settings:90–102`, `progress-bar-settings:132–135`
   **Что не так:** декларация повторяет вывод `resolveGroupContentLabel` / `resolveGroupFieldLabel`; эталон — Input, SearchField, Stepper, Fieldset.
   **Как должно быть:** убрать явные лейблы там, где хватает `labelPrefix`.
   **Канон:** `showcase.mdc`; дубли.

9. [UI · маркер демо] `browser-ai-smoke-probe/index.tsx` — extension/demo-поверхность без маркера «Не переносить в продуктовый код».
   **Канон:** `showcase.mdc`; distill.

10. [UI · маркер демо] `listbox-settings/options.ts:1–24` — демо-опции без маркера непереносимости.
    **Канон:** `showcase.mdc`; distill.

11. [UI · дубль обработчиков] `stepper-settings/index.tsx:101–124` — парсеры `Min:` и `Max:` идентичны.
    **Как должно быть:** один `parseOptionalNumberInput`.

12. [UI · дубль обработчиков] `range-input-settings/index.tsx:244–275` — три инпута повторяют один spread-патч объекта сообщений.
    **Как должно быть:** локальный `updateValidationMessage(key, value)`.

13. [UI · единообразие свежих панелей] `toolbar-settings`, `search-field-settings` — собраны канонично; расхождение в обратную сторону: старшие text-панели и Modal без рамки отстают.
    **Как должно быть:** выравнивать старшие панели к свежим, не наоборот.

---

## Дубли и вынос

| Что | Где сейчас | Куда выносить |
|-----|------------|---------------|
| `resolveIconPaddingSizePreset` | `icon-settings`, `card-settings` | общий хелпер витрины с параметрами keys + fallback |
| Явные `label: 'Text:'` / `'Text tone:'` | button, tag, checkbox, switch, spinner, toast, progress | удалить, полагаться на `labelPrefix` |
| Парс optional number | `stepper-settings` | локальная функция панели |
| Патч `validationMessages` | `range-input-settings` | локальный updater по ключу |
| Тройной блок сегмента | `segment-button-settings` | опционально фабрика контролов сегмента |

Сателлиты в панелях в целом подключены по телу; исключение — Modal без `BorderGroup`. Локальных перечней вместо `*_KEYS` не найдено.

---

## Кандидаты в канон

1. Раздел «Дубли» в витринном чеклисте: обязанность брать сателлит при совпадении тела блока; запрет лейбла, повторяющего вывод хелпера; фолбэк только в сателлите.
2. Булевы лейблы без `show`: режимные признаки называть именем (`Inverted`, `Tinted`, `Striped`).
3. Порядок вложенных поверхностей — место слота «режим вложенной поверхности» в слотовой лестнице.
4. Card/Modal `Show subtitle` + `TitleGroup` — зафиксировать паттерн внешнего чекбокса.
5. Маркер демо-данных в `*-settings/options.ts` и smoke-probe считать обязательным.

---

## Требует решения пользователя

1. Modal и рамка: полный `BorderGroup` или только `Show border` с учётом дефолта `showBorder = false`.
2. DateRange `dayShape`: отдельный контрол с «как `shape`» или всегда явное значение.
3. Вынос `resolveIconPaddingSizePreset`: общий модуль витрины, расширение `IconGroup` или отдельный сателлит.
4. SegmentButton: выносить тройной блок сегмента или оставить развёрнутым.

---

## Итог

Требуется исправление находок 1–12: Modal без рамки, фолбэк и порядок полей у DateRange, лейблы `Show inverted` / `Show tinted` / `Index column`, дубли padding-резолвера и лейблов текстовой группы, маркеры демо. Пункт 13 — ориентир выравнивания. Паритет Toast preview и `showToast` подтверждён; SearchField и Toolbar к сателлитам подключены корректно.

**Подпись:** Ревьюер cursor-grok-4.5 (project-reviewer)

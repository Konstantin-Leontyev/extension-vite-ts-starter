# Ревью: оболочки, оверлеи, ряд иконочных действий

**Проект:** `extension-vite-ts-starter`
**Область:** `src/ui/card`, `src/ui/toolbar`, `src/ui/icon-button-row`, `src/ui/sidebar`, `src/ui/modal`, `src/ui/toast`, `src/ui/scroll-port`
**Эталоны (без замечаний):** `src/ui/surface.ts`, `src/ui/anchored-portal`
**Дата:** 2026-08-12

---

## Находки

1. **`src/ui/card/index.tsx:172-173` + `src/ui/card/card.styles.ts:127-134`**
   **Что не так:** ряд действий позиционируется жёстко `inset*={CARD_PADDING}`, а внутренний отступ поверхности задаётся `padding: CARD_PADDING` и затем может быть перебит layout-пропами через `getLayoutStyles`. Публичный контракт допускает `<Card padding={…} />`, но угол действий остаётся на константе — полумагия после выноса ряда в `IconButtonRow`.
   **Как должно быть:** один источник края: либо insets ряда считать из фактически применённого padding, либо не принимать переопределение padding, либо ставить ряд в угол padding-box так, чтобы он не зависел от величины отступа.
   **Канон:** §10 (полный эффект пропа), §8.5, §4.1.

2. **`src/ui/toolbar/toolbar.styles.ts:81` + `:131-134`**
   **Что не так:** та же схема: `TOOLBAR_PADDING` зашит в шаблон и в формулу `resolveToolbarBlockRadius`, а `getLayoutStyles` ниже может переписать `padding*`. Радиус и визуальный «пол» панели перестают соответствовать реальному отступу.
   **Как должно быть:** радиус и padding поверхности читать из одного резолва отступа.
   **Канон:** §10, §8.5, §7.7.

3. **`src/ui/scroll-port/index.tsx:159` + `:209` / `scroll-port.styles.ts:218`**
   **Что не так:** `isVeilEnabled = showVeil ?? DEFAULT_SCROLL_PORT_SHOW_VEIL` резолвит дефолт в `index.tsx`, но в корень уходит сырой `showVeil`; генератор снова подставляет тот же дефолт — дубль дефолта вниз по дереву.
   **Как должно быть:** передавать резолвленное значение; в генераторе не дублировать `?? DEFAULT_*`.
   **Канон:** §8.2.

4. **`src/ui/card/card.styles.ts:184` + комментарий `:178`**
   **Что не так:** у `StyledCardBody` стоит `position: relative` «якорь для вложенного позиционирования», но абсолютный ряд действий якорится на `StyledCard` (`:123`), а absolute-потомков внутри body нет. Декларация мёртвая, комментарий противоречит коду.
   **Как должно быть:** убрать правило и поправить комментарий.
   **Канон:** §10; `comments.mdc` §1.7.

5. **`src/ui/toast/toast.styles.ts:89`**
   **Что не так:** `color: ${theme.colors.default}` повторяет цвет, уже заданный на `body` и наследуемый Toast (портал в `document.body`).
   **Как должно быть:** не писать `color`; цвет сообщения — ось Text.
   **Канон:** §10, §11.3.

6. **`src/ui/card/card.styles.ts:170`**
   **Что не так:** `min-block-size` первой строки шапки всегда резервирует высоту действия, даже когда `headerActions` пуст, а сам ряд absolute и места в потоке не занимает — резерв под условного соседа.
   **Как должно быть:** либо не резервировать при пустом ряде, либо закрепить исключение в каноне с единым источником размера.
   **Канон:** §5.3; смежно §5.2, §8.5.

7. **`src/ui/icon-button-row/` (модуль целиком) vs distill витрины**
   **Что не так:** публичный `@ui/icon-button-row` не имеет секции витрины; демонстрируется только косвенно через Card и Toolbar.
   **Как должно быть:** секция с осями ряда либо явный статус внутреннего сателлита.
   **Канон:** distill «Витрина / DS-canon»; `showcase.mdc`.

8. **`src/ui/card/card.styles.ts:129-132` vs `src/ui/toolbar/toolbar.styles.ts:46-51,107`**
   **Что не так:** после выноса заливки в `@ui/surface` оси поверхности разъехались: Toolbar публично несёт `shape` + `sizePreset` и считает радиус от них; Card зашивает дефолты в шаблон и формы поверхности не даёт.
   **Как должно быть:** зафиксировать продуктово — Card без оси формы как правило канона, либо выровнять оси Card и Toolbar.
   **Канон:** §1.1, §7.1 / §7.7.

9. **`src/ui/card/index.tsx:170-176` vs `src/ui/toolbar/index.tsx:81-86`**
   **Что не так:** остаток прежней модели действий: Card не передаёт `shape` и получает дефолт ряда `round`; Toolbar мапит форму панели в `rounded`. Один примитив ряда, два неявных контракта формы.
   **Как должно быть:** явные `shape` на обоих call site или единая таблица «контекст → форма».
   **Канон:** §8.2–§8.3; `icons.mdc`.

---

## Дубли и вынос

1. **`resolveSidebarPaddingEdge` (`sidebar.styles.ts:186-217`) ≈ `resolveScrollPortPaddingEdge` (`scroll-port.styles.ts:78-115`)** — один каскад «сторона → ось → `padding` → дефолт», отличаются только дефолты.
   **Куда:** `@ui/spacing` — `resolvePaddingEdge(props, edge, defaults)`.

2. **Заливка + рамка в `getCardStyles` (`card.styles.ts:97-100`) и `getToolbarStyles` (`toolbar.styles.ts:104-106`)** — одинаковая пара `getSurfaceBackgroundColor` + `getBorderStyles`.
   **Куда:** `@ui/surface` — `getSurfaceChromeStyles(theme, background, showBorder, showShadow, borderTone)`.

3. **`omitSidebarShellLayoutProps` / `omitScrollPortRoutedPaddingProps`** — одинаковый цикл «выкинуть имена из Set»; при третьем потребителе — `omitPropsByNames` рядом со `splitLayoutProps`.

4. **Мёртвое после каскада** — `StyledCardBody` `position: relative` (находка 4). Локального ряда действий и локальной заливки в Card/Toolbar не осталось. В `project.mdc` §2.5 всё ещё пример удалённого `StyledCardHeaderActions`.

---

## Кандидаты в канон

1. **Дубли и лишние сущности** — перенести блок в чеклист этого репозитория.
2. **§2.5:** заменить пример `StyledCardHeaderActions` на актуальный.
3. **Исключение §5.3** для absolute-ряда шапки, если резерв высоты подтверждён.
4. **Контракт поверхности Card vs Toolbar** — какие оси обязательны после выноса в `@ui/surface`.
5. **Внутренний padding surface-компонента vs `LayoutProps.padding*`** — запрет полумагии либо общий резолв для зависимых величин.

---

## Требует решения пользователя

1. Резерв высоты первой строки Card при пустых действиях — оставить как исключение или убрать.
2. Оси `shape` / `sizePreset` у Card — выровнять с Toolbar или зафиксировать отсутствие.
3. Форма действий по умолчанию: Card `round` против Toolbar `rounded`.
4. `@ui/icon-button-row` в витрине — секция или статус сателлита.
5. Переопределение `padding*` на Card и Toolbar — поддерживать с синхронизацией или запретить.

---

## Итог

Требуется исправление находок 1–7, согласование 8–9. Каскад выноса ряда в `IconButtonRow` и заливки в `surface` прослеживается; главные регрессы — полумагия padding против insets и радиуса, и незакрытый разъезд осей и дефолтов формы между Card и Toolbar.

**Подпись:** Ревьюер Cursor Grok 4.5 (project-reviewer)

# Полное ревью · область 07 — каркас витрины и общие сателлиты

**Проект:** `extension-vite-ts-starter`
**Область:** `src/pages/showcase/index.tsx`, `showcase.styles.ts`, `showcase-labels.ts`, `showcase-icon-options.tsx`; сателлиты `align-listbox`, `background-listbox`, `border-group`, `control-group`, `field-error-group`, `icon-group`, `shape-listbox`, `size-listbox`, `text-group`, `title-group`, `tone-listbox`
**Вне области:** панели `*-settings`, `table-demo`, `browser-ai-smoke-probe`
**Режим:** только анализ; код не правился; линтеры не гонялись.

---

## Находки

1. [UI · покрытие секциями] `src/pages/showcase/index.tsx` · `@ui/scroll-port`, `@ui/sidebar`
   **Что не так:** самостоятельно применяемые `@ui/scroll-port` и `@ui/sidebar` используются каркасом витрины, но не имеют собственной секции. Сателлиты композиции секций корректно не получают.
   **Как должно быть:** добавить секции ScrollPort и Sidebar.
   **Канон:** distill «Витрина / DS-canon»; продуктовый `showcase.mdc` «Какие компоненты получают секцию».

2. [UI · дубль хелпера опций] `align-listbox/index.tsx:31–37`, `shape-listbox/index.tsx:34–40`, `size-listbox/index.tsx:44–50`, `tone-listbox/index.tsx:68–74`, `background-listbox/index.tsx:30–34`, `icon-group/index.tsx:65–69`
   **Что не так:** один и тот же маппинг `keys → { label, value }` скопирован шесть раз.
   **Как должно быть:** общий `getListboxOptions(keys)`; потребители передают перечень.
   **Канон:** дубли; §2.4.

3. [UI · сущность мимо сателлита] `icon-group/index.tsx:200–206`
   **Что не так:** выбор позиции собран локальным `Listbox`, тогда как тон, размер, форма, выравнивание и заливка уже вынесены в `*-listbox`.
   **Как должно быть:** сателлит `position-listbox` по тому же контракту.
   **Канон:** `showcase.mdc` «Сателлиты витрины»; дубли.

4. [UI · неоднородность listbox-сателлитов] `shape-listbox:52–56` / `background-listbox:44–47` vs `size-listbox:70–74` / `align-listbox:58–62` / `tone-listbox:108–113`
   **Что не так:** Shape и Background требуют `value`; Size, Align и Tone принимают опциональный `value` с именованным дефолтом. Background зашивает перечень внутри и мапит опции в рендере; icon-options замораживает опции на уровне модуля.
   **Как должно быть:** единый контракт однотипных сателлитов-списков.
   **Канон:** `showcase.mdc` «Дефолты стейта» / «Сателлиты витрины».

5. [UI · дубль updater'ов] `src/pages/showcase/index.tsx:985–1183`
   **Что не так:** около двадцати почти идентичных `updateX(key, value)`; ветвление есть только у `updateListbox`.
   **Как должно быть:** фабрика `createWidgetStateUpdater(setState)`; `updateListbox` остаётся локальным.
   **Канон:** дубли; §9.2.

6. [UI · дубль id заголовков] `src/pages/showcase/index.tsx:152–284` + `SETTINGS_TITLES:379–403`
   **Что не так:** двадцать с лишним констант `*_WIDGET_TITLE_ID` вручную дублируют ключи `WidgetSettingsKey`.
   **Как должно быть:** `resolveWidgetTitleId(key)`.
   **Канон:** дубли; §8.2 / §12 п. 1.

7. [UI · ось-двойник дефолтов] `src/pages/showcase/index.tsx:419–851`
   **Что не так:** в одних `DEFAULT_*_STATE` тон берётся как `DEFAULT_TONE`, в соседних — литерал `'neutral'` / `'primary'` / `'pill'` / `'square'` / `'tiny'` / `'bold'` / `'center'` там, где значение совпадает с дефолтом примитива.
   **Как должно быть:** именованные дефолты примитива; литералы только для выразительного демо.
   **Канон:** `showcase.mdc` «Дефолты стейта = дефолты компонента»; §8.2.

8. [КОММЕНТАРИИ] `icon-group/index.tsx:11–12`, `:84`
   **Что не так:** шапка утверждает, что SegmentButton передаёт `Icon A` / `Icon B`; фактически — `Left icon` / `Center icon` / `Right icon`.
   **Канон:** `comments.mdc` §1.7.

9. [КОММЕНТАРИИ · потребители] неполные списки против реальных импортов
   - `control-group/index.tsx:21–30` — нет `search-field-settings`
   - `border-group/index.tsx:21–26` — нет `search-field-settings`, `toolbar-settings`
   - `background-listbox/index.tsx:16–19` — нет `toolbar-settings`
   - `icon-group/index.tsx:35–42` — нет `search-field-settings`
   - `showcase-icon-options.tsx:11–17` — нет `search-field-settings`
   **Канон:** `comments.mdc` §1.7.

10. [UI · канон стартера отстаёт] `.cursor/rules/showcase.mdc:146` (`CARD_BACKGROUND_KEYS`); эталоны групп без SearchField и Toolbar; нет раздела «Какие компоненты получают секцию»
    **Как должно быть:** выровнять стартерный `showcase.mdc` с продуктовым и с фактическими эталонами сателлитов.
    **Канон:** преамбула `project.mdc`; `showcase.mdc`.

---

## Дубли и вынос

| Что | Где сейчас | Куда выносить |
|-----|------------|---------------|
| `keys.map → { label, value }` | align/shape/size/tone/background-listbox, icon-group | общий `getListboxOptions` |
| Listbox позиции иконки | `icon-group` локально | `pages/showcase/position-listbox` |
| Плоский `setState` по ключу | ~20 `updateX` в каркасе | `createWidgetStateUpdater` |
| `showcase-*-heading` | константы `*_WIDGET_TITLE_ID` | `resolveWidgetTitleId(WidgetSettingsKey)` |
| Литералы тона/формы/размера = дефолт примитива | `DEFAULT_*_STATE` | публичные `DEFAULT_*` примитивов |

Не дефект: `text-group` и `title-group` сознательно разные при похожей четвёрке полей; `StyledShowcaseWidgetFullRow` и `StyledRadioButtonDemo` несут layout-функцию.

Сирот и мёртвых экспортов в области не найдено. Порядок полей и лейблы в сателлитах соответствуют канону. Паритет Toast preview и `showToast` соблюдён (`index.tsx:1912–1933`).

---

## Кандидаты в канон

1. Раздел «Какие компоненты получают секцию» — перенести из продуктового `showcase.mdc`, добавив в список сателлитов `field-error` и `field-label`.
2. Раздел «Дубли и лишние сущности» в чеклисте стартера.
3. `showcase.mdc`: `CARD_BACKGROUND_KEYS` → `SURFACE_BACKGROUND_KEYS`; в эталоны групп добавить SearchField и Toolbar.
4. Единый контракт однотипных `*-listbox`.
5. Сателлит `position-listbox` как обязательный паттерн оси позиции.

---

## Требует решения пользователя

1. Секции ScrollPort и Sidebar: отдельные карточки или каркасный блок.
2. Глубина унификации сателлитов-списков: только общий хелпер опций или ещё выравнивание контракта и вынос `position-listbox`.
3. `createWidgetStateUpdater`: общий хелпер или явные `updateX` ради читаемости типов.

---

## Итог

Требуется исправление находок 1–10: нет секций ScrollPort и Sidebar, дубли опций, updater'ов и id заголовков, неоднородность сателлитов-списков, отставание `showcase.mdc` и ложные JSDoc.

**Подпись:** Ревьюер cursor-grok-4.5 (project-reviewer)

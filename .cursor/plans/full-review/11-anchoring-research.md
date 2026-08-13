# Исследование: позиционирование выпадающих панелей

**Проект:** `extension-vite-ts-starter`  
**Дата отчёта:** 2026-08-13  
**Объём:** исследование, без правок `src/**`  
**Источники поддержки:** Can I Use и MDN на дату отчёта (ссылки у каждого утверждения о версиях)

---

## 1. Что сейчас в репозитории

### Инфраструктура (~760 строк ядра + локальные стратегии)

| Файл | Строк | Роль |
|------|------:|------|
| `src/ui/anchored-portal/index.tsx` | 169 | портал в `document.body`, склейка dismiss / focus / position |
| `src/ui/anchored-portal/anchored-portal.styles.ts` | 68 | хром панели (`position: fixed`, слой, рамка) |
| `src/hooks/use-anchored-portal-position.ts` | 250 | `placeTriggerAlignedPanel`, `clampPanelToViewport`, `matchTriggerRect`, хук на `resize` |
| `src/hooks/use-anchored-dismiss.ts` | 107 | Escape, клик вне зон, scroll capture |
| `src/hooks/use-focus.ts` | 126 | ловушка Tab + возврат фокуса |
| `src/ui/open-control.ts` | 377 | хром open-контролов, в т.ч. `visibility: hidden` триггера при открытии |
| `src/ui/viewport.ts` | 42 | `PORTAL_VIEWPORT_EDGE_INSET` для clamp |

### Потребители и их стратегии

| Потребитель | Стратегия | Суть |
|-------------|-----------|------|
| **Listbox** | свой `applyListboxPanelPosition` + `splitPanelOptionIndices` | панель **замещает** триггер; выбранная строка на линии триггера; остальные — «барабан» вверх/вниз с учётом вьюпорта |
| **Combobox** | `applyComboboxPanelPosition` (обёртка над place/clamp с резервом поиска) | верх панели ≈ верх триггера (или поднят), ширина = триггер, `max-block-size` + скролл |
| **RangeInput** | `matchTriggerRect` | панель ровно поверх прямоугольника триггера |
| **DateRangeInput** | `placeTriggerAlignedPanel` + `clampPanelToViewport` | ширина триггера, flip вверх/вниз, clamp к краю |
| **Table** (add/edit) | `applyTableAddPanelPosition` / `applyTableEditPanelPosition` | ширина якоря, панель накладывается на строку(и) шапки/футера/редактора |
| **ProfileMenu** | `applyProfileMenuPanelPosition` | ниже аватара с зазором, правый край к триггеру, `max-block-size` + скролл |

Общий UX open-контролов: при `data-open='true'` ряд-триггер скрывается (`visibility: hidden` в `open-control.ts`), панель рисуется поверх — визуально «триггер превратился в панель», а не «меню под кнопкой».

---

## 2. Нативный `popover` + CSS Anchor Positioning

### Что даёт связка

| Задача | Кто закрывает | Как |
|--------|---------------|-----|
| Всплытие над UI | **Popover** | элемент в top layer (`showPopover` / `popover` attribute) |
| Закрытие по клику вне / Escape | **Popover `auto`** | light-dismiss по спецификации ([HTML Standard — popover light dismiss](https://html.spec.whatwg.org/multipage/popover.html); [MDN Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)) |
| Привязка к якорю | **Anchor Positioning** | `anchor-name` / `position-anchor`, неявный якорь через `popovertarget` / `showPopover({source})` ([web.dev — Anchor positioning](https://web.dev/learn/css/anchor-positioning)) |
| Выбор стороны + flip | **CSS** | `position-area` + `position-try-fallbacks` / `flip-block` ([MDN `position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area); [web.dev](https://web.dev/learn/css/anchor-positioning)) |
| Ширина = триггер | **CSS** | `inline-size: anchor-size(width)` ([MDN `anchor-size()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/anchor-size)) |
| Ограничение высоты + скролл | **частично CSS** | `max-block-size` + `overflow`; «доступная высота до края» — через `calc`/`dvh` или ручной clamp; браузер flip’ает позицию, но не пишет за вас `max-height` равный остатку вьюпорта так же, как текущий `clampPanelToViewport` |
| Ловушка Tab / возврат фокуса | **JS остаётся** | Popover non-modal ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)); для интерактивных панелей `useFocus` / аналог нужен |
| Закрытие при scroll страницы | **JS остаётся** | текущий `useAnchoredDismiss` — проектное поведение; у popover этого нет из коробки |
| Перестановка DOM-содержимого (барабан Listbox) | **JS остаётся** | см. §5 |

Портал в `document.body` для top-layer **не обязателен**: popover сам поднимается в top layer. React-портал можно упростить или убрать, если панель остаётся в дереве рядом с триггером (удобнее для неявного якоря).

### Поддержка (на 2026-08-13)

**Popover API** — Baseline, широко доступен:

| Движок | Версия | Источник |
|--------|--------|----------|
| Chrome / Edge | 114+ | [Can I Use — `HTMLElement.popover`](https://caniuse.com/mdn-api_htmlelement_popover) |
| Firefox | 125+ | то же |
| Safari | 17+ (iOS: полная с 18.3) | то же |
| MDN | Baseline с января 2025 | [MDN Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) |

**CSS Anchor Positioning** — Baseline 2026 (с января 2026 по MDN):

| Движок | Версия | Источник |
|--------|--------|----------|
| Chrome / Edge | 125+ | [Can I Use — CSS Anchor Positioning](https://caniuse.com/css-anchor-positioning) |
| Firefox | 147+ (145–146 за флагом) | то же |
| Safari / iOS Safari | 26.0+ | то же |
| MDN `position-area` | Baseline 2026 | [MDN `position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area) |

Имена: в раннем Chrome были `inset-area` / `position-try-options`; канон сейчас — `position-area` / `position-try-fallbacks` ([CSS-Tricks Anchor Positioning Guide](https://css-tricks.com/css-anchor-positioning-guide/), [Can I Use notes](https://caniuse.com/css-anchor-positioning)).

---

## 3. Кастомизируемый нативный `<select>` (`appearance: base-select`)

Прямой ответ на исходное желание «просто стилизовать нативный select».

### Что умеет (где уже есть)

По [Chrome Developers — customizable select (2025-03-24)](https://developer.chrome.com/blog/a-customizable-select), [Open UI explainer](https://open-ui.org/components/customizable-select.explainer/), [MDN Customizable select](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select):

- opt-in: `appearance: base-select` на `select` **и** на `::picker(select)`;
- пикер в top layer, позиционирование через anchor;
- стилизация кнопки, списка, `option::checkmark`, `select::picker-icon`;
- rich HTML внутри `<option>` (картинки, разметка) при поддержке парсера;
- `<button>` + `<selectedcontent>` для кастомного триггера;
- клавиатура и a11y остаются на стороне браузера.

### Чего нет / не хватает для этого кита

| Возможность кита | `base-select` сегодня |
|------------------|----------------------|
| Одиночный dropdown со стилями | да, в поддерживающих браузерах |
| Множественный выбор (`multiple` как dropdown) | **нет в стабильных движках** — [Can I Use multiple dropdown](https://caniuse.com/mdn-css_properties_appearance_base-select_multiple_dropdown): Chrome/Firefox/Safari — Not supported; Open UI: «actively prototyped, not part of any specification yet» ([explainer § multiple and size](https://open-ui.org/components/customizable-select.explainer/)) |
| Строка поиска / фильтр (Combobox) | **не часть select** — отдельный трек Open UI Combobox ([explainer](https://open-ui.org/components/combobox.explainer/)) |
| Барабан Listbox (выбранная на линии триггера) | нет |
| Календарь / range / table overlays / profile menu | вне модели `<select>` |

### Поддержка (на 2026-08-13)

| Движок | `appearance: base-select` | Источник |
|--------|---------------------------|----------|
| Chrome / Edge | 135+ | [Can I Use](https://caniuse.com/mdn-css_properties_appearance_base-select) |
| Safari | 27+ (TP); 26.x — нет | то же |
| Firefox | 149–156 — **Disabled by default** | то же |
| iOS Safari | нет в 26.x | то же |
| MDN | **не Baseline** | [MDN appearance / customizable select](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select) |

**Вывод:** для хаба, который кормит и Chrome-расширение, и веб с Safari/Firefox, `base-select` **не заменяет** Listbox/Combobox в 2026-08. Для расширения (только Chromium ≥135) — возможный эксперимент на простых одиночных списках, но не на всём семействе open-control.

---

## 4. Как делают другие

### Bootstrap 5.3

Документация прямо говорит: dropdowns/popovers/tooltips **позиционирует Popper** (JS: placement, flip, preventOverflow, offset). Статика — только opt-out (`display: static` / navbar без Popper).  
Источник: [Bootstrap 5.3 Dropdowns](https://getbootstrap.com/docs/5.3/components/dropdowns/).

Миграция Bootstrap 6 (WIP PR) — с Popper на **Floating UI**, всё ещё JS-расчёт.  
Источник: [twbs/bootstrap#41941](https://github.com/twbs/bootstrap/pull/41941).

**Неизбежный JS у них:** координаты, collision, flip. Light-dismiss и ARIA — свой JS Bootstrap, не Popover API как единственный механизм.

### Floating UI

Официально: toolkit для якорения absolutely-positioned элемента + collision middleware (`computePosition`, flip, shift, size).  
Источник: [floating-ui.com — Getting Started](https://floating-ui.com/docs/getting-started).

Нативная CSS-якорность — **альтернатива** для простых кейсов, не замена библиотеки «из коробки» в самом Floating UI. Сложные случаи (virtual element, стрелка с точным transform-origin, кастомные boundaries) по-прежнему считают на JS.

### Radix / Base UI

- **Radix Popover:** позиционирование через портал + JS (переменные `--radix-popover-content-available-height`, trigger width и т.д.) — [Radix Popover docs](https://www.radix-ui.com/primitives/docs/components/popover).
- **Base UI:** `useAnchorPositioning` — обёртка над Floating UI `useFloating` ([исходник](https://github.com/mui/base-ui/blob/d81ec002/packages/react/src/utils/useAnchorPositioning.ts)).
- Нативный CSS anchor — **опциональный путь в будущем**: issue [mui/base-ui#1663](https://github.com/mui/base-ui/issues/1663) (открыт с 2025-04; цель — позволить опустить `Positioner` и не тащить Floating UI в бандл). На август 2026 это не «уже мигрировали», а «обсуждают / готовят API».

### Что остаётся неизбежным на JS почти везде

1. Состояние open/close и синхронизация с формой.  
2. Клавиатура списка / combobox (если не нативный select).  
3. Фокус-ловушка и возврат фокуса для сложных панелей.  
4. **Контентная** раскладка, зависящая от выбранного индекса и геометрии вьюпорта (барабан Listbox).  
5. Специфичные overlays (table add/edit с высотой error-row).

Координатный «middleware» (flip/shift/size) в 2026 уже **можно** отдать браузеру через anchor + `position-try-fallbacks` — библиотеки пока дублируют это на JS из инерции и ради старых браузеров / edge-cases.

---

## 5. Особенность кита: замещение триггера и барабан Listbox

### Замещение триггера (RangeInput, общий open-control)

Сейчас: `matchTriggerRect` + скрытие триггера через `visibility: hidden`.

На CSS anchors:

```css
.panel {
  position: fixed;
  position-anchor: --trigger;
  inset-block-start: anchor(top);
  inset-inline-start: anchor(left);
  inline-size: anchor-size(width);
  /* высота — своя или min по контенту */
}
```

либо `position-area: center` + выравнивание ([MDN `position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area) — центр сетки = плитка якоря).

**Оценка:** выражается средствами anchor positioning **один в один по геометрии прямоугольника**. JS-математика `matchTriggerRect` исчезает. Скрытие триггера остаётся CSS-состоянием.

### Барабан Listbox

Алгоритм в `listbox/index.tsx`:

1. выбрать индекс;  
2. посчитать, сколько строк влезает ниже триггера (`countRowsFitBelow`);  
3. разложить остальные индексы вверх/вниз (`splitPanelOptionIndices`), поджимая, пока вся панель не войдёт во вьюпорт;  
4. поставить `inset-block-start = triggerTop - aboveCount * rowHeight`.

Это одновременно:

- **порядок DOM** (перестановка опций вокруг выбранной),  
- **смещение панели**, зависящее от числа строк выше.

`position-area` / `position-try-fallbacks` умеют flip стороны **целой** панели относительно якоря. Они **не** умеют «держать выбранную строку на линии якоря, а лишние опции разложить вверх и вниз с перестановкой списка».  
`anchor()` задаёт inset’ы панели, но не перестраивает children.

**Оценка:** барабан **требует расчёта на JS** (или смены UX на обычный список со скроллом к выбранному — тогда можно опереться на native/CSS).

---

## 6. Особые среды

### Chrome side panel (расширение)

Side panel — обычная extension page (`chrome-extension://…`) с тем же web platform, что у popup/options ([chrome.sidePanel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)). Отдельного запрета Popover / Anchor Positioning в документации Chrome нет.

Практические следствия:

- целевой движок — Chromium → Popover (114+) и Anchor (125+) доступны при разумном `minimum_chrome_version`;
- узкий вьюпорт усиливает ценность `position-try-fallbacks` и `max-block-size`;
- `base-select` (135+) на стороне расширения реальнее, чем на широком вебе — но не закрывает Combobox/DateRange/Table.

### Веб с широкой аудиторией

| API | Риск |
|-----|------|
| Popover | низкий (Safari 17+, Firefox 125+) |
| Anchor Positioning | средний: нужен Safari **26+** и Firefox **147+**; пользователи на Safari 18 / старых macOS/iOS — без API ([Can I Use](https://caniuse.com/css-anchor-positioning)) |
| `base-select` | высокий: Firefox выключен, Safari только 27+, multiple нет |

Стратегии для веба:

1. **Прогрессивное улучшение:** `@supports (anchor-name: --x)` → CSS path; иначе текущий JS.  
2. **Полифилл** (например Oddbird css-anchor-positioning — упоминается в обзорах; оценивать отдельно по лицензии/размеру, в отчёт не включался как обязательный).  
3. **Два билда / два минимума:** extension-only Chromium features vs web fallback.  
4. Не ставить `base-select` как единственный путь Listbox до interoperable multiple + стабильного Firefox.

---

## 7. Варианты пути

### Вариант A — Оставить свой JS (status quo + точечная чистка)

| | |
|--|--|
| **Исчезает** | почти ничего по позиционированию |
| **Остаётся** | весь стек AnchoredPortal + хуки + локальные `apply*` |
| **Дописать** | разве что тесты/документация «это осознанный выбор» |
| **Плата** | продолжаем содержать координатную математику; зато UX (барабан, scroll-dismiss, table overlays) без сюрпризов |
| **Риск / объём** | низкий риск, объём 0; витрина без изменений |
| **Оценка** | честно: не «костыль случайный», а самописный Floating UI light — но дублирует то, что браузер уже умеет для *простых* меню |

### Вариант B — Popover + CSS Anchor (рекомендуемый основной вектор)

Заменить портальную координатную математику на platform API; кастомные панели и open-control UX сохранить.

| | |
|--|--|
| **Исчезает / сильно худеет** | `useAnchoredPortalPosition`, `placeTriggerAlignedPanel`, `clampPanelToViewport`, `matchTriggerRect` для ProfileMenu / Combobox / DateRange / Range / части Table; возможно `createPortal` |
| **Остаётся на JS** | open state; `useAnchoredDismiss` (scroll + зоны) или частичная замена light-dismiss popover; `useFocus`; **барабан Listbox**; table error-height нюансы; фильтрация Combobox; календарь DateRange |
| **Дописать** | CSS: `anchor-name`, `position-anchor` / implicit source, `position-area` / `anchor()`, `position-try-fallbacks`, `anchor-size()`; адаптер `AnchoredPortal` → popover; `@supports` fallback для веба; правки витрины (визуально те же демо, другая механика) |
| **Плата** | двухпутевость на вебе до вымирания Safari &lt;26; проверить взаимодействие popover light-dismiss с `dismissZoneRefs` (триггер + панель); пересмотреть scroll-dismiss |
| **Риск / объём** | средний–высокий; оценка порядка **1–2 недели** на ядро + потребителей + витрину, отдельно регрессии Listbox/Table |
| **Барабан** | не выражается CSS — оставить JS-раскладку, панель можно всё равно повесить на popover+anchor для left/width |

### Вариант C — Внешняя библиотека (Floating UI / Base UI Positioner)

| | |
|--|--|
| **Исчезает** | самописный `use-anchored-portal-position` и часть `apply*` |
| **Остаётся** | dismiss/focus (или их аналоги из lib); барабан; доменная логика контролов; open-control хром |
| **Дописать** | зависимость, обёртка middleware (flip/shift/size), интеграция в AnchoredPortal |
| **Плата** | бандл; чужой API; **не** убирает JS-позиционирование — меняет автора кода; kit-hub «нейтральный UI без лишних deps» страдает |
| **Риск / объём** | средний; быстрее стабильный flip, чем писать с нуля, но стратегически шаг **в сторону** от platform, не к нему |
| **Миграция библиотек на CSS anchors** | у Base UI пока opt-in обсуждение ([#1663](https://github.com/mui/base-ui/issues/1663)), не default |

### Вариант D — Нативный `<select appearance: base-select>` для простых списков + кастом для остального

| | |
|--|--|
| **Исчезает** | только узкий класс одиночных Listbox-подобных контролов (если сознательно упростить UX: без барабана, без multiple, без поиска) |
| **Остаётся** | Combobox, DateRange, Range, Table, ProfileMenu, multiple Listbox — весь текущий стек |
| **Дописать** | отдельный примитив NativeSelect; ветки `@supports`; витрина двух миров |
| **Плата** | раскол семейства open-control; на вебе Firefox/Safari дыра; multiple отсутствует ([Can I Use](https://caniuse.com/mdn-css_properties_appearance_base-select_multiple_dropdown)); отказ от барабана |
| **Риск / объём** | высокий продуктовый (два UX), низкий технический для extension-only прототипа |
| **Вердикт к желанию владельца** | желание валидно, платформа **ещё не догнала** требования кита (multiple + search + барабан + календарь) |

---

## 8. Что воспроизводится браузером один в один vs что остаётся на JS

| Поведение сейчас | Браузер один в один? | Комментарий |
|------------------|----------------------|-------------|
| Панель над UI (z/top-layer) | да — popover | |
| Клик вне + Escape | да — `popover=auto` | зоны «триггер не dismiss» — проверить; при скрытом триггере ок |
| Flip вверх/вниз | да — `position-try-fallbacks` | |
| Ширина = триггер | да — `anchor-size` | |
| Прижатие left к краю | да — shift через try / containing block | точный паритет с `PORTAL_VIEWPORT_EDGE_INSET` — настроить margin/padding |
| `max-block-size` = остаток вьюпорта | частично | часто всё ещё CSS `min()`/`dvh` или тонкий JS |
| Скрытие триггера при open | CSS состояния | не platform popover |
| Scroll страницы закрывает панель | нет — JS | |
| Focus trap + return focus | нет — JS (popover non-modal) | |
| Замещение прямоугольника триггера | да — `anchor()` / `position-area: center` | |
| Барабан Listbox | **нет** — JS | |
| Table add/edit с error-row height | почти нет — JS или тонкий layout | |
| Поиск Combobox | нет — JS (+ будущий Open UI combobox) | |
| Multiple select native styled | нет (2026-08) | |

---

## 9. Рекомендации

### Для Chrome-расширения (side panel)

**Рекомендация: Вариант B** — переводить инфраструктуру на **Popover + CSS Anchor Positioning**, не на `base-select` и не на Floating UI.

Обоснование:

1. Целевой браузер один; Anchor с Chrome 125 и Popover с 114 закрыты ([Can I Use](https://caniuse.com/css-anchor-positioning), [Can I Use popover](https://caniuse.com/mdn-api_htmlelement_popover)).  
2. Убирается главный «костыль» — ручной `getBoundingClientRect` + resize — для ProfileMenu, Combobox, DateRange, Range, части Table.  
3. Сохраняется кастомная разметка и визуальный язык open-control (в отличие от D).  
4. Listbox-барабан осознанно оставить на JS или позже упростить UX.  
5. `base-select` — только как опциональный третий примитив «простой одиночный список», не как замена семьи.

Порядок внедрения (если решите идти): ProfileMenu → DateRange/Combobox → Range (`matchTriggerRect` → CSS) → Table → Listbox (anchor для left/width, барабан отдельно).

### Для веба (широкая аудитория)

**Рекомендация: B с `@supports` fallback на текущий JS (гибрид A+B); не D.**

Обоснование:

1. Popover уже безопасен.  
2. Anchor — Baseline 2026, но отсечка Safari 26 / Firefox 147 ещё режет хвост аудитории ([Can I Use](https://caniuse.com/css-anchor-positioning)).  
3. Пока fallback жив — `use-anchored-portal-position` не удалять из allow-list, а сузить до fallback-пути.  
4. `base-select` на вебе в августе 2026 — преждевременно (Firefox disabled, multiple нет).

### Чего не делать сейчас

- Не менять весь kit на Floating UI/Radix ради «как у всех» — это закрепляет JS-расчёт на годы.  
- Не обещать владельцу, что `appearance: base-select` снимет Combobox/Listbox multiple/барабан — платформа этого не даёт.  
- Не ломать барабан Listbox «заодно» без отдельного UX-решения.

---

## 10. Краткая матрица решения

| Критерий | A свой JS | B popover+anchor | C Floating UI | D base-select |
|----------|:---------:|:----------------:|:-------------:|:-------------:|
| Убирает координатный JS | нет | да (кроме барабана/особых) | заменяет своим | да, но узко |
| Паритет барабана | да | барабан всё ещё JS | барабан всё ещё JS | нет |
| Extension готовность | да | да | да | частично (Chrome 135+) |
| Web готовность | да | с fallback | да | нет |
| Соответствие желанию «нативный select» | нет | нет | нет | да, но рано |
| Риск для витрины | низкий | средний | средний | высокий (два мира) |

**Итог:** путь владельца («стилизовать нативное») правильный по направлению платформы, но **в 2026-08 закрывается связкой popover + CSS anchor для кастомных панелей**, а не `base-select`. Самописный портал — не ошибка истории, а заполнение дыры; дыра по координатам для типичных меню уже закрыта браузером, дыра по барабану/поиска/multiple — ещё нет.

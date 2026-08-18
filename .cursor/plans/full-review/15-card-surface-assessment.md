# 15 · Оценка: Card как единая поверхность

**Проект:** `extension-vite-ts-starter`
**Файлы области:** `src/ui/card/index.tsx`, `src/ui/card/card.styles.ts`, `src/ui/modal/index.tsx`, `src/ui/modal/modal.styles.ts`, `src/ui/sidebar/index.tsx`, `src/ui/sidebar/sidebar.styles.ts`, `src/ui/range-input/index.tsx`, `src/ui/range-input/range-input.styles.ts`; сверка с HEAD через `git diff` / `git show`; соседние ресурсы `src/ui/open-control.ts`, `src/ui/anchored-panel/anchored-panel.styles.ts`, `src/ui/surface.ts`, `src/ui/border.ts`, `src/ui/text/index.tsx`, `src/ui/type-utils.ts`, `src/components/profile-menu`, `src/ui/reset.ts`, `src/ui/date-range-input/date-range-input.styles.ts`, `src/ui/listbox/listbox.styles.ts`, `src/ui/combobox/combobox.styles.ts`, `src/ui/table/table.styles.ts`
**Дата:** 18.08.2026
**Шаг плана:** 8б в `00-plan.md`
**Состояние кода:** незакоммиченное рабочее дерево (`git status` — `M` у перечисленных файлов, `?? src/ui/type-utils.ts`). Stash к переезду не относится (`stash@{0}` / `stash@{1}` — июль 2026, другие темы).

Вопрос: оправдан ли переезд. Три исхода равноправны. Гипотеза владельца («плюшки — только заливка и тень; у модалки потеряли нативное поведение; общее и так в хелперах») проверяется фактами, не подтверждается из вежливости.

Каждое утверждение ниже помечено **наблюдение** (прочитанный код) или **вывод** (оценка).

---

## 1. Что Card реально даёт каждому потребителю

Общий ресурс поверхности **до** переезда уже существовал в двух видах, не через наследование компонента:

- заливка — `getSurfaceBackgroundColor` (`src/ui/surface.ts:59`, дефолт `'surface'`);
- рамка и тень — `getBorderStyles` (`@ui/border`, канон `project.mdc` §7.2);
- скругление — `resolveBlockRadius` (`@ui/presets`);
- хром привязанной панели целиком — `getAnchoredPanelStyles` (`src/ui/anchored-panel/anchored-panel.styles.ts:108–125`: `position: fixed`, padding, overflow, заливка, рамка, радиус, outline);
- стековая панель open-control — `getOpenControlStackedPanelStyles` (`src/ui/open-control.ts:403–417`: сетка, `gap` 12, тот же `getAnchoredPanelStyles` с `OPEN_CONTROL_PANEL_PADDING = 16`);
- шапка с заголовком, подзаголовком и рядом действий — сам компонент Card, которым Modal и Sidebar **уже** пользовались как ребёнком, не как предком.

`getSurfaceChromeStyles` в коде нет; это предложенный вынос из отчёта `04-shells.md` (заливка + рамка Card и Toolbar). На переезд не влияет: пара генераторов уже общая.

### 1.1. Modal

**Наблюдение.** В HEAD корень — `styled.dialog` (`StyledModalDialog`), внутри — `<Card>` с `headerActions` и пробросом поверхности. Диалог сам обнулял UA-хром: `padding: 0`, `background: transparent`, `border: none`, плюс `::backdrop`, `max-*-size`, `margin: auto`. Две ветки JSX отличались только тем, передавать ли `titleId`.

После переезда: `StyledModal = styled(Card)` (`modal.styles.ts:66`), вызов с `as="dialog"` (`modal/index.tsx:176–186`). Вложенной Card нет.

| Что перестало дублироваться | Было ли это дублем поверхности | Общий ресурс до переезда |
|---|---|---|
| Заливка | нет | уже Card-ребёнок; диалог был `background: transparent` |
| Рамка и тень | нет | уже Card; у Modal дефолт рамки `false` (`modal/index.tsx:67`) и раньше |
| Скругление | нет | уже Card |
| Внутренние отступы | нет | уже `CARD_PADDING`; диалог держал `padding: 0`, чтобы не сложить два отступа |
| Шапка, подзаголовок, ряд действий | нет | уже Card |
| Связывание доступного имени | частично | в HEAD Modal сам собирал `titleId` через `useId` и ставил `aria-labelledby` на `<dialog>`; Card после прохода 17.08 умеет это на корне с ролью (`card/index.tsx:178–179`, канон §11.7). Это выигрыш прохода Card, не наследования |
| Сетка тела | нет | уже `StyledCardBody` |

**Вывод.** У Modal переезд не убрал повтор заливки, рамки, тени, радиуса, отступов и шапки. Он схлопнул **хозяина модальности** и **поверхность** в один узел и снял три декларации-сброса на диалоге (`padding: 0`, `background: transparent`). Формулировка плана «поверхность внутри поверхности» (`00-plan.md`, шаг 8б) здесь не сходится с HEAD: диалог поверхностью не был.

### 1.2. Sidebar

**Наблюдение.** В HEAD: `StyledSidebarSlot` (`<aside>`) → `StyledSidebarTrack` (`<div>` с `transform`) → `<Card>`. После: `StyledSidebarPanel = styled(Card)` (`sidebar.styles.ts:100`) с `as="aside"` (`sidebar/index.tsx:228–231`). Слот и трек удалены; ширина колонки, выезд и `aria-hidden` живут на Card.

| Что перестало дублироваться | Было ли это дублем поверхности | Общий ресурс до переезда |
|---|---|---|
| Заливка, рамка, тень, скругление, отступы, шапка, ряд действий | нет | уже Card-ребёнок |
| Связывание имени | частично | в HEAD слот ставил `aria-labelledby={`${id}-title`}` только при паре `title` + `id`; теперь Card связывает сам при `as` с ролью. Ручная формула `${id}-title` ушла |
| Сетка тела | нет | уже Card |
| Два анимационных узла | да, но это не поверхность | слот резал выезд (`overflow: hidden`, рост `inline-size`), трек двигал панель (`transform`). Это механика колонки, не хром |

**Вывод.** Поверхность у Sidebar уже была Card. Переезд сэкономил **два структурных узла** анимации и ручной `titleId`. Это другой выигрыш, чем «единый источник заливки».

### 1.3. RangeInput

**Наблюдение.** В HEAD панель — `styled.div` + `getOpenControlStackedPanelStyles` (заливка, рамка, тень, радиус по `shape`/`sizePreset`, padding 16, `position: fixed`, outline через `getAnchoredPanelStyles`). Заголовок — локальный `<Text as="h2">` **внутри** `StyledRangeInputCustomSection`, после списка пресетов.

После: `StyledRangeInputPanel = styled(Card)` (`range-input.styles.ts:201`), без смены тега. Локальный заголовок снят (`range-input/index.tsx`, diff: удалены строки с `<Text as="h2">` в секции). Хром стекового хелпера с панели снят; рядом дописаны `position: fixed`, `overflow: hidden auto`, `border-radius` по форме контрола, `getOutlineStyles` (`range-input.styles.ts:183–189`). `getOpenControlStackedPanelStyles` остался у DateRangeInput (`date-range-input.styles.ts:106`).

| Что перестало дублироваться | Было ли это дублем | Общий ресурс до переезда |
|---|---|---|
| Заливка | дубль сменён, не убран | `getSurfaceBackgroundColor` внутри `getAnchoredPanelStyles` |
| Рамка и тень | то же | `getBorderStyles` там же |
| Скругление | не убрано | `resolveBlockRadius(shape, size)` было в хелпере; после переезда снова пишется локально (`range-input.styles.ts:187`) поверх дефолта Card |
| Внутренние отступы | значение то же | `OPEN_CONTROL_PANEL_PADDING = 16` и `CARD_PADDING = 16` — две константы одного числа |
| Шапка Card | появилась впервые | до переезда шапки Card не было; был свой `h2` в другом месте композиции |
| Связывание имени | не переехало на Card | панель остаётся `div` (нет `as`), `hasRootRole` ложен (`card/index.tsx:178`); `aria-labelledby` / `aria-label` по-прежнему ставит RangeInput (`range-input/index.tsx:706–708`) |
| Сетка тела | частично | Card даёт grid без `gap`; зазор 12, который держал стековый хелпер, переехал в `margin-block-end` списка пресетов (`range-input.styles.ts:217`) |

**Вывод.** RangeInput — единственный из трёх, кто **впервые** сел на Card как на поверхность. При этом он ушёл с живого общего генератора, который DateRangeInput продолжает звать, и половину хрома (радиус, outline, `position: fixed`, прокрутка) написал снова. «Дубль убран» здесь не выполняется: дубль сменён носителем.

---

## 2. Сколько кода это стоило и сколько сэкономило

`git diff --numstat HEAD` по затронутым файлам (без плана):

| Файл | + | − | Нетто |
|---|---:|---:|---:|
| `src/ui/card/index.tsx` | 50 | 99 | −49 |
| `src/ui/card/card.styles.ts` | 1 | 1 | 0 |
| `src/ui/modal/index.tsx` | 51 | 45 | +6 |
| `src/ui/modal/modal.styles.ts` | 24 | 14 | +10 |
| `src/ui/sidebar/index.tsx` | 31 | 61 | −30 |
| `src/ui/sidebar/sidebar.styles.ts` | 36 | 73 | −37 |
| `src/ui/range-input/index.tsx` | 17 | 46 | −29 |
| `src/ui/range-input/range-input.styles.ts` | 30 | 14 | +16 |
| `src/ui/text/index.tsx` | 70 | 3 | +67 |
| `src/ui/type-utils.ts` (новый) | 26 | 0 | +26 |
| `src/pages/showcase/index.tsx` | 53 | 208 | −155 |
| `eslint.config.ts` | 1 | 1 | 0 |
| `src/ui/open-control.ts` | 1 | 1 | 0 |
| **Всего в дереве** | **385** | **566** | **−181** |

### 2.1. Что не в зачёт переезду (типы и проход Card)

**Наблюдение.** В том же дереве, но по решению шага 3з / 11в, не 8б:

- `PrefixedTextProps` + `resolvePrefixedTextProps` в `src/ui/text/index.tsx:97–146` (+67 строк нетто);
- `AllOrNone` / `DistributiveOmit` в новом `src/ui/type-utils.ts` (26 строк);
- перепись `CardTitleProps` / удаление `CardSubtitleProps` и локальных резолверов в `card/index.tsx` (основной объём −99);
- удаление `RangeInputTitleProps` (~25 строк) в пользу `PrefixedTextProps<'title'>`;
- `ModalAccessibleName` (`modal/index.tsx:76–78`) — обязательное имя `title | ariaLabel`, это доступность, не наследование;
- витрина: замена `resolveCardTitleProps` / `resolveCardSubtitleProps` на `resolvePrefixedTextProps`, снятие ручных `*WIDGET_TITLE_ID` — следствие прохода Card §11.7 и пакета текста.

**Вывод.** Крупное сжатие витрины (−155) и сжатие `card/index.tsx` (−49) переезду на `styled(Card)` не принадлежат. Без них нетто «стало меньше кода» по 8б не читается.

### 2.2. Что в зачёт переезду

**Наблюдение.**

- Modal JSX: две ветки `dialog > Card` → один `StyledModal`. Файл `modal/index.tsx` в сумме **вырос** (+6): вычитание ключей `DistributiveOmit` (8 ключей, `modal/index.tsx:88–97`), приведение `cardForward as Omit<…>` (`:123–126`), тип `StyledModalProps` (`modal.styles.ts:25–28`). Styled-узлов: 1 → 1 (переименование).
- Sidebar: слот + трек + Card → один `styled(Card)`. Styled-узлы: 4 → 3 (`StyledSidebar`, `StyledSidebarContent`, `StyledSidebarPanel`). Индекс −30, стили −37. Это главное численное сжатие 8б. Тип `SidebarCardTitleProps` ушёл; `CardForwardProps` стал короче за счёт `DistributiveOmit` (типы, не наследование). Приведение `restProps as CardForwardProps` осталось (`sidebar/index.tsx:155`).
- RangeInput: локальный `h2` снят (−12 JSX), `RangeInputTitleProps` снят (типы). Стили панели **выросли** (+16): обёртка Card плюс локальные `position` / `overflow` / `radius` / outline, которые раньше отдавал хелпер. Styled-узлов: 1 → 1.
- Card: в перечень тегов добавлены `aside` и `dialog` (`card/index.tsx:74`). Тело рисуется только при `children` (`:235`) — пункт плана 8б, дешёвый.
- eslint: `StyledModalDialog` → `StyledModal` как `dialog` (`eslint.config.ts`). Комментарий потребителя в `open-control.ts`.

**Вывод.** Чистый выигрыш строк от наследования Card — в основном Sidebar (−67 по двум файлам) за счёт схлопывания анимационных узлов, не заливки. Modal в сумме не сжался. RangeInput стили раздулись. Обёрточные типы и приведения появились именно там, где корень потребителя стал `styled(Card)` и публичный тип собирается вычитанием ключей Card.

---

## 3. Чем переезд сопротивляется

По каждому месту: разовая ошибка исполнителя или свойство подхода.

### 3.1. `as` у `styled(Card)` подменяет компонент, не тег

**Наблюдение.** `StyledModal` и `StyledSidebarPanel` — `styled(Card)` (`modal.styles.ts:66`, `sidebar.styles.ts:100`). Вызовы передают `as="dialog"` и `as="aside"` (`modal/index.tsx:180`, `sidebar/index.tsx:231`). Card сам принимает `as` и кладёт его на `StyledCard` (`card/index.tsx:217–223`).

Документация styled-components v4.3+ (пакет проекта — `^6.4.2`): `as` меняет то, что рендерит **обёртка**; чтобы донести смену тега до обёрнутого компонента, нужен `forwardedAs`. Прецедент в трекере: `styled(промежуточный компонент)` + `as` перестаёт рендерить промежуточный компонент, его разметка и стили внутреннего styled-узла не применяются ([issue 2953](https://github.com/styled-components/styled-components/issues/2953), [API: forwardedAs](https://styled-components.com/docs/api)).

В дереве `forwardedAs` нет нигде (`rg forwardedAs src` — пусто).

Следствие при текущем `as` у Modal: обёртка рендерит нативный `<dialog>` **вместо** Card. `showModal` и `ref` на диалоге живут. Шапка, ряд закрытия, `StyledCardBody`, заливка и радиус Card — нет. Проп `title` на нативном `<dialog>` становится HTML-атрибутом всплывающей подсказки, не заголовком Card.

RangeInput `as` не передаёт — этот капкан его не бьёт. ProfileMenu уже сидит на `styled(Card)` без смены тега (`profile-menu.styles.ts:60`, `profile-menu/index.tsx:175–194`) и капкана не касается: это рабочий прецедент обёртки.

**Вывод.** Ошибиться в имени пропа — ошибка исполнителя. То, что **каждый** потребитель со сменой тега обязан помнить `forwardedAs`, а канон §8.8 говорит только про `as` у самого примитива, — свойство подхода `styled(Card)` + полиморфный Card. План 8б писал «`<Card as="dialog">`» и не назвал `forwardedAs`.

### 3.2. `position: relative` у корня Card и модальный диалог

**Наблюдение.** `StyledCard` всегда пишет `position: relative` (`card.styles.ts:123`) — якорь абсолютного ряда действий. UA модального диалога (Chrome / HTML): `dialog:modal` / `dialog:-internal-dialog-in-top-layer` задаёт `position: fixed`, `overflow: auto`, `inset-block: 0`, `max-width` / `max-height`. Специфичность `dialog:modal` — (0, 1, 1); класс styled-components — (0, 1, 0). По каскаду UA `position: fixed` **побеждает** `position: relative` Card, если узел действительно `<dialog>` и открыт через `showModal`.

В `reset.ts` сброса `dialog` нет; сбрасывается только `[popover]` (`reset.ts:157–164`).

**Вывод.** Заявленный конфликт «relative перебивает fixed» по специфичности **не подтверждается** для настоящего `dialog:modal`. Это не повод считать переезд безопасным: при текущем `as` узел — диалог без Card, и relative вообще не применяется; при `forwardedAs` relative проигрывает UA, ряд действий якорится уже не так, как задуман Card (containing block может стать другим). Свойство подхода: корень Card несёт геометрию шапки, которая не обязана совпадать с геометрией хозяина верхнего слоя.

### 3.3. `overflow: hidden` у корня Card

**Наблюдение.** Card: `overflow: hidden` (`card.styles.ts:128`) — обрезка по скруглению. UA `dialog:modal`: `overflow: auto` при большей специфичности — на диалоге победит UA, обрезка Card не сработает. RangeInput сам пишет `overflow: hidden auto` на обёртке (`range-input.styles.ts:186`); при живом Card оба класса на одном узле, победитель — порядок инъекции styled-components, не контракт.

**Вывод.** Свойство подхода: обрезка и прокрутка принадлежат разным ролям (поверхность vs хозяин слоя) и на одном узле начинают спорить.

### 3.4. Первая строка шапки резервирует высоту под ряд действий

**Наблюдение.** `StyledCardHeaderFirstLine` всегда несёт `min-block-size` окна иконки `CARD_HEADER_ACTION_SIZE_PRESET` (`'normal'` → `minBlockSize` 40 → `2.5rem`, `card.styles.ts:166–171`, `presets.ts:41`). Ряд `IconButtonRow` рендерится всегда, даже с пустым `actions` (`card/index.tsx:226–234`, дефолт `[]` на `:160`). Комментарий прямо говорит: высота резервируется, «заголовок не смещается при добавлении и удалении действий».

У RangeInput `headerActions` нет. До переезда заголовок был обычным `Text` без резерва 40px.

**Вывод.** Свойство подхода и уже известная находка плана (`00-plan.md` шаг 8, `04/№6`). На потребителе без действий это не «разовый косяк», а обязательная цена шапки Card.

### 3.5. Шапка всегда над телом — заголовок RangeInput сменил место

**Наблюдение.** Card кладёт `header`, затем ряд, затем тело (`card/index.tsx:225–235`). В HEAD заголовок RangeInput стоял внутри `StyledRangeInputCustomSection` **после** списка пресетов. После переезда заголовок — шапка Card, то есть над пресетами.

**Вывод.** Свойство подхода. Композиция Card жёсткая; потребитель с другим порядком либо меняет продукт, либо не является Card.

### 3.6. Дефолт размера заголовка

**Наблюдение.** Card: `DEFAULT_CARD_TITLE_SIZE_PRESET = 'bold'` (`card/index.tsx:86`). RangeInput своего дефолта `titleSizePreset` не задаёт (`:424`, в деструктуризации без значения). До переезда `<Text sizePreset={titleSizePreset}>` при отсутствии пропа брал дефолт Text — `'normal'` (`text.styles.ts:102`). Выравнивание RangeInput по-прежнему центрирует (`DEFAULT_RANGE_INPUT_TITLE_ALIGN = 'center'`, `:136`) и уходит в Card — эта ось сохранилась.

**Вывод.** Свойство подхода: дефолты шапки Card становятся дефолтами всех обёрток. Смена `'normal'` → `'bold'` — видимое расхождение, не учтённое в «вид не меняется» шага 8б.

### 3.7. Публичный тип потребителя вычитанием ключей Card

**Наблюдение.** Modal: `DistributiveOmit<ComponentProps<typeof Card>, 'aria-label' | 'aria-labelledby' | 'as' | 'children' | 'headerActions' | 'ref' | keyof ShowBorderProps>` плюс свои поля (`modal/index.tsx:88–104`). Sidebar: `DistributiveOmit<…, 'as' | 'children' | 'headerActions' | 'id' | keyof SidebarStyleProps>` (`sidebar/index.tsx:93–96`). Плюс приведения на спреде (`modal/index.tsx:123–126`, `sidebar/index.tsx:155`). `StyledModalProps` отдельно предупреждает, что обычный `Omit` схлопывает ветки заголовка (`modal.styles.ts:21–28`).

В HEAD у Modal уже был `CardForwardProps` через `Omit` + обратная сборка title/subtitle. Переезд заменил прокладку на вычитание из Card, но прокладка не исчезла — она стала длиннее списком запрещённых ключей (`as`, `ref`, aria-имя, `headerActions`).

**Вывод.** Свойство подхода: чем больше Card «хозяин», тем больше публичный тип потребителя — негатив фотографии Card. `DistributiveOmit` ценен сам по себе (шаг 3з); длина списка вычитания — цена наследования.

### 3.8. Прочие найденные точки сопротивления

**Наблюдение.**

- RangeInput ушёл с `getOpenControlStackedPanelStyles`, DateRangeInput остался. Два соседних контрола, одна роль «стековая панель», два носителя хрома.
- Listbox, Combobox, панели add/edit Table по-прежнему на `getOpenControlPanelStyles` / `getAnchoredPanelStyles`. После 8б Card **не** единственный источник поверхности даже внутри `src/ui`.
- Toolbar шаг 8б сам отвёл в сторону (`00-plan.md`).
- ProfileMenu — `styled(Card)` без смены тега, `role="dialog"`, `position="fixed"` layout-пропом (`profile-menu/index.tsx:189–192`). Это уже работающая модель «Card остаётся Card, обёртка дописывает слой». Modal/Sidebar выбрали другую: сменить тег корня.
- Узкий экран Sidebar пишет на панель `position: absolute` (`sidebar.styles.ts:243`). Это бьётся с `position: relative` Card той же схемой «второй класс на том же узле».
- Карта jsx-a11y считает `StyledModal` тегом `dialog`. При текущем `as` это случайно верно (Card подменён). При `forwardedAs` линтер видит обёртку, а дерево рисует Card→`StyledCard as=dialog` — карта по-прежнему сходится по имени `StyledModal`, но правило смотрит JSX вызывающего кода, не внутренний тег Card.

**Вывод.** Подход не замыкает заявленный тезис «всё с заливкой — Card». Он создаёт третий путь рядом с генераторами панелей и с Card-ребёнком.

---

## 4. Что именно теряется в модалке

Проверка по коду, не по общему рассуждению.

### 4.1. Остаётся ли корнем нативный `<dialog>`

**Наблюдение.** Задумка: Card с `as="dialog"` (`card/index.tsx:74`, `217–223`). Факт вызова: `as` стоит на `styled(Card)` (`modal/index.tsx:180`). По контракту styled-components корнем становится `<dialog>`, но **минуя** Card. Нативный тег есть. Компонент Card на этом пути не монтируется.

### 4.2. `showModal`, верхний слой, ловушка фокуса, Escape, `::backdrop`

**Наблюдение.** Эффект по-прежнему зовёт `dialog.showModal()` / `dialog.close()` и ставит `closedby="any"` (`modal/index.tsx:137–157`). `onClose` висит на корне (`:183`). `::backdrop` пишет `getModalStyles` (`modal.styles.ts:43–48`). Эти API привязаны к элементу `<dialog>` и к `showModal()`, не к Card.

При текущем `as` (Card подменён): `ref` попадает на настоящий `<dialog>`, `showModal` работает, верхний слой, нативная ловушка Tab, Escape и backdrop — нативные. Потеряна **разметка Card** (шапка, закрытие, отступы, заливка), не платформа диалога.

При исправлении на `forwardedAs` (задумка плана): React 19 отдаёт `ref` обычным пропом; Card не `forwardRef`, но кладёт `...rest` на `StyledCard` (`card/index.tsx:223`), значит `ref` доходит до `styled.div as="dialog"`. `showModal` должен работать. HTML-поведение диалога от наследования Card само по себе не отключается.

### 4.3. UA-стили диалога при наложении стилей Card

**Наблюдение.** HEAD уже перекрывал UA: `padding: 0`, `background: transparent`, `border: none` на `styled.dialog`, оформление нёс ребёнок Card. После переезда `border: none` остался на обёртке (`modal.styles.ts:70`); padding и background должен нести Card. UA `dialog { padding: 1em; background: Canvas; border }` проигрывает классу по специфичности — это намеренно. UA `dialog:modal { position: fixed; overflow: auto; max-width/max-height }` **не** проигрывает классу Card — см. §3.2–3.3. `max-inline-size` / `max-block-size` обёртки (`modal.styles.ts:67–68`) — логические свойства; UA задаёт физические `max-width` / `max-height`. Они не один каскадный слот. Такое же напряжение было и в HEAD на `styled.dialog`.

### 4.4. Нативное поведение потеряно по существу подхода или из-за `as`

**Вывод.** Гипотеза «с модалкой потеряли нативное поведение» **в той формулировке не подтверждается**.

- Текущая ошибка `as` **сохраняет** нативный `<dialog>` и его API и **ломает** Card.
- Подход с `forwardedAs` **сохраняет** `showModal`, верхний слой, ловушку, Escape, `::backdrop`, если `ref` доходит (в React 19 — да).
- Что подход реально смешивает — роль хозяина модальности и роль поверхности на одном узле. Это не отмена HTML-диалога, а отказ от разделения, которое в HEAD уже было и работало: диалог = платформа, Card = поверхность. Канон витрины (`canon-ui-checklist.md`, distill): «центральная модалка — `<dialog>` (`@ui/modal`), не portal-div». Тег сохраним. Разделение ролей — нет.

Открытая находка чеклиста №10 (фокус `showModal()` на кнопке закрытия, потому что ряд действий всё ещё первый фокусируемый) переездом **не закрыта**: ряд по-прежнему перед телом (`card/index.tsx:226–235`). План 8б обещал решить это вместе с переводом на `Card as="dialog"`. Код этого не делает.

---

## 5. Альтернатива без наследования компонента

Вариант: Modal, Sidebar и панель RangeInput оставляют свои корни; общее берут генераторами и узлами.

### 5.1. Что останется продублированным, а что нет

**Наблюдение.** Так **уже было** в HEAD для Modal и Sidebar, и так **уже есть** у DateRangeInput / Listbox / Combobox / Table.

| Слой | Нужен ли новый код | Останется ли дубль |
|---|---|---|
| Заливка + рамка + тень | нет, `getSurfaceBackgroundColor` + `getBorderStyles`; при желании — обещанный `getSurfaceChromeStyles` (`04-shells.md`) | нет |
| Скругление | нет, `resolveBlockRadius` | нет |
| Отступ 16 | две константы `CARD_PADDING` и `OPEN_CONTROL_PANEL_PADDING` — кандидат на одну, не на компонент | литерал один, имён два |
| Хром привязанной панели | нет, `getAnchoredPanelStyles` / `getOpenControlStackedPanelStyles` | нет у RangeInput, если вернуть хелпер |
| Шапка (заголовок, подзаголовок, ряд) | да, если вынести из Card маленький `CardHeader` / генератор шапки | иначе Modal/Sidebar продолжают звать **Card-ребёнка**, и шапка не дублируется вовсе |
| Доступное имя | уже в Card при корне с ролью; у отдельного `<dialog>` / `<aside>` — либо оставить ручную связь, либо вынести хелпер `resolveSurfaceLabelledBy(title, titleId, hasRole)` из `card/index.tsx:175–179` | один хелпер, не компонент |
| Сетка тела | `StyledCardBody` или `display: grid` на хозяине | тонкий дубль из двух деклараций, не повод наследовать Card |

**Вывод.** При «свои корни + генераторы + Card как ребёнок там, где нужна шапка» **продублированного хрома поверхности почти нет** — его не было и в HEAD у Modal/Sidebar. Выносить имеет смысл только шапку (если появится четвёртый потребитель без Card) и константу отступа 16. RangeInput в этом варианте возвращается к хелперу, который DateRangeInput и так зовёт.

### 5.2. Сравнение по трём осям

| Ось | Наследование `styled(Card)` (текущий 8б) | Свои корни + генераторы + Card-ребёнок |
|---|---|---|
| Объём кода | Sidebar сжимается за счёт слота/трека. Modal не сжимается. RangeInput стили растут. Типы обёрток растут | Modal/Sidebar — как HEAD, уже написано. RangeInput — откат к хелперу, минус локальные radius/outline. Вынос `getSurfaceChromeStyles` — шаг 8, не 8б |
| Места правки при смене оформления поверхности | Card + все обёртки, которые **перебивают** дефолты (RangeInput радиус/overflow, Modal border/max-size, Sidebar position). Плюс генераторы панелей, которые 8б не тронул: DateRange, Listbox, Combobox, Table | Одно место на слой: генератор хрома / Card-ребёнок. Хозяева (`dialog`, `aside`, popover-панель) не трогаются |
| Число обходов | `forwardedAs`, спор overflow/position с UA, резерв высоты шапки, жёсткий порядок шапка→тело, дефолт `'bold'`, `DistributiveOmit` длинного списка, два носителя хрома у Range/DateRange | Обходов платформы нет: `<dialog>` остаётся `styled.dialog`, панель — `styled.div` + хелпер. Card не знает про `showModal` и якорь |

---

## 6. Цена каждого исхода прямо сейчас

Изменения не закоммичены. Откат файлов целиком (`git checkout -- src/ui/modal …`) **нельзя**: в тех же файлах лежат ценные и независимые от 8б правки типов и доступности.

### 6.1. Довести переезд до конца

Осталось по фактам этого дерева:

1. Заменить `as` на `forwardedAs` у Modal и Sidebar (два вызова). Свойство подхода, не разовая правка «навсегда»: любой новый `styled(Card)` со сменой тега повторит развилку.
2. Проверить руками Modal: `showModal`, центрирование, backdrop, Escape, фокус. Находка №10 чеклиста (фокус на Close) сама не закроется.
3. Решить видимые смены RangeInput: место заголовка, `'bold'` вместо `'normal'`, резерв 40px без действий. Это продукт, не одна строка.
4. Либо мигрировать DateRangeInput (и дальше Listbox/Combobox/Table) на Card — иначе тезис «единственный источник» ложен; либо сузить тезис в каноне. Миграция панелей open-control — отдельный высокий риск (popover, CSS anchor, форма контрола).
5. Снять или обосновать спор `overflow` / `position` на диалоге и на узкой Sidebar.
6. Сузить списки `DistributiveOmit` и приведения, если после `forwardedAs` что-то из вычитания окажется лишним.

Оценка: не «починить `as` и готово». Пункты 3–4 — открытые продуктовые решения. Пункт 4 по объёму больше самого 8б.

### 6.2. Откатить переезд целиком

Вернуть: `styled.dialog` + Card-ребёнок; `aside` + track + Card-ребёнок; `styled.div` + `getOpenControlStackedPanelStyles` + локальный `h2` (или тот же `PrefixedTextProps` на Text).

Сохранить: `type-utils.ts`, `PrefixedTextProps`, `titleAs`, авто-`aria-labelledby` у Card, `ModalAccessibleName`, тело Card только при `children`, правки витрины на `resolvePrefixedTextProps`.

Цена: хирургический откат внутри уже смешанных файлов (не `checkout` файла целиком). Анимация Sidebar вернётся к двум узлам — это +~70 строк, которые 8б реально снял. Типы не откатываются.

### 6.3. Откатить частично

Оставить Card основой там, где нет смены тега и нет чужой композиции; вернуть собственные корни там, где сопротивление системное.

Конкретно по фактам:

- **ProfileMenu** — не трогать: `styled(Card)` без `as` уже сидел и не часть 8б.
- **Sidebar** — единственное место, где наследование сняло два реальных узла и нет UA-диалога. Имеет смысл оставить **только если** починить `forwardedAs` и принять, что анимация живёт на поверхности. Иначе вернуть `aside` как хозяина колонки, Card — ребёнок (как HEAD).
- **Modal** — вернуть `styled.dialog` + Card-ребёнок. Платформенный корень и поверхность снова разделены. `ModalAccessibleName` оставить.
- **RangeInput** — вернуть стековый хелпер. Заголовок — локальный Text или крошечный общий узел шапки, не Card целиком. Иначе DateRange и Range снова расходятся, а композиция и дефолты Card ломают панель.

---

## Находки (дефекты текущего дерева, не вердикт об исходе)

### 15-1 · `as` на `styled(Card)` подменяет Card
- **Класс:** канон
- **Файлы:** `src/ui/modal/index.tsx:180`, `src/ui/sidebar/index.tsx:231`, `src/ui/modal/modal.styles.ts:66`, `src/ui/sidebar/sidebar.styles.ts:100`, `src/ui/card/index.tsx:217–223`
- **Якорь:** §8.8 (проп смены тега — `as` у примитива); документация styled-components, `forwardedAs`
- **Что в коде:** обёртка получает `as`, Card `as` не видит.
- **Как должно быть:** либо `forwardedAs` на обёртке, либо не оборачивать Card, а менять тег на самом Card / на своём `styled.dialog` / `styled.aside`.
- **Потребители:** Modal, Sidebar. RangeInput и ProfileMenu `as` на обёртку не ставят. В `caption-downloader` / `yt-lodger` потребителей этих файлов нет.

### 15-2 · Заголовок RangeInput сменил место, размер и высоту строки
- **Класс:** вопрос
- **Файлы:** HEAD `range-input/index.tsx` (Text в `StyledRangeInputCustomSection`); текущий `range-input/index.tsx:473–483, 705–715`; `card/index.tsx:86, 166–171, 196–215`
- **Якорь:** шаг 8б «вид не меняется ни в одном»; §8.2 дефолт один раз
- **Что в коде:** заголовок над пресетами, дефолт `'bold'`, резерв 40px под отсутствующие действия.
- **Как должно быть:** решить продуктом: либо это новая композиция панели, либо RangeInput не Card.
- **Потребители:** витрина RangeInput, продуктовые вызовы с `title`.

### 15-3 · Тезис «Card — единственный источник поверхности» после 8б ложен
- **Класс:** вопрос
- **Файлы:** `date-range-input.styles.ts:106`, `listbox.styles.ts` / `combobox.styles.ts` (`getOpenControlPanelStyles`), `table.styles.ts` (`getAnchoredPanelStyles`), `open-control.ts:403–417`
- **Якорь:** формулировка шага 8б в `00-plan.md`
- **Что в коде:** те же заливка/рамка/тень/радиус/отступ по-прежнему рисуют генераторы у четырёх панелей.
- **Как должно быть:** либо сузить правило («Card — блок с шапкой, панели open-control — генератор»), либо продолжать миграцию далеко за трёх названных потребителей.
- **Потребители:** все open-control и Table.

## Дубли и вынос

Поверхность (заливка, рамка, тень, радиус, отступ 16) уже вынесена в генераторы. Повтор, который 8б пытался лечить у Modal/Sidebar, в HEAD был вложенностью хозяин+Card, не копией деклараций. Имеет смысл выносить не компонент-предок, а при желании: (1) `getSurfaceChromeStyles` — уже в плане шага 8; (2) константа отступа поверхности 16; (3) хелпер `aria-labelledby` для корня с ролью — если Modal снова станет `styled.dialog` и не захочет дублировать `useId`.

## Кандидаты в канон

1. **`styled(Примитив)` со сменой тега.** Если примитив сам принимает `as`, обёртка передаёт тег через `forwardedAs`. Имя `as` на обёртке запрещено: оно подменяет примитив. Файл: `project.mdc` §8.8.
2. **Граница Card.** Card — блок с опциональной шапкой, который вызывающий код кладёт **внутрь** хозяина платформы (`dialog`, `aside`, popover-панель) либо стилизует обёрткой **без** смены тега (эталон ProfileMenu). Делать Card самим `<dialog>` / якорем popover — не правило набора. Это сужение шага 8б, не его закрепление.
3. **Возможности платформы (обязательный пункт).** Модальность, верхний слой, ловушка фокуса, Escape, `::backdrop` — нативный `<dialog>` + `showModal()` ([HTML dialog](https://html.spec.whatwg.org/#the-dialog-element), [CloseWatcher / `closedby`](https://html.spec.whatwg.org/#close-watchers)). В HEAD это уже так. Склейка с Card не даёт ни одного из этих умений и требует обходить UA `dialog:modal`. Панели open-control уже отдали слой нативному `popover` (шаг 2б). Повторять тот же урок на `<dialog>` не нужно.

## Итог

Находок: 1 канон, 2 вопроса, 3 кандидата в канон.

---

## Рекомендация

**Исход: откатить частично.**

Вернуть собственные корни Modal (`styled.dialog` + Card-ребёнок) и панели RangeInput (`styled.div` + `getOpenControlStackedPanelStyles` + свой заголовок). Наследование `styled(Card)` со сменой тега у Sidebar не дожимать вместе с ними: либо починить `forwardedAs` и оставить схлопнутую панель как отдельное решение про анимацию, либо вернуть `aside`+трек — это уже не вопрос поверхности. Типы (`PrefixedTextProps`, `DistributiveOmit`, `ModalAccessibleName`, `titleAs`, автоимя Card) не откатывать.

Решающие доводы:

1. У Modal и Sidebar заливка, рамка, тень, радиус, отступы и шапка **уже** были Card-ребёнком. Переезд не снял повтор хрома. Он склеил хозяина платформы с поверхностью. У Modal это три сброшенных декларации против нативного `<dialog>`. Склеивать незачем.
2. Гипотеза про «потеряли нативное поведение» в узком смысле неверна: текущий `as` ломает Card и оставляет диалог; `forwardedAs` оставит оба API. Верно другое: подход отменяет разделение ролей, которое платформа и HEAD уже дали даром. Это хуже, чем «забыли `showModal`».
3. RangeInput ушёл с живого общего генератора, который DateRangeInput всё ещё зовёт, и написал радиус/outline/`position` заново. Плюс сменились место заголовка, его размер и высота строки. Это не дедупликация, а смена носителя с побочным продуктовым эффектом.
4. Тезис «Card — единственный источник поверхности» после 8б всё равно ложен: Listbox, Combobox, DateRange, Table остаются на генераторах. Довести тезис до конца — мигрировать все панели open-control, что план 8б не заказывал и для Toolbar сам отверг.
5. Альтернатива «генератор хрома + Card как ребёнок там, где нужна шапка» в репозитории уже работает и не требует `forwardedAs`, спора с `dialog:modal` и вычитания половины пропсов Card.

Что говорит **против** этой рекомендации:

- Sidebar на `styled(Card)` реально снял два узла и ~67 строк; частичный откат Sidebar вернёт эту вложенность.
- Довести Modal одной заменой `as` → `forwardedAs` дешевле, чем руками разводить диалог и Card, если визуально диалог после починки встанет как в HEAD.
- Два способа применения Card (ребёнок vs корень обёртки) учить сложнее, чем одно правило «всё — Card», даже если второе правило на фактах не сходится.
- ProfileMenu уже живёт на `styled(Card)` без смены тега; частичный откат оставляет этот прецедент и запрещает тот же приём со сменой тега — границу придётся записать в канон, иначе следующий проход повторит 8б.
- Незакоммиченное дерево смешано с типами: частичный откат нельзя сделать `checkout` файла, нужна аккуратная правка внутри Modal/RangeInput.

**Подпись:** аудитор Cursor Grok 4.6

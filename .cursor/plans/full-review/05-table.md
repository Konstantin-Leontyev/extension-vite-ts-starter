# Ревью: `src/ui/table` (целиком)

**Проект:** extension-vite-ts-starter
**Область:** пакет `src/ui/table` и все подмодули (`table-cell`, `table-group-cell`, `table-nested-cell`, `table-inline-field`, `table-member-prefix`, `column-sizing`, styles/barrel).
**Примитивы** (`checkbox`, `icon`, `text`, `scroll-port`) читались как эталон; замечания по ним не выносятся.
**Код не правился.** Линтеры не гонялись.

---

## ЗАМЕЧАНИЯ

1. **[UI · §8.2 / §8.4]** `table.styles.ts:269`, `305`, `359`, `380`, `470` — `StyledTableHead` / `StyledTableFoot` / `StyledTableBody` / `StyledTableRowPanelTable` красят вид ячеек селекторами `& th`, `& td`, `& tr:last-child td`, `[data-add-header] th`, `[data-add-footer] td` (заливка, швы).
   **Как должно быть:** хром ячейки задаётся осями самого `TableCell` (или каналом на `tr` там, где фон — свойство строки), без CSS родителя на чужой корень.
   **Якорь:** §8.2, §8.4.

2. **[UI · §10 полумагия пропа]** `index.tsx:872–880`, `902–908`, `841–859` — при `checkable` без `rowCheckboxColumnKey` шапка колонки выбора рендерит только скрытый «Select»; `renderKeywordColumnHeader` (select-all, «+», bulk) вызывается только при совпадении ключа.
   **Как должно быть:** полный эффект режима или явный контракт «отдельная колонка = только рядные чекбоксы».
   **Якорь:** §10.

3. **[UI · §7.6]** `table.styles.ts:82` / `index.tsx:1247–1254` — `getTableTextSize` не реэкспортируется из barrel.
   **Как должно быть:** мост размера текста в публичном API, как у Tag и Spinner.
   **Якорь:** §7.6.

4. **[UI · ось-двойник]** `table.styles.ts:49` (`TableSizePreset = SizePreset`), `index.tsx:102` (`TableAlign = TableCellAlign`).
   **Как должно быть:** наружу канонический тип; алиас — только при реальном расширении ряда.
   **Якорь:** глоссарий; правило про ось-двойник.

5. **[UI · §8.2 / §1.3]** `index.tsx:661`, `667`, `668`, `TableHeaderLeadSpacers:384–385` — литералы `= false` в деструктуризации вместо именованных дефолтов.
   **Якорь:** §8.2, §1.3.

6. **[UI · §8.1 + КОММЕНТАРИИ]** `table-nested-cell.styles.ts:18–35`, `table-nested-cell/index.tsx:30` — `nestDepth: number` при поддержке только `1 | 2`; комментарий про «удвоенный отступ ячейки» не сходится с фиксированными `24` / `48`.
   **Якорь:** §8.1; `comments.mdc` §1.7.

7. **[UI · a11y + КОММЕНТАРИИ]** `table-member-prefix/index.tsx:33–34` — `aria-hidden` стоит до `{...props}` и может быть перебит.
   **Как должно быть:** `{...props}`, затем принудительный `aria-hidden="true"`.
   **Якорь:** `comments.mdc` §1.7; §11.

8. **[UI · §10 мёртвая декларация]** `table.styles.ts:522` — `border-block-end: none` у `StyledTablePanelErrorCell` не меняет действующее значение.
   **Якорь:** §10.

9. **[UI · §10 дубль действующего]** `table-member-prefix.styles.ts:38` — `flex-shrink: 0` повторяет правило родителей (`> * { flex-shrink: 0 }`).
   **Якорь:** §10.

10. **[UI · distill flex-комментарий / §5.1]** `table-group-cell.styles.ts:22–28`, `table-nested-cell.styles.ts:42–52` — `inline-flex` без обоснования «почему не grid».
    **Якорь:** §5.1; distill.

11. **[UI · §2.5]** `table.styles.ts:529` — `TABLE_HEADER_MARK_BLOCK_SIZE` объявлен в хвосте у spacer, хотя это осевая константа размера.
    **Якорь:** §2.5.

12. **[UI · §14 / §10 модель ховера]** `table.styles.ts:372–377` — `& tr:hover` красит всю строку локальным `color-mix` с собственным процентом; три модели §10 «data-row highlight» не покрывают.
    **Якорь:** §10, §14. → решение пользователя.

13. **[UI · distill Table nested head]** `table-group-cell/index.tsx:40–44` vs чеклист: distill требует `TableNestedCell` + expander, пакет документирует `TableGroupCell` + `TableMemberPrefix`.
    **Якорь:** distill. → решение пользователя.

14. **[UI · §8.1]** `table-inline-field.styles.ts:26` — `textAlign?: CSSProperties['textAlign']` шире и расходится с `TableCellAlign` в том же пакете.
    **Якорь:** §8.1, §7.6.

### Негатив (не дефект)

15. `table-inline-field.styles.ts:55–67` — поле опирается на `getTextProperties`, Input не пересобирает; снятие outline оправдано хромом панели. Локальной пересборки Input / ScrollPort / Checkbox / Icon / Text нет.

---

## Дубли и вынос

| # | Где | Что | Куда выносить |
|---|-----|-----|----------------|
| D1 | `table.styles.ts:266–316` ≈ `466–478` | Заливка и шов шапки/подвала трижды | `getTableSectionEdgeStyles({ side, cellSel })` |
| D2 | `table.styles.ts:232–238` ≈ `497–504` | База таблицы: ширина, `table-layout`, `border-collapse` | общий `getTableRootStyles(tableLayout)` |
| D3 | `table-group-cell.styles.ts:27–41` ≈ `table-nested-cell.styles.ts:51–67` | Один inline-flex кластер; nested добавляет только indent | `getTableInlineClusterStyles()` |
| D4 | `table-cell.styles.ts:118–128` vs D3 | Lead близок, но другая модель flex у детей | кандидат на общий кластер с параметром стратегии |
| D5 | `index.tsx:591–631` | `applyTableAddPanelPosition` ≈ `applyTableEditPanelPosition` | `applyTableRowPanelPosition(anchor, panel, { rows, errorAttr })` |
| D6 | `index.tsx:914–977` | `renderAddCells` ≈ `renderEditCells` | `renderPanelCells({ renderCell, reserveAddButton })` |
| D7 | `table.styles.ts:592–605` | KeywordBar и Trailing уже делят общий хелпер | образец выноса, замечаний нет |
| D8 | `table-member-prefix.styles.ts:38` | см. замечание 9 | снять дубль |

Проверено по телу хелперов: `getBorderStyles`, `getPortalPanelStyles`, `getEllipsisStyles`, `getTextProperties`, `Checkbox`/`Icon`/`ScrollPort`/`FieldError` — локальных пересборок нет. Spacer имеет JSDoc-инвариант, по distill замечание не ставится.

---

## Кандидаты в канон

1. **Раздел «Дубли»** в общем чеклисте репозитория.
2. **Исключение spacer для Table** — поднять из distill в §5.2–§5.3.
3. **Модель hover строки таблицы** — исключение или четвёртая модель в §10, роль заливки в §14.
4. **Контракт `checkable` + отдельная колонка** — полный эффект или сужение.
5. **Nested head:** выровнять distill с фактическим API пакета.
6. **`nestDepth` и indent** — юнион глубин; шкала без ложной привязки к padding ячейки.

---

## Требует решения пользователя

1. Отдельная колонка чекбокса: восстанавливать select-all, «+» и bulk или сузить контракт.
2. Вложенная сворачиваемая голова: оставить `TableGroupCell` + prefix и поправить distill, или перейти на `TableNestedCell` + expander.
3. `tr:hover`: оставить как исключение канона или менять модель и заливку.
4. Дефолт `textAlign` ячейки `center` — норма или менять на `start`.
5. Алиасы `TableSizePreset` / `TableAlign` — удалять с каскадом или легитимировать.

---

## ОК

- Скролл через `ScrollPort`, панели через `AnchoredPortal` + `getPortalPanelStyles`, ошибки через `FieldError`, mark-действия через полиморфный `Icon`, выбор через `Checkbox` — без локальных копий механики.
- `getTableLeadTrailRowStyles` вынесен и переиспользован.
- `column-sizing.ts` как утилита вызывающего кода уместна; замер согласован с `@ui/text`.

---

## Итог

Требуется исправление замечаний 1–14 (п. 15 — проверенный негатив). Критичны для контракта: 2 (неполный эффект separate-checkbox), 1 (лестница владения на ячейках), 6 и 13 (nest API против комментариев и distill). Дубли D1–D6 — вынос внутри пакета без смены публичного поведения.

**Подпись:** Ревьюер Cursor Grok 4.5 (project-reviewer)

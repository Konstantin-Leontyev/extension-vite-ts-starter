/**
 * Файл: `src/ui/table/table.styles.ts`
 * Определяет внешний вид компонента Table.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TableStyleProps` и `TableSizePreset`
 * 2. Хранить габарит бокса Checkbox / Icon `tiny` в `TABLE_HEADER_MARK_BLOCK_SIZE`
 *    для спейсера выравнивания в шапке
 * 3. Предоставить функцию `getTableTextSize`, а также дефолты `DEFAULT_TABLE_SIZE_PRESET`,
 *    `DEFAULT_TABLE_SHOW_BORDER`, `DEFAULT_TABLE_HOVER_HIGHLIGHT` и `DEFAULT_TABLE_STRIPED`
 * 4. Предоставить styled-узлы `StyledTableClip`, `StyledTable`, `StyledTableCol`,
 *    `StyledTableHead`, `StyledTableFoot`, `StyledTableBody`, `StyledTableRow`,
 *    `StyledTableRowPanel`, `StyledTableRowPanelTable`,
 *    `StyledTablePanelErrorCell`, `StyledTableHeaderMarkSpacer`,
 *    `StyledTableHeaderKeywordBar` и `StyledTableCellTrailing`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 * 6. Реэкспортировать `computeTableColumnInlineSizes` и тип `TableColumnSizeConfig`
 *
 * Потребители:
 *  - `src/ui/table/index.tsx` — собирает компонент Table и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { getPortalPanelStyles } from '@ui/anchored-portal';
import { getBorderStyles } from '@ui/border';
import { checkboxSizePresets } from '@ui/checkbox';
import { type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  getTextSize,
  resolveBlockRadius,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { resolveColorMix } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * TableSizePreset — представляет размерный ряд таблицы.
 * Совпадает с каноническим `SizePreset` контролов проекта.
 */
export type TableSizePreset = SizePreset;

/**
 * DEFAULT_TABLE_SIZE_PRESET — задаёт размер таблицы по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
export const DEFAULT_TABLE_SIZE_PRESET: TableSizePreset = DEFAULT_SIZE_PRESET;

/**
 * DEFAULT_TABLE_SHOW_BORDER — задаёт показ рамки таблицы по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
export const DEFAULT_TABLE_SHOW_BORDER = true;

/**
 * DEFAULT_TABLE_HOVER_HIGHLIGHT — задаёт подсветку строк при наведении по умолчанию.
 * Используется, когда вызывающий код не передал проп `hoverHighlight`.
 */
export const DEFAULT_TABLE_HOVER_HIGHLIGHT = true;

/**
 * DEFAULT_TABLE_STRIPED — задаёт чередование фона строк по умолчанию.
 * Используется, когда вызывающий код не передал проп `striped`.
 */
export const DEFAULT_TABLE_STRIPED = true;

/**
 * getTableTextSize — возвращает размер текста ячеек по `sizePreset`.
 * Подставляет `DEFAULT_TABLE_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер Table
 * @returns метка размера текста из `TextSizePreset` для текста ячеек
 */
export function getTableTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_TABLE_SIZE_PRESET);
}

/**
 * TABLE_EDGE_BORDER_WIDTH — задаёт толщину рамки шапки и подвала таблицы.
 * Используется в `StyledTableHead`, `StyledTableFoot` и строках add-панели.
 */
const TABLE_EDGE_BORDER_WIDTH = '2px';

/**
 * TABLE_HEAD_FILL_MIX_PERCENT — задаёт долю цвета рамки в смеси заливки шапки и подвала.
 * Подбирает приглушённый фон относительно `surface` Card.
 */
const TABLE_HEAD_FILL_MIX_PERCENT = 22;

/**
 * TABLE_STRIPE_FILL_MIX_PERCENT — задаёт долю `default` в смеси заливки чётной строки.
 * Слабый сдвиг, чтобы полосы не спорили с наведением.
 */
const TABLE_STRIPE_FILL_MIX_PERCENT = 3;

/**
 * TABLE_ROW_HOVER_FILL_MIX_PERCENT — задаёт долю `primary` в смеси заливки строки при наведении.
 */
const TABLE_ROW_HOVER_FILL_MIX_PERCENT = 6;

/**
 * resolveTableHeadFill — возвращает приглушённую заливку шапки и подвала.
 * Контрастирует с телом таблицы на поверхности Card.
 *
 * @param theme текущая тема
 * @returns значение для CSS-свойства `background-color`
 */
function resolveTableHeadFill(theme: AppTheme): string {
  return resolveColorMix(
    theme.colors.border,
    theme.colors.surface,
    TABLE_HEAD_FILL_MIX_PERCENT
  );
}

/**
 * resolveTableStripeFill — возвращает заливку чётной строки тела при `striped`.
 *
 * @param theme текущая тема
 * @returns значение для CSS-свойства `background-color`
 */
function resolveTableStripeFill(theme: AppTheme): string {
  return resolveColorMix(
    theme.colors.default,
    theme.colors.surface,
    TABLE_STRIPE_FILL_MIX_PERCENT
  );
}

/**
 * resolveTableRowHoverFill — возвращает заливку строки при наведении.
 *
 * @param theme текущая тема
 * @returns значение для CSS-свойства `background-color`
 */
function resolveTableRowHoverFill(theme: AppTheme): string {
  return resolveColorMix(
    theme.colors.primary,
    theme.colors.surface,
    TABLE_ROW_HOVER_FILL_MIX_PERCENT
  );
}

/**
 * TableStyleProps — представляет пропсы стилизации Table и layout-пропсы.
 *
 * @property hoverHighlight — включает подсветку строки при наведении
 * @property showBorder — включает рамку и заливку `surface` вокруг таблицы. Собственный
 *   проп Table, не пакет `BorderProps`
 * @property sizePreset — размер компонента
 * @property striped — включает чередование фона чётных строк тела
 */
export type TableStyleProps = LayoutProps & {
  hoverHighlight?: boolean;
  showBorder?: boolean;
  sizePreset?: TableSizePreset;
  striped?: boolean;
};

/**
 * getTableClipStyles — возвращает CSS-правила для узла `StyledTableClip`:
 * рамку без тени и заливку `surface` при включённом `$showBorder`.
 *
 * Как работает:
 * 1. Берёт тему и флаг `$showBorder`
 * 2. Кладёт рамку без тени через `getBorderStyles` с `showShadow` равным `false`
 * 3. При включённой рамке добавляет заливку `surface`
 * 4. Склеивает правила через перенос строки
 *
 * @param props флаг рамки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTableClipStyles(props: { $showBorder?: boolean; theme: AppTheme }): string {
  const theme = getTheme(props);
  const showBorder = props.$showBorder ?? DEFAULT_TABLE_SHOW_BORDER;
  const styles = [getBorderStyles(theme, showBorder, false)];

  if (showBorder) {
    styles.push(`background-color: ${theme.colors.surface};`);
  }

  return styles.join('\n');
}

/**
 * StyledTableClip — задаёт обёртку обрезки углов компонента Table.
 * Базируется на `<div>` и принимает проп `$showBorder`.
 *
 * Встроенные стили:
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `overflow: hidden` — обрезает по своей границе вместе со скруглением
 *  - `border-radius` — скругление по канону формы и размера контролов
 *
 * Генерация стилей:
 *  - `getTableClipStyles` — рамка без тени и заливка `surface` при `$showBorder`
 *
 * При включённой рамке хром лежит на этом узле, без отдельной обёртки:
 * ScrollPort остаётся корнем скролла, отступ под трек скроллбара — в padding Card.
 */
export const StyledTableClip = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$showBorder',
})<{ $showBorder?: boolean }>`
  min-inline-size: 0;
  overflow: hidden;
  border-radius: ${resolveBlockRadius(
    DEFAULT_SHAPE_PRESET,
    getMinBlockSize(DEFAULT_SIZE_PRESET)
  )};
  ${(props) => getTableClipStyles(props)}
`;

/**
 * StyledTable — задаёт нативную таблицу компонента Table.
 * Базируется на `<table>` и принимает проп `tableLayout`.
 *
 * Встроенные стили:
 *  - `inline-size: 100%` — таблица занимает ширину контейнера
 *  - `table-layout` — режим раскладки колонок; по умолчанию `auto`
 *  - `border-collapse: collapse` — общие границы ячеек без зазоров
 *
 * При `table-layout: fixed` ширины колонок берутся из `colgroup` и не зависят
 * от данных: нет скачка ширины при смене содержимого.
 */
export const StyledTable = styled.table.withConfig({
  shouldForwardProp: (prop) => prop !== 'tableLayout',
})<{ tableLayout?: 'auto' | 'fixed' }>`
  inline-size: 100%;
  table-layout: ${(props) => props.tableLayout ?? 'auto'};
  border-collapse: collapse;
`;

/**
 * StyledTableCol — задаёт колонку `colgroup` компонента Table.
 * Базируется на `<col>` и принимает проп `inlineSize`.
 *
 * Встроенные стили:
 *  - `inline-size` и `width` — ширина колонки при переданном `inlineSize`;
 *    работает при `table-layout: fixed`
 */
export const StyledTableCol = styled.col.withConfig({
  shouldForwardProp: (prop) => prop !== 'inlineSize',
})<{ inlineSize?: string }>`
  ${(props) =>
    props.inlineSize &&
    `
      inline-size: ${props.inlineSize};
      width: ${props.inlineSize};
    `}
`;

/**
 * getTableHeadStyles — возвращает CSS-правила для узла `StyledTableHead`:
 * заливку и нижнюю границу `th`, скрытие якоря при `$addHidden`.
 *
 * @param props флаг скрытия и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTableHeadStyles(props: { $addHidden?: boolean; theme: AppTheme }): string {
  const theme = getTheme(props);
  const styles = [
    `& th {
      background-color: ${resolveTableHeadFill(theme)};
      border-block-end: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
    }`,
  ];

  if (props.$addHidden) {
    styles.push('visibility: hidden;');
  }

  return styles.join('\n');
}

/**
 * StyledTableHead — задаёт шапку компонента Table.
 * Базируется на `<thead>` и принимает проп `$addHidden`.
 *
 * Генерация стилей:
 *  - `getTableHeadStyles` — заливка и граница `th`, скрытие якоря add-панели
 */
export const StyledTableHead = styled.thead.withConfig({
  shouldForwardProp: (prop) => prop !== '$addHidden',
})<{ $addHidden?: boolean }>`
  ${(props) => getTableHeadStyles(props)}
`;

/**
 * getTableFootStyles — возвращает CSS-правила для узла `StyledTableFoot`:
 * заливку и верхнюю границу `td`, скрытие якоря при `$addHidden`.
 *
 * @param props флаг скрытия и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTableFootStyles(props: { $addHidden?: boolean; theme: AppTheme }): string {
  const theme = getTheme(props);
  const styles = [
    `& td {
      background-color: ${resolveTableHeadFill(theme)};
      border-block-start: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
    }`,
  ];

  if (props.$addHidden) {
    styles.push('visibility: hidden;');
  }

  return styles.join('\n');
}

/**
 * StyledTableFoot — задаёт подвал компонента Table.
 * Базируется на `<tfoot>` и принимает проп `$addHidden`.
 *
 * Генерация стилей:
 *  - `getTableFootStyles` — заливка и граница `td`, скрытие якоря add-панели
 */
export const StyledTableFoot = styled.tfoot.withConfig({
  shouldForwardProp: (prop) => prop !== '$addHidden',
})<{ $addHidden?: boolean }>`
  ${(props) => getTableFootStyles(props)}
`;

/**
 * TABLE_BODY_PROP_NAMES — хранит имена пропсов стилизации тела таблицы.
 */
const TABLE_BODY_PROP_NAMES = new Set<string>(['$hoverHighlight', '$striped']);

/**
 * getTableBodyStyles — возвращает CSS-правила для узла `StyledTableBody`:
 * разделители строк, чередование фона и подсветку при наведении.
 *
 * Как работает:
 * 1. Берёт тему и флаги `$striped` и `$hoverHighlight`
 * 2. Кладёт нижнюю границу на ячейки тела
 * 3. При включённом `$striped` заливает чётные строки через `resolveTableStripeFill`
 * 4. При включённом `$hoverHighlight` заливает строку при наведении через
 *    `resolveTableRowHoverFill`
 * 5. У последней строки снимает нижнюю границу, чтобы не дублировать шов с подвалом
 * 6. Склеивает правила через перенос строки
 *
 * @param props флаги полос, наведения и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTableBodyStyles(props: {
  $hoverHighlight?: boolean;
  $striped?: boolean;
  theme: AppTheme;
}): string {
  const theme = getTheme(props);
  const styles = [
    `& td {
      border-block-end: 1px solid ${theme.colors.border};
    }`,
  ];

  if (props.$striped ?? DEFAULT_TABLE_STRIPED) {
    styles.push(
      `& tr:nth-child(even) {
        background-color: ${resolveTableStripeFill(theme)};
      }`
    );
  }

  if (props.$hoverHighlight ?? DEFAULT_TABLE_HOVER_HIGHLIGHT) {
    styles.push(
      `& tr:hover {
        background-color: ${resolveTableRowHoverFill(theme)};
      }`
    );
  }

  styles.push(`& tr:last-child td {
    border-block-end: none;
  }`);

  return styles.join('\n');
}

/**
 * StyledTableBody — задаёт тело компонента Table.
 * Базируется на `<tbody>` и принимает пропсы `$hoverHighlight` и `$striped`.
 *
 * Генерация стилей:
 *  - `getTableBodyStyles` — разделители строк, чередование фона и подсветка при наведении
 */
export const StyledTableBody = styled.tbody.withConfig({
  shouldForwardProp: (prop) => !TABLE_BODY_PROP_NAMES.has(prop),
})<{ $hoverHighlight?: boolean; $striped?: boolean }>`
  ${(props) => getTableBodyStyles(props)}
`;

/**
 * TABLE_ROW_PROP_NAMES — хранит имена пропсов стилизации строки таблицы.
 */
const TABLE_ROW_PROP_NAMES = new Set<string>(['$editHidden', 'sizePreset']);

/**
 * StyledTableRow — задаёт строку компонента Table.
 * Базируется на `<tr>` и принимает пропсы `$editHidden` и `sizePreset`.
 *
 * Встроенные стили:
 *  - `block-size` — высота строки по `sizePreset`
 *  - `visibility: hidden` при `$editHidden` — скрывает якорную строку под edit-панелью,
 *    оставляя место в потоке
 */
export const StyledTableRow = styled.tr.withConfig({
  shouldForwardProp: (prop) => !TABLE_ROW_PROP_NAMES.has(prop),
})<{ $editHidden?: boolean; sizePreset?: TableSizePreset }>`
  block-size: ${(props) =>
    getMinBlockSize(props.sizePreset ?? DEFAULT_TABLE_SIZE_PRESET)};
  ${(props) => props.$editHidden && 'visibility: hidden;'}
`;

/**
 * StyledTableRowPanel — задаёт панель add- и edit-режима компонента Table.
 * Базируется на `<div>` и принимает проп `$hasError`.
 *
 * Встроенные стили:
 *  - `overflow: hidden` — обрезает по скруглению
 *
 * Генерация стилей:
 *  - `getPortalPanelStyles` — хром портальной панели; `outlineColor` зависит от `$hasError`
 */
export const StyledTableRowPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$hasError',
})<{ $hasError?: boolean }>`
  overflow: hidden;
  ${(props) => {
    const theme = getTheme(props);

    return getPortalPanelStyles({
      borderRadius: resolveBlockRadius(
        DEFAULT_SHAPE_PRESET,
        getMinBlockSize(DEFAULT_SIZE_PRESET)
      ),
      outlineColor: props.$hasError
        ? theme.colors.invalidOutline
        : theme.colors.focusOutline,
      theme,
    });
  }}
`;

/**
 * getTableRowPanelTableStyles — возвращает CSS-правила для узла
 * `StyledTableRowPanelTable`: заливку и границы строк шапки и подвала панели
 * по data-маркерам.
 *
 * Как работает:
 * 1. Берёт тему
 * 2. Красит `[data-add-header] th` заливкой шапки и нижней границей секции
 * 3. Красит `[data-add-footer] td` той же заливкой и верхней границей
 * 4. Отдаёт правила для подстановки в CSS-шаблон
 *
 * @param props объект с темой
 * @returns CSS-правила, каждое с новой строки
 */
function getTableRowPanelTableStyles(props: { theme: AppTheme }): string {
  const theme = getTheme(props);

  return `
    & [data-add-header] th {
      background-color: ${resolveTableHeadFill(theme)};
      border-block-end: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
    }
    & [data-add-footer] td {
      background-color: ${resolveTableHeadFill(theme)};
      border-block-start: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
    }
  `;
}

/**
 * StyledTableRowPanelTable — задаёт внутреннюю таблицу add- и edit-панели.
 * Базируется на `<table>` и принимает проп `tableLayout`.
 *
 * Встроенные стили:
 *  - `inline-size: 100%` — совпадает с шириной панели
 *  - `table-layout` — режим раскладки колонок; по умолчанию `fixed`
 *  - `border-collapse: collapse` — общие границы ячеек без зазоров
 *
 * Генерация стилей:
 *  - `getTableRowPanelTableStyles` — заливка и границы шапки и подвала панели
 *
 * Собственной рамки у таблицы нет: хром несёт `StyledTableRowPanel`.
 * Секций `thead` и `tfoot` в портале нет — фон и границы шапки и подвала панели
 * задаются по data-маркерам строк.
 */
export const StyledTableRowPanelTable = styled.table.withConfig({
  shouldForwardProp: (prop) => prop !== 'tableLayout',
})<{ tableLayout?: 'auto' | 'fixed' }>`
  inline-size: 100%;
  table-layout: ${(props) => props.tableLayout ?? 'fixed'};
  border-collapse: collapse;
  ${(props) => getTableRowPanelTableStyles(props)}
`;

/**
 * StyledTablePanelErrorCell — задаёт ячейку строки ошибки add- и edit-панели.
 * Базируется на `<td>` и принимает проп `sizePreset`.
 *
 * Встроенные стили:
 *  - `padding-block` и `padding-inline` — отступы содержимого по размеру таблицы
 *  - `vertical-align: middle` — выравнивание полоски ошибки по вертикали
 *  - `border-block-end: none` — без нижнего шва: строка замыкает панель
 */
export const StyledTablePanelErrorCell = styled.td.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset',
})<{ sizePreset?: TableSizePreset }>`
  padding-block: ${getSpacingValue(8)};
  padding-inline: ${(props) =>
    getPaddingInline(props.sizePreset ?? DEFAULT_TABLE_SIZE_PRESET)};
  vertical-align: middle;
  border-block-end: none;
`;

/**
 * TABLE_HEADER_MARK_BLOCK_SIZE — задаёт габарит спейсера лид-слота шапки.
 * Совпадает с боксом Checkbox `small` и окном Icon `tiny`.
 */
const TABLE_HEADER_MARK_BLOCK_SIZE = getSpacingValue(checkboxSizePresets.small.size);

/**
 * StyledTableHeaderMarkSpacer — задаёт спейсер лид-слота шапки компонента Table.
 * Базируется на `<span>`. Резервирует габарит бокса Checkbox или окна Icon `tiny`
 * в неинтерактивной копии шапки и в add/edit-ячейках keyword-колонки.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — спейсер не сжимается
 *  - `inline-size` и `block-size` — габарит по `TABLE_HEADER_MARK_BLOCK_SIZE`
 *
 * Элемент `colgroup` выравнивает ширину колонок, но lead внутри keyword-ячейки
 * должен совпадать с интерактивной шапкой; без спейсера поля add съезжают
 * относительно заголовка Keyword.
 */
export const StyledTableHeaderMarkSpacer = styled.span`
  flex-shrink: 0;
  inline-size: ${TABLE_HEADER_MARK_BLOCK_SIZE};
  block-size: ${TABLE_HEADER_MARK_BLOCK_SIZE};
`;

/**
 * getTableLeadTrailRowStyles — возвращает CSS-правила ряда lead/trail:
 * flex-раскладку с растягиваемым первым слотом и fit-content у остальных.
 * Flex вместо grid: текст и контрол идут в одном потоке, первый слот
 * растягивается, действия остаются по содержимому.
 *
 * Как работает:
 * 1. Собирает flex-ряд с выравниванием по центру, полной шириной и зазором между слотами
 * 2. Первому ребёнку задаёт растягивание и `min-inline-size: 0`
 * 3. Остальным задаёт `flex: 0 0 auto` и `max-inline-size: fit-content`
 * 4. Отдаёт правила для подстановки в CSS-шаблон
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getTableLeadTrailRowStyles(): string {
  return `
    display: flex;
    gap: ${getSpacingValue(12)};
    align-items: center;
    inline-size: 100%;
    min-inline-size: 0;

    & > :first-child {
      flex: 1 1 auto;
      min-inline-size: 0;
    }

    & > :not(:first-child) {
      flex: 0 0 auto;
      max-inline-size: fit-content;
    }
  `;
}

/**
 * StyledTableHeaderKeywordBar — задаёт ряд шапки keyword-колонки: lead слева
 * и bulk-действия справа.
 * Базируется на `<span>`.
 *
 * Генерация стилей:
 *  - `getTableLeadTrailRowStyles` — flex-раскладка lead/trail
 */
export const StyledTableHeaderKeywordBar = styled.span`
  ${getTableLeadTrailRowStyles()}
`;

/**
 * StyledTableCellTrailing — задаёт ряд содержимого ячейки с действием справа от текста.
 * Базируется на `<span>`.
 *
 * Генерация стилей:
 *  - `getTableLeadTrailRowStyles` — flex-раскладка lead/trail
 */
export const StyledTableCellTrailing = styled.span`
  ${getTableLeadTrailRowStyles()}
`;

export {
  computeTableColumnInlineSizes,
  type TableColumnSizeConfig,
} from './column-sizing';

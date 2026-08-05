/**
 * Файл: `src/ui/table/table.styles.ts`
 * Определяет внешний вид компонента Table.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TableStyleProps` и `TableSizePreset`
 * 2. Предоставить дефолты `DEFAULT_TABLE_SIZE_PRESET`, `DEFAULT_TABLE_SHOW_BORDER`,
 *    `DEFAULT_TABLE_HOVER_HIGHLIGHT`, `DEFAULT_TABLE_STRIPED` и `DEFAULT_TABLE_NUMBERED`
 * 3. Предоставить styled-узлы `StyledTableClip`, `StyledTable`, `StyledTableCol`,
 *    `StyledTableHead`, `StyledTableFoot`, `StyledTableBody`, `StyledTableRow`,
 *    `StyledTableComposePanel`, `StyledTableComposeInnerTable`,
 *    `StyledTableComposeErrorCell`, `StyledTableHeaderAddButton`,
 *    `StyledTableHeaderMarkSpacer`, `StyledTableHeaderKeywordBar` и
 *    `StyledTableCellTrailing`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 * 5. Реэкспортировать `computeTableColumnInlineSizes` и тип `TableColumnSizeConfig`
 *
 * Потребители:
 *  - `src/ui/table/index.tsx` — собирает компонент Table и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { checkboxSizePresets } from '@ui/checkbox';
import { type LayoutProps } from '@ui/layout';
import { getOutlineStyles } from '@ui/outline';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  resolveBlockRadius,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { STACKING_PORTAL } from '@ui/stacking';
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
export const DEFAULT_TABLE_SIZE_PRESET: TableSizePreset = 'normal';

/**
 * DEFAULT_TABLE_SHOW_BORDER — задаёт показ рамки таблицы по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
export const DEFAULT_TABLE_SHOW_BORDER = true;

/**
 * DEFAULT_TABLE_HOVER_HIGHLIGHT — задаёт подсветку строк при наведении по умолчанию.
 * Используется, когда вызывающий код не передал проп `hoverHighlight`.
 */
export const DEFAULT_TABLE_HOVER_HIGHLIGHT = false;

/**
 * DEFAULT_TABLE_STRIPED — задаёт чередование фона строк по умолчанию.
 * Используется, когда вызывающий код не передал проп `striped`.
 */
export const DEFAULT_TABLE_STRIPED = false;

/**
 * DEFAULT_TABLE_NUMBERED — задаёт показ колонки нумерации по умолчанию.
 * Используется, когда вызывающий код не передал проп `numbered`.
 */
export const DEFAULT_TABLE_NUMBERED = true;

/**
 * TABLE_EDGE_BORDER_WIDTH — задаёт толщину рамки шапки и подвала таблицы.
 * Используется в `StyledTableHead`, `StyledTableFoot` и строках compose-панели.
 */
const TABLE_EDGE_BORDER_WIDTH = '2px';

/**
 * resolveTableHeadFill — возвращает приглушённую заливку шапки и подвала.
 * Контрастирует с телом таблицы на поверхности Card.
 *
 * @param theme текущая тема
 * @returns значение для CSS-свойства `background-color`
 */
function resolveTableHeadFill(theme: AppTheme): string {
  return resolveColorMix(theme.colors.border, theme.colors.surface, 22);
}

/**
 * resolveTableStripeFill — возвращает заливку чётной строки тела при `striped`.
 *
 * @param theme текущая тема
 * @returns значение для CSS-свойства `background-color`
 */
function resolveTableStripeFill(theme: AppTheme): string {
  return resolveColorMix(theme.colors.default, theme.colors.surface, 3);
}

/**
 * resolveTableRowHoverFill — возвращает заливку строки при наведении и кнопки «+» в шапке.
 *
 * @param theme текущая тема
 * @returns значение для CSS-свойства `background-color`
 */
function resolveTableRowHoverFill(theme: AppTheme): string {
  return resolveColorMix(theme.colors.primary, theme.colors.surface, 6);
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
  const showBorder = props.$showBorder === true;
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
    props.inlineSize
      ? `
          inline-size: ${props.inlineSize};
          width: ${props.inlineSize};
        `
      : ''}
`;

/**
 * StyledTableHead — задаёт шапку компонента Table.
 * Базируется на `<thead>` и принимает проп `$composeHidden`.
 *
 * Встроенные стили:
 *  - заливка и нижняя граница на `th` — контраст с телом на уровне секции, не на каждой ячейке
 *  - `visibility: hidden` при `$composeHidden` — скрывает якорь compose-панели, оставляя место в потоке
 */
export const StyledTableHead = styled.thead.withConfig({
  shouldForwardProp: (prop) => prop !== '$composeHidden',
})<{ $composeHidden?: boolean }>`
  & th {
    background-color: ${(props) => resolveTableHeadFill(getTheme(props))};
    border-block-end: ${TABLE_EDGE_BORDER_WIDTH} solid
      ${(props) => getTheme(props).colors.border};
  }
  ${(props) => (props.$composeHidden ? 'visibility: hidden;' : '')}
`;

/**
 * StyledTableFoot — задаёт подвал компонента Table.
 * Базируется на `<tfoot>` и принимает проп `$composeHidden`.
 *
 * Встроенные стили:
 *  - заливка и верхняя граница на `td` — тот же контраст, что у шапки
 *  - `visibility: hidden` при `$composeHidden` — скрывает якорь compose-панели, оставляя место в потоке
 */
export const StyledTableFoot = styled.tfoot.withConfig({
  shouldForwardProp: (prop) => prop !== '$composeHidden',
})<{ $composeHidden?: boolean }>`
  & td {
    background-color: ${(props) => resolveTableHeadFill(getTheme(props))};
    border-block-start: ${TABLE_EDGE_BORDER_WIDTH} solid
      ${(props) => getTheme(props).colors.border};
  }
  ${(props) => (props.$composeHidden ? 'visibility: hidden;' : '')}
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
  block-size: ${(props) => getMinBlockSize(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  ${(props) => (props.$editHidden ? 'visibility: hidden;' : '')}
`;

/**
 * StyledTableComposePanel — задаёт панель compose- и edit-режима компонента Table.
 * Базируется на `<div>` и принимает пропсы `$hasError` и `sizePreset`.
 *
 * Встроенные стили:
 *  - `position: fixed` и `z-index` — панель в портале над таблицей
 *  - `overflow: hidden` — обрезает по скруглению
 *  - `background-color` — заливка `surface`
 *  - `border-radius` — скругление по канону формы и размера контролов
 *
 * Генерация стилей:
 *  - `getOutlineStyles` — постоянный `outline`: при ошибке — `invalidOutline`, иначе `focusOutline`
 *  - `getBorderStyles` — рамка с тенью
 */
export const StyledTableComposePanel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset' && prop !== '$hasError',
})<{ $hasError?: boolean; sizePreset?: TableSizePreset }>`
  position: fixed;
  z-index: ${STACKING_PORTAL};
  overflow: hidden;
  ${(props) =>
    getOutlineStyles(
      props.$hasError
        ? getTheme(props).colors.invalidOutline
        : getTheme(props).colors.focusOutline
    )}
  background-color: ${(props) => getTheme(props).colors.surface};
  border-radius: ${resolveBlockRadius(
    DEFAULT_SHAPE_PRESET,
    getMinBlockSize(DEFAULT_SIZE_PRESET)
  )};
  ${(props) => getBorderStyles(getTheme(props))}
`;

/**
 * getTableComposeInnerTableStyles — возвращает CSS-правила для узла
 * `StyledTableComposeInnerTable`: заливку и границы строк шапки и подвала панели
 * по data-маркерам.
 *
 * Как работает:
 * 1. Берёт тему
 * 2. Красит `[data-compose-header] th` заливкой шапки и нижней границей секции
 * 3. Красит `[data-compose-footer] td` той же заливкой и верхней границей
 * 4. Отдаёт правила для подстановки в CSS-шаблон
 *
 * @param props объект с темой
 * @returns CSS-правила, каждое с новой строки
 */
function getTableComposeInnerTableStyles(props: { theme: AppTheme }): string {
  const theme = getTheme(props);

  return `
    & [data-compose-header] th {
      background-color: ${resolveTableHeadFill(theme)};
      border-block-end: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
    }
    & [data-compose-footer] td {
      background-color: ${resolveTableHeadFill(theme)};
      border-block-start: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
    }
  `;
}

/**
 * StyledTableComposeInnerTable — задаёт внутреннюю таблицу compose- и edit-панели.
 * Базируется на `<table>` и принимает проп `tableLayout`.
 *
 * Встроенные стили:
 *  - `inline-size: 100%` — совпадает с шириной панели
 *  - `table-layout` — режим раскладки колонок; по умолчанию `fixed`
 *  - `border-collapse: collapse` — общие границы ячеек без зазоров
 *
 * Генерация стилей:
 *  - `getTableComposeInnerTableStyles` — заливка и границы шапки и подвала панели
 *
 * Собственной рамки у таблицы нет: хром несёт `StyledTableComposePanel`.
 * Секций `thead` и `tfoot` в портале нет — фон и границы шапки и подвала панели
 * задаются по data-маркерам строк.
 */
export const StyledTableComposeInnerTable = styled.table.withConfig({
  shouldForwardProp: (prop) => prop !== 'tableLayout',
})<{ tableLayout?: 'auto' | 'fixed' }>`
  inline-size: 100%;
  table-layout: ${(props) => props.tableLayout ?? 'fixed'};
  border-collapse: collapse;
  ${(props) => getTableComposeInnerTableStyles(props)}
`;

/**
 * StyledTableComposeErrorCell — задаёт ячейку строки ошибки compose- и edit-панели.
 * Базируется на `<td>` и принимает проп `sizePreset`.
 *
 * Встроенные стили:
 *  - `padding-block` и `padding-inline` — отступы содержимого по размеру таблицы
 *  - `vertical-align: middle` и `text-align: center` — выравнивание текста ошибки
 *  - `border-block-end: none` — без нижнего шва: строка замыкает панель
 */
export const StyledTableComposeErrorCell = styled.td.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset',
})<{ sizePreset?: TableSizePreset }>`
  padding-block: ${getSpacingValue(8)};
  padding-inline: ${(props) =>
    getPaddingInline(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  vertical-align: middle;
  text-align: center;
  border-block-end: none;
`;

/**
 * TABLE_HEADER_MARK_BLOCK_SIZE — задаёт габарит метки чекбокса и кнопки «+» в шапке.
 * Совпадает с размером `small` у Checkbox без подписи.
 */
const TABLE_HEADER_MARK_BLOCK_SIZE = getSpacingValue(checkboxSizePresets.small.size);

/* TODO: ручное ревью — дубль кодировщика data-URI из `markIcon` в `checkbox.styles.ts`.
   Там data-URI вынужден: марка рисуется фоном нативного `<input>` (void-элемент,
   детей не принимает). Здесь марка стоит на `<button>` — ограничения нет; кандидат
   на вынос общего хелпера или замену иконкой-компонентом. */
/**
 * headerMarkIcon — возвращает значение для CSS-свойства `background-image`
 * с SVG-маркой плюса.
 *
 * @param pathD путь глифа в `viewBox` 12×12
 * @param strokeColor цвет обводки в hex
 * @returns значение data-URI для CSS-свойства `background-image`
 */
function headerMarkIcon(pathD: string, strokeColor: string): string {
  const stroke = strokeColor.replace('#', '%23');

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath stroke='${stroke}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='${pathD}'/%3E%3C/svg%3E")`;
}

/**
 * StyledTableHeaderAddButton — задаёт кнопку «+» в шапке keyword-колонки.
 * Базируется на `<button>`.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — кнопка не сжимается при нехватке места
 *  - `inline-size` и `block-size` — габарит по `TABLE_HEADER_MARK_BLOCK_SIZE`
 *  - `appearance: none` — снимает нативный вид кнопки
 *  - заливка `surface` и марка плюса через `background-image`
 *  - `background-size` — размер глифа марки
 *  - `border-radius` — скругление кнопки
 *  - `:disabled` — курсор по умолчанию для неактивной кнопки
 *  - `:not(:disabled):hover` — заливка через `resolveTableRowHoverFill`
 *
 * Генерация стилей:
 *  - `getBorderStyles` — рамка с тенью
 */
export const StyledTableHeaderAddButton = styled.button`
  flex-shrink: 0;
  inline-size: ${TABLE_HEADER_MARK_BLOCK_SIZE};
  block-size: ${TABLE_HEADER_MARK_BLOCK_SIZE};
  appearance: none;
  background-color: ${(props) => getTheme(props).colors.surface};
  background-image: ${(props) =>
    headerMarkIcon('M3 6h6M6 3v6', getTheme(props).colors.default)};
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${getSpacingValue(8)} ${getSpacingValue(8)};
  border-radius: ${getSpacingValue(4)};
  ${(props) => getBorderStyles(getTheme(props))}

  &:disabled {
    cursor: default;
  }

  &:not(:disabled):hover {
    background-color: ${(props) => resolveTableRowHoverFill(getTheme(props))};
  }
`;

/**
 * StyledTableHeaderMarkSpacer — задаёт резерв под метку чекбокса или кнопку «+»
 * в неинтерактивной копии шапки и в compose/edit-ячейках keyword-колонки.
 * Базируется на `<span>`.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — резерв не сжимается
 *  - `inline-size` и `block-size` — габарит по `TABLE_HEADER_MARK_BLOCK_SIZE`
 *
 * Элемент `colgroup` выравнивает ширину колонок, но lead внутри keyword-ячейки
 * должен совпадать с интерактивной шапкой; без резерва поля compose съезжают
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

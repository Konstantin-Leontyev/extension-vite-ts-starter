import styled, { css } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { SPACING_REM, spacingRem, type SpacingPx } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text/text.styles';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

export type TableAlign = 'center' | 'end' | 'start';

/** Пресеты размера: высота строки, размер текста ячейки, горизонтальный отступ ячейки. */
export const tableSizePresets = {
  small: {
    blockSize: 32,
    cellPaddingInline: 8,
    textSizePreset: 'thin',
  },
  normal: {
    blockSize: 40,
    cellPaddingInline: 12,
    textSizePreset: 'normal',
  },
  large: {
    blockSize: 48,
    cellPaddingInline: 12,
    textSizePreset: 'normal',
  },
} as const satisfies Record<
  string,
  {
    blockSize: SpacingPx;
    cellPaddingInline: SpacingPx;
    textSizePreset: TextSizePreset;
  }
>;

export type TableSizePreset = keyof typeof tableSizePresets;

const DEFAULT_SIZE_PRESET: TableSizePreset = 'normal';

const TABLE_BODY_PROP_NAMES = new Set<string>(['$hoverHighlight', '$striped']);

/** Приглушённый фон шапки — контраст с телом таблицы в Card. */
function tableHeadFill(theme: AppTheme): string {
  return `color-mix(in srgb, ${theme.colors.border} 22%, ${theme.colors.surface})`;
}

/** Чётная строка: лёгкая полоса, чтобы строки не сливались. */
function tableStripeFill(theme: AppTheme): string {
  return `color-mix(in srgb, ${theme.colors.default} 3%, ${theme.colors.surface})`;
}

/** Подсветка строки при наведении — лёгкий оттенок primary. */
function tableRowHoverFill(theme: AppTheme): string {
  return `color-mix(in srgb, ${theme.colors.primary} 6%, ${theme.colors.surface})`;
}

/** Оси вида ячейки: размер (высота/текст/отступ), выравнивание, обрезание. */
type TableCellAxisProps = {
  align?: TableAlign;
  ellipsis?: boolean;
  sizePreset?: TableSizePreset;
};

/** Публичные пропы примитива: layout — на корень, размер — на строки/ячейки. */
export type TableStyleProps = LayoutProps & {
  /** Рамка + surface-фон вокруг таблицы; на main page false (таблица лежит в Card). */
  bordered?: boolean;
  /** Подсветка строки при наведении. */
  hoverHighlight?: boolean;
  sizePreset?: TableSizePreset;
  /** Чередование фона чётных строк тела таблицы. */
  striped?: boolean;
};

const TABLE_CELL_PROP_NAMES = new Set<string>(['align', 'ellipsis', 'sizePreset']);
const shouldForwardCellProp = (prop: string): boolean =>
  !TABLE_CELL_PROP_NAMES.has(prop);

/** Размер текста ячейки для оси sizePreset — дефолт живёт здесь. */
export function tableTextSizePreset(
  sizePreset: TableSizePreset = DEFAULT_SIZE_PRESET
): TextSizePreset {
  return tableSizePresets[sizePreset].textSizePreset;
}

function rowBlockSizeRem(sizePreset: TableSizePreset = DEFAULT_SIZE_PRESET): string {
  return spacingRem(tableSizePresets[sizePreset].blockSize);
}

function cellPaddingInlineRem(
  sizePreset: TableSizePreset = DEFAULT_SIZE_PRESET
): string {
  return spacingRem(tableSizePresets[sizePreset].cellPaddingInline);
}

/**
 * Опциональная рамка вокруг таблицы (bordered): своё у неё — border/radius/surface.
 * Скролл и сайзинг — у ScrollPort; здесь лишь структурный минимум, чтобы ScrollPort
 * с block-size:100% ограничился по высоте (flex-колонка + min-block-size:0 + overflow).
 */
export const StyledTableFrame = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: flex;
  flex-direction: column;
  min-block-size: 0;
  min-inline-size: 0;
  overflow: hidden;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${SPACING_REM[12]};
  ${(props) => getLayoutStyles(props)}
`;

/** Скругление без рамки (таблица в Card): обрезка фона шапки по углам. */
export const StyledTableClip = styled.div`
  overflow: hidden;
  border-radius: ${SPACING_REM[12]};
  min-inline-size: 0;
`;

/** fixed: ширины колонок берутся из colgroup и не зависят от данных (нет скачка при смене view). */
export const StyledTable = styled.table.withConfig({
  shouldForwardProp: (prop) => prop !== 'tableLayout',
})<{ tableLayout?: 'auto' | 'fixed' }>`
  inline-size: 100%;
  table-layout: ${(props) => props.tableLayout ?? 'auto'};
  border-collapse: collapse;
`;

/** Ширина колонки в colgroup; работает при table-layout: fixed. */
export const StyledTableCol = styled.col.withConfig({
  shouldForwardProp: (prop) => prop !== 'inlineSize',
})<{ inlineSize?: string }>`
  ${(props) => (props.inlineSize ? `inline-size: ${props.inlineSize};` : '')}
`;

export const StyledTableHead = styled.thead.withConfig({
  shouldForwardProp: (prop) => prop !== '$composeHidden',
})<{ $composeHidden?: boolean }>`
  ${(props) =>
    props.$composeHidden
      ? css`
          visibility: hidden;
        `
      : ''}
`;

export const StyledTableFoot = styled.tfoot.withConfig({
  shouldForwardProp: (prop) => prop !== '$composeHidden',
})<{ $composeHidden?: boolean }>`
  ${(props) =>
    props.$composeHidden
      ? css`
          visibility: hidden;
        `
      : ''}
`;

export const StyledTableBody = styled.tbody.withConfig({
  shouldForwardProp: (prop) => !TABLE_BODY_PROP_NAMES.has(prop),
})<{ $hoverHighlight?: boolean; $striped?: boolean }>`
  ${(props) => {
    const theme = getTheme(props);
    const rules: string[] = [];

    if (props.$striped) {
      rules.push(
        `& tr:nth-child(even) {
          background-color: ${tableStripeFill(theme)};
        }`
      );
    }

    if (props.$hoverHighlight) {
      rules.push(
        `& tr:hover {
          background-color: ${tableRowHoverFill(theme)};
        }`
      );
    }

    rules.push(`& tr:last-child td {
      border-block-end: none;
    }`);

    return rules.join('\n');
  }}
`;

export const StyledTableRow = styled.tr.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<{ sizePreset?: TableSizePreset }>`
  block-size: ${(props) => rowBlockSizeRem(props.sizePreset)};
`;

const cellBase = css<TableCellAxisProps>`
  padding-inline: ${(props) => cellPaddingInlineRem(props.sizePreset)};
  text-align: ${(props) => props.align ?? 'start'};
  vertical-align: middle;
  ${(props) =>
    props.ellipsis === true
      ? css`
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        `
      : css`
          overflow-wrap: break-word;
        `}
`;

export const StyledTableHeadCell = styled.th.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<TableCellAxisProps>`
  ${cellBase}
  background-color: ${(props) => tableHeadFill(getTheme(props))};
  border-block-end: 2px solid ${(props) => getTheme(props).colors.border};
`;

export const StyledTableCell = styled.td.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<TableCellAxisProps>`
  ${cellBase}
  border-block-end: 1px solid ${(props) => getTheme(props).colors.border};
`;

/** Дубль шапки внизу таблицы (после последней строки). */
export const StyledTableFootHeadCell = styled(StyledTableCell)`
  background-color: ${(props) => tableHeadFill(getTheme(props))};
  border-block-start: 2px solid ${(props) => getTheme(props).colors.border};
`;

/** Толщина border compose-панели; при border-box компенсируется в позиционировании. */
export const COMPOSE_PANEL_BORDER_WIDTH_PX = 1;

/** Панель compose-row: одна рамка как у Listbox (outline + border + radius). */
export const StyledTableComposePanel = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset' && prop !== '$hasError',
})<{ $hasError?: boolean; sizePreset?: TableSizePreset }>`
  position: fixed;
  z-index: 2000;
  overflow: hidden;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${SPACING_REM[12]};
  box-shadow: ${(props) => getTheme(props).shadow.surface};
  outline: 2px solid
    ${(props) =>
      props.$hasError
        ? getTheme(props).colors.invalidRing
        : getTheme(props).colors.focusRing};
  outline-offset: 2px;
`;

/** Внутренняя таблица панели — без собственной рамки, совпадает с колонками. */
export const StyledTableComposeInnerTable = styled.table.withConfig({
  shouldForwardProp: (prop) => prop !== 'tableLayout',
})<{ tableLayout?: 'auto' | 'fixed' }>`
  inline-size: 100%;
  table-layout: ${(props) => props.tableLayout ?? 'fixed'};
  border-collapse: collapse;
`;

export const StyledTableComposeInnerHeadCell = styled.th.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<TableCellAxisProps>`
  ${cellBase}
  background-color: ${(props) => tableHeadFill(getTheme(props))};
  border-block-end: 2px solid ${(props) => getTheme(props).colors.border};
`;

export const StyledTableComposeInnerCell = styled.td.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<TableCellAxisProps>`
  ${cellBase}
  border-block-end: none;
`;

/** Нижняя строка панели compose при якоре foot. */
export const StyledTableComposeInnerFootCell = styled(StyledTableComposeInnerCell)`
  background-color: ${(props) => tableHeadFill(getTheme(props))};
  border-block-start: 2px solid ${(props) => getTheme(props).colors.border};
`;

/** Общая строка ошибки под полями compose-панели. */
export const StyledTableComposeErrorCell = styled.td.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<TableCellAxisProps>`
  padding-block: ${SPACING_REM[8]};
  padding-inline: ${(props) => cellPaddingInlineRem(props.sizePreset)};
  text-align: center;
  vertical-align: middle;
  border-block-end: none;
`;

function headerMarkIcon(pathD: string, strokeColor: string): string {
  const stroke = strokeColor.replace('#', '%23');

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath stroke='${stroke}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='${pathD}'/%3E%3C/svg%3E")`;
}

/** Кнопка «+» в шапке Keyword; активна при переданном `onAddRow`, иначе заглушка. */
export const StyledTableHeaderAddButton = styled.button`
  flex-shrink: 0;
  inline-size: ${spacingRem(12)};
  block-size: ${spacingRem(12)};
  appearance: none;
  padding: 0;
  margin: 0;
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${SPACING_REM[4]};
  box-shadow: ${(props) => getTheme(props).shadow.surface};
  background-color: ${(props) => getTheme(props).colors.surface};
  background-image: ${(props) =>
    headerMarkIcon('M3 6h6M6 3v6', getTheme(props).colors.default)};
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${spacingRem(8)} ${spacingRem(8)};
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:not(:disabled):hover {
    background-color: ${(props) =>
      `color-mix(in srgb, ${getTheme(props).colors.primary} 6%, ${getTheme(props).colors.surface})`};
  }
`;

/** Заглушка под чекбокс / «+» в копии шапки внутри compose-панели. */
export const StyledTableHeaderMarkSpacer = styled.span`
  flex-shrink: 0;
  inline-size: ${spacingRem(12)};
  block-size: ${spacingRem(12)};
`;

/** Шапка Keyword: ☐ + label слева, bulk-действия справа. */
export const StyledTableHeaderKeywordBar = styled.span`
  display: flex;
  align-items: center;
  gap: ${SPACING_REM[12]};
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

/** Чекбокс строки + содержимое ячейки в одной линии. */
export const StyledTableRowLeading = styled.span`
  display: inline-flex;
  gap: ${SPACING_REM[8]};
  align-items: center;
  min-inline-size: 0;
`;

/**
 * Keyword-ячейка с чекбоксом: чекбокс слева, блок текста+действия на всю оставшуюся ширину
 * (Delete прижимается к правому краю строки через StyledTableCellWithActions).
 */
export const StyledTableCheckableCell = styled.span`
  display: flex;
  align-items: center;
  gap: ${SPACING_REM[8]};
  inline-size: 100%;
  min-inline-size: 0;

  & > :nth-child(2) {
    flex: 1 1 auto;
    min-inline-size: 0;
  }
`;

/** Содержимое ячейки + действие выбранной строки справа от текста. */
export const StyledTableCellWithActions = styled.span`
  display: flex;
  align-items: center;
  gap: ${SPACING_REM[12]};
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

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SIZE_PRESET,
  blockSizeRem,
  controlPaddingInline,
  type SizePreset,
} from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Размерный ряд таблицы — канон контролов проекта. */
export type TableSizePreset = SizePreset;

export const DEFAULT_TABLE_SIZE_PRESET: TableSizePreset = 'large';
export const DEFAULT_TABLE_BORDERED = true;
export const DEFAULT_TABLE_HOVER_HIGHLIGHT = false;
export const DEFAULT_TABLE_STRIPED = false;
export const DEFAULT_TABLE_NUMBERED = true;

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
  border-radius: ${spacingRem(12)};
  ${(props) => getLayoutStyles(props)}
`;

/** Скругление без рамки (таблица в Card): обрезка фона шапки по углам. */
export const StyledTableClip = styled.div`
  overflow: hidden;
  border-radius: ${spacingRem(12)};
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
  ${(props) =>
    props.inlineSize
      ? `
          inline-size: ${props.inlineSize};
          width: ${props.inlineSize};
        `
      : ''}
`;

/** Шапка: фон-контраст и нижняя граница — на уровне секции, не на каждой ячейке. */
export const StyledTableHead = styled.thead.withConfig({
  shouldForwardProp: (prop) => prop !== '$composeHidden',
})<{ $composeHidden?: boolean }>`
  & th {
    background-color: ${(props) => tableHeadFill(getTheme(props))};
    border-block-end: 2px solid ${(props) => getTheme(props).colors.border};
  }
  ${(props) => (props.$composeHidden ? 'visibility: hidden;' : '')}
`;

/** Футер — дубль шапки внизу: тот же фон, верхняя граница. */
export const StyledTableFoot = styled.tfoot.withConfig({
  shouldForwardProp: (prop) => prop !== '$composeHidden',
})<{ $composeHidden?: boolean }>`
  & td {
    background-color: ${(props) => tableHeadFill(getTheme(props))};
    border-block-start: 2px solid ${(props) => getTheme(props).colors.border};
  }
  ${(props) => (props.$composeHidden ? 'visibility: hidden;' : '')}
`;

/** Тело: разделители строк, striped и hover — на уровне секции. */
export const StyledTableBody = styled.tbody.withConfig({
  shouldForwardProp: (prop) => !TABLE_BODY_PROP_NAMES.has(prop),
})<{ $hoverHighlight?: boolean; $striped?: boolean }>`
  ${(props) => {
    const theme = getTheme(props);
    const rules: string[] = [
      `& td {
        border-block-end: 1px solid ${theme.colors.border};
      }`,
    ];

    if (props.$striped ?? DEFAULT_TABLE_STRIPED) {
      rules.push(
        `& tr:nth-child(even) {
          background-color: ${tableStripeFill(theme)};
        }`
      );
    }

    if (props.$hoverHighlight ?? DEFAULT_TABLE_HOVER_HIGHLIGHT) {
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

const TABLE_ROW_PROP_NAMES = new Set<string>(['$editHidden', 'sizePreset']);

export const StyledTableRow = styled.tr.withConfig({
  shouldForwardProp: (prop) => !TABLE_ROW_PROP_NAMES.has(prop),
})<{ $editHidden?: boolean; sizePreset?: TableSizePreset }>`
  block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  ${(props) => (props.$editHidden ? 'visibility: hidden;' : '')}
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
  border-radius: ${spacingRem(12)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};
  outline: 2px solid
    ${(props) =>
      props.$hasError
        ? getTheme(props).colors.invalidRing
        : getTheme(props).colors.focusRing};
  outline-offset: 2px;
`;

/**
 * Внутренняя таблица панели — без собственной рамки, совпадает с колонками.
 * Фон/границы шапки и футера панели — по data-маркерам строк (секций в портале нет).
 */
export const StyledTableComposeInnerTable = styled.table.withConfig({
  shouldForwardProp: (prop) => prop !== 'tableLayout',
})<{ tableLayout?: 'auto' | 'fixed' }>`
  inline-size: 100%;
  table-layout: ${(props) => props.tableLayout ?? 'fixed'};
  border-collapse: collapse;
  ${(props) => {
    const theme = getTheme(props);

    return [
      `& [data-compose-header] th {
        background-color: ${tableHeadFill(theme)};
        border-block-end: 2px solid ${theme.colors.border};
      }`,
      `& [data-compose-footer] td {
        background-color: ${tableHeadFill(theme)};
        border-block-start: 2px solid ${theme.colors.border};
      }`,
    ].join('\n');
  }}
`;

/** Общая строка ошибки под полями compose/edit-панели. */
export const StyledTableComposeErrorCell = styled.td.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset',
})<{ sizePreset?: TableSizePreset }>`
  padding-block: ${spacingRem(8)};
  padding-inline: ${(props) =>
    spacingRem(controlPaddingInline[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
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
  border-radius: ${spacingRem(4)};
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
  gap: ${spacingRem(12)};
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

/** Содержимое ячейки + действие выбранной строки справа от текста. */
export const StyledTableCellTrailing = styled.span`
  display: flex;
  align-items: center;
  gap: ${spacingRem(12)};
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

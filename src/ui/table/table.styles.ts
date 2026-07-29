// TODO: ручное ревью — ui/table/table.styles.ts
import styled from 'styled-components';

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

/** Размерный ряд таблицы — канон контролов проекта. */
export type TableSizePreset = SizePreset;

export const DEFAULT_TABLE_SIZE_PRESET: TableSizePreset = 'normal';
export const DEFAULT_TABLE_SHOW_BORDER = true;
export const DEFAULT_TABLE_HOVER_HIGHLIGHT = false;
export const DEFAULT_TABLE_STRIPED = false;
export const DEFAULT_TABLE_NUMBERED = true;

/**
 * TABLE_EDGE_BORDER_WIDTH — задаёт толщину рамки шапки и подвала таблицы.
 * Используется в `StyledTableHead`, `StyledTableFoot` и compose-секциях.
 */
const TABLE_EDGE_BORDER_WIDTH = '2px';

const TABLE_BODY_PROP_NAMES = new Set<string>(['$hoverHighlight', '$striped']);

/** Приглушённый фон шапки — контраст с телом таблицы в Card. */
function tableHeadFill(theme: AppTheme): string {
  return resolveColorMix(theme.colors.border, theme.colors.surface, 22);
}

/** Чётная строка: лёгкая полоса, чтобы строки не сливались. */
function tableStripeFill(theme: AppTheme): string {
  return resolveColorMix(theme.colors.default, theme.colors.surface, 3);
}

/** Подсветка при наведении — лёгкий оттенок primary: строки тела и кнопка «+» шапки. */
function tableRowHoverFill(theme: AppTheme): string {
  return resolveColorMix(theme.colors.primary, theme.colors.surface, 6);
}

/** Публичные пропы примитива: layout — на корень, размер — на строки/ячейки. */
export type TableStyleProps = LayoutProps & {
  /** Подсветка строки при наведении. */
  hoverHighlight?: boolean;
  /** Рамка + surface-фон вокруг таблицы; на main page false (таблица лежит в Card). */
  showBorder?: boolean;
  sizePreset?: TableSizePreset;
  /** Чередование фона чётных строк тела таблицы. */
  striped?: boolean;
};

/**
 * Обрезка углов таблицы; при showBorder — рамка и surface без отдельной обёртки
 * (ScrollPort остаётся корнем скролла, gutter в padding Card).
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
  ${(props) =>
    props.$showBorder === true
      ? `
          background-color: ${getTheme(props).colors.surface};
          border: 1px solid ${getTheme(props).colors.border};
        `
      : ''}
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
    border-block-end: ${TABLE_EDGE_BORDER_WIDTH} solid
      ${(props) => getTheme(props).colors.border};
  }
  ${(props) => (props.$composeHidden ? 'visibility: hidden;' : '')}
`;

/** Футер — дубль шапки внизу: тот же фон, верхняя граница. */
export const StyledTableFoot = styled.tfoot.withConfig({
  shouldForwardProp: (prop) => prop !== '$composeHidden',
})<{ $composeHidden?: boolean }>`
  & td {
    background-color: ${(props) => tableHeadFill(getTheme(props))};
    border-block-start: ${TABLE_EDGE_BORDER_WIDTH} solid
      ${(props) => getTheme(props).colors.border};
  }
  ${(props) => (props.$composeHidden ? 'visibility: hidden;' : '')}
`;

/** Тело: разделители строк, striped и hover — на уровне секции. */
export const StyledTableBody = styled.tbody.withConfig({
  shouldForwardProp: (prop) => !TABLE_BODY_PROP_NAMES.has(prop),
})<{ $hoverHighlight?: boolean; $striped?: boolean }>`
  ${(props) => {
    const theme = getTheme(props);
    const styles: string[] = [
      `& td {
        border-block-end: 1px solid ${theme.colors.border};
      }`,
    ];

    if (props.$striped ?? DEFAULT_TABLE_STRIPED) {
      styles.push(
        `& tr:nth-child(even) {
          background-color: ${tableStripeFill(theme)};
        }`
      );
    }

    if (props.$hoverHighlight ?? DEFAULT_TABLE_HOVER_HIGHLIGHT) {
      styles.push(
        `& tr:hover {
          background-color: ${tableRowHoverFill(theme)};
        }`
      );
    }

    styles.push(`& tr:last-child td {
      border-block-end: none;
    }`);

    return styles.join('\n');
  }}
`;

const TABLE_ROW_PROP_NAMES = new Set<string>(['$editHidden', 'sizePreset']);

export const StyledTableRow = styled.tr.withConfig({
  shouldForwardProp: (prop) => !TABLE_ROW_PROP_NAMES.has(prop),
})<{ $editHidden?: boolean; sizePreset?: TableSizePreset }>`
  block-size: ${(props) => getMinBlockSize(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  ${(props) => (props.$editHidden ? 'visibility: hidden;' : '')}
`;

/** Толщина border compose-панели; при border-box компенсируется в позиционировании. */
export const COMPOSE_PANEL_BORDER_WIDTH_PX = 1;

/** Панель compose-row: одна рамка как у Listbox (outline + border + radius). */
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
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${resolveBlockRadius(
    DEFAULT_SHAPE_PRESET,
    getMinBlockSize(DEFAULT_SIZE_PRESET)
  )};
  box-shadow: ${(props) => getTheme(props).shadow.surface};
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
    const styles = [
      `& [data-compose-header] th {
        background-color: ${tableHeadFill(theme)};
        border-block-end: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
      }`,
      `& [data-compose-footer] td {
        background-color: ${tableHeadFill(theme)};
        border-block-start: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
      }`,
    ];

    return styles.join('\n');
  }}
`;

/** Общая строка ошибки под полями compose/edit-панели. */
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

/** Габарит метки чекбокса и кнопки «+» в шапке — TableCheckbox без подписи, размер small. */
const tableHeaderMarkBlockSizeRem = getSpacingValue(checkboxSizePresets.small.size);

/* TODO: ручное ревью — дубль кодировщика data-URI из `markIcon` в `checkbox.styles.ts`.
   Там data-URI вынужден: марка рисуется фоном нативного `<input>` (void-элемент,
   детей не принимает). Здесь марка стоит на `<button>` — ограничения нет; кандидат
   на вынос общего хелпера или замену иконкой-компонентом. */
function headerMarkIcon(pathD: string, strokeColor: string): string {
  const stroke = strokeColor.replace('#', '%23');

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath stroke='${stroke}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='${pathD}'/%3E%3C/svg%3E")`;
}

/** Кнопка «+» в шапке Keyword; активна при переданном `onAddRow`, иначе заглушка. */
export const StyledTableHeaderAddButton = styled.button`
  flex-shrink: 0;
  inline-size: ${tableHeaderMarkBlockSizeRem};
  block-size: ${tableHeaderMarkBlockSizeRem};
  appearance: none;
  background-color: ${(props) => getTheme(props).colors.surface};
  background-image: ${(props) =>
    headerMarkIcon('M3 6h6M6 3v6', getTheme(props).colors.default)};
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${getSpacingValue(8)} ${getSpacingValue(8)};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${getSpacingValue(4)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};

  &:disabled {
    cursor: default;
  }

  &:not(:disabled):hover {
    background-color: ${(props) => tableRowHoverFill(getTheme(props))};
  }
`;

/**
 * Резерв под отсутствующую метку чекбокса или кнопку «+» в неинтерактивной копии шапки
 * и в compose/edit-ячейках keyword-колонки. Colgroup выравнивает ширину колонок, но lead
 * внутри keyword-ячейки должен совпадать с интерактивной шапкой; без резерва поля compose
 * съезжают относительно заголовка Keyword.
 */
export const StyledTableHeaderMarkSpacer = styled.span`
  flex-shrink: 0;
  inline-size: ${tableHeaderMarkBlockSizeRem};
  block-size: ${tableHeaderMarkBlockSizeRem};
`;

/** Шапка Keyword: ☐ + label слева, bulk-действия справа. */
export const StyledTableHeaderKeywordBar = styled.span`
  /* flex (не grid): первый слот растягивается (flex: 1 1 auto), действия — fit-content. */
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

/** Содержимое ячейки + действие выбранной строки справа от текста. */
export const StyledTableCellTrailing = styled.span`
  /* flex (не grid): текст и trailing-control в одном потоке; gap между слотами. */
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

export {
  computeTableColumnInlineSize,
  computeTableColumnInlineSizes,
  type TableColumnSizeSpec,
} from './column-sizing';

import styled, { css } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { SPACING_REM, spacingRem, type SpacingPx } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text/text.styles';
import { getTheme } from '@ui/theme';

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

/** Оси вида ячейки: размер (высота/текст/отступ) и выравнивание. */
type TableCellAxisProps = {
  align?: TableAlign;
  sizePreset?: TableSizePreset;
};

/** Публичные пропы примитива: layout — на корень, размер — на строки/ячейки. */
export type TableStyleProps = LayoutProps & {
  /** Рамка + surface-фон вокруг таблицы; на main page false (таблица лежит в Card). */
  bordered?: boolean;
  sizePreset?: TableSizePreset;
};

const TABLE_CELL_PROP_NAMES = new Set<string>(['align', 'sizePreset']);
const shouldForwardCellProp = (prop: string): boolean => !TABLE_CELL_PROP_NAMES.has(prop);

/** Размер текста ячейки для оси sizePreset — дефолт живёт здесь. */
export function tableTextSizePreset(
  sizePreset: TableSizePreset = DEFAULT_SIZE_PRESET
): TextSizePreset {
  return tableSizePresets[sizePreset].textSizePreset;
}

function rowBlockSizeRem(sizePreset: TableSizePreset = DEFAULT_SIZE_PRESET): string {
  return spacingRem(tableSizePresets[sizePreset].blockSize);
}

function cellPaddingInlineRem(sizePreset: TableSizePreset = DEFAULT_SIZE_PRESET): string {
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

export const StyledTable = styled.table`
  inline-size: 100%;
  border-collapse: collapse;
`;

export const StyledTableHead = styled.thead`
  background-color: ${(props) => getTheme(props).colors.surface};
`;

export const StyledTableBody = styled.tbody`
  & tr:last-child td {
    border-block-end: none;
  }
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
`;

export const StyledTableHeadCell = styled.th.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<TableCellAxisProps>`
  ${cellBase}
  border-block-end: 2px solid ${(props) => getTheme(props).colors.border};
`;

export const StyledTableCell = styled.td.withConfig({
  shouldForwardProp: shouldForwardCellProp,
})<TableCellAxisProps>`
  ${cellBase}
  border-block-end: 1px solid ${(props) => getTheme(props).colors.border};
  overflow-wrap: break-word;
`;

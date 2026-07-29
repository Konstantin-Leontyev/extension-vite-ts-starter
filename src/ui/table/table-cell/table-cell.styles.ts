// TODO: ручное ревью — ui/table/table-cell/table-cell.styles.ts
import styled, { css } from 'styled-components';

import { DEFAULT_SIZE_PRESET, getPaddingInline, type SizePreset } from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getEllipsisStyles } from '@ui/text';

export type TableCellAlign = 'center' | 'end' | 'start';

/** Оси вида ячейки: выравнивание, размер (padding), обрезание. */
export type TableCellStyleProps = {
  align?: TableCellAlign;
  ellipsis?: boolean;
  nowrap?: boolean;
  sizePreset?: SizePreset;
};

const TABLE_CELL_PROP_NAMES = new Set<string>([
  'align',
  'ellipsis',
  'nowrap',
  'sizePreset',
]);

/**
 * Единая модель ячейки: токен-padding по оси sizePreset, выравнивание, обрезание.
 * Контракт: на td/th нельзя display:grid/flex (теряется формат-контекст table-cell —
 * высота строки и vertical-align), поэтому горизонталь — text-align, вертикаль —
 * vertical-align; нестандартный бокс — обёртка inline-flex/grid внутри ячейки.
 */
const tableCellBase = css<TableCellStyleProps>`
  padding-inline: ${(props) =>
    getPaddingInline(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  vertical-align: middle;
  text-align: ${(props) => props.align ?? 'center'};
  ${(props) => {
    if (props.ellipsis === true) {
      return getEllipsisStyles();
    }

    if (props.nowrap === true) {
      return css`
        white-space: nowrap;
      `;
    }

    return css`
      overflow-wrap: break-word;
    `;
  }}
`;

export const StyledTableCell = styled.td.withConfig({
  shouldForwardProp: (prop) => !TABLE_CELL_PROP_NAMES.has(prop),
})<TableCellStyleProps>`
  ${tableCellBase}
`;

/**
 * Лид-слот ячейки: [checkbox?][expander?] + контент в одну линию.
 * flex-поток (оправданное исключение из «grid по умолчанию»): отсутствующий
 * условный сосед места не занимает. Контент (последний ребёнок) забирает
 * остаток ширины и сжимается с ellipsis; лид-контролы остаются фиксированными.
 */
export const StyledTableCellLead = styled.span`
  display: inline-flex;
  gap: ${getSpacingValue(8)};
  align-items: center;
  inline-size: 100%;
  min-inline-size: 0;

  & > :last-child {
    flex: 1 1 auto;
    min-inline-size: 0;
  }
`;

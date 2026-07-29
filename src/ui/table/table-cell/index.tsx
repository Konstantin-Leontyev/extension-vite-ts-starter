// TODO: ручное ревью — ui/table/table-cell/index.tsx
import { type ComponentPropsWithRef } from 'react';

import { StyledTableCell, type TableCellStyleProps } from './table-cell.styles';

type TableCellProps = TableCellStyleProps & {
  /** Рендерить th вместо td (ячейка шапки/футера). */
  head?: boolean;
  /** scope для th (ячейки шапки). */
  scope?: 'col' | 'colgroup' | 'row' | 'rowgroup';
} & Omit<
    ComponentPropsWithRef<'td'>,
    'className' | 'scope' | 'style' | keyof TableCellStyleProps
  >;

export function TableCell({ head, ...props }: TableCellProps) {
  return <StyledTableCell as={head ? 'th' : undefined} {...props} />;
}

export {
  StyledTableCellLead,
  type TableCellAlign,
  type TableCellStyleProps,
} from './table-cell.styles';

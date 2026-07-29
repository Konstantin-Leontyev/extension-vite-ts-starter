// TODO: ручное ревью — ui/table/table-group-cell/index.tsx
import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { StyledTableGroupCell } from './table-group-cell.styles';

type TableGroupCellProps = Omit<ComponentPropsWithRef<'span'>, 'className' | 'style'> & {
  children: ReactNode;
};

export function TableGroupCell(props: TableGroupCellProps) {
  return <StyledTableGroupCell {...props} />;
}

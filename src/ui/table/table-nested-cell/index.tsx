// TODO: ручное ревью — ui/table/table-nested-cell/index.tsx
import { type ComponentPropsWithRef, type ReactNode } from 'react';

import {
  StyledTableMemberPrefix,
  StyledTableNestedCell,
} from './table-nested-cell.styles';

type TableNestedCellProps = {
  children: ReactNode;
  nestDepth: number;
};

export function TableNestedCell({ children, nestDepth }: TableNestedCellProps) {
  return (
    <StyledTableNestedCell $nestDepth={nestDepth}>{children}</StyledTableNestedCell>
  );
}

type TableMemberPrefixProps = Omit<ComponentPropsWithRef<'span'>, 'className' | 'style'>;

export function TableMemberPrefix(props: TableMemberPrefixProps) {
  return <StyledTableMemberPrefix aria-hidden="true" {...props} />;
}

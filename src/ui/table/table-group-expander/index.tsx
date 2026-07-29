// TODO: ручное ревью — ui/table/table-group-expander/index.tsx
import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { StyledTableGroupExpander } from './table-group-expander.styles';

type TableGroupExpanderProps = Omit<
  ComponentPropsWithRef<'button'>,
  'className' | 'style'
> & {
  children: ReactNode;
};

export function TableGroupExpander({ children, ...props }: TableGroupExpanderProps) {
  return (
    <StyledTableGroupExpander type="button" {...props}>
      {children}
    </StyledTableGroupExpander>
  );
}

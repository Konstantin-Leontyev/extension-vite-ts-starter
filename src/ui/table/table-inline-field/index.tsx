// TODO: ручное ревью — ui/table/table-inline-field/index.tsx
import { type CSSProperties, type ComponentPropsWithRef } from 'react';

import { type TextSizePreset } from '@ui/text';

import {
  StyledTableInlineField,
  type TableInlineFieldStyleProps,
} from './table-inline-field.styles';

export type TableInlineFieldProps = TableInlineFieldStyleProps & {
  textAlign?: CSSProperties['textAlign'];
  textSizePreset?: TextSizePreset;
} & Omit<
    ComponentPropsWithRef<'input'>,
    'className' | 'style' | keyof TableInlineFieldStyleProps
  >;

export function TableInlineField(props: TableInlineFieldProps) {
  return <StyledTableInlineField {...props} />;
}

export type { TableInlineFieldStyleProps } from './table-inline-field.styles';

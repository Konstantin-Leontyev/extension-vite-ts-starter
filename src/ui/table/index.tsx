import { type ComponentPropsWithRef } from 'react';

import { ScrollPort } from '@ui/scroll-port';
import { Text } from '@ui/text';

import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableFrame,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
  splitLayoutProps,
  tableTextSizePreset,
  type TableAlign,
  type TableStyleProps,
} from './table.styles';

export type TableColumn<Row> = {
  align?: TableAlign;
  header: string;
  key: Extract<keyof Row, string>;
};

type TableProps<Row> = {
  columns: TableColumn<Row>[];
  numbered?: boolean;
  rows: Row[];
} & TableStyleProps &
  Omit<ComponentPropsWithRef<'table'>, keyof TableStyleProps | 'className' | 'style'>;

export function Table<Row>({
  bordered = true,
  columns,
  numbered = true,
  rows,
  sizePreset,
  ...rest
}: TableProps<Row>) {
  const { layout, rest: tableAttrs } = splitLayoutProps(rest);
  const textSizePreset = tableTextSizePreset(sizePreset);

  const table = (
    <StyledTable {...tableAttrs}>
      <StyledTableHead>
        <StyledTableRow sizePreset={sizePreset}>
          {numbered && (
            <StyledTableHeadCell align="end" scope="col" sizePreset={sizePreset}>
              <Text sizePreset={textSizePreset}>#</Text>
            </StyledTableHeadCell>
          )}
          {columns.map((column) => (
            <StyledTableHeadCell
              key={column.key}
              align={column.align}
              scope="col"
              sizePreset={sizePreset}
            >
              <Text sizePreset={textSizePreset}>{column.header}</Text>
            </StyledTableHeadCell>
          ))}
        </StyledTableRow>
      </StyledTableHead>
      <StyledTableBody>
        {rows.map((row, rowIndex) => (
          <StyledTableRow key={rowIndex} sizePreset={sizePreset}>
            {numbered && (
              <StyledTableCell align="end" sizePreset={sizePreset}>
                <Text sizePreset={textSizePreset}>{rowIndex + 1}</Text>
              </StyledTableCell>
            )}
            {columns.map((column) => (
              <StyledTableCell
                key={column.key}
                align={column.align}
                sizePreset={sizePreset}
              >
                <Text sizePreset={textSizePreset}>{String(row[column.key] ?? '')}</Text>
              </StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
      </StyledTableBody>
    </StyledTable>
  );

  /* Без рамки ScrollPort — сам корень: layout-пропы и скролл на нём, лишней обёртки нет. */
  if (!bordered) {
    return <ScrollPort {...layout}>{table}</ScrollPort>;
  }

  return (
    <StyledTableFrame {...layout}>
      <ScrollPort>{table}</ScrollPort>
    </StyledTableFrame>
  );
}

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Checkbox } from '@ui/checkbox';
import { ScrollPort } from '@ui/scroll-port';
import { Text } from '@ui/text';
import { type TextSizePreset } from '@ui/text/text.styles';

import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableCellWithActions,
  StyledTableCheckableCell,
  StyledTableClip,
  StyledTableCol,
  StyledTableFoot,
  StyledTableFootHeadCell,
  StyledTableFrame,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableHeaderAddButton,
  StyledTableHeaderKeywordBar,
  StyledTableRow,
  StyledTableRowLeading,
  splitLayoutProps,
  tableTextSizePreset,
  type TableAlign,
  type TableStyleProps,
} from './table.styles';

/** Ширина колонки нумерации в fixed-режиме. */
const NUMBER_COLUMN_INLINE_SIZE = '3.5rem';

/** Ширина колонки чекбокса в fixed-режиме (отдельная колонка без rowCheckboxColumnKey). */
const CHECKBOX_COLUMN_INLINE_SIZE = '2.75rem';

/** Минимум выбранных строк, при котором есть «группа»: bulk-действия и групповой чекбокс в шапке. */
const BULK_SELECTION_MIN = 2;

export type TableCellRenderContext = {
  textSizePreset: TextSizePreset;
};

export type TableColumn<Row> = {
  align?: TableAlign;
  ellipsis?: boolean;
  header: string;
  inlineSize?: string;
  key: Extract<keyof Row, string>;
  renderCell?: (
    row: Row,
    rowIndex: number,
    context: TableCellRenderContext
  ) => ReactNode;
};

type TableSelectionProps<Row> = {
  checkable: true;
  /** Уникальный ключ каждой видимой строки; дубли ломают selection и React key. */
  getRowKey: (row: Row) => string;
  onSelectedKeysChange: (keys: Set<string>) => void;
  /** Действия над всеми выделенными строками (шапка и дубль внизу при 2+ выбранных). */
  renderBulkSelectionActions?: () => ReactNode;
  /**
   * Создание новой записи по кнопке «+» в шапке.
   * Без колбэка кнопка «+» видна, но disabled (заглушка).
   * Рендерится только при заданном `rowCheckboxColumnKey`.
   */
  onAddRow?: () => void;
  renderSelectedRowActions?: (row: Row) => ReactNode;
  /** Чекбокс строки внутри колонки (перед +/- и текстом), без отдельной колонки ☐. */
  rowCheckboxColumnKey?: Extract<keyof Row, string>;
  selectedKeys: ReadonlySet<string>;
  selectedRowActionsColumnKey?: Extract<keyof Row, string>;
};

type TableProps<Row> = {
  columns: TableColumn<Row>[];
  numbered?: boolean;
  rows: Row[];
} & TableStyleProps &
  (
    | ({ checkable?: false } & Omit<
        ComponentPropsWithRef<'table'>,
        keyof TableStyleProps | 'className' | 'style'
      >)
    | (TableSelectionProps<Row> &
        Omit<
          ComponentPropsWithRef<'table'>,
          keyof TableStyleProps | 'className' | 'style' | keyof TableSelectionProps<Row>
        >)
  );

function TableCheckbox({
  ariaLabel,
  checked,
  onToggle,
}: {
  ariaLabel: string;
  checked: boolean;
  onToggle: () => void;
}): ReactNode {
  return (
    <Checkbox
      aria-label={ariaLabel}
      bare
      checked={checked}
      sizePreset="small"
      onChange={onToggle}
    />
  );
}

export function Table<Row>(props: TableProps<Row>) {
  const {
    bordered = true,
    columns,
    hoverHighlight = false,
    numbered = true,
    rows,
    sizePreset,
    striped = false,
    ...rest
  } = props;

  const checkable = props.checkable === true;
  const { layout, rest: tableAttrs } = splitLayoutProps(rest);
  const textSizePreset = tableTextSizePreset(sizePreset);
  const rowCheckboxColumnKey = checkable ? props.rowCheckboxColumnKey : undefined;
  const separateCheckboxColumn = checkable && rowCheckboxColumnKey === undefined;
  const fixed =
    separateCheckboxColumn || columns.some((column) => column.inlineSize !== undefined);

  const selectedKeys = checkable ? props.selectedKeys : new Set<string>();
  const allRowKeys = checkable ? rows.map((row) => props.getRowKey(row)) : [];
  const allRowsSelected =
    checkable &&
    selectedKeys.size > 0 &&
    allRowKeys.every((key) => selectedKeys.has(key));
  const hasBulkSelection = checkable && selectedKeys.size >= BULK_SELECTION_MIN;
  const showBulkActions = hasBulkSelection;
  const actionsColumnKey = checkable ? props.selectedRowActionsColumnKey : undefined;

  const toggleRowKey = (rowKey: string): void => {
    if (!checkable) {
      return;
    }

    const next = new Set(props.selectedKeys);

    if (next.has(rowKey)) {
      next.delete(rowKey);
    } else {
      next.add(rowKey);
    }

    props.onSelectedKeysChange(next);
  };

  const toggleAllRows = (): void => {
    if (!checkable) {
      return;
    }

    if (hasBulkSelection) {
      props.onSelectedKeysChange(new Set());
      return;
    }

    props.onSelectedKeysChange(new Set(allRowKeys));
  };

  const onAddRow = checkable ? props.onAddRow : undefined;

  const renderKeywordColumnHeader = (column: TableColumn<Row>): ReactNode => (
    <StyledTableHeaderKeywordBar>
      <StyledTableRowLeading>
        <TableCheckbox
          ariaLabel={hasBulkSelection ? 'Clear selection' : 'Select all rows'}
          checked={hasBulkSelection}
          onToggle={toggleAllRows}
        />
        <StyledTableHeaderAddButton
          aria-label="Add row"
          disabled={!onAddRow}
          tabIndex={onAddRow ? undefined : -1}
          type="button"
          onClick={onAddRow}
        />
        <Text sizePreset={textSizePreset}>{column.header}</Text>
      </StyledTableRowLeading>
      {showBulkActions && props.renderBulkSelectionActions?.()}
    </StyledTableHeaderKeywordBar>
  );

  const renderHeaderRow = (
    HeadCell: typeof StyledTableHeadCell | typeof StyledTableFootHeadCell,
    isThead: boolean,
  ): ReactNode => (
    <StyledTableRow sizePreset={sizePreset}>
      {separateCheckboxColumn && (
        <HeadCell
          align="center"
          sizePreset={sizePreset}
          {...(isThead ? { scope: 'col' as const } : {})}
        >
          <span className="visually-hidden">Select</span>
        </HeadCell>
      )}
      {numbered && (
        <HeadCell
          align="end"
          sizePreset={sizePreset}
          {...(isThead ? { scope: 'col' as const } : {})}
        >
          <Text sizePreset={textSizePreset}>#</Text>
        </HeadCell>
      )}
      {columns.map((column) => (
        <HeadCell
          key={column.key}
          align={column.align}
          ellipsis={column.ellipsis}
          sizePreset={sizePreset}
          {...(isThead ? { scope: 'col' as const } : {})}
        >
          {checkable &&
          rowCheckboxColumnKey !== undefined &&
          column.key === rowCheckboxColumnKey ? (
            renderKeywordColumnHeader(column)
          ) : (
            <Text sizePreset={textSizePreset}>{column.header}</Text>
          )}
        </HeadCell>
      ))}
    </StyledTableRow>
  );

  const table = (
    <StyledTable {...tableAttrs} tableLayout={fixed ? 'fixed' : 'auto'}>
      {fixed && (
        <colgroup>
          {separateCheckboxColumn && (
            <StyledTableCol inlineSize={CHECKBOX_COLUMN_INLINE_SIZE} />
          )}
          {numbered && <StyledTableCol inlineSize={NUMBER_COLUMN_INLINE_SIZE} />}
          {columns.map((column) => (
            <StyledTableCol key={column.key} inlineSize={column.inlineSize} />
          ))}
        </colgroup>
      )}
      <StyledTableHead>{renderHeaderRow(StyledTableHeadCell, true)}</StyledTableHead>
      <StyledTableBody $hoverHighlight={hoverHighlight} $striped={striped}>
        {rows.map((row, rowIndex) => {
          const rowKey = checkable ? props.getRowKey(row) : String(rowIndex);
          const isSelected = checkable && selectedKeys.has(rowKey);
          const showRowActions =
            isSelected &&
            (selectedKeys.size === 1 || !allRowsSelected) &&
            actionsColumnKey !== undefined &&
            props.renderSelectedRowActions;

          return (
            <StyledTableRow key={rowKey} sizePreset={sizePreset}>
              {separateCheckboxColumn && (
                <StyledTableCell align="center" sizePreset={sizePreset}>
                  <TableCheckbox
                    ariaLabel={`Select row ${rowKey}`}
                    checked={isSelected}
                    onToggle={() => {
                      toggleRowKey(rowKey);
                    }}
                  />
                </StyledTableCell>
              )}
              {numbered && (
                <StyledTableCell align="end" sizePreset={sizePreset}>
                  <Text sizePreset={textSizePreset}>{rowIndex + 1}</Text>
                </StyledTableCell>
              )}
              {columns.map((column) => {
                const cellContent = column.renderCell ? (
                  column.renderCell(row, rowIndex, { textSizePreset })
                ) : (
                  <Text sizePreset={textSizePreset}>
                    {String(row[column.key] ?? '')}
                  </Text>
                );
                const showRowCheckbox =
                  checkable &&
                  rowCheckboxColumnKey !== undefined &&
                  column.key === rowCheckboxColumnKey;
                const showRowActionsInColumn =
                  showRowActions && column.key === actionsColumnKey;

                const rowCheckbox = showRowCheckbox ? (
                  <TableCheckbox
                    ariaLabel={`Select row ${rowKey}`}
                    checked={isSelected}
                    onToggle={() => {
                      toggleRowKey(rowKey);
                    }}
                  />
                ) : null;

                const bodyContent =
                  (showRowActionsInColumn && (
                    <StyledTableCellWithActions>
                      {cellContent}
                      {props.renderSelectedRowActions?.(row)}
                    </StyledTableCellWithActions>
                  )) ||
                  cellContent;

                return (
                  <StyledTableCell
                    key={column.key}
                    align={column.align}
                    ellipsis={column.ellipsis && !showRowActionsInColumn}
                    sizePreset={sizePreset}
                  >
                    {(showRowCheckbox && showRowActionsInColumn && (
                      <StyledTableCheckableCell>
                        {rowCheckbox}
                        {bodyContent}
                      </StyledTableCheckableCell>
                    )) ||
                      (showRowCheckbox && (
                        <StyledTableRowLeading>
                          {rowCheckbox}
                          {bodyContent}
                        </StyledTableRowLeading>
                      )) ||
                      bodyContent}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
          );
        })}
      </StyledTableBody>
      {checkable && (
        <StyledTableFoot>
          {renderHeaderRow(StyledTableFootHeadCell, false)}
        </StyledTableFoot>
      )}
    </StyledTable>
  );

  if (!bordered) {
    return (
      <ScrollPort {...layout}>
        <StyledTableClip>{table}</StyledTableClip>
      </ScrollPort>
    );
  }

  return (
    <StyledTableFrame {...layout}>
      <ScrollPort>{table}</ScrollPort>
    </StyledTableFrame>
  );
}

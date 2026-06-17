import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'styled-components';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { useFocusTrap } from '@hooks/use-focus-trap';
import { Checkbox } from '@ui/checkbox';
import { ScrollPort } from '@ui/scroll-port';
import { Text } from '@ui/text';
import { type TextSizePreset } from '@ui/text/text.styles';

import {
  COMPOSE_PANEL_BORDER_WIDTH_PX,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableCellWithActions,
  StyledTableCheckableCell,
  StyledTableClip,
  StyledTableCol,
  StyledTableComposeErrorCell,
  StyledTableComposeInnerCell,
  StyledTableComposeInnerFootCell,
  StyledTableComposeInnerHeadCell,
  StyledTableComposeInnerTable,
  StyledTableComposePanel,
  StyledTableFoot,
  StyledTableFootHeadCell,
  StyledTableFrame,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableHeaderAddButton,
  StyledTableHeaderKeywordBar,
  StyledTableHeaderMarkSpacer,
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

export type TableAddRowSource = 'foot' | 'head';

export type TableCellRenderContext = {
  composeError?: string;
  composeErrorId?: string;
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

/** Подсказка в строке compose-панели, когда ошибки нет и включён резерв высоты. */
const DEFAULT_COMPOSE_HINT =
  'Press Esc to close without saving, or Enter to add a row to the table.';

type TableComposeProps<Row> = {
  /** Режим ввода новой строки — панель как у Listbox. */
  composeError?: string;
  /**
   * Текст подсказки в зарезервированной строке, пока нет `composeError`.
   * Используется при `composeReserveErrorSpace`.
   */
  composeHint?: string;
  composeRowActive?: boolean;
  /** Якорь панели: шапка (`head`) или футер (`foot`). */
  composeRowSource?: TableAddRowSource;
  /**
   * Резерв высоты под строку подсказки/ошибки, чтобы смена текста не сдвигала панель.
   * Как `reserveErrorSpace` у Input.
   */
  composeReserveErrorSpace?: boolean;
  onComposeCancel?: () => void;
  renderComposeCell?: (
    column: TableColumn<Row>,
    context: TableCellRenderContext
  ) => ReactNode;
};

type TableSelectionProps<Row> = {
  checkable: true;
  getRowKey: (row: Row) => string;
  onSelectedKeysChange: (keys: Set<string>) => void;
  renderBulkSelectionActions?: () => ReactNode;
  /**
   * Запрос на добавление строки по «+» в шапке (`head`) или футере (`foot`).
   * Без колбэка кнопка «+» видна, но disabled (заглушка).
   */
  onAddRow?: (source: TableAddRowSource) => void;
  renderSelectedRowActions?: (row: Row) => ReactNode;
  rowCheckboxColumnKey?: Extract<keyof Row, string>;
  selectedKeys: ReadonlySet<string>;
  selectedRowActionsColumnKey?: Extract<keyof Row, string>;
};

type TableProps<Row> = {
  columns: TableColumn<Row>[];
  numbered?: boolean;
  rows: Row[];
} & TableComposeProps<Row> &
  TableStyleProps &
  (
    | ({ checkable?: false } & Omit<
        ComponentPropsWithRef<'table'>,
        keyof TableStyleProps | keyof TableComposeProps<Row> | 'className' | 'style'
      >)
    | (TableSelectionProps<Row> &
        Omit<
          ComponentPropsWithRef<'table'>,
          | keyof TableStyleProps
          | keyof TableComposeProps<Row>
          | 'className'
          | 'style'
          | keyof TableSelectionProps<Row>
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
    composeError,
    composeHint = DEFAULT_COMPOSE_HINT,
    composeRowActive = false,
    composeRowSource,
    composeReserveErrorSpace = true,
    hoverHighlight = false,
    numbered = true,
    onComposeCancel,
    renderComposeCell,
    rows,
    sizePreset,
    striped = false,
    ...rest
  } = props;

  const theme = useTheme();
  const composeErrorId = useId();

  const checkable = props.checkable === true;
  const { layout, rest: tableAttrs } = splitLayoutProps(rest);
  const textSizePreset = tableTextSizePreset(sizePreset);
  const rowCheckboxColumnKey = checkable ? props.rowCheckboxColumnKey : undefined;
  const separateCheckboxColumn = checkable && rowCheckboxColumnKey === undefined;
  const fixed =
    separateCheckboxColumn || columns.some((column) => column.inlineSize !== undefined);

  const headAnchorRef = useRef<HTMLTableSectionElement>(null);
  const footAnchorRef = useRef<HTMLTableSectionElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tableRootRef = useRef<HTMLTableElement>(null);
  const headAddButtonRef = useRef<HTMLButtonElement>(null);
  const footAddButtonRef = useRef<HTMLButtonElement>(null);

  const selectedKeys = checkable ? props.selectedKeys : new Set<string>();
  const allRowKeys = checkable ? rows.map((row) => props.getRowKey(row)) : [];
  const allRowsSelected =
    checkable &&
    selectedKeys.size > 0 &&
    allRowKeys.every((key) => selectedKeys.has(key));
  const hasBulkSelection = checkable && selectedKeys.size >= BULK_SELECTION_MIN;
  const showBulkActions = hasBulkSelection;
  const actionsColumnKey = checkable ? props.selectedRowActionsColumnKey : undefined;
  const hideHeadAnchor = composeRowActive && composeRowSource === 'head';
  const hideFootAnchor = composeRowActive && composeRowSource === 'foot';
  const showComposePanel =
    composeRowActive &&
    composeRowSource !== undefined &&
    renderComposeCell !== undefined;
  const composeErrorMessage = composeError?.trim() ?? '';
  const hasComposeError = composeErrorMessage !== '';
  const composeCellContext: TableCellRenderContext = {
    composeError: hasComposeError ? composeErrorMessage : undefined,
    composeErrorId,
    textSizePreset,
  };

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

  const renderKeywordColumnHeader = (
    column: TableColumn<Row>,
    addSource: TableAddRowSource,
    interactive: boolean
  ): ReactNode => (
    <StyledTableHeaderKeywordBar>
      <StyledTableRowLeading>
        {interactive ? (
          <TableCheckbox
            ariaLabel={hasBulkSelection ? 'Clear selection' : 'Select all rows'}
            checked={hasBulkSelection}
            onToggle={toggleAllRows}
          />
        ) : (
          <StyledTableHeaderMarkSpacer aria-hidden="true" />
        )}
        {interactive ? (
          <StyledTableHeaderAddButton
            ref={addSource === 'head' ? headAddButtonRef : footAddButtonRef}
            aria-label="Add row"
            disabled={!onAddRow || composeRowActive}
            tabIndex={onAddRow && !composeRowActive ? undefined : -1}
            type="button"
            onClick={() => {
              onAddRow?.(addSource);
            }}
          />
        ) : (
          <StyledTableHeaderMarkSpacer aria-hidden="true" />
        )}
        <Text sizePreset={textSizePreset}>{column.header}</Text>
      </StyledTableRowLeading>
      {interactive && showBulkActions && props.renderBulkSelectionActions?.()}
    </StyledTableHeaderKeywordBar>
  );

  const renderHeaderCells = (
    HeadCell:
      | typeof StyledTableHeadCell
      | typeof StyledTableFootHeadCell
      | typeof StyledTableComposeInnerHeadCell
      | typeof StyledTableComposeInnerFootCell,
    isThead: boolean,
    addSource: TableAddRowSource,
    interactive: boolean
  ): ReactNode => (
    <>
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
            renderKeywordColumnHeader(column, addSource, interactive)
          ) : (
            <Text sizePreset={textSizePreset}>{column.header}</Text>
          )}
        </HeadCell>
      ))}
    </>
  );

  const renderComposeCells = (): ReactNode => (
    <>
      {separateCheckboxColumn && (
        <StyledTableComposeInnerCell align="center" sizePreset={sizePreset} />
      )}
      {numbered && <StyledTableComposeInnerCell align="end" sizePreset={sizePreset} />}
      {columns.map((column) => {
        const composeCellContent = renderComposeCell?.(column, composeCellContext);
        const cellBody =
          (checkable &&
            rowCheckboxColumnKey !== undefined &&
            column.key === rowCheckboxColumnKey && (
              <StyledTableRowLeading>
                <StyledTableHeaderMarkSpacer aria-hidden="true" />
                <StyledTableHeaderMarkSpacer aria-hidden="true" />
                {composeCellContent}
              </StyledTableRowLeading>
            )) ||
          composeCellContent;

        return (
          <StyledTableComposeInnerCell
            key={column.key}
            align={column.align}
            ellipsis={false}
            sizePreset={sizePreset}
          >
            {cellBody}
          </StyledTableComposeInnerCell>
        );
      })}
    </>
  );

  const renderColgroup = (): ReactNode =>
    fixed ? (
      <colgroup>
        {separateCheckboxColumn && (
          <StyledTableCol inlineSize={CHECKBOX_COLUMN_INLINE_SIZE} />
        )}
        {numbered && <StyledTableCol inlineSize={NUMBER_COLUMN_INLINE_SIZE} />}
        {columns.map((column) => (
          <StyledTableCol key={column.key} inlineSize={column.inlineSize} />
        ))}
      </colgroup>
    ) : null;

  const composeColumnCount =
    (separateCheckboxColumn ? 1 : 0) + (numbered ? 1 : 0) + columns.length;

  const renderComposeErrorRow = (): ReactNode => {
    if (!hasComposeError && !composeReserveErrorSpace) {
      return null;
    }

    const hintMessage = composeHint.trim();
    const rowMessage = hasComposeError
      ? composeErrorMessage
      : composeReserveErrorSpace
        ? hintMessage
        : null;

    if (rowMessage === null || rowMessage === '') {
      return null;
    }

    return (
      <StyledTableRow data-compose-error sizePreset={sizePreset}>
        <StyledTableComposeErrorCell
          colSpan={composeColumnCount}
          sizePreset={sizePreset}
        >
          <Text
            align="center"
            aria-live={hasComposeError ? 'polite' : undefined}
            color={hasComposeError ? theme.colors.danger : theme.colors.muted}
            id={composeErrorId}
            minBlockSize={composeReserveErrorSpace ? '1.25rem' : undefined}
            sizePreset="thin"
          >
            {rowMessage}
          </Text>
        </StyledTableComposeErrorCell>
      </StyledTableRow>
    );
  };

  useLayoutEffect(() => {
    if (!showComposePanel) {
      return;
    }

    const anchor =
      composeRowSource === 'head' ? headAnchorRef.current : footAnchorRef.current;
    const panel = panelRef.current;

    if (!anchor || !panel) {
      return;
    }

    function applyPanelPosition(): void {
      const anchorElement =
        composeRowSource === 'head' ? headAnchorRef.current : footAnchorRef.current;
      const panelElement = panelRef.current;

      if (!anchorElement || !panelElement) {
        return;
      }

      const rect = anchorElement.getBoundingClientRect();
      const rowHeight = rect.height;
      const errorRow = panelElement.querySelector('[data-compose-error]');
      const errorRowHeight = errorRow instanceof HTMLElement ? errorRow.offsetHeight : 0;
      const border = COMPOSE_PANEL_BORDER_WIDTH_PX;
      const contentHeight = rowHeight * 2 + errorRowHeight;

      panelElement.style.inlineSize = `${rect.width + border * 2}px`;
      panelElement.style.insetInlineStart = `${rect.left - border}px`;
      panelElement.style.blockSize = `${contentHeight + border * 2}px`;

      if (composeRowSource === 'head') {
        panelElement.style.insetBlockStart = `${rect.top - border}px`;
        return;
      }

      panelElement.style.insetBlockStart = `${rect.top - rowHeight - errorRowHeight - border}px`;
    }

    applyPanelPosition();
    window.addEventListener('resize', applyPanelPosition);

    return () => {
      window.removeEventListener('resize', applyPanelPosition);
    };
  }, [
    composeReserveErrorSpace,
    composeRowSource,
    hasComposeError,
    showComposePanel,
    rows.length,
    columns.length,
  ]);

  const dismissCompose = useCallback(() => {
    onComposeCancel?.();
  }, [onComposeCancel]);

  const isInsideComposeLayer = useCallback((target: Node): boolean => {
    return (
      (tableRootRef.current?.contains(target) ?? false) ||
      (panelRef.current?.contains(target) ?? false)
    );
  }, []);

  useAnchoredDismiss({
    active: showComposePanel && onComposeCancel !== undefined,
    isInside: isInsideComposeLayer,
    onDismiss: dismissCompose,
  });

  useFocusTrap({
    active: showComposePanel,
    containerRef: panelRef,
    returnFocusRef: composeRowSource === 'foot' ? footAddButtonRef : headAddButtonRef,
  });

  const composePanel =
    showComposePanel &&
    createPortal(
      <StyledTableComposePanel
        ref={panelRef}
        $hasError={hasComposeError}
        aria-label="Add row"
        aria-modal="true"
        role="dialog"
        sizePreset={sizePreset}
      >
        <StyledTableComposeInnerTable tableLayout={fixed ? 'fixed' : 'auto'}>
          {renderColgroup()}
          <tbody>
            {composeRowSource === 'head' ? (
              <>
                <StyledTableRow sizePreset={sizePreset}>
                  {renderHeaderCells(
                    StyledTableComposeInnerHeadCell,
                    true,
                    'head',
                    false
                  )}
                </StyledTableRow>
                <StyledTableRow data-compose-row sizePreset={sizePreset}>
                  {renderComposeCells()}
                </StyledTableRow>
                {renderComposeErrorRow()}
              </>
            ) : (
              <>
                <StyledTableRow data-compose-row sizePreset={sizePreset}>
                  {renderComposeCells()}
                </StyledTableRow>
                {renderComposeErrorRow()}
                <StyledTableRow data-compose-footer sizePreset={sizePreset}>
                  {renderHeaderCells(
                    StyledTableComposeInnerFootCell,
                    false,
                    'foot',
                    false
                  )}
                </StyledTableRow>
              </>
            )}
          </tbody>
        </StyledTableComposeInnerTable>
      </StyledTableComposePanel>,
      document.body
    );

  const table = (
    <>
      <StyledTable
        {...tableAttrs}
        ref={tableRootRef}
        tableLayout={fixed ? 'fixed' : 'auto'}
      >
        {renderColgroup()}
        <StyledTableHead $composeHidden={hideHeadAnchor} ref={headAnchorRef}>
          <StyledTableRow sizePreset={sizePreset}>
            {renderHeaderCells(StyledTableHeadCell, true, 'head', true)}
          </StyledTableRow>
        </StyledTableHead>
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
          <StyledTableFoot $composeHidden={hideFootAnchor} ref={footAnchorRef}>
            <StyledTableRow sizePreset={sizePreset}>
              {renderHeaderCells(StyledTableFootHeadCell, false, 'foot', true)}
            </StyledTableRow>
          </StyledTableFoot>
        )}
      </StyledTable>
      {composePanel}
    </>
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

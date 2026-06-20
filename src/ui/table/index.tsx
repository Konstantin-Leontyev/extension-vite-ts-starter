import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'styled-components';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { useFocusTrap } from '@hooks/use-focus-trap';
import { useLongPress } from '@hooks/use-long-press';
import { Checkbox } from '@ui/checkbox';
import { textSizePreset as resolveTextSizePreset } from '@ui/presets';
import { ScrollPort } from '@ui/scroll-port';
import { Text } from '@ui/text';
import { type TextSizePreset } from '@ui/text';

import {
  StyledTableCellLead,
  TableCell,
  type TableCellAlign,
} from './table-cell';
import {
  COMPOSE_PANEL_BORDER_WIDTH_PX,
  DEFAULT_TABLE_BORDERED,
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_NUMBERED,
  DEFAULT_TABLE_STRIPED,
  StyledTable,
  StyledTableBody,
  StyledTableCellTrailing,
  StyledTableClip,
  StyledTableCol,
  StyledTableComposeErrorCell,
  StyledTableComposeInnerTable,
  StyledTableComposePanel,
  StyledTableFoot,
  StyledTableFrame,
  StyledTableHead,
  StyledTableHeaderAddButton,
  StyledTableHeaderKeywordBar,
  StyledTableHeaderMarkSpacer,
  StyledTableRow,
  splitLayoutProps,
  type TableStyleProps,
} from './table.styles';

/** Горизонтальное выравнивание ячейки таблицы. */
export type TableAlign = TableCellAlign;

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
  editError?: string;
  editErrorId?: string;
  textSizePreset: TextSizePreset;
};

export type TableColumn<Row> = {
  align?: TableAlign;
  ellipsis?: boolean;
  header: string;
  /** Горизонтальное выравнивание заголовка; данные — через `align`. */
  headerAlign?: TableAlign;
  inlineSize?: string;
  /** Не переносить содержимое ячейки (`white-space: nowrap`). */
  nowrap?: boolean;
  key: Extract<keyof Row, string>;
  renderCell?: (
    row: Row,
    rowIndex: number,
    context: TableCellRenderContext
  ) => ReactNode;
};

/** Подсказка в строке compose-панели, когда ошибки нет и включён резерв высоты. */
const DEFAULT_COMPOSE_HINT =
  'Press Esc to close without saving, or Enter to add the row. Use Tab to move between fields.';

/** Подсказка в строке edit-панели, когда ошибки нет и включён резерв высоты. */
const DEFAULT_EDIT_HINT =
  'Press Esc to close without saving, or Enter to save changes.';

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
  /**
   * Запрос на добавление строки по «+» в шапке (`head`) или футере (`foot`).
   * Без колбэка кнопка «+» видна, но disabled (заглушка). Активна только при `editable`.
   */
  onAddRow?: (source: TableAddRowSource) => void;
  onComposeCancel?: () => void;
  renderComposeCell?: (
    column: TableColumn<Row>,
    context: TableCellRenderContext
  ) => ReactNode;
};

type TableEditProps<Row> = {
  /** Режим редактирования существующей строки — панель поверх якорной строки. */
  editRowActive?: boolean;
  editRowKey?: string;
  editError?: string;
  /**
   * Текст подсказки в зарезервированной строке, пока нет `editError`.
   * Используется при `editReserveErrorSpace`.
   */
  editHint?: string;
  /**
   * Резерв высоты под строку подсказки/ошибки, чтобы смена текста не сдвигала панель.
   * Как `reserveErrorSpace` у Input.
   */
  editReserveErrorSpace?: boolean;
  onEditCancel?: () => void;
  onEditRow?: (row: Row) => void;
  renderEditCell?: (
    column: TableColumn<Row>,
    row: Row,
    context: TableCellRenderContext
  ) => ReactNode;
};

type TableSelectionProps<Row> = {
  checkable: true;
  getRowKey: (row: Row) => string;
  isRowSelectable?: (row: Row) => boolean;
  onSelectedKeysChange: (keys: Set<string>) => void;
  renderBulkSelectionActions?: () => ReactNode;
  renderSelectedRowActions?: (row: Row) => ReactNode;
  rowCheckboxColumnKey?: Extract<keyof Row, string>;
  selectedKeys: ReadonlySet<string>;
  selectedRowActionsColumnKey?: Extract<keyof Row, string>;
};

type TableProps<Row> = {
  columns: TableColumn<Row>[];
  /** Мастер-переключатель работы со строками (add/edit). false → только вывод строк. */
  editable?: boolean;
  numbered?: boolean;
  rows: Row[];
} & TableComposeProps<Row> &
  TableEditProps<Row> &
  TableStyleProps &
  (
    | ({ checkable?: false } & Omit<
        ComponentPropsWithRef<'table'>,
        | keyof TableStyleProps
        | keyof TableComposeProps<Row>
        | keyof TableEditProps<Row>
        | 'className'
        | 'style'
      >)
    | (TableSelectionProps<Row> &
        Omit<
          ComponentPropsWithRef<'table'>,
          | keyof TableStyleProps
          | keyof TableComposeProps<Row>
          | keyof TableEditProps<Row>
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

type TableBodyRowProps<Row> = {
  actionsColumnKey: Extract<keyof Row, string> | undefined;
  anchorRef: RefObject<HTMLTableRowElement | null>;
  checkable: boolean;
  columns: TableColumn<Row>[];
  editRowActive: boolean;
  isEditAnchor: boolean;
  isSelected: boolean;
  onEditRow: ((row: Row) => void) | undefined;
  renderSelectedRowActions: ((row: Row) => ReactNode) | undefined;
  resolvedNumbered: boolean;
  row: Row;
  rowCheckboxColumnKey: Extract<keyof Row, string> | undefined;
  rowIndex: number;
  rowKey: string;
  rowSelectable: boolean;
  separateCheckboxColumn: boolean;
  showRowActions: boolean;
  sizePreset: TableStyleProps['sizePreset'];
  textSizePreset: TextSizePreset;
  toggleRowKey: (rowKey: string) => void;
};

function TableBodyRow<Row>({
  actionsColumnKey,
  anchorRef,
  checkable,
  columns,
  editRowActive,
  isEditAnchor,
  isSelected,
  onEditRow,
  renderSelectedRowActions,
  resolvedNumbered,
  row,
  rowCheckboxColumnKey,
  rowIndex,
  rowKey,
  rowSelectable,
  separateCheckboxColumn,
  showRowActions,
  sizePreset,
  textSizePreset,
  toggleRowKey,
}: TableBodyRowProps<Row>): ReactNode {
  const { pointerProps } = useLongPress({
    disabled: !onEditRow || editRowActive || !rowSelectable,
    onLongPress: onEditRow ? () => onEditRow(row) : undefined,
  });

  return (
    <StyledTableRow
      ref={isEditAnchor ? anchorRef : undefined}
      $editHidden={isEditAnchor}
      sizePreset={sizePreset}
      {...(pointerProps ?? {})}
    >
      {separateCheckboxColumn && (
        <TableCell align="center" sizePreset={sizePreset}>
          {rowSelectable && (
            <TableCheckbox
              ariaLabel={`Select row ${rowKey}`}
              checked={isSelected}
              onToggle={() => {
                toggleRowKey(rowKey);
              }}
            />
          )}
        </TableCell>
      )}
      {resolvedNumbered && (
        <TableCell align="end" sizePreset={sizePreset}>
          <Text sizePreset={textSizePreset}>{rowIndex + 1}</Text>
        </TableCell>
      )}
      {columns.map((column) => {
        const cellContent = column.renderCell ? (
          column.renderCell(row, rowIndex, { textSizePreset })
        ) : (
          <Text sizePreset={textSizePreset}>{String(row[column.key] ?? '')}</Text>
        );
        const showRowCheckbox =
          rowSelectable &&
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
            <StyledTableCellTrailing>
              {cellContent}
              {renderSelectedRowActions?.(row)}
            </StyledTableCellTrailing>
          )) ||
          cellContent;

        return (
          <TableCell
            key={column.key}
            align={column.align}
            ellipsis={column.ellipsis && !showRowActionsInColumn}
            nowrap={column.nowrap}
            sizePreset={sizePreset}
          >
            {(showRowCheckbox && (
              <StyledTableCellLead>
                {rowCheckbox}
                {bodyContent}
              </StyledTableCellLead>
            )) ||
              bodyContent}
          </TableCell>
        );
      })}
    </StyledTableRow>
  );
}

export function Table<Row>(props: TableProps<Row>) {
  const {
    bordered,
    columns,
    composeError,
    composeHint = DEFAULT_COMPOSE_HINT,
    composeRowActive: composeRowActiveProp = false,
    composeRowSource,
    composeReserveErrorSpace = true,
    editable = false,
    editError,
    editHint = DEFAULT_EDIT_HINT,
    editReserveErrorSpace = true,
    editRowActive: editRowActiveProp = false,
    editRowKey,
    hoverHighlight,
    numbered,
    onAddRow: onAddRowProp,
    onComposeCancel,
    onEditCancel,
    onEditRow: onEditRowProp,
    renderComposeCell,
    renderEditCell,
    rows,
    sizePreset,
    striped,
    ...rest
  } = props;

  const resolvedBordered = bordered ?? DEFAULT_TABLE_BORDERED;
  const resolvedHoverHighlight = hoverHighlight ?? DEFAULT_TABLE_HOVER_HIGHLIGHT;
  const resolvedNumbered = numbered ?? DEFAULT_TABLE_NUMBERED;
  const resolvedStriped = striped ?? DEFAULT_TABLE_STRIPED;

  // Гейт editable: без него таблица — чистый вывод строк (нет add/edit, порталов, long-press).
  const composeRowActive = editable && composeRowActiveProp;
  const editRowActive = editable && editRowActiveProp;
  const onAddRow = editable ? onAddRowProp : undefined;
  const onEditRow = editable ? onEditRowProp : undefined;

  const theme = useTheme();
  const composeErrorId = useId();
  const editErrorId = useId();

  const checkable = props.checkable === true;
  const { layout, rest: tableAttrs } = splitLayoutProps(rest);
  const textSizePreset = resolveTextSizePreset(sizePreset);
  const rowCheckboxColumnKey = checkable ? props.rowCheckboxColumnKey : undefined;
  const separateCheckboxColumn = checkable && rowCheckboxColumnKey === undefined;
  const fixed =
    separateCheckboxColumn || columns.some((column) => column.inlineSize !== undefined);

  const headAnchorRef = useRef<HTMLTableSectionElement>(null);
  const footAnchorRef = useRef<HTMLTableSectionElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const editPanelRef = useRef<HTMLDivElement>(null);
  const editRowAnchorRef = useRef<HTMLTableRowElement>(null);
  const tableRootRef = useRef<HTMLTableElement>(null);
  const headAddButtonRef = useRef<HTMLButtonElement>(null);
  const footAddButtonRef = useRef<HTMLButtonElement>(null);

  const selectedKeys = checkable ? props.selectedKeys : new Set<string>();
  const isRowSelectable = checkable
    ? (props.isRowSelectable ?? (() => true))
    : () => false;
  const allRowKeys = checkable
    ? rows
        .filter((row) => isRowSelectable(row))
        .map((row) => props.getRowKey(row))
    : [];
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
  const editingRow =
    editRowActive && editRowKey !== undefined
      ? rows.find((row, rowIndex) =>
          checkable ? props.getRowKey(row) === editRowKey : String(rowIndex) === editRowKey
        )
      : undefined;
  const showEditPanel =
    editRowActive &&
    editRowKey !== undefined &&
    editingRow !== undefined &&
    renderEditCell !== undefined;
  const composeErrorMessage = composeError?.trim() ?? '';
  const hasComposeError = composeErrorMessage !== '';
  const editErrorMessage = editError?.trim() ?? '';
  const hasEditError = editErrorMessage !== '';
  const composeCellContext: TableCellRenderContext = {
    composeError: hasComposeError ? composeErrorMessage : undefined,
    composeErrorId,
    textSizePreset,
  };
  const editCellContext: TableCellRenderContext = {
    editError: hasEditError ? editErrorMessage : undefined,
    editErrorId,
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

  const renderKeywordColumnHeader = (
    column: TableColumn<Row>,
    addSource: TableAddRowSource,
    interactive: boolean
  ): ReactNode => (
    <StyledTableHeaderKeywordBar>
      <StyledTableCellLead>
        {interactive ? (
          <TableCheckbox
            ariaLabel={hasBulkSelection ? 'Clear selection' : 'Select all rows'}
            checked={hasBulkSelection}
            onToggle={toggleAllRows}
          />
        ) : (
          <StyledTableHeaderMarkSpacer aria-hidden="true" />
        )}
        {(interactive && editable && (
          <StyledTableHeaderAddButton
            ref={addSource === 'head' ? headAddButtonRef : footAddButtonRef}
            aria-label="Add row"
            disabled={!onAddRow || composeRowActive || editRowActive}
            tabIndex={onAddRow && !composeRowActive && !editRowActive ? undefined : -1}
            type="button"
            onClick={() => {
              onAddRow?.(addSource);
            }}
          />
        )) ||
          (!interactive && <StyledTableHeaderMarkSpacer aria-hidden="true" />) ||
          null}
        <Text sizePreset={textSizePreset}>{column.header}</Text>
      </StyledTableCellLead>
      {interactive && showBulkActions && props.renderBulkSelectionActions?.()}
    </StyledTableHeaderKeywordBar>
  );

  const renderHeaderCells = (
    head: boolean,
    addSource: TableAddRowSource,
    interactive: boolean
  ): ReactNode => (
    <>
      {separateCheckboxColumn && (
        <TableCell
          align="center"
          head={head}
          sizePreset={sizePreset}
          {...(head ? { scope: 'col' as const } : {})}
        >
          <span className="visually-hidden">Select</span>
        </TableCell>
      )}
      {resolvedNumbered && (
        <TableCell
          align="end"
          head={head}
          sizePreset={sizePreset}
          {...(head ? { scope: 'col' as const } : {})}
        >
          <Text sizePreset={textSizePreset}>#</Text>
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell
          key={column.key}
          align={column.headerAlign ?? column.align}
          ellipsis={column.ellipsis}
          head={head}
          nowrap={column.nowrap}
          sizePreset={sizePreset}
          {...(head ? { scope: 'col' as const } : {})}
        >
          {checkable &&
          rowCheckboxColumnKey !== undefined &&
          column.key === rowCheckboxColumnKey ? (
            renderKeywordColumnHeader(column, addSource, interactive)
          ) : (
            <Text sizePreset={textSizePreset}>{column.header}</Text>
          )}
        </TableCell>
      ))}
    </>
  );

  const renderComposeCells = (): ReactNode => (
    <>
      {separateCheckboxColumn && (
        <TableCell align="center" sizePreset={sizePreset} />
      )}
      {resolvedNumbered && <TableCell align="end" sizePreset={sizePreset} />}
      {columns.map((column) => {
        const composeCellContent = renderComposeCell?.(column, composeCellContext);
        const cellBody =
          (checkable &&
            rowCheckboxColumnKey !== undefined &&
            column.key === rowCheckboxColumnKey && (
              <StyledTableCellLead>
                <StyledTableHeaderMarkSpacer aria-hidden="true" />
                <StyledTableHeaderMarkSpacer aria-hidden="true" />
                {composeCellContent}
              </StyledTableCellLead>
            )) ||
          composeCellContent;

        return (
          <TableCell
            key={column.key}
            align={column.align}
            nowrap={column.nowrap}
            sizePreset={sizePreset}
          >
            {cellBody}
          </TableCell>
        );
      })}
    </>
  );

  const renderEditCells = (row: Row): ReactNode => (
    <>
      {separateCheckboxColumn && (
        <TableCell align="center" sizePreset={sizePreset} />
      )}
      {resolvedNumbered && <TableCell align="end" sizePreset={sizePreset} />}
      {columns.map((column) => {
        const editCellContent = renderEditCell?.(column, row, editCellContext);
        const cellBody =
          (checkable &&
            rowCheckboxColumnKey !== undefined &&
            column.key === rowCheckboxColumnKey && (
              <StyledTableCellLead>
                <StyledTableHeaderMarkSpacer aria-hidden="true" />
                {editCellContent}
              </StyledTableCellLead>
            )) ||
          editCellContent;

        return (
          <TableCell
            key={column.key}
            align={column.align}
            nowrap={column.nowrap}
            sizePreset={sizePreset}
          >
            {cellBody}
          </TableCell>
        );
      })}
    </>
  );

  const renderColgroup = (): ReactNode => {
    if (!fixed) {
      return null;
    }

    return (
      <colgroup>
        {separateCheckboxColumn && (
          <StyledTableCol inlineSize={CHECKBOX_COLUMN_INLINE_SIZE} />
        )}
        {resolvedNumbered && <StyledTableCol inlineSize={NUMBER_COLUMN_INLINE_SIZE} />}
        {columns.map((column) => (
          <StyledTableCol key={column.key} inlineSize={column.inlineSize} />
        ))}
      </colgroup>
    );
  };

  const composeColumnCount =
    (separateCheckboxColumn ? 1 : 0) + (resolvedNumbered ? 1 : 0) + columns.length;

  const renderErrorRow = (variant: 'compose' | 'edit'): ReactNode => {
    const isCompose = variant === 'compose';
    const hasError = isCompose ? hasComposeError : hasEditError;
    const reserveErrorSpace = isCompose
      ? composeReserveErrorSpace
      : editReserveErrorSpace;

    if (!hasError && !reserveErrorSpace) {
      return null;
    }

    const hintMessage = (isCompose ? composeHint : editHint).trim();
    const rowMessage = hasError
      ? isCompose
        ? composeErrorMessage
        : editErrorMessage
      : reserveErrorSpace
        ? hintMessage
        : null;

    if (rowMessage === null || rowMessage === '') {
      return null;
    }

    const errorRowProps = isCompose
      ? { 'data-compose-error': '' }
      : { 'data-edit-error': '' };

    return (
      <StyledTableRow {...errorRowProps} sizePreset={sizePreset}>
        <StyledTableComposeErrorCell
          colSpan={composeColumnCount}
          sizePreset={sizePreset}
        >
          <Text
            align="center"
            aria-live={hasError ? 'polite' : undefined}
            color={hasError ? theme.colors.danger : theme.colors.muted}
            id={isCompose ? composeErrorId : editErrorId}
            minBlockSize={reserveErrorSpace ? '1.25rem' : undefined}
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

  useLayoutEffect(() => {
    if (!showEditPanel) {
      return;
    }

    const anchor = editRowAnchorRef.current;
    const panel = editPanelRef.current;

    if (!anchor || !panel) {
      return;
    }

    function applyEditPanelPosition(): void {
      const anchorElement = editRowAnchorRef.current;
      const panelElement = editPanelRef.current;

      if (!anchorElement || !panelElement) {
        return;
      }

      const rect = anchorElement.getBoundingClientRect();
      const rowHeight = rect.height;
      const errorRow = panelElement.querySelector('[data-edit-error]');
      const errorRowHeight = errorRow instanceof HTMLElement ? errorRow.offsetHeight : 0;
      const border = COMPOSE_PANEL_BORDER_WIDTH_PX;
      const contentHeight = rowHeight + errorRowHeight;

      panelElement.style.inlineSize = `${rect.width + border * 2}px`;
      panelElement.style.insetInlineStart = `${rect.left - border}px`;
      panelElement.style.insetBlockStart = `${rect.top - border}px`;
      panelElement.style.blockSize = `${contentHeight + border * 2}px`;
    }

    applyEditPanelPosition();
    window.addEventListener('resize', applyEditPanelPosition);

    return () => {
      window.removeEventListener('resize', applyEditPanelPosition);
    };
  }, [
    editReserveErrorSpace,
    editRowKey,
    hasEditError,
    showEditPanel,
    rows.length,
    columns.length,
  ]);

  const dismissCompose = useCallback(() => {
    onComposeCancel?.();
  }, [onComposeCancel]);

  const isInsideComposeLayer = useCallback((target: Node): boolean => {
    return panelRef.current?.contains(target) ?? false;
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

  const dismissEdit = useCallback(() => {
    onEditCancel?.();
  }, [onEditCancel]);

  const isInsideEditLayer = useCallback((target: Node): boolean => {
    return editPanelRef.current?.contains(target) ?? false;
  }, []);

  useAnchoredDismiss({
    active: showEditPanel && onEditCancel !== undefined,
    isInside: isInsideEditLayer,
    onDismiss: dismissEdit,
  });

  useFocusTrap({
    active: showEditPanel,
    containerRef: editPanelRef,
    returnFocusRef: editRowAnchorRef,
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
                <StyledTableRow data-compose-header sizePreset={sizePreset}>
                  {renderHeaderCells(true, 'head', false)}
                </StyledTableRow>
                <StyledTableRow data-compose-row sizePreset={sizePreset}>
                  {renderComposeCells()}
                </StyledTableRow>
                {renderErrorRow('compose')}
              </>
            ) : (
              <>
                <StyledTableRow data-compose-row sizePreset={sizePreset}>
                  {renderComposeCells()}
                </StyledTableRow>
                {renderErrorRow('compose')}
                <StyledTableRow data-compose-footer sizePreset={sizePreset}>
                  {renderHeaderCells(false, 'foot', false)}
                </StyledTableRow>
              </>
            )}
          </tbody>
        </StyledTableComposeInnerTable>
      </StyledTableComposePanel>,
      document.body
    );

  const editPanel =
    showEditPanel &&
    editingRow !== undefined &&
    createPortal(
      <StyledTableComposePanel
        ref={editPanelRef}
        $hasError={hasEditError}
        aria-label="Edit row"
        aria-modal="true"
        role="dialog"
        sizePreset={sizePreset}
      >
        <StyledTableComposeInnerTable tableLayout={fixed ? 'fixed' : 'auto'}>
          {renderColgroup()}
          <tbody>
            <StyledTableRow data-edit-row sizePreset={sizePreset}>
              {renderEditCells(editingRow)}
            </StyledTableRow>
            {renderErrorRow('edit')}
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
            {renderHeaderCells(true, 'head', true)}
          </StyledTableRow>
        </StyledTableHead>
        <StyledTableBody
          $hoverHighlight={resolvedHoverHighlight}
          $striped={resolvedStriped}
        >
          {rows.map((row, rowIndex) => {
            const rowKey = checkable ? props.getRowKey(row) : String(rowIndex);
            const isSelected = checkable && selectedKeys.has(rowKey);
            const showRowActions =
              isSelected &&
              (selectedKeys.size === 1 || !allRowsSelected) &&
              actionsColumnKey !== undefined &&
              props.renderSelectedRowActions;
            const isEditAnchor = editRowActive && editRowKey === rowKey;

            return (
              <TableBodyRow
                key={rowKey}
                actionsColumnKey={actionsColumnKey}
                anchorRef={editRowAnchorRef}
                checkable={checkable}
                columns={columns}
                editRowActive={editRowActive}
                isEditAnchor={isEditAnchor}
                isSelected={isSelected}
                onEditRow={onEditRow}
                renderSelectedRowActions={
                  checkable ? props.renderSelectedRowActions : undefined
                }
                resolvedNumbered={resolvedNumbered}
                row={row}
                rowCheckboxColumnKey={rowCheckboxColumnKey}
                rowIndex={rowIndex}
                rowKey={rowKey}
                rowSelectable={isRowSelectable(row)}
                separateCheckboxColumn={separateCheckboxColumn}
                showRowActions={Boolean(showRowActions)}
                sizePreset={sizePreset}
                textSizePreset={textSizePreset}
                toggleRowKey={toggleRowKey}
              />
            );
          })}
        </StyledTableBody>
        {checkable && (
          <StyledTableFoot $composeHidden={hideFootAnchor} ref={footAnchorRef}>
            <StyledTableRow sizePreset={sizePreset}>
              {renderHeaderCells(false, 'foot', true)}
            </StyledTableRow>
          </StyledTableFoot>
        )}
      </StyledTable>
      {composePanel}
      {editPanel}
    </>
  );

  if (!resolvedBordered) {
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

export { TableCell } from './table-cell';
export type { TableCellAlign, TableCellStyleProps } from './table-cell';
export type { TableSizePreset, TableStyleProps } from './table.styles';
export {
  DEFAULT_TABLE_BORDERED,
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_NUMBERED,
  DEFAULT_TABLE_SIZE_PRESET,
  DEFAULT_TABLE_STRIPED,
} from './table.styles';

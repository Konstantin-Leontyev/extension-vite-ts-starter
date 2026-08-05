// TODO: ручное ревью — ui/table/index.tsx
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type RefObject,
} from 'react';

import { useLongPress } from '@hooks/use-long-press';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Checkbox } from '@ui/checkbox';
import { DEFAULT_SIZE_PRESET, getTextSize as resolveTextSizePreset } from '@ui/presets';
import { ScrollPort } from '@ui/scroll-port';
import { Text, getTextLineHeight, type TextSizePreset } from '@ui/text';

import { StyledTableCellLead, TableCell, type TableCellAlign } from './table-cell';
import {
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_NUMBERED,
  DEFAULT_TABLE_SHOW_BORDER,
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

/** Субпиксельный допуск при сравнении высоты контента с viewport. */
const SCROLL_OVERFLOW_THRESHOLD_PX = 1;

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
  key: Extract<keyof Row, string>;
  /** Не переносить содержимое ячейки (`white-space: nowrap`). */
  nowrap?: boolean;
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
const DEFAULT_EDIT_HINT = 'Press Esc to close without saving, or Enter to save changes.';

type TableComposeProps<Row> = {
  /** Режим ввода новой строки — панель как у Listbox. */
  composeError?: string;
  /**
   * Текст подсказки в зарезервированной строке, пока нет `composeError`.
   * Используется при `composeReserveErrorSpace`.
   */
  composeHint?: string;
  /**
   * Резерв высоты под строку подсказки/ошибки, чтобы смена текста не сдвигала панель.
   * Как `reserveErrorSpace` у Input.
   */
  composeReserveErrorSpace?: boolean;
  composeRowActive?: boolean;
  /** Якорь панели: шапка (`head`) или футер (`foot`). */
  composeRowSource?: TableAddRowSource;
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
  /** Режим редактирования существующей строки — панель поверх якорной строки. */
  editRowActive?: boolean;
  editRowKey?: string;
  onEditCancel?: () => void;
  onEditRow?: (row: Row) => void;
  renderEditCell?: (
    column: TableColumn<Row>,
    row: Row,
    context: TableCellRenderContext
  ) => ReactNode;
};

type TableSelectionProps<Row> = {
  /**
   * Полный набор выбираемых ключей вида, ВКЛЮЧАЯ скрытые в свёрнутых группах. Если
   * задан — «выбрать всё» в шапке и её галка работают над ним (а не только над
   * видимыми строками): свёрнутые строки тоже выделяются. Иначе — над видимыми.
   */
  allSelectableKeys?: string[];
  checkable: true;
  /**
   * Ключи строк-членов группы для строки-заголовка (или undefined для обычной
   * строки). Если непустой — у заголовка появляется групповой чекбокс: отмечает/
   * снимает все эти строки (в т.ч. свёрнутые); галка «стоит», когда выбраны все.
   */
  getRowGroupMemberKeys?: (row: Row) => string[] | undefined;
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
        | 'className'
        | 'style'
        | keyof TableComposeProps<Row>
        | keyof TableEditProps<Row>
        | keyof TableStyleProps
      >)
    | (TableSelectionProps<Row> &
        Omit<
          ComponentPropsWithRef<'table'>,
          | 'className'
          | 'style'
          | keyof TableComposeProps<Row>
          | keyof TableEditProps<Row>
          | keyof TableSelectionProps<Row>
          | keyof TableStyleProps
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
      checked={checked}
      sizePreset="small"
      onChange={onToggle}
    />
  );
}

/** Резерв lead-слотов keyword-шапки, когда чекбокс или «+» не рендерятся. */
function TableHeaderLeadSpacers({
  reserveAddButton = false,
  reserveCheckbox = false,
}: {
  reserveAddButton?: boolean;
  reserveCheckbox?: boolean;
}): ReactNode {
  return (
    <>
      {reserveCheckbox && <StyledTableHeaderMarkSpacer aria-hidden="true" />}
      {reserveAddButton && <StyledTableHeaderMarkSpacer aria-hidden="true" />}
    </>
  );
}

type TableBodyRowProps<Row> = {
  actionsColumnKey: Extract<keyof Row, string> | undefined;
  anchorRef: RefObject<HTMLTableRowElement | null>;
  checkable: boolean;
  columns: TableColumn<Row>[];
  editRowActive: boolean;
  groupMemberKeys: string[] | undefined;
  groupSelected: boolean;
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
  toggleGroupKeys: (memberKeys: string[]) => void;
  toggleRowKey: (rowKey: string) => void;
};

function TableBodyRow<Row>({
  actionsColumnKey,
  anchorRef,
  checkable,
  columns,
  editRowActive,
  groupMemberKeys,
  groupSelected,
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
  toggleGroupKeys,
  toggleRowKey,
}: TableBodyRowProps<Row>): ReactNode {
  // Заголовок группы с непустым набором членов получает групповой чекбокс
  // (выбрать/снять всю группу, включая свёрнутые строки).
  const isGroupSelector =
    checkable && !rowSelectable && (groupMemberKeys?.length ?? 0) > 0;
  const groupCheckbox = isGroupSelector ? (
    <TableCheckbox
      ariaLabel={groupSelected ? 'Clear group selection' : 'Select group'}
      checked={groupSelected}
      onToggle={() => {
        toggleGroupKeys(groupMemberKeys ?? []);
      }}
    />
  ) : null;
  const { pointerProps } = useLongPress({
    disabled: !onEditRow || editRowActive || !rowSelectable,
    onLongPress: onEditRow ? () => onEditRow(row) : undefined,
  });

  return (
    <StyledTableRow
      $editHidden={isEditAnchor}
      ref={isEditAnchor ? anchorRef : undefined}
      sizePreset={sizePreset}
      {...(pointerProps ?? {})}
    >
      {separateCheckboxColumn && (
        <TableCell align="center" sizePreset={sizePreset}>
          {(rowSelectable && (
            <TableCheckbox
              ariaLabel={`Select row ${rowKey}`}
              checked={isSelected}
              onToggle={() => {
                toggleRowKey(rowKey);
              }}
            />
          )) ||
            groupCheckbox}
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
        const isCheckboxColumn =
          checkable &&
          rowCheckboxColumnKey !== undefined &&
          column.key === rowCheckboxColumnKey;
        const showRowCheckbox = rowSelectable && isCheckboxColumn;
        const showGroupCheckbox = isGroupSelector && isCheckboxColumn;
        const showRowActionsInColumn = showRowActions && column.key === actionsColumnKey;

        const rowCheckbox = showRowCheckbox ? (
          <TableCheckbox
            ariaLabel={`Select row ${rowKey}`}
            checked={isSelected}
            onToggle={() => {
              toggleRowKey(rowKey);
            }}
          />
        ) : null;
        const leadCheckbox = rowCheckbox ?? (showGroupCheckbox ? groupCheckbox : null);

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
            align={column.align}
            ellipsis={column.ellipsis && !showRowActionsInColumn}
            key={column.key}
            nowrap={column.nowrap}
            sizePreset={sizePreset}
          >
            {(leadCheckbox && (
              <StyledTableCellLead>
                {leadCheckbox}
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

function applyTableComposePanelPosition(
  anchor: HTMLElement,
  panel: HTMLElement,
  composeRowSource: TableAddRowSource
): void {
  const rect = anchor.getBoundingClientRect();
  const rowHeight = rect.height;
  const errorRow = panel.querySelector('[data-compose-error]');
  const errorRowHeight = errorRow instanceof HTMLElement ? errorRow.offsetHeight : 0;
  const contentHeight = rowHeight * 2 + errorRowHeight;

  panel.style.inlineSize = `${rect.width}px`;
  panel.style.insetInlineStart = `${rect.left}px`;
  panel.style.blockSize = `${contentHeight}px`;

  if (composeRowSource === 'head') {
    panel.style.insetBlockStart = `${rect.top}px`;
    return;
  }

  panel.style.insetBlockStart = `${rect.top - rowHeight - errorRowHeight}px`;
}

function applyTableEditPanelPosition(anchor: HTMLElement, panel: HTMLElement): void {
  const rect = anchor.getBoundingClientRect();
  const rowHeight = rect.height;
  const errorRow = panel.querySelector('[data-edit-error]');
  const errorRowHeight = errorRow instanceof HTMLElement ? errorRow.offsetHeight : 0;
  const contentHeight = rowHeight + errorRowHeight;

  panel.style.inlineSize = `${rect.width}px`;
  panel.style.insetInlineStart = `${rect.left}px`;
  panel.style.insetBlockStart = `${rect.top}px`;
  panel.style.blockSize = `${contentHeight}px`;
}

export function Table<Row>(props: TableProps<Row>) {
  const {
    columns,
    composeError,
    composeHint = DEFAULT_COMPOSE_HINT,
    composeReserveErrorSpace = true,
    composeRowActive: composeRowActiveProp = false,
    composeRowSource,
    editError,
    editHint = DEFAULT_EDIT_HINT,
    editReserveErrorSpace = true,
    editRowActive: editRowActiveProp = false,
    editRowKey,
    editable = false,
    hoverHighlight,
    numbered,
    onAddRow: onAddRowProp,
    onComposeCancel,
    onEditCancel,
    onEditRow: onEditRowProp,
    renderComposeCell,
    renderEditCell,
    rows,
    showBorder,
    sizePreset,
    striped,
    ...rest
  } = props;

  const resolvedShowBorder = showBorder ?? DEFAULT_TABLE_SHOW_BORDER;
  const resolvedHoverHighlight = hoverHighlight ?? DEFAULT_TABLE_HOVER_HIGHLIGHT;
  const resolvedNumbered = numbered ?? DEFAULT_TABLE_NUMBERED;
  const resolvedStriped = striped ?? DEFAULT_TABLE_STRIPED;

  // Гейт editable: без него таблица — чистый вывод строк (нет add/edit, порталов, long-press).
  const composeRowActive = editable && composeRowActiveProp;
  const editRowActive = editable && editRowActiveProp;
  const onAddRow = editable ? onAddRowProp : undefined;
  const onEditRow = editable ? onEditRowProp : undefined;

  const composeErrorId = useId();
  const editErrorId = useId();

  const checkable = props.checkable === true;
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const textSizePreset = resolveTextSizePreset(sizePreset ?? DEFAULT_SIZE_PRESET);
  const rowCheckboxColumnKey = checkable ? props.rowCheckboxColumnKey : undefined;
  const separateCheckboxColumn = checkable && rowCheckboxColumnKey === undefined;
  const fixed =
    separateCheckboxColumn || columns.some((column) => column.inlineSize !== undefined);

  const headAnchorRef = useRef<HTMLTableSectionElement>(null);
  const footAnchorRef = useRef<HTMLTableSectionElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
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
  const getRowGroupMemberKeys = checkable ? props.getRowGroupMemberKeys : undefined;
  // Универсум выбора: полный список ключей (вкл. скрытые в свёрнутых группах), если
  // его передал call site; иначе — только видимые выбираемые строки.
  const allSelectableKeys = checkable
    ? (props.allSelectableKeys ??
      rows.filter((row) => isRowSelectable(row)).map((row) => props.getRowKey(row)))
    : [];
  const allRowsSelected =
    checkable &&
    selectedKeys.size > 0 &&
    allSelectableKeys.length > 0 &&
    allSelectableKeys.every((key) => selectedKeys.has(key));
  const hasBulkSelection = checkable && selectedKeys.size >= BULK_SELECTION_MIN;
  const showBulkActions = hasBulkSelection;
  // Галка в шапке/футере «стоит», когда доступны групповые действия (выбрано 2+) ИЛИ
  // выбраны все строки таблицы. «Все» закрывает случай одной строки: 1 из 1 = все,
  // поэтому галка корректно ставится и снимается даже когда строка единственная.
  const headerSelectionActive = hasBulkSelection || allRowsSelected;
  const actionsColumnKey = checkable ? props.selectedRowActionsColumnKey : undefined;
  const hideHeadAnchor = composeRowActive && composeRowSource === 'head';
  const hideFootAnchor = composeRowActive && composeRowSource === 'foot';
  const [showFootHeader, setShowFootHeader] = useState(false);
  const showFootHeaderRow =
    checkable && (showFootHeader || (composeRowActive && composeRowSource === 'foot'));
  const showComposePanel =
    composeRowActive &&
    composeRowSource !== undefined &&
    renderComposeCell !== undefined;
  const editingRow =
    editRowActive && editRowKey !== undefined
      ? rows.find((row, rowIndex) =>
          checkable
            ? props.getRowKey(row) === editRowKey
            : String(rowIndex) === editRowKey
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

    if (headerSelectionActive) {
      props.onSelectedKeysChange(new Set());
      return;
    }

    props.onSelectedKeysChange(new Set(allSelectableKeys));
  };

  // Групповой тоггл: если все члены группы уже выбраны — снять их, иначе добавить
  // (свёрнутые члены тоже попадают в выбор, т.к. memberKeys содержит их ключи).
  const toggleGroupKeys = (memberKeys: string[]): void => {
    if (!checkable || memberKeys.length === 0) {
      return;
    }

    const next = new Set(props.selectedKeys);
    const allSelected = memberKeys.every((key) => next.has(key));

    for (const key of memberKeys) {
      if (allSelected) {
        next.delete(key);
      } else {
        next.add(key);
      }
    }

    props.onSelectedKeysChange(next);
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
            ariaLabel={headerSelectionActive ? 'Clear selection' : 'Select all rows'}
            checked={headerSelectionActive}
            onToggle={toggleAllRows}
          />
        ) : (
          <TableHeaderLeadSpacers reserveCheckbox />
        )}
        {(interactive && editable && (
          <StyledTableHeaderAddButton
            aria-label="Add row"
            disabled={!onAddRow || composeRowActive || editRowActive}
            ref={addSource === 'head' ? headAddButtonRef : footAddButtonRef}
            tabIndex={onAddRow && !composeRowActive && !editRowActive ? undefined : -1}
            type="button"
            onClick={() => {
              onAddRow?.(addSource);
            }}
          />
        )) ||
          (!interactive && <TableHeaderLeadSpacers reserveAddButton />) ||
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
          align={column.headerAlign ?? column.align}
          ellipsis={column.ellipsis}
          head={head}
          key={column.key}
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
      {separateCheckboxColumn && <TableCell align="center" sizePreset={sizePreset} />}
      {resolvedNumbered && <TableCell align="end" sizePreset={sizePreset} />}
      {columns.map((column) => {
        const composeCellContent = renderComposeCell?.(column, composeCellContext);
        const cellBody =
          (checkable &&
            rowCheckboxColumnKey !== undefined &&
            column.key === rowCheckboxColumnKey && (
              <StyledTableCellLead>
                <TableHeaderLeadSpacers reserveAddButton reserveCheckbox />
                {composeCellContent}
              </StyledTableCellLead>
            )) ||
          composeCellContent;

        return (
          <TableCell
            align={column.align}
            key={column.key}
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
      {separateCheckboxColumn && <TableCell align="center" sizePreset={sizePreset} />}
      {resolvedNumbered && <TableCell align="end" sizePreset={sizePreset} />}
      {columns.map((column) => {
        const editCellContent = renderEditCell?.(column, row, editCellContext);
        const cellBody =
          (checkable &&
            rowCheckboxColumnKey !== undefined &&
            column.key === rowCheckboxColumnKey && (
              <StyledTableCellLead>
                <TableHeaderLeadSpacers reserveCheckbox />
                {editCellContent}
              </StyledTableCellLead>
            )) ||
          editCellContent;

        return (
          <TableCell
            align={column.align}
            key={column.key}
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
          <StyledTableCol inlineSize={column.inlineSize} key={column.key} />
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
            id={isCompose ? composeErrorId : editErrorId}
            minBlockSize={reserveErrorSpace ? getTextLineHeight('thin') : undefined}
            sizePreset="thin"
            tone={hasError ? 'danger' : 'muted'}
          >
            {rowMessage}
          </Text>
        </StyledTableComposeErrorCell>
      </StyledTableRow>
    );
  };

  // Нижняя шапка нужна только при вертикальном overflow viewport. Сравниваем
  // интринсивную высоту контента (scrollHeight без самого footer) с clientHeight:
  // вычитание footer обязательно — иначе показанный footer сам поддерживает
  // overflow и не исчезает (latch).
  useLayoutEffect(() => {
    if (!checkable) {
      return;
    }

    const viewport = scrollViewportRef.current;
    const table = tableRootRef.current;

    if (!viewport || !table) {
      return;
    }

    function updateFootHeaderVisibility(): void {
      const viewportElement = scrollViewportRef.current;

      if (!viewportElement) {
        return;
      }

      const footElement = footAnchorRef.current;
      const intrinsicScroll =
        viewportElement.scrollHeight - (footElement?.offsetHeight ?? 0);
      const nextShowFootHeader =
        intrinsicScroll > viewportElement.clientHeight + SCROLL_OVERFLOW_THRESHOLD_PX;

      setShowFootHeader((current) =>
        current === nextShowFootHeader ? current : nextShowFootHeader
      );
    }

    updateFootHeaderVisibility();

    const resizeObserver = new ResizeObserver(updateFootHeaderVisibility);

    resizeObserver.observe(viewport);
    resizeObserver.observe(table);
    window.addEventListener('resize', updateFootHeaderVisibility);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateFootHeaderVisibility);
    };
  }, [checkable, columns.length, rows.length]);

  const composeAnchorRef = composeRowSource === 'head' ? headAnchorRef : footAnchorRef;

  const composePanel = (
    <AnchoredPortal
      dismissActive={showComposePanel && onComposeCancel !== undefined}
      dismissZoneRefs={[panelRef]}
      open={showComposePanel}
      panelRef={panelRef}
      positionStrategy={{
        anchorRef: composeAnchorRef,
        apply: (anchor, panel) => {
          if (composeRowSource === undefined) {
            return;
          }

          applyTableComposePanelPosition(anchor, panel, composeRowSource);
        },
        layoutDeps: [
          composeReserveErrorSpace,
          composeRowSource,
          hasComposeError,
          rows.length,
          columns.length,
        ],
      }}
      returnFocusRef={composeRowSource === 'foot' ? footAddButtonRef : headAddButtonRef}
      onDismiss={() => onComposeCancel?.()}
    >
      <StyledTableComposePanel
        $hasError={hasComposeError}
        aria-label="Add row"
        aria-modal="true"
        ref={panelRef}
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
      </StyledTableComposePanel>
    </AnchoredPortal>
  );

  const editPanel =
    showEditPanel && editingRow !== undefined ? (
      <AnchoredPortal
        dismissActive={showEditPanel && onEditCancel !== undefined}
        dismissZoneRefs={[editPanelRef]}
        open={showEditPanel}
        panelRef={editPanelRef}
        positionStrategy={{
          anchorRef: editRowAnchorRef,
          apply: applyTableEditPanelPosition,
          layoutDeps: [
            editReserveErrorSpace,
            editRowKey,
            hasEditError,
            rows.length,
            columns.length,
          ],
        }}
        returnFocusRef={editRowAnchorRef}
        onDismiss={() => onEditCancel?.()}
      >
        <StyledTableComposePanel
          $hasError={hasEditError}
          aria-label="Edit row"
          aria-modal="true"
          ref={editPanelRef}
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
        </StyledTableComposePanel>
      </AnchoredPortal>
    ) : null;

  const table = (
    <>
      <StyledTable
        {...restProps}
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
            const groupMemberKeys = getRowGroupMemberKeys?.(row);
            const groupSelected =
              (groupMemberKeys?.length ?? 0) > 0 &&
              (groupMemberKeys ?? []).every((key) => selectedKeys.has(key));

            return (
              <TableBodyRow
                actionsColumnKey={actionsColumnKey}
                anchorRef={editRowAnchorRef}
                checkable={checkable}
                columns={columns}
                editRowActive={editRowActive}
                groupMemberKeys={groupMemberKeys}
                groupSelected={groupSelected}
                isEditAnchor={isEditAnchor}
                isSelected={isSelected}
                key={rowKey}
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
                toggleGroupKeys={toggleGroupKeys}
                toggleRowKey={toggleRowKey}
                onEditRow={onEditRow}
              />
            );
          })}
        </StyledTableBody>
        {showFootHeaderRow && (
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

  return (
    <ScrollPort ref={scrollViewportRef} {...layoutProps}>
      <StyledTableClip $showBorder={resolvedShowBorder}>{table}</StyledTableClip>
    </ScrollPort>
  );
}

export { TableCell } from './table-cell';
export type { TableCellAlign } from './table-cell';
export { TableGroupCell } from './table-group-cell';
export { TableGroupExpander } from './table-group-expander';
export { TableInlineField } from './table-inline-field';
export { TableMemberPrefix, TableNestedCell } from './table-nested-cell';
export type {
  TableColumnSizeConfig,
  TableSizePreset,
  TableStyleProps,
} from './table.styles';
/* eslint-disable react-refresh/only-export-components -- barrel: утилиты sizing и дефолты осей Table. */
export {
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_NUMBERED,
  DEFAULT_TABLE_SHOW_BORDER,
  DEFAULT_TABLE_SIZE_PRESET,
  DEFAULT_TABLE_STRIPED,
  computeTableColumnInlineSizes,
} from './table.styles';

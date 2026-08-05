/**
 * Файл: `src/ui/table/index.tsx`
 * Предоставляет компонент Table для отображения табличных данных со скроллом,
 * выбором строк и панелями добавления и редактирования.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - подсветку строки при наведении через проп `hoverHighlight`
 *  - рамку вокруг таблицы через проп `showBorder`
 *  - чередование фона строк через проп `striped`
 *  - колонки через проп `columns`
 *  - мастер-переключатель добавления и редактирования строк через проп `editable`.
 *    Без `editable` таблица только выводит строки
 *  - колонку нумерации через проп `numbered`
 *  - строки данных через проп `rows`
 *  - текст ошибки панели добавления через проп `composeError`
 *  - подсказку в полоске ошибки панели добавления через проп `composeHint`, пока нет
 *    `composeError`
 *  - режим панели добавления строки через проп `composeRowActive`
 *  - якорь панели добавления через проп `composeRowSource`
 *  - обработчик запроса на добавление строки через проп `onAddRow`. Без колбэка кнопка
 *    «+» видна, но недоступна
 *  - обработчик отмены добавления строки через проп `onComposeCancel`
 *  - рендер ячеек панели добавления через проп `renderComposeCell`
 *  - текст ошибки панели редактирования через проп `editError`
 *  - подсказку в полоске ошибки панели редактирования через проп `editHint`, пока нет
 *    `editError`
 *  - режим панели редактирования строки через проп `editRowActive`
 *  - ключ редактируемой строки через проп `editRowKey`
 *  - обработчик отмены редактирования через проп `onEditCancel`
 *  - обработчик запроса на редактирование строки через проп `onEditRow`
 *  - рендер ячеек панели редактирования через проп `renderEditCell`
 *  - выбор строк через проп `checkable`
 *  - полный набор выбираемых ключей через проп `allSelectableKeys`
 *  - ключи членов группы через проп `getRowGroupMemberKeys`
 *  - ключ строки через проп `getRowKey`
 *  - фильтр выбираемых строк через проп `isRowSelectable`
 *  - обработчик изменения выбранных ключей через проп `onSelectedKeysChange`
 *  - действия при множественном выборе через проп `renderBulkSelectionActions`
 *  - действия выбранной строки через проп `renderSelectedRowActions`
 *  - колонку с чекбоксом строки через проп `rowCheckboxColumnKey`
 *  - выбранные ключи через проп `selectedKeys`
 *  - колонку действий выбранной строки через проп `selectedRowActionsColumnKey`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Table
 * 2. Типизировать пропсы через `TableProps`
 * 3. Экспортировать типы `TableAlign`, `TableAddRowSource`, `TableCellRenderContext`
 *    и `TableColumn`
 * 4. Реэкспортировать мост размера текста `getTableTextSize`, утилиту
 *    `computeTableColumnInlineSizes`, дефолты осей и типы стилей
 * 5. Реэкспортировать сателлиты `TableCell`, `TableCellAlign`, `TableGroupCell`,
 *    `TableGroupExpander`, `TableInlineField`, `TableMemberPrefix` и `TableNestedCell`
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/index.tsx` — собирает демо-таблицу каталога
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */
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
import { FieldError } from '@ui/field-error';
import { ScrollPort } from '@ui/scroll-port';
import { Text, type TextSizePreset } from '@ui/text';

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
  getTableTextSize,
  splitLayoutProps,
  type TableStyleProps,
} from './table.styles';

/**
 * TableAlign — представляет горизонтальное выравнивание ячейки таблицы.
 */
export type TableAlign = TableCellAlign;

/**
 * NUMBER_COLUMN_INLINE_SIZE — задаёт ширину колонки нумерации в режиме `fixed`.
 */
const NUMBER_COLUMN_INLINE_SIZE = '3.5rem';

/**
 * CHECKBOX_COLUMN_INLINE_SIZE — задаёт ширину отдельной колонки чекбокса в режиме `fixed`.
 */
const CHECKBOX_COLUMN_INLINE_SIZE = '2.75rem';

/**
 * BULK_SELECTION_MIN — задаёт минимум выбранных строк для групповых действий
 * и группового чекбокса в шапке.
 */
const BULK_SELECTION_MIN = 2;

/**
 * SCROLL_OVERFLOW_THRESHOLD_PX — задаёт субпиксельный допуск при сравнении высоты
 * контента с viewport.
 */
const SCROLL_OVERFLOW_THRESHOLD_PX = 1;

/**
 * TableAddRowSource — представляет сторону якоря панели добавления строки:
 * шапку или футер.
 */
export type TableAddRowSource = 'foot' | 'head';

/**
 * TableCellRenderContext — представляет контекст рендера ячейки таблицы.
 * Передаётся в `renderCell`, `renderComposeCell` и `renderEditCell`.
 *
 * @property composeError — текст ошибки панели добавления для связи с полем
 * @property composeErrorId — id полоски ошибки панели добавления для `aria-describedby`
 * @property editError — текст ошибки панели редактирования для связи с полем
 * @property editErrorId — id полоски ошибки панели редактирования для `aria-describedby`
 * @property textSize — размер текста ячейки по `sizePreset` таблицы
 */
export type TableCellRenderContext = {
  composeError?: string;
  composeErrorId?: string;
  editError?: string;
  editErrorId?: string;
  textSize: TextSizePreset;
};

/**
 * TableColumn — представляет описание колонки таблицы.
 *
 * @property align — горизонтальное выравнивание содержимого ячейки данных
 * @property ellipsis — включает обрезку содержимого с многоточием
 * @property header — текст заголовка колонки
 * @property headerAlign — горизонтальное выравнивание заголовка. Данные выравнивает `align`
 * @property inlineSize — фиксированная ширина колонки в режиме `fixed`
 * @property key — ключ поля строки
 * @property nowrap — включает запрет переноса содержимого ячейки
 * @property renderCell — кастомный рендер ячейки данных
 */
export type TableColumn<Row> = {
  align?: TableAlign;
  ellipsis?: boolean;
  header: string;
  headerAlign?: TableAlign;
  inlineSize?: string;
  key: Extract<keyof Row, string>;
  nowrap?: boolean;
  renderCell?: (
    row: Row,
    rowIndex: number,
    context: TableCellRenderContext
  ) => ReactNode;
};

/**
 * DEFAULT_COMPOSE_HINT — задаёт подсказку в полоске ошибки панели добавления по умолчанию.
 * Используется, когда вызывающий код не передал проп `composeHint`.
 */
const DEFAULT_COMPOSE_HINT =
  'Press Esc to close without saving, or Enter to add the row. Use Tab to move between fields.';

/**
 * DEFAULT_EDIT_HINT — задаёт подсказку в полоске ошибки панели редактирования по умолчанию.
 * Используется, когда вызывающий код не передал проп `editHint`.
 */
const DEFAULT_EDIT_HINT = 'Press Esc to close without saving, or Enter to save changes.';

/**
 * TableComposeProps — представляет пропсы панели добавления строки Table.
 *
 * @property composeError — текст ошибки панели добавления строки
 * @property composeHint — текст подсказки в полоске ошибки панели добавления, пока нет
 *   `composeError`
 * @property composeRowActive — включает режим панели добавления строки
 * @property composeRowSource — якорь панели: шапка или футер
 * @property onAddRow — обработчик запроса на добавление строки из шапки или футера.
 *   Без колбэка кнопка «+» видна, но недоступна. Активна только при `editable`
 * @property onComposeCancel — обработчик отмены добавления строки
 * @property renderComposeCell — рендер содержимого ячейки в панели добавления
 */
type TableComposeProps<Row> = {
  composeError?: string;
  composeHint?: string;
  composeRowActive?: boolean;
  composeRowSource?: TableAddRowSource;
  onAddRow?: (source: TableAddRowSource) => void;
  onComposeCancel?: () => void;
  renderComposeCell?: (
    column: TableColumn<Row>,
    context: TableCellRenderContext
  ) => ReactNode;
};

/**
 * TableEditProps — представляет пропсы панели редактирования строки Table.
 *
 * @property editError — текст ошибки панели редактирования строки
 * @property editHint — текст подсказки в полоске ошибки панели редактирования, пока нет
 *   `editError`
 * @property editRowActive — включает режим панели редактирования строки
 * @property editRowKey — ключ редактируемой строки
 * @property onEditCancel — обработчик отмены редактирования строки
 * @property onEditRow — обработчик запроса на редактирование строки
 * @property renderEditCell — рендер содержимого ячейки в панели редактирования
 */
type TableEditProps<Row> = {
  editError?: string;
  editHint?: string;
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

/**
 * TableSelectionProps — представляет пропсы выбора строк Table.
 * Доступны только при `checkable` равном `true`.
 *
 * @property allSelectableKeys — полный набор выбираемых ключей вида, включая скрытые
 *   в свёрнутых группах. Если задан, «выбрать всё» в шапке и её галка работают над ним,
 *   а не только над видимыми строками: свёрнутые строки тоже выделяются. Иначе выбор
 *   охватывает только видимые строки
 * @property checkable — включает режим выбора строк
 * @property getRowGroupMemberKeys — ключи строк-членов группы для строки-заголовка.
 *   Для обычной строки возвращает `undefined`. Непустой набор включает групповой
 *   чекбокс у заголовка: отмечает и снимает все эти строки, включая свёрнутые;
 *   галка стоит, когда выбраны все
 * @property getRowKey — стабильный ключ строки
 * @property isRowSelectable — признак, можно ли выбрать строку
 * @property onSelectedKeysChange — обработчик изменения набора выбранных ключей
 * @property renderBulkSelectionActions — действия шапки при множественном выборе
 * @property renderSelectedRowActions — действия в ячейке выбранной строки
 * @property rowCheckboxColumnKey — ключ колонки, в которой рендерится чекбокс строки.
 *   Без ключа чекбокс выносится в отдельную колонку
 * @property selectedKeys — выбранные ключи строк
 * @property selectedRowActionsColumnKey — ключ колонки для действий выбранной строки
 */
type TableSelectionProps<Row> = {
  allSelectableKeys?: string[];
  checkable: true;
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

/**
 * TableProps — представляет пропсы компонента Table.
 *
 * @property columns — описание колонок
 * @property editable — включает добавление и редактирование строк. Без `editable`
 *   таблица только выводит строки
 * @property numbered — включает колонку нумерации
 * @property rows — строки данных
 */
type TableProps<Row> = {
  columns: TableColumn<Row>[];
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

/**
 * TableCheckbox — отображает чекбокс выбора строки или группы в таблице.
 */
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

/**
 * TableHeaderLeadSpacers — отображает резервные lead-слоты keyword-шапки, когда
 * чекбокс или кнопка «+» не рендерятся.
 */
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

/**
 * TableBodyRowProps — представляет пропсы внутренней строки тела Table.
 *
 * @property actionsColumnKey — ключ колонки действий выбранной строки
 * @property anchorRef — ref якорной строки панели редактирования
 * @property checkable — признак режима выбора строк
 * @property columns — описание колонок
 * @property editRowActive — признак открытой панели редактирования
 * @property groupMemberKeys — ключи членов группы для строки-заголовка
 * @property groupSelected — признак, что все члены группы выбраны
 * @property isEditAnchor — признак, что строка — якорь панели редактирования
 * @property isSelected — признак выбранной строки
 * @property onEditRow — обработчик запроса на редактирование строки
 * @property renderSelectedRowActions — действия в ячейке выбранной строки
 * @property resolvedNumbered — признак колонки нумерации
 * @property row — данные строки
 * @property rowCheckboxColumnKey — ключ колонки с чекбоксом строки
 * @property rowIndex — индекс строки в видимом списке
 * @property rowKey — стабильный ключ строки
 * @property rowSelectable — признак, можно ли выбрать строку
 * @property separateCheckboxColumn — признак отдельной колонки чекбокса
 * @property showRowActions — признак показа действий выбранной строки в ячейке
 * @property sizePreset — размер таблицы
 * @property textSize — размер текста ячейки
 * @property toggleGroupKeys — обработчик выбора или снятия группы ключей
 * @property toggleRowKey — обработчик переключения выбора одной строки
 */
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
  textSize: TextSizePreset;
  toggleGroupKeys: (memberKeys: string[]) => void;
  toggleRowKey: (rowKey: string) => void;
};

/**
 * TableBodyRow — отображает одну строку тела таблицы.
 */
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
  textSize,
  toggleGroupKeys,
  toggleRowKey,
}: TableBodyRowProps<Row>): ReactNode {
  // Заголовок группы с непустым набором членов получает групповой чекбокс:
  // выбрать или снять всю группу, включая свёрнутые строки.
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
          <Text sizePreset={textSize}>{rowIndex + 1}</Text>
        </TableCell>
      )}
      {columns.map((column) => {
        const cellContent = column.renderCell ? (
          column.renderCell(row, rowIndex, { textSize })
        ) : (
          <Text sizePreset={textSize}>{String(row[column.key] ?? '')}</Text>
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

/**
 * applyTableComposePanelPosition — задаёт геометрию compose-панели относительно якоря.
 *
 * @param anchor элемент-якорь шапки или футера
 * @param panel корневой элемент панели
 * @param composeRowSource сторона якоря: шапка или футер
 */
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

/**
 * applyTableEditPanelPosition — задаёт геометрию edit-панели относительно якорной строки.
 *
 * @param anchor элемент якорной строки
 * @param panel корневой элемент панели
 */
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

/**
 * Table — отображает таблицу данных со скроллом, выбором строк и панелями
 * добавления и редактирования.
 *
 * @example
 * <Table
 *   aria-label="Catalog table demo"
 *   columns={columns}
 *   numbered={false}
 *   rows={tableRows}
 *   showBorder
 *   sizePreset="normal"
 * />
 * <Table
 *   aria-label="Catalog table demo"
 *   checkable
 *   columns={columns}
 *   editable
 *   getRowKey={(row) => row.rowId}
 *   rows={tableRows}
 *   selectedKeys={selectedKeys}
 *   onSelectedKeysChange={setSelectedKeys}
 * />
 */
export function Table<Row>(props: TableProps<Row>) {
  const {
    columns,
    composeError,
    composeHint = DEFAULT_COMPOSE_HINT,
    composeRowActive: composeRowActiveProp = false,
    composeRowSource,
    editError,
    editHint = DEFAULT_EDIT_HINT,
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

  // Переключатель editable: без него таблица только выводит строки, без добавления,
  // редактирования, порталов и long-press.
  const composeRowActive = editable && composeRowActiveProp;
  const editRowActive = editable && editRowActiveProp;
  const onAddRow = editable ? onAddRowProp : undefined;
  const onEditRow = editable ? onEditRowProp : undefined;

  const composeErrorId = useId();
  const editErrorId = useId();

  const checkable = props.checkable === true;
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const textSize = getTableTextSize(sizePreset);
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
  // Универсум выбора: полный список ключей, включая скрытые в свёрнутых группах, если
  // его передал вызывающий код; иначе только видимые выбираемые строки.
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
  // Галка в шапке и футере стоит, когда доступны групповые действия при двух и более
  // выбранных строках или выбраны все строки таблицы. Случай одной строки: одна из одной
  // считается всеми, поэтому галка ставится и снимается и для единственной строки.
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
    textSize,
  };
  const editCellContext: TableCellRenderContext = {
    editError: hasEditError ? editErrorMessage : undefined,
    editErrorId,
    textSize,
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

  // Групповой тоггл: если все члены группы уже выбраны — снять их, иначе добавить.
  // Свёрнутые члены тоже попадают в выбор, потому что memberKeys содержит их ключи.
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
        <Text sizePreset={textSize}>{column.header}</Text>
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
          <Text sizePreset={textSize}>#</Text>
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
            <Text sizePreset={textSize}>{column.header}</Text>
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
    const errorRowProps = isCompose
      ? { 'data-compose-error': '' }
      : { 'data-edit-error': '' };

    return (
      <StyledTableRow {...errorRowProps} sizePreset={sizePreset}>
        <StyledTableComposeErrorCell
          colSpan={composeColumnCount}
          sizePreset={sizePreset}
        >
          <FieldError
            id={isCompose ? composeErrorId : editErrorId}
            placeholder={isCompose ? composeHint : editHint}
            reserveErrorSpace
          >
            {isCompose ? composeError : editError}
          </FieldError>
        </StyledTableComposeErrorCell>
      </StyledTableRow>
    );
  };

  // Нижняя шапка нужна только при вертикальном переполнении viewport. Сравниваем
  // высоту контента scrollHeight без самого footer с clientHeight: вычитание footer
  // обязательно, иначе показанный footer сам поддерживает переполнение и не исчезает.
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
        layoutDeps: [composeRowSource, hasComposeError, rows.length, columns.length],
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
          layoutDeps: [editRowKey, hasEditError, rows.length, columns.length],
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
                textSize={textSize}
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
/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста, утилит sizing и дефолтов осей Table */
export {
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_NUMBERED,
  DEFAULT_TABLE_SHOW_BORDER,
  DEFAULT_TABLE_SIZE_PRESET,
  DEFAULT_TABLE_STRIPED,
  computeTableColumnInlineSizes,
  getTableTextSize,
} from './table.styles';

/**
 * Файл: `src/pages/showcase/table-demo/index.tsx`
 * Содержит демо-таблицу каталога для виджета Table в витрине дизайн-системы.
 * Собирает колонки, группы, выбор строк и панели добавления и редактирования
 * на данных каталога.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TableDemoProps`
 * 2. Экспортировать компонент `TableDemo`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — рендерит демо в карточке виджета Table
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@icons';
import { Button } from '@ui/button';
import { Icon, type IconShapePreset, type IconSizePreset } from '@ui/icon';
import { type SizePreset } from '@ui/presets';
import {
  Table,
  TableGroupCell,
  TableInlineField,
  TableMemberPrefix,
  TableNestedCell,
  computeTableColumnInlineSizes,
  type TableAddRowSource,
  type TableCellRenderContext,
  type TableColumn,
} from '@ui/table';
import { Text } from '@ui/text';

import { INITIAL_CATALOG_PRODUCTS, type CatalogProduct } from './data';
import {
  buildCatalogGroupMemberKeyMap,
  buildCatalogSelectableKeys,
  buildCatalogTableRows,
  buildCatalogTableSizingRows,
  buildInitialExpandedGroupIds,
  isCatalogHeaderRowKind,
  type CatalogTableRow,
} from './rows';
import { type TableWidgetState } from '../table-settings';

/**
 * ROW_ACTION_MIN_INLINE_SIZE — задаёт минимальную ширину кнопок действий строки.
 * Используется в `Delete` одиночного и группового удаления.
 */
const ROW_ACTION_MIN_INLINE_SIZE = '5.5rem';

/**
 * ROW_ACTION_SIZE_PRESET — задаёт `sizePreset` кнопок Delete в checkable-режиме.
 * Используется в `Delete` одиночного и группового удаления.
 */
const ROW_ACTION_SIZE_PRESET: SizePreset = 'small';

/**
 * GROUP_EXPANDER_SIZE_PRESET — задаёт `sizePreset` кнопки раскрытия группы.
 * Используется в expander голов групп демо-таблицы.
 */
const GROUP_EXPANDER_SIZE_PRESET: IconSizePreset = 'tiny';

/**
 * GROUP_EXPANDER_SHAPE — задаёт `shape` кнопки раскрытия группы.
 * Используется в expander голов групп демо-таблицы.
 */
const GROUP_EXPANDER_SHAPE: IconShapePreset = 'rounded';

/**
 * CATALOG_TABLE_DEMO_ARIA_LABEL — задаёт `aria-label` демо-таблицы каталога.
 * Используется в корневом Table демо.
 */
const CATALOG_TABLE_DEMO_ARIA_LABEL = 'Catalog table demo';

/**
 * GROUP_EXPAND_ARIA_VERB — задаёт глагол `aria-label` для свёрнутой группы.
 * Используется в `resolveGroupExpanderAriaLabel`.
 */
const GROUP_EXPAND_ARIA_VERB = 'Expand';

/**
 * GROUP_COLLAPSE_ARIA_VERB — задаёт глагол `aria-label` для раскрытой группы.
 * Используется в `resolveGroupExpanderAriaLabel`.
 */
const GROUP_COLLAPSE_ARIA_VERB = 'Collapse';

/**
 * resolveGroupExpanderAriaLabel — возвращает `aria-label` кнопки раскрытия группы.
 *
 * @param expanded признак раскрытой группы
 * @param product имя группы в подписи
 * @returns строка `aria-label`
 */
function resolveGroupExpanderAriaLabel(expanded: boolean, product: string): string {
  const verb = expanded ? GROUP_COLLAPSE_ARIA_VERB : GROUP_EXPAND_ARIA_VERB;
  return `${verb} ${product}`;
}

/**
 * CatalogColumnInlineSizes — представляет вычисленные `inlineSize` метрических колонок.
 *
 * @property indexLabel — ширина колонки нумерации
 * @property price — ширина колонки Price
 * @property stock — ширина колонки Stock
 */
type CatalogColumnInlineSizes = {
  indexLabel: string;
  price: string;
  stock: string;
};

/**
 * CatalogDraft — представляет черновик полей add- и edit-панели демо-таблицы.
 *
 * @property price — значение поля Price
 * @property product — значение поля Product
 * @property stock — значение поля Stock
 */
type CatalogDraft = {
  price: string;
  product: string;
  stock: string;
};

/**
 * EMPTY_CATALOG_DRAFT — задаёт пустой черновик полей add- и edit-панели.
 * Используется при открытии и сбросе панелей добавления и редактирования.
 */
const EMPTY_CATALOG_DRAFT: CatalogDraft = {
  price: '',
  product: '',
  stock: '',
};

/**
 * TableDemoProps — представляет пропсы компонента TableDemo.
 *
 * @property settings — состояние настроек виджета Table из панели витрины
 */
type TableDemoProps = {
  settings: TableWidgetState;
};

/**
 * buildCatalogColumns — возвращает описание колонок демо-таблицы каталога.
 *
 * @param toggleGroup обработчик раскрытия или сворачивания группы
 * @param metricInlineSizes вычисленные ширины метрических колонок
 * @returns массив колонок для пропа `columns` Table
 */
function buildCatalogColumns(
  toggleGroup: (groupId: string) => void,
  metricInlineSizes: CatalogColumnInlineSizes
): TableColumn<CatalogTableRow>[] {
  return [
    {
      align: 'end',
      header: '#',
      headerAlign: 'center',
      inlineSize: metricInlineSizes.indexLabel,
      key: 'indexLabel',
      nowrap: true,
      renderCell: (row, _rowIndex, { textSize }) => {
        if (isCatalogHeaderRowKind(row.rowKind)) {
          return null;
        }

        return <Text sizePreset={textSize}>{row.indexLabel}</Text>;
      },
    },
    {
      align: 'start',
      ellipsis: true,
      header: 'Product',
      key: 'product',
      renderCell: (row, _rowIndex, { textSize }) => {
        if (row.rowKind === 'brand-head') {
          return (
            <Text ellipsis fontWeight={600} sizePreset={textSize}>
              {row.product}
            </Text>
          );
        }

        if (row.rowKind === 'group-head') {
          const expanded = row.groupExpanded === true;
          const nestDepth = row.nestDepth ?? 0;

          const expander = (
            <Icon
              aria-expanded={expanded}
              aria-label={resolveGroupExpanderAriaLabel(expanded, row.product)}
              as="button"
              shape={GROUP_EXPANDER_SHAPE}
              showBorder
              sizePreset={GROUP_EXPANDER_SIZE_PRESET}
              onClick={() => {
                toggleGroup(row.groupId);
              }}
            >
              {(expanded && <ChevronUpIcon />) || <ChevronDownIcon />}
            </Icon>
          );

          const label = (
            <Text ellipsis fontWeight={600} sizePreset={textSize}>
              {row.product}
            </Text>
          );

          if (nestDepth > 0) {
            return (
              <TableGroupCell>
                <TableMemberPrefix>↳</TableMemberPrefix>
                {expander}
                {label}
              </TableGroupCell>
            );
          }

          return (
            <TableGroupCell>
              {expander}
              {label}
            </TableGroupCell>
          );
        }

        return (
          <TableNestedCell nestDepth={row.nestDepth ?? 1}>
            <TableMemberPrefix>↳</TableMemberPrefix>
            <Text ellipsis sizePreset={textSize}>
              {row.product}
            </Text>
          </TableNestedCell>
        );
      },
    },
    {
      align: 'end',
      header: 'Stock',
      headerAlign: 'end',
      inlineSize: metricInlineSizes.stock,
      key: 'stock',
      nowrap: true,
      renderCell: (row, _rowIndex, { textSize }) => {
        if (isCatalogHeaderRowKind(row.rowKind)) {
          return null;
        }

        return <Text sizePreset={textSize}>{row.stock}</Text>;
      },
    },
    {
      align: 'end',
      header: 'Price',
      headerAlign: 'end',
      inlineSize: metricInlineSizes.price,
      key: 'price',
      nowrap: true,
      renderCell: (row, _rowIndex, { textSize }) => {
        if (isCatalogHeaderRowKind(row.rowKind)) {
          return null;
        }

        return <Text sizePreset={textSize}>{row.price}</Text>;
      },
    },
  ];
}

/**
 * collectMetricSamples — собирает непустые образцы значений метрической колонки.
 *
 * @param sizingRows строки при полном раскрытии групп
 * @param pick выборка текста колонки из строки
 * @returns массив образцов для `computeTableColumnInlineSizes`
 */
function collectMetricSamples(
  sizingRows: CatalogTableRow[],
  pick: (row: CatalogTableRow) => string
): string[] {
  const samples: string[] = [];

  for (const row of sizingRows) {
    if (isCatalogHeaderRowKind(row.rowKind)) {
      continue;
    }

    const value = pick(row).trim();

    if (value !== '') {
      samples.push(value);
    }
  }

  return samples;
}

/**
 * TableDemo — отображает демо-таблицу каталога виджета Table в витрине.
 *
 * @example
 * <TableDemo settings={table} />
 */
export function TableDemo({ settings }: TableDemoProps): ReactNode {
  const [products, setProducts] = useState<CatalogProduct[]>(() => [
    ...INITIAL_CATALOG_PRODUCTS,
  ]);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(() =>
    buildInitialExpandedGroupIds(INITIAL_CATALOG_PRODUCTS)
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [isAddRowOpen, setIsAddRowOpen] = useState(false);
  const [addRowSource, setAddRowSource] = useState<TableAddRowSource>('head');
  const [addDraft, setAddDraft] = useState(EMPTY_CATALOG_DRAFT);
  const [isEditRowOpen, setIsEditRowOpen] = useState(false);
  const [editRowId, setEditRowId] = useState<string | undefined>(undefined);
  const [editingProductId, setEditingProductId] = useState<string | undefined>(
    undefined
  );
  const [editDraft, setEditDraft] = useState(EMPTY_CATALOG_DRAFT);

  const toggleGroup = useCallback((groupId: string): void => {
    setExpandedGroupIds((current) => {
      const next = new Set(current);

      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }

      return next;
    });
  }, []);

  const tableRows = useMemo(
    () =>
      buildCatalogTableRows(products, expandedGroupIds, settings.continuousNumbering),
    [expandedGroupIds, products, settings.continuousNumbering]
  );

  const metricInlineSizes = useMemo((): CatalogColumnInlineSizes => {
    const sizingRows = buildCatalogTableSizingRows(products);
    const stockSamples = collectMetricSamples(sizingRows, (row) => row.stock);
    const priceSamples = collectMetricSamples(sizingRows, (row) => row.price);
    const indexSamples = collectMetricSamples(sizingRows, (row) => row.indexLabel);

    if (isAddRowOpen) {
      const addStock = addDraft.stock.trim();

      if (addStock !== '') {
        stockSamples.push(addStock);
      }

      const addPrice = addDraft.price.trim();

      if (addPrice !== '') {
        priceSamples.push(addPrice);
      }
    }

    if (isEditRowOpen) {
      const editStock = editDraft.stock.trim();

      if (editStock !== '') {
        stockSamples.push(editStock);
      }

      const editPrice = editDraft.price.trim();

      if (editPrice !== '') {
        priceSamples.push(editPrice);
      }
    }

    return computeTableColumnInlineSizes(
      {
        indexLabel: { header: '#', samples: indexSamples },
        price: { header: 'Price', samples: priceSamples },
        stock: { header: 'Stock', samples: stockSamples },
      },
      settings.sizePreset
    );
  }, [
    addDraft.price,
    addDraft.stock,
    isAddRowOpen,
    editDraft.price,
    editDraft.stock,
    isEditRowOpen,
    products,
    settings.sizePreset,
  ]);

  const memberKeysByHeaderRowId = useMemo(
    () => buildCatalogGroupMemberKeyMap(products),
    [products]
  );

  const allSelectableKeys = useMemo(
    () => buildCatalogSelectableKeys(products),
    [products]
  );

  const columns = useMemo(() => {
    const base = buildCatalogColumns(toggleGroup, metricInlineSizes);

    if (!settings.showIndexColumn) {
      return base.filter((column) => column.key !== 'indexLabel');
    }

    return base;
  }, [metricInlineSizes, settings.showIndexColumn, toggleGroup]);

  const resetAddRow = useCallback((): void => {
    setIsAddRowOpen(false);
    setAddRowSource('head');
    setAddDraft(EMPTY_CATALOG_DRAFT);
  }, []);

  const resetEditRow = useCallback((): void => {
    setIsEditRowOpen(false);
    setEditRowId(undefined);
    setEditingProductId(undefined);
    setEditDraft(EMPTY_CATALOG_DRAFT);
  }, []);

  const handleAddRowRequest = useCallback(
    (source: TableAddRowSource): void => {
      if (isAddRowOpen || isEditRowOpen) {
        return;
      }

      setIsAddRowOpen(true);
      setAddRowSource(source);
      setAddDraft(EMPTY_CATALOG_DRAFT);
      setSelectedKeys(new Set());
    },
    [isAddRowOpen, isEditRowOpen]
  );

  const handleEditRowRequest = useCallback(
    (row: CatalogTableRow): void => {
      if (isAddRowOpen || isEditRowOpen || isCatalogHeaderRowKind(row.rowKind)) {
        return;
      }

      setIsEditRowOpen(true);
      setEditRowId(row.rowId);
      setEditingProductId(row.dataRowKey);
      setEditDraft({
        price: row.price,
        product: row.product,
        stock: row.stock,
      });
      setSelectedKeys(new Set());
    },
    [isAddRowOpen, isEditRowOpen]
  );

  const handleDeleteRow = useCallback(
    (row: CatalogTableRow): void => {
      if (isEditRowOpen && editingProductId === row.dataRowKey) {
        resetEditRow();
      }

      setProducts((current) =>
        current.filter((product) => product.id !== row.dataRowKey)
      );
      setSelectedKeys((current) => {
        const next = new Set(current);
        next.delete(row.rowId);
        return next;
      });
    },
    [isEditRowOpen, editingProductId, resetEditRow]
  );

  const handleBulkDelete = useCallback((): void => {
    const rowIdsToRemove = new Set(selectedKeys);
    const dataRowKeysToRemove = new Set(
      tableRows
        .filter((row) => rowIdsToRemove.has(row.rowId))
        .map((row) => row.dataRowKey)
    );

    if (isEditRowOpen && editingProductId && dataRowKeysToRemove.has(editingProductId)) {
      resetEditRow();
    }

    setProducts((current) =>
      current.filter((product) => !dataRowKeysToRemove.has(product.id))
    );
    setSelectedKeys(new Set());
  }, [isEditRowOpen, editingProductId, resetEditRow, selectedKeys, tableRows]);

  /**
   * commitAddRow — добавляет черновик в каталог демо-таблицы.
   * Не переносить в продуктовый код: в реальном проекте целевая группа выводится
   * из контекста источника добавления.
   */
  const commitAddRow = useCallback((): void => {
    const productName = addDraft.product.trim();

    if (productName === '') {
      return;
    }

    const categoryId = 'phones';
    const nextProduct: CatalogProduct = {
      brand: 'Apple',
      categoryId,
      id: `new-${Date.now()}`,
      price: addDraft.price.trim() || '$0',
      product: productName,
      stock: addDraft.stock.trim() || '0',
    };

    setProducts((current) => [...current, nextProduct]);
    setExpandedGroupIds((current) => new Set([...current, `Apple:${categoryId}`]));
    resetAddRow();
  }, [addDraft, resetAddRow]);

  const commitEditRow = useCallback((): void => {
    if (!editingProductId) {
      resetEditRow();
      return;
    }

    const productName = editDraft.product.trim();

    if (productName === '') {
      return;
    }

    setProducts((current) =>
      current.map((product) =>
        product.id === editingProductId
          ? {
              ...product,
              price: editDraft.price.trim() || product.price,
              product: productName,
              stock: editDraft.stock.trim() || product.stock,
            }
          : product
      )
    );
    resetEditRow();
  }, [editDraft, editingProductId, resetEditRow]);

  const renderAddCell = useCallback(
    (
      column: TableColumn<CatalogTableRow>,
      { addErrorId, textSize }: TableCellRenderContext
    ): ReactNode => {
      if (column.key === 'indexLabel') {
        return null;
      }

      if (column.key === 'product') {
        return (
          <TableInlineField
            aria-describedby={addErrorId}
            placeholder="Product"
            textSize={textSize}
            value={addDraft.product}
            onChange={(event) =>
              setAddDraft((current) => ({
                ...current,
                product: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitAddRow();
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                resetAddRow();
              }
            }}
          />
        );
      }

      if (column.key === 'stock') {
        return (
          <TableInlineField
            aria-describedby={addErrorId}
            inputMode="numeric"
            placeholder="Stock"
            textAlign="end"
            textSize={textSize}
            value={addDraft.stock}
            onChange={(event) =>
              setAddDraft((current) => ({
                ...current,
                stock: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitAddRow();
              }
            }}
          />
        );
      }

      if (column.key === 'price') {
        return (
          <TableInlineField
            aria-describedby={addErrorId}
            placeholder="Price"
            textAlign="end"
            textSize={textSize}
            value={addDraft.price}
            onChange={(event) =>
              setAddDraft((current) => ({
                ...current,
                price: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitAddRow();
              }
            }}
          />
        );
      }

      return null;
    },
    [commitAddRow, addDraft, resetAddRow]
  );

  const renderEditCell = useCallback(
    (
      column: TableColumn<CatalogTableRow>,
      row: CatalogTableRow,
      { editErrorId, textSize }: TableCellRenderContext
    ): ReactNode => {
      if (column.key === 'indexLabel') {
        return <Text sizePreset={textSize}>{row.indexLabel}</Text>;
      }

      if (column.key === 'product') {
        const field = (
          <TableInlineField
            aria-describedby={editErrorId}
            placeholder="Product"
            textSize={textSize}
            value={editDraft.product}
            onChange={(event) =>
              setEditDraft((current) => ({
                ...current,
                product: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitEditRow();
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                resetEditRow();
              }
            }}
          />
        );

        return (
          <TableNestedCell nestDepth={1}>
            <TableMemberPrefix>↳</TableMemberPrefix>
            {field}
          </TableNestedCell>
        );
      }

      if (column.key === 'stock') {
        return (
          <TableInlineField
            aria-describedby={editErrorId}
            inputMode="numeric"
            placeholder="Stock"
            textAlign="end"
            textSize={textSize}
            value={editDraft.stock}
            onChange={(event) =>
              setEditDraft((current) => ({
                ...current,
                stock: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitEditRow();
              }
            }}
          />
        );
      }

      if (column.key === 'price') {
        return (
          <TableInlineField
            aria-describedby={editErrorId}
            placeholder="Price"
            textAlign="end"
            textSize={textSize}
            value={editDraft.price}
            onChange={(event) =>
              setEditDraft((current) => ({
                ...current,
                price: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitEditRow();
              }
            }}
          />
        );
      }

      return null;
    },
    [commitEditRow, editDraft, resetEditRow]
  );

  const tableProps = {
    columns,
    // Ось numbered Table выключена: нумерация идёт через колонку indexLabel
    // по витринному ключу showIndexColumn.
    hoverHighlight: settings.hoverHighlight,
    numbered: false,
    rows: tableRows,
    showBorder: settings.showBorder,
    sizePreset: settings.sizePreset,
    striped: settings.striped,
  };

  const editableProps = settings.editable
    ? {
        addRowActive: isAddRowOpen,
        addRowSource,
        editable: true as const,
        editRowActive: isEditRowOpen,
        editRowKey: editRowId,
        onAddRow: handleAddRowRequest,
        onAddCancel: resetAddRow,
        onEditCancel: resetEditRow,
        onEditRow: handleEditRowRequest,
        renderAddCell,
        renderEditCell,
      }
    : {
        editable: false as const,
      };

  if (!settings.checkable) {
    return (
      <Table aria-label={CATALOG_TABLE_DEMO_ARIA_LABEL} {...tableProps} {...editableProps} />
    );
  }

  return (
    <Table
      aria-label={CATALOG_TABLE_DEMO_ARIA_LABEL}
      {...tableProps}
      {...editableProps}
      allSelectableKeys={allSelectableKeys}
      checkable
      getRowGroupMemberKeys={(row) => memberKeysByHeaderRowId.get(row.rowId)}
      getRowKey={(row) => row.rowId}
      isRowSelectable={(row) => row.rowKind === 'group-member'}
      renderBulkSelectionActions={() => (
        <Button
          minInlineSize={ROW_ACTION_MIN_INLINE_SIZE}
          sizePreset={ROW_ACTION_SIZE_PRESET}
          tone="danger"
          onClick={handleBulkDelete}
        >
          Delete
        </Button>
      )}
      renderSelectedRowActions={(row) => (
        <Button
          minInlineSize={ROW_ACTION_MIN_INLINE_SIZE}
          sizePreset={ROW_ACTION_SIZE_PRESET}
          tone="danger"
          onClick={() => {
            handleDeleteRow(row);
          }}
        >
          Delete
        </Button>
      )}
      selectedKeys={selectedKeys}
      {...(settings.separateCheckboxColumn
        ? { selectedRowActionsColumnKey: 'product' as const }
        : {
            rowCheckboxColumnKey: 'product' as const,
            selectedRowActionsColumnKey: 'product' as const,
          })}
      onSelectedKeysChange={setSelectedKeys}
    />
  );
}

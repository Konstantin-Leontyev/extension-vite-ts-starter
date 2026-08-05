// TODO: ручное ревью — pages/showcase/table-demo/index.tsx
import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@icons';
import { Button } from '@ui/button';
import {
  Table,
  TableGroupCell,
  TableGroupExpander,
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

const ROW_ACTION_MIN_INLINE_SIZE = '5.5rem';

type CatalogColumnInlineSizes = {
  indexLabel: string;
  price: string;
  stock: string;
};

type CatalogDraft = {
  price: string;
  product: string;
  stock: string;
};

const EMPTY_CATALOG_DRAFT: CatalogDraft = {
  price: '',
  product: '',
  stock: '',
};

type TableDemoProps = {
  settings: TableWidgetState;
};

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
            <TableGroupExpander
              aria-expanded={expanded}
              aria-label={`${expanded ? 'Collapse' : 'Expand'} ${row.product}`}
              onClick={() => {
                toggleGroup(row.groupId);
              }}
            >
              {(expanded && <ChevronUpIcon />) || <ChevronDownIcon />}
            </TableGroupExpander>
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

export function TableDemo({ settings }: TableDemoProps): ReactNode {
  const [products, setProducts] = useState<CatalogProduct[]>(() => [
    ...INITIAL_CATALOG_PRODUCTS,
  ]);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(() =>
    buildInitialExpandedGroupIds(INITIAL_CATALOG_PRODUCTS)
  );
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [isComposeRowOpen, setIsComposeRowOpen] = useState(false);
  const [composeRowSource, setComposeRowSource] = useState<TableAddRowSource>('head');
  const [composeDraft, setComposeDraft] = useState(EMPTY_CATALOG_DRAFT);
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

    if (isComposeRowOpen) {
      const composeStock = composeDraft.stock.trim();

      if (composeStock !== '') {
        stockSamples.push(composeStock);
      }

      const composePrice = composeDraft.price.trim();

      if (composePrice !== '') {
        priceSamples.push(composePrice);
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
    composeDraft.price,
    composeDraft.stock,
    isComposeRowOpen,
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

  const resetComposeRow = useCallback((): void => {
    setIsComposeRowOpen(false);
    setComposeRowSource('head');
    setComposeDraft(EMPTY_CATALOG_DRAFT);
  }, []);

  const resetEditRow = useCallback((): void => {
    setIsEditRowOpen(false);
    setEditRowId(undefined);
    setEditingProductId(undefined);
    setEditDraft(EMPTY_CATALOG_DRAFT);
  }, []);

  const handleAddRowRequest = useCallback(
    (source: TableAddRowSource): void => {
      if (isComposeRowOpen || isEditRowOpen) {
        return;
      }

      setIsComposeRowOpen(true);
      setComposeRowSource(source);
      setComposeDraft(EMPTY_CATALOG_DRAFT);
      setSelectedKeys(new Set());
    },
    [isComposeRowOpen, isEditRowOpen]
  );

  const handleEditRowRequest = useCallback(
    (row: CatalogTableRow): void => {
      if (isComposeRowOpen || isEditRowOpen || isCatalogHeaderRowKind(row.rowKind)) {
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
    [isComposeRowOpen, isEditRowOpen]
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

  /** Не переносить в продуктовый код: в реальном проекте целевая группа выводится из контекста compose-источника. */
  const commitComposeRow = useCallback((): void => {
    const productName = composeDraft.product.trim();

    if (productName === '') {
      return;
    }

    const categoryId = 'phones';
    const nextProduct: CatalogProduct = {
      brand: 'Apple',
      categoryId,
      id: `new-${Date.now()}`,
      price: composeDraft.price.trim() || '$0',
      product: productName,
      stock: composeDraft.stock.trim() || '0',
    };

    setProducts((current) => [...current, nextProduct]);
    setExpandedGroupIds((current) => new Set([...current, `Apple:${categoryId}`]));
    resetComposeRow();
  }, [composeDraft, resetComposeRow]);

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

  const renderComposeCell = useCallback(
    (
      column: TableColumn<CatalogTableRow>,
      { composeErrorId, textSize }: TableCellRenderContext
    ): ReactNode => {
      if (column.key === 'indexLabel') {
        return null;
      }

      if (column.key === 'product') {
        return (
          <TableInlineField
            aria-describedby={composeErrorId}
            placeholder="Product"
            textSize={textSize}
            value={composeDraft.product}
            onChange={(event) =>
              setComposeDraft((current) => ({
                ...current,
                product: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitComposeRow();
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                resetComposeRow();
              }
            }}
          />
        );
      }

      if (column.key === 'stock') {
        return (
          <TableInlineField
            aria-describedby={composeErrorId}
            inputMode="numeric"
            placeholder="Stock"
            textAlign="end"
            textSize={textSize}
            value={composeDraft.stock}
            onChange={(event) =>
              setComposeDraft((current) => ({
                ...current,
                stock: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitComposeRow();
              }
            }}
          />
        );
      }

      if (column.key === 'price') {
        return (
          <TableInlineField
            aria-describedby={composeErrorId}
            placeholder="Price"
            textAlign="end"
            textSize={textSize}
            value={composeDraft.price}
            onChange={(event) =>
              setComposeDraft((current) => ({
                ...current,
                price: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitComposeRow();
              }
            }}
          />
        );
      }

      return null;
    },
    [commitComposeRow, composeDraft, resetComposeRow]
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
    /* Kit-ось numbered выключена: нумерация — через колонку indexLabel (настройка «Index column»). */
    hoverHighlight: settings.hoverHighlight,
    numbered: false,
    rows: tableRows,
    showBorder: settings.showBorder,
    sizePreset: settings.sizePreset,
    striped: settings.striped,
  };

  const editableProps = settings.editable
    ? {
        composeRowActive: isComposeRowOpen,
        composeRowSource,
        editable: true as const,
        editRowActive: isEditRowOpen,
        editRowKey: editRowId,
        onAddRow: handleAddRowRequest,
        onComposeCancel: resetComposeRow,
        onEditCancel: resetEditRow,
        onEditRow: handleEditRowRequest,
        renderComposeCell,
        renderEditCell,
      }
    : {
        editable: false as const,
      };

  if (!settings.checkable) {
    return <Table aria-label="Catalog table demo" {...tableProps} {...editableProps} />;
  }

  return (
    <Table
      aria-label="Catalog table demo"
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
          sizePreset="small"
          tone="danger"
          onClick={handleBulkDelete}
        >
          Delete
        </Button>
      )}
      renderSelectedRowActions={(row) => (
        <Button
          minInlineSize={ROW_ACTION_MIN_INLINE_SIZE}
          sizePreset="small"
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

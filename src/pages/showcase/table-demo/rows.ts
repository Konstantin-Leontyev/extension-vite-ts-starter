// TODO: ручное ревью — pages/showcase/table-demo/rows.ts
import {
  CATALOG_BRAND_ORDER,
  CATALOG_CATEGORY_LABELS,
  CATALOG_CATEGORY_ORDER,
  CATALOG_SUB_GROUP_LABELS,
  CATALOG_SUB_GROUP_ORDER,
  catalogCategoryUsesSubGroups,
  type CatalogBrand,
  type CatalogCategoryId,
  type CatalogProduct,
  type CatalogSubGroupId,
} from './data';

export type CatalogTableRowKind = 'brand-head' | 'group-head' | 'group-member';

export type CatalogTableRow = {
  brandId: CatalogBrand;
  categoryId?: CatalogCategoryId;
  dataRowKey: string;
  groupExpanded?: boolean;
  groupId: string;
  indexLabel: string;
  nestDepth?: number;
  price: string;
  product: string;
  rowId: string;
  rowKind: CatalogTableRowKind;
  stock: string;
};

function catalogCategoryGroupId(
  brandId: CatalogBrand,
  categoryId: CatalogCategoryId
): string {
  return `${brandId}:${categoryId}`;
}

function catalogSubGroupGroupId(
  brandId: CatalogBrand,
  categoryId: CatalogCategoryId,
  subGroupId: CatalogSubGroupId
): string {
  return `${brandId}:${categoryId}:${subGroupId}`;
}

function allCategoryGroupIds(products: readonly CatalogProduct[]): Set<string> {
  const ids = new Set<string>();

  for (const brandId of CATALOG_BRAND_ORDER) {
    for (const categoryId of CATALOG_CATEGORY_ORDER) {
      const hasProducts = products.some(
        (product) => product.brand === brandId && product.categoryId === categoryId
      );

      if (hasProducts) {
        ids.add(catalogCategoryGroupId(brandId, categoryId));

        if (catalogCategoryUsesSubGroups(brandId, categoryId)) {
          for (const subGroupId of CATALOG_SUB_GROUP_ORDER) {
            const hasSubGroupProducts = products.some(
              (product) =>
                product.brand === brandId &&
                product.categoryId === categoryId &&
                product.subGroupId === subGroupId
            );

            if (hasSubGroupProducts) {
              ids.add(catalogSubGroupGroupId(brandId, categoryId, subGroupId));
            }
          }
        }
      }
    }
  }

  return ids;
}

export function isCatalogHeaderRowKind(rowKind: CatalogTableRowKind): boolean {
  return rowKind === 'brand-head' || rowKind === 'group-head';
}

export function catalogTableRowId(
  rowKind: CatalogTableRowKind,
  groupId: string,
  suffix: string
): string {
  return `${rowKind}:${groupId}:${suffix}`;
}

export function buildCatalogTableRows(
  products: readonly CatalogProduct[],
  expandedGroupIds: ReadonlySet<string>,
  continuousNumbering = false
): CatalogTableRow[] {
  const rows: CatalogTableRow[] = [];
  let memberIndex = 0;

  for (const brandId of CATALOG_BRAND_ORDER) {
    const brandProducts = products.filter((product) => product.brand === brandId);

    if (brandProducts.length === 0) {
      continue;
    }

    rows.push({
      brandId,
      dataRowKey: brandId,
      groupId: brandId,
      indexLabel: '',
      price: '',
      product: brandId,
      rowId: catalogTableRowId('brand-head', brandId, brandId),
      rowKind: 'brand-head',
      stock: '',
    });

    for (const categoryId of CATALOG_CATEGORY_ORDER) {
      const members = brandProducts.filter(
        (product) => product.categoryId === categoryId
      );

      if (members.length === 0) {
        continue;
      }

      const groupId = catalogCategoryGroupId(brandId, categoryId);
      const expanded = expandedGroupIds.has(groupId);

      rows.push({
        brandId,
        categoryId,
        dataRowKey: groupId,
        groupExpanded: expanded,
        groupId,
        indexLabel: '',
        nestDepth: 0,
        price: '',
        product: CATALOG_CATEGORY_LABELS[categoryId],
        rowId: catalogTableRowId('group-head', groupId, categoryId),
        rowKind: 'group-head',
        stock: '',
      });

      if (!expanded) {
        continue;
      }

      if (catalogCategoryUsesSubGroups(brandId, categoryId)) {
        for (const subGroupId of CATALOG_SUB_GROUP_ORDER) {
          const members = brandProducts.filter(
            (product) =>
              product.categoryId === categoryId && product.subGroupId === subGroupId
          );

          if (members.length === 0) {
            continue;
          }

          const nestedGroupId = catalogSubGroupGroupId(brandId, categoryId, subGroupId);
          const nestedExpanded = expandedGroupIds.has(nestedGroupId);

          rows.push({
            brandId,
            categoryId,
            dataRowKey: nestedGroupId,
            groupExpanded: nestedExpanded,
            groupId: nestedGroupId,
            indexLabel: '',
            nestDepth: 1,
            price: '',
            product: CATALOG_SUB_GROUP_LABELS[subGroupId],
            rowId: catalogTableRowId('group-head', nestedGroupId, subGroupId),
            rowKind: 'group-head',
            stock: '',
          });

          if (!nestedExpanded) {
            continue;
          }

          if (!continuousNumbering) {
            memberIndex = 0;
          }

          for (const member of members) {
            memberIndex += 1;

            rows.push({
              brandId,
              categoryId,
              dataRowKey: member.id,
              groupId: nestedGroupId,
              indexLabel: String(memberIndex),
              nestDepth: 1,
              price: member.price,
              product: member.product,
              rowId: catalogTableRowId('group-member', nestedGroupId, member.id),
              rowKind: 'group-member',
              stock: member.stock,
            });
          }
        }

        continue;
      }

      if (!continuousNumbering) {
        memberIndex = 0;
      }

      for (const member of members) {
        memberIndex += 1;

        rows.push({
          brandId,
          categoryId,
          dataRowKey: member.id,
          groupId,
          indexLabel: String(memberIndex),
          nestDepth: 1,
          price: member.price,
          product: member.product,
          rowId: catalogTableRowId('group-member', groupId, member.id),
          rowKind: 'group-member',
          stock: member.stock,
        });
      }
    }
  }

  return rows;
}

/** Строки со всеми группами раскрыты — для расчёта max-ширины колонок. */
export function buildCatalogTableSizingRows(
  products: readonly CatalogProduct[]
): CatalogTableRow[] {
  return buildCatalogTableRows(products, allCategoryGroupIds(products), true);
}

/** Ключи всех product-строк для «выбрать всё» (все категории раскрыты). */
export function buildCatalogSelectableKeys(
  products: readonly CatalogProduct[]
): string[] {
  return buildCatalogTableRows(products, allCategoryGroupIds(products))
    .filter((row) => row.rowKind === 'group-member')
    .map((row) => row.rowId);
}

/** Заголовок категории → rowId всех product-строк (включая свёрнутые). */
export function buildCatalogGroupMemberKeyMap(
  products: readonly CatalogProduct[]
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const brandId of CATALOG_BRAND_ORDER) {
    for (const categoryId of CATALOG_CATEGORY_ORDER) {
      const groupId = catalogCategoryGroupId(brandId, categoryId);
      const categoryProducts = products.filter(
        (product) => product.brand === brandId && product.categoryId === categoryId
      );

      if (categoryProducts.length === 0) {
        continue;
      }

      if (catalogCategoryUsesSubGroups(brandId, categoryId)) {
        const categoryMemberRowIds: string[] = [];

        for (const subGroupId of CATALOG_SUB_GROUP_ORDER) {
          const nestedGroupId = catalogSubGroupGroupId(brandId, categoryId, subGroupId);
          const memberRowIds = categoryProducts
            .filter((product) => product.subGroupId === subGroupId)
            .map((product) =>
              catalogTableRowId('group-member', nestedGroupId, product.id)
            );

          if (memberRowIds.length > 0) {
            categoryMemberRowIds.push(...memberRowIds);
            map.set(
              catalogTableRowId('group-head', nestedGroupId, subGroupId),
              memberRowIds
            );
          }
        }

        if (categoryMemberRowIds.length > 0) {
          map.set(
            catalogTableRowId('group-head', groupId, categoryId),
            categoryMemberRowIds
          );
        }
      } else {
        const memberRowIds = categoryProducts.map((product) =>
          catalogTableRowId('group-member', groupId, product.id)
        );

        map.set(catalogTableRowId('group-head', groupId, categoryId), memberRowIds);
      }
    }
  }

  return map;
}

export function buildInitialExpandedGroupIds(
  products: readonly CatalogProduct[]
): Set<string> {
  return allCategoryGroupIds(products);
}

export { catalogCategoryGroupId, catalogSubGroupGroupId };

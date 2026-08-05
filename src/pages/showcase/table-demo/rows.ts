/**
 * Файл: `src/pages/showcase/table-demo/rows.ts`
 * Содержит сборку строк демо-таблицы каталога из плоского списка товаров.
 *
 * Основные задачи:
 * 1. Типизировать строку таблицы через `CatalogTableRowKind` и `CatalogTableRow`
 * 2. Предоставить сборку видимых строк через `buildCatalogTableRows`
 * 3. Предоставить выборки `buildCatalogTableSizingRows`, `buildCatalogSelectableKeys`,
 *    `buildCatalogGroupMemberKeyMap` и `buildInitialExpandedGroupIds`
 * 4. Предоставить функции `isCatalogHeaderRowKind`, `catalogTableRowId`,
 *    `catalogCategoryGroupId` и `catalogSubGroupGroupId`
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/index.tsx` — передаёт строки и карты групп в Table
 */

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

/**
 * CatalogTableRowKind — представляет роль строки в иерархии демо-таблицы.
 */
export type CatalogTableRowKind = 'brand-head' | 'group-head' | 'group-member';

/**
 * CatalogTableRow — представляет строку демо-таблицы каталога.
 *
 * @property brandId — бренд, к которому относится строка
 * @property categoryId — категория для голов групп и member-строк
 * @property dataRowKey — ключ данных: id товара или id группы
 * @property groupExpanded — признак раскрытой группы для головы группы
 * @property groupId — идентификатор группы строки
 * @property indexLabel — текст колонки нумерации для member-строк
 * @property nestDepth — глубина вложенности для голов подгрупп и member-строк
 * @property price — значение колонки Price
 * @property product — значение колонки Product
 * @property rowId — стабильный ключ строки для Table
 * @property rowKind — роль строки в иерархии
 * @property stock — значение колонки Stock
 */
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

/**
 * catalogCategoryGroupId — возвращает идентификатор группы категории внутри бренда.
 *
 * @param brandId бренд
 * @param categoryId категория
 * @returns строковый id группы категории внутри бренда
 */
function catalogCategoryGroupId(
  brandId: CatalogBrand,
  categoryId: CatalogCategoryId
): string {
  return `${brandId}:${categoryId}`;
}

/**
 * catalogSubGroupGroupId — возвращает идентификатор вложенной подгруппы.
 *
 * @param brandId бренд
 * @param categoryId категория
 * @param subGroupId подгруппа
 * @returns строковый id вложенной подгруппы
 */
function catalogSubGroupGroupId(
  brandId: CatalogBrand,
  categoryId: CatalogCategoryId,
  subGroupId: CatalogSubGroupId
): string {
  return `${brandId}:${categoryId}:${subGroupId}`;
}

/**
 * allCategoryGroupIds — возвращает набор id всех групп и подгрупп, у которых есть товары.
 *
 * @param products товары каталога
 * @returns набор идентификаторов групп
 */
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

/**
 * isCatalogHeaderRowKind — возвращает признак строки-заголовка бренда или группы.
 *
 * @param rowKind роль строки
 * @returns `true` для `brand-head` и `group-head`
 */
export function isCatalogHeaderRowKind(rowKind: CatalogTableRowKind): boolean {
  return rowKind === 'brand-head' || rowKind === 'group-head';
}

/**
 * catalogTableRowId — возвращает стабильный `rowId` строки демо-таблицы.
 *
 * @param rowKind роль строки
 * @param groupId идентификатор группы
 * @param suffix уникальный хвост: id товара, категории или подгруппы
 * @returns строковый ключ строки
 */
export function catalogTableRowId(
  rowKind: CatalogTableRowKind,
  groupId: string,
  suffix: string
): string {
  return `${rowKind}:${groupId}:${suffix}`;
}

/**
 * buildCatalogTableRows — собирает видимые строки демо-таблицы по раскрытым группам.
 *
 * Как работает:
 * 1. Обходит бренды и категории с товарами и добавляет головы бренда и группы
 * 2. Для свёрнутой группы пропускает членов и вложенные подгруппы
 * 3. Для категорий с подгруппами добавляет головы подгрупп и их членов при раскрытии
 * 4. Нумерацию членов ведёт сквозь группы при `continuousNumbering`, иначе сбрасывает
 *    счётчик в каждой группе или подгруппе
 *
 * @param products товары каталога
 * @param expandedGroupIds набор раскрытых групп
 * @param continuousNumbering сквозная нумерация членов групп
 * @returns массив строк для пропа `rows` Table
 */
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

/**
 * buildCatalogTableSizingRows — возвращает строки со всеми группами раскрытыми
 * для расчёта max-ширины колонок.
 *
 * @param products товары каталога
 * @returns строки каталога при полном раскрытии и сквозной нумерации
 */
export function buildCatalogTableSizingRows(
  products: readonly CatalogProduct[]
): CatalogTableRow[] {
  return buildCatalogTableRows(products, allCategoryGroupIds(products), true);
}

/**
 * buildCatalogSelectableKeys — возвращает ключи всех product-строк для «выбрать всё».
 * Считает строки при полном раскрытии категорий, включая обычно свёрнутые.
 *
 * @param products товары каталога
 * @returns массив `rowId` member-строк
 */
export function buildCatalogSelectableKeys(
  products: readonly CatalogProduct[]
): string[] {
  return buildCatalogTableRows(products, allCategoryGroupIds(products))
    .filter((row) => row.rowKind === 'group-member')
    .map((row) => row.rowId);
}

/**
 * buildCatalogGroupMemberKeyMap — возвращает соответствие головы группы и `rowId`
 * всех её product-строк, включая свёрнутые.
 *
 * @param products товары каталога
 * @returns карта `rowId` головы группы → массив `rowId` членов
 */
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

/**
 * buildInitialExpandedGroupIds — возвращает набор id всех групп для начального раскрытия.
 *
 * @param products товары каталога
 * @returns набор идентификаторов групп
 */
export function buildInitialExpandedGroupIds(
  products: readonly CatalogProduct[]
): Set<string> {
  return allCategoryGroupIds(products);
}

export { catalogCategoryGroupId, catalogSubGroupGroupId };

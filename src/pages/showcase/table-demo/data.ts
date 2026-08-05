/**
 * Файл: `src/pages/showcase/table-demo/data.ts`
 * Содержит исходные данные каталога для демо-таблицы Table в витрине.
 *
 * Основные задачи:
 * 1. Типизировать сущности каталога через `CatalogBrand`, `CatalogCategoryId`,
 *    `CatalogSubGroupId` и `CatalogProduct`
 * 2. Задать порядок и подписи брендов, категорий и подгрупп
 * 3. Предоставить признак вложенных подгрупп через `catalogCategoryUsesSubGroups`
 * 4. Задать начальный набор товаров в `INITIAL_CATALOG_PRODUCTS`
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/rows.ts` — строит строки таблицы из каталога
 *  - `src/pages/showcase/table-demo/index.tsx` — держит состояние товаров демо-таблицы
 */

/**
 * CatalogBrand — представляет бренд товара в каталоге демо-таблицы.
 */
export type CatalogBrand = 'Apple' | 'Huawei' | 'Samsung' | 'Xiaomi';

/**
 * CATALOG_BRAND_ORDER — задаёт порядок брендов в демо-таблице.
 * Используется при обходе каталога в `buildCatalogTableRows` и соответствиях групп.
 */
export const CATALOG_BRAND_ORDER: readonly CatalogBrand[] = [
  'Apple',
  'Samsung',
  'Huawei',
  'Xiaomi',
];

/**
 * CatalogCategoryId — представляет идентификатор категории товаров каталога.
 */
export type CatalogCategoryId = 'phones' | 'tablets' | 'watches';

/**
 * CatalogSubGroupId — представляет идентификатор подгруппы внутри категории.
 */
export type CatalogSubGroupId = 'iphone-16' | 'iphone-17';

/**
 * CATALOG_SUB_GROUP_LABELS — связывает идентификатор подгруппы с подписью в таблице.
 * Ключ — `CatalogSubGroupId`, значение — текст головы подгруппы.
 */
export const CATALOG_SUB_GROUP_LABELS: Record<CatalogSubGroupId, string> = {
  'iphone-17': 'iPhone 17',
  'iphone-16': 'iPhone 16',
};

/**
 * CATALOG_SUB_GROUP_ORDER — задаёт порядок подгрупп внутри категории с вложением.
 * Используется при обходе подгрупп Apple Phones.
 */
export const CATALOG_SUB_GROUP_ORDER: readonly CatalogSubGroupId[] = [
  'iphone-17',
  'iphone-16',
];

/**
 * CatalogProduct — представляет товар каталога демо-таблицы.
 *
 * @property brand — бренд товара
 * @property categoryId — категория товара
 * @property id — стабильный идентификатор товара
 * @property price — цена для колонки Price
 * @property product — название для колонки Product
 * @property stock — остаток для колонки Stock
 * @property subGroupId — подгруппа внутри категории, если категория использует вложение
 */
export type CatalogProduct = {
  brand: CatalogBrand;
  categoryId: CatalogCategoryId;
  id: string;
  price: string;
  product: string;
  stock: string;
  subGroupId?: CatalogSubGroupId;
};

/**
 * catalogCategoryUsesSubGroups — возвращает признак, что категория бренда рендерит
 * вложенные подгруппы вместо плоского списка товаров.
 *
 * @param brandId бренд товара
 * @param categoryId категория товара
 * @returns `true` для Apple Phones, иначе `false`
 */
export function catalogCategoryUsesSubGroups(
  brandId: CatalogBrand,
  categoryId: CatalogCategoryId
): boolean {
  return brandId === 'Apple' && categoryId === 'phones';
}

/**
 * CATALOG_CATEGORY_LABELS — связывает идентификатор категории с подписью в таблице.
 * Ключ — `CatalogCategoryId`, значение — текст головы группы.
 */
export const CATALOG_CATEGORY_LABELS: Record<CatalogCategoryId, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  watches: 'Smart watches',
};

/**
 * CATALOG_CATEGORY_ORDER — задаёт порядок категорий внутри бренда.
 * Используется при обходе каталога в `buildCatalogTableRows` и соответствиях групп.
 */
export const CATALOG_CATEGORY_ORDER: readonly CatalogCategoryId[] = [
  'phones',
  'tablets',
  'watches',
];

/**
 * INITIAL_CATALOG_PRODUCTS — задаёт начальный набор товаров демо-таблицы.
 * Используется при инициализации состояния `products` в TableDemo.
 */
export const INITIAL_CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    brand: 'Apple',
    categoryId: 'phones',
    id: 'iphone-17-pro',
    price: '$1,099',
    product: 'iPhone 17 Pro',
    stock: '320',
    subGroupId: 'iphone-17',
  },
  {
    brand: 'Apple',
    categoryId: 'phones',
    id: 'iphone-17-pro-max',
    price: '$1,199',
    product: 'iPhone 17 Pro Max',
    stock: '280',
    subGroupId: 'iphone-17',
  },
  {
    brand: 'Apple',
    categoryId: 'phones',
    id: 'iphone-16',
    price: '$799',
    product: 'iPhone 16',
    stock: '410',
    subGroupId: 'iphone-16',
  },
  {
    brand: 'Apple',
    categoryId: 'phones',
    id: 'iphone-16-plus',
    price: '$899',
    product: 'iPhone 16 Plus',
    stock: '365',
    subGroupId: 'iphone-16',
  },
  {
    brand: 'Samsung',
    categoryId: 'phones',
    id: 'galaxy-s25',
    price: '$899',
    product: 'Galaxy S25',
    stock: '310',
  },
  {
    brand: 'Huawei',
    categoryId: 'phones',
    id: 'pura-70',
    price: '$849',
    product: 'Pura 70',
    stock: '180',
  },
  {
    brand: 'Xiaomi',
    categoryId: 'phones',
    id: 'xiaomi-15',
    price: '$699',
    product: 'Xiaomi 15',
    stock: '260',
  },
  {
    brand: 'Apple',
    categoryId: 'tablets',
    id: 'ipad-pro',
    price: '$1,099',
    product: 'iPad Pro',
    stock: '95',
  },
  {
    brand: 'Samsung',
    categoryId: 'tablets',
    id: 'galaxy-tab-s9',
    price: '$849',
    product: 'Galaxy Tab S9',
    stock: '120',
  },
  {
    brand: 'Huawei',
    categoryId: 'tablets',
    id: 'matepad-pro',
    price: '$749',
    product: 'MatePad Pro',
    stock: '88',
  },
  {
    brand: 'Xiaomi',
    categoryId: 'tablets',
    id: 'pad-6',
    price: '$499',
    product: 'Pad 6',
    stock: '140',
  },
  {
    brand: 'Apple',
    categoryId: 'watches',
    id: 'apple-watch',
    price: '$399',
    product: 'Apple Watch Series 10',
    stock: '210',
  },
  {
    brand: 'Samsung',
    categoryId: 'watches',
    id: 'galaxy-watch',
    price: '$349',
    product: 'Galaxy Watch 7',
    stock: '175',
  },
  {
    brand: 'Huawei',
    categoryId: 'watches',
    id: 'watch-gt',
    price: '$299',
    product: 'Watch GT 5',
    stock: '130',
  },
  {
    brand: 'Xiaomi',
    categoryId: 'watches',
    id: 'watch-s3',
    price: '$249',
    product: 'Watch S3',
    stock: '190',
  },
];

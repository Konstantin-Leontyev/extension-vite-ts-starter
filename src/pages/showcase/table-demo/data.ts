// TODO: ручное ревью — pages/showcase/table-demo/data.ts
export type CatalogBrand = 'Apple' | 'Huawei' | 'Samsung' | 'Xiaomi';

export const CATALOG_BRAND_ORDER: readonly CatalogBrand[] = [
  'Apple',
  'Samsung',
  'Huawei',
  'Xiaomi',
];

export type CatalogCategoryId = 'phones' | 'tablets' | 'watches';

export type CatalogSubGroupId = 'iphone-16' | 'iphone-17';

export const CATALOG_SUB_GROUP_LABELS: Record<CatalogSubGroupId, string> = {
  'iphone-17': 'iPhone 17',
  'iphone-16': 'iPhone 16',
};

export const CATALOG_SUB_GROUP_ORDER: readonly CatalogSubGroupId[] = [
  'iphone-17',
  'iphone-16',
];

export type CatalogProduct = {
  brand: CatalogBrand;
  categoryId: CatalogCategoryId;
  id: string;
  price: string;
  product: string;
  stock: string;
  subGroupId?: CatalogSubGroupId;
};

export function catalogCategoryUsesSubGroups(
  brandId: CatalogBrand,
  categoryId: CatalogCategoryId
): boolean {
  return brandId === 'Apple' && categoryId === 'phones';
}

export const CATALOG_CATEGORY_LABELS: Record<CatalogCategoryId, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  watches: 'Smart watches',
};

export const CATALOG_CATEGORY_ORDER: readonly CatalogCategoryId[] = [
  'phones',
  'tablets',
  'watches',
];

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

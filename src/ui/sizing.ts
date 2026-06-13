/**
 * Размеры — свободные строки: контентные значения
 * (`max-content`, `100%`, `min(360px, …)`) шкалой не выражаются.
 */
export type SizingProps = {
  blockSize?: string;
  inlineSize?: string;
  maxBlockSize?: string;
  maxInlineSize?: string;
  minBlockSize?: string;
  minInlineSize?: string;
};

/**
 * Источник истины оси: sizing-проп → CSS-свойство.
 * Набор имён и генератор выводятся отсюда; `satisfies` держит карту
 * в синхроне с SizingProps в обе стороны.
 */
const SIZING_CSS = {
  inlineSize: 'inline-size',
  minInlineSize: 'min-inline-size',
  maxInlineSize: 'max-inline-size',
  blockSize: 'block-size',
  minBlockSize: 'min-block-size',
  maxBlockSize: 'max-block-size',
} as const satisfies Record<keyof SizingProps, string>;

export const SIZING_PROP_NAMES = new Set<string>(Object.keys(SIZING_CSS));

export function getSizingStyles(props: SizingProps): string {
  const rules: string[] = [];

  for (const [prop, property] of Object.entries(SIZING_CSS)) {
    const value = props[prop as keyof SizingProps];

    if (value !== undefined) {
      rules.push(`${property}: ${value};`);
    }
  }

  return rules.join('\n');
}

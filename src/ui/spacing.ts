/** Отступ: ключ — px в spacing-пропе, значение — длина в CSS. */
export const SPACING_REM = {
  0: '0',
  4: '0.25rem',
  8: '0.5rem',
  12: '0.75rem',
  16: '1rem',
  20: '1.25rem',
  24: '1.5rem',
  28: '1.75rem',
  32: '2rem',
  36: '2.25rem',
  40: '2.5rem',
  44: '2.75rem',
  48: '3rem',
  64: '4rem',
  80: '5rem',
} as const;

export type SpacingPx = keyof typeof SPACING_REM;

/**
 * Источник истины оси: spacing-проп → CSS-свойство.
 * Тип, набор имён и генератор выводятся отсюда.
 * Порядок объявления = порядок правил в CSS: шорткат раньше лонгхендов.
 */
const SPACING_CSS = {
  margin: 'margin',
  marginBlock: 'margin-block',
  marginBlockEnd: 'margin-block-end',
  marginBlockStart: 'margin-block-start',
  marginInline: 'margin-inline',
  marginInlineEnd: 'margin-inline-end',
  marginInlineStart: 'margin-inline-start',
  padding: 'padding',
  paddingBlock: 'padding-block',
  paddingBlockEnd: 'padding-block-end',
  paddingBlockStart: 'padding-block-start',
  paddingInline: 'padding-inline',
  paddingInlineEnd: 'padding-inline-end',
  paddingInlineStart: 'padding-inline-start',
} as const;

export type SpacingProps = { [K in keyof typeof SPACING_CSS]?: SpacingPx };

/** Имена spacing-пропов: только CSS, не атрибуты DOM-узла. */
export const SPACING_PROP_NAMES = new Set<string>(Object.keys(SPACING_CSS));

export function spacingRem(px: SpacingPx): string {
  return SPACING_REM[px];
}

export function getSpacingStyles(props: SpacingProps): string {
  const rules: string[] = [];

  for (const [prop, property] of Object.entries(SPACING_CSS)) {
    const value = props[prop as keyof SpacingProps];

    if (value !== undefined) {
      rules.push(`${property}: ${SPACING_REM[value]};`);
    }
  }

  return rules.join('\n');
}

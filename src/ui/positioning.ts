import { type CSSProperties } from 'react';

import { spacingRem, type SpacingPx } from '@ui/spacing';

export type InsetValue = 'auto' | SpacingPx;

export type LayoutDisplay = 'block' | 'flex' | 'grid' | 'inline-flex';

export type LayoutPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';

export type PositioningProps = {
  alignItems?: CSSProperties['alignItems'];
  alignSelf?: CSSProperties['alignSelf'];
  bottom?: InsetValue;
  columnGap?: SpacingPx;
  display?: LayoutDisplay;
  flexDirection?: CSSProperties['flexDirection'];
  flexWrap?: CSSProperties['flexWrap'];
  gap?: SpacingPx;
  gridAutoFlow?: CSSProperties['gridAutoFlow'];
  gridTemplateColumns?: CSSProperties['gridTemplateColumns'];
  gridTemplateRows?: CSSProperties['gridTemplateRows'];
  inset?: InsetValue;
  insetBlock?: InsetValue;
  insetBlockEnd?: InsetValue;
  insetBlockStart?: InsetValue;
  insetInline?: InsetValue;
  insetInlineEnd?: InsetValue;
  insetInlineStart?: InsetValue;
  justifyContent?: CSSProperties['justifyContent'];
  justifySelf?: CSSProperties['justifySelf'];
  left?: InsetValue;
  overflow?: CSSProperties['overflow'];
  placeItems?: CSSProperties['placeItems'];
  placeSelf?: CSSProperties['placeSelf'];
  position?: LayoutPosition;
  right?: InsetValue;
  rowGap?: SpacingPx;
  top?: InsetValue;
  zIndex?: CSSProperties['zIndex'];
};

/** Вид значения: `inset`/`spacing` идут через SPACING_REM, `raw` — как есть. */
type PositioningValueKind = 'inset' | 'raw' | 'spacing';

/**
 * Источник истины оси: позиционирующий проп → CSS-свойство и вид значения.
 * Набор имён и генератор выводятся отсюда; `satisfies` держит карту
 * в синхроне с PositioningProps в обе стороны.
 * Порядок объявления = порядок правил в CSS: шорткат раньше лонгхендов
 * (`inset` раньше `top`, `gap` раньше `row-gap`).
 */
const POSITIONING_CSS = {
  display: ['display', 'raw'],
  position: ['position', 'raw'],
  zIndex: ['z-index', 'raw'],
  inset: ['inset', 'inset'],
  insetBlock: ['inset-block', 'inset'],
  insetBlockStart: ['inset-block-start', 'inset'],
  insetBlockEnd: ['inset-block-end', 'inset'],
  insetInline: ['inset-inline', 'inset'],
  insetInlineStart: ['inset-inline-start', 'inset'],
  insetInlineEnd: ['inset-inline-end', 'inset'],
  top: ['top', 'inset'],
  right: ['right', 'inset'],
  bottom: ['bottom', 'inset'],
  left: ['left', 'inset'],
  flexDirection: ['flex-direction', 'raw'],
  flexWrap: ['flex-wrap', 'raw'],
  alignItems: ['align-items', 'raw'],
  justifyContent: ['justify-content', 'raw'],
  placeItems: ['place-items', 'raw'],
  placeSelf: ['place-self', 'raw'],
  alignSelf: ['align-self', 'raw'],
  justifySelf: ['justify-self', 'raw'],
  gridTemplateRows: ['grid-template-rows', 'raw'],
  gridTemplateColumns: ['grid-template-columns', 'raw'],
  gridAutoFlow: ['grid-auto-flow', 'raw'],
  gap: ['gap', 'spacing'],
  rowGap: ['row-gap', 'spacing'],
  columnGap: ['column-gap', 'spacing'],
  overflow: ['overflow', 'raw'],
} as const satisfies Record<
  keyof PositioningProps,
  readonly [string, PositioningValueKind]
>;

export const POSITIONING_PROP_NAMES = new Set<string>(Object.keys(POSITIONING_CSS));

function positioningValueCss(
  kind: PositioningValueKind,
  value: NonNullable<PositioningProps[keyof PositioningProps]>
): string {
  if (kind === 'raw') {
    return String(value);
  }

  if (value === 'auto') {
    return 'auto';
  }

  // Карта гарантирует: у inset/spacing-пропов значение — SpacingPx.
  return spacingRem(value as SpacingPx);
}

export function getPositioningStyles(props: PositioningProps): string {
  const rules: string[] = [];

  for (const [prop, [property, kind]] of Object.entries(POSITIONING_CSS)) {
    const value = props[prop as keyof PositioningProps];

    if (value !== undefined) {
      rules.push(`${property}: ${positioningValueCss(kind, value)};`);
    }
  }

  return rules.join('\n');
}

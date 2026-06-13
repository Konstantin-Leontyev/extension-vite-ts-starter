import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';

/** Пресеты типографики для оси sizePreset. */
export const textSizePresets = {
  extraBold: {
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: '1.75rem',
  },
  bold: {
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.5rem',
  },
  medium: {
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1rem',
  },
  normal: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.25rem',
  },
  thin: {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1rem',
  },
  light: {
    fontSize: '0.75rem',
    fontWeight: '300',
    lineHeight: '1rem',
  },
  extraLight: {
    fontSize: '0.75rem',
    fontWeight: '200',
    lineHeight: '1rem',
  },
} as const;

export type TextSizePreset = keyof typeof textSizePresets;

export type TextStyleProps = LayoutProps & {
  align?: CSSProperties['textAlign'];
  color?: string;
  /** Однострочное обрезание: overflow + text-overflow + white-space одним пропом. */
  ellipsis?: boolean;
  fontSize?: string;
  fontWeight?: CSSProperties['fontWeight'];
  lineHeight?: CSSProperties['lineHeight'];
  sizePreset?: TextSizePreset;
  whiteSpace?: CSSProperties['whiteSpace'];
};

const TEXT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'align',
  'color',
  'ellipsis',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'sizePreset',
  'whiteSpace',
]);

export function getTextStyles(props: TextStyleProps): string {
  const {
    align,
    color,
    ellipsis,
    fontSize,
    fontWeight,
    lineHeight,
    sizePreset = 'normal',
    whiteSpace,
  } = props;

  const rules: string[] = [];

  const preset = textSizePresets[sizePreset];

  rules.push(`font-size: ${preset.fontSize};`);
  rules.push(`font-weight: ${preset.fontWeight};`);
  rules.push(`line-height: ${preset.lineHeight};`);

  if (fontSize !== undefined) {
    rules.push(`font-size: ${fontSize};`);
  }

  if (fontWeight !== undefined) {
    rules.push(`font-weight: ${fontWeight};`);
  }

  if (lineHeight !== undefined) {
    rules.push(`line-height: ${lineHeight};`);
  }

  if (color !== undefined) {
    rules.push(`color: ${color};`);
  }

  if (align !== undefined) {
    rules.push(`text-align: ${align};`);
  }

  if (whiteSpace !== undefined) {
    rules.push(`white-space: ${whiteSpace};`);
  }

  if (ellipsis === true) {
    rules.push('overflow: hidden;');
    rules.push('text-overflow: ellipsis;');
    rules.push('white-space: nowrap;');
  }

  return rules.join('\n');
}

export const StyledText = styled.span.withConfig({
  shouldForwardProp: (prop) => !TEXT_PROP_NAMES.has(prop),
})<TextStyleProps>`
  color: inherit;
  min-inline-size: 0;
  overflow-wrap: break-word;
  ${(props) => getTextStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

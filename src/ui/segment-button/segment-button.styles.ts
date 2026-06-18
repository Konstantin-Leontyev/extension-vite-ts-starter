import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { SPACING_REM, spacingRem, type SpacingPx } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export type SegmentButtonShape = 'default' | 'round';

/** Пресеты размера сегментной кнопки: габариты сегмента и размер текста. */
export const segmentButtonSizePresets = {
  small: {
    blockSize: 32,
    dividerMarginBlock: 8,
    gap: 4,
    textSizePreset: 'medium',
    paddingInline: 12,
  },
  medium: {
    blockSize: 40,
    dividerMarginBlock: 8,
    gap: 8,
    textSizePreset: 'medium',
    paddingInline: 12,
  },
  large: {
    blockSize: 48,
    dividerMarginBlock: 12,
    gap: 8,
    textSizePreset: 'normal',
    paddingInline: 16,
  },
} as const satisfies Record<
  string,
  {
    blockSize: SpacingPx;
    dividerMarginBlock: SpacingPx;
    gap: SpacingPx;
    textSizePreset: TextSizePreset;
    paddingInline: SpacingPx;
  }
>;

export type SegmentButtonSizePreset = keyof typeof segmentButtonSizePresets;

export type SegmentButtonStyleProps = LayoutProps & {
  shape?: SegmentButtonShape;
  sizePreset?: SegmentButtonSizePreset;
};

const SEGMENT_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'shape',
  'sizePreset',
]);

type SegmentViewProps = {
  shape?: SegmentButtonShape;
  sizePreset?: SegmentButtonSizePreset;
};

export function getSegmentButtonStyles(
  props: SegmentViewProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = 'default', sizePreset = 'large' } = props;
  const preset = segmentButtonSizePresets[sizePreset];
  const radius = shape === 'round' ? '9999px' : SPACING_REM[8];

  return [
    `min-block-size: ${spacingRem(preset.blockSize)};`,
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `box-shadow: ${theme.shadow.surface};`,
    `border-radius: ${radius};`,
  ].join('\n');
}

function getSegmentPartStyles(props: SegmentViewProps): string {
  const { shape = 'default', sizePreset = 'large' } = props;
  const preset = segmentButtonSizePresets[sizePreset];

  const rules = [
    `gap: ${spacingRem(preset.gap)};`,
    `block-size: ${spacingRem(preset.blockSize)};`,
    `padding-inline: ${spacingRem(preset.paddingInline)};`,
  ];

  if (shape === 'default') {
    rules.push(
      `&:first-child {\nborder-start-start-radius: ${SPACING_REM[8]};\nborder-end-start-radius: ${SPACING_REM[8]};\n}`
    );
    rules.push(
      `&:last-child {\nborder-start-end-radius: ${SPACING_REM[8]};\nborder-end-end-radius: ${SPACING_REM[8]};\n}`
    );
  }

  return rules.join('\n');
}

function getSegmentDividerStyles(props: {
  sizePreset?: SegmentButtonSizePreset;
}): string {
  const { sizePreset = 'large' } = props;

  return `margin-block: ${spacingRem(segmentButtonSizePresets[sizePreset].dividerMarginBlock)};`;
}

export const StyledSegmentButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PROP_NAMES.has(prop),
})<SegmentButtonStyleProps>`
  display: inline-grid;
  grid-template-columns: 1fr;
  flex-shrink: 0;
  align-items: stretch;
  overflow: hidden;

  &[data-segments='2'] {
    inline-size: 100%;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  &[data-segments='3'] {
    inline-size: 100%;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  }

  ${(props) => getSegmentButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

export const StyledSegmentButtonPart = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'shape' && prop !== 'sizePreset',
})<SegmentViewProps>`
  display: flex;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;

  & svg {
    inline-size: 1.25rem;
    block-size: 1.25rem;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: 2px solid ${(props) => getTheme(props).colors.focusRing};
    outline-offset: -2px;
  }

  &:hover:not(:disabled) {
    background-color: ${(props) => {
      const theme = getTheme(props);

      return `color-mix(in srgb, ${theme.colors.border} 28%, ${theme.colors.surface})`;
    }};
  }

  ${(props) => getSegmentPartStyles(props)}
`;

export const StyledSegmentButtonDivider = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset',
})<{ sizePreset?: SegmentButtonSizePreset }>`
  inline-size: 1px;
  background-color: ${(props) => getTheme(props).colors.border};
  ${(props) => getSegmentDividerStyles(props)}
`;

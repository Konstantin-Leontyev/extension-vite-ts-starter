import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  blockSizeRem,
  controlPaddingInline,
  radiusPreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  extendedToneOptions,
  resolveExtendedToneColor,
  type ExtendedTone,
  type ToneExtraColors,
} from '@ui/tones';

/** Локальный слой textColor: канон tone + muted (нейтральный вторичный текст). */
export type SegmentTextColor = ExtendedTone<'muted'>;

/** Локальные значения textColor вне канона → ключи темы. */
const SEGMENT_TEXT_EXTRA_COLORS = {
  muted: 'muted',
} as const satisfies ToneExtraColors<'muted'>;

export const SEGMENT_TEXT_COLOR_OPTIONS = extendedToneOptions(['muted']);

/**
 * Цвет текста сегмента: явный `textColor` резолвится через канон тона (нейтральный
 * `default` → наследование), без override активный сегмент берёт `primary`.
 */
export function resolveSegmentTextColor(
  theme: AppTheme,
  textColor: SegmentTextColor | undefined,
  active: boolean | undefined
): string | undefined {
  if (textColor !== undefined) {
    return resolveExtendedToneColor(
      theme,
      textColor,
      SEGMENT_TEXT_EXTRA_COLORS,
      undefined
    );
  }

  return active ? theme.colors.primary : undefined;
}

/** Зазор между иконкой и текстом сегмента и вертикальный отступ разделителя — оси, уникальные для сегментной кнопки. */
const segmentButtonLayoutPresets = {
  small: { dividerMarginBlock: 8, gap: 4 },
  medium: { dividerMarginBlock: 8, gap: 8 },
  large: { dividerMarginBlock: 12, gap: 8 },
} as const satisfies Record<
  SizePreset,
  { dividerMarginBlock: SpacingPx; gap: SpacingPx }
>;

export type SegmentButtonStyleProps = LayoutProps & {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

const SEGMENT_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'shape',
  'sizePreset',
]);

type SegmentViewProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

export function getSegmentButtonStyles(
  props: SegmentViewProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return [
    `min-block-size: ${blockSizeRem(sizePreset)};`,
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `box-shadow: ${theme.shadow.surface};`,
    `border-radius: ${radiusPreset(shape, sizePreset)};`,
  ].join('\n');
}

function getSegmentPartStyles(props: SegmentViewProps): string {
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  const rules = [
    `gap: ${spacingRem(segmentButtonLayoutPresets[sizePreset].gap)};`,
    `block-size: ${blockSizeRem(sizePreset)};`,
    `padding-inline: ${spacingRem(controlPaddingInline[sizePreset])};`,
  ];

  if (shape === 'default') {
    const radius = spacingRem(8);

    rules.push(
      `&:first-child {\nborder-start-start-radius: ${radius};\nborder-end-start-radius: ${radius};\n}`
    );
    rules.push(
      `&:last-child {\nborder-start-end-radius: ${radius};\nborder-end-end-radius: ${radius};\n}`
    );
  }

  return rules.join('\n');
}

function getSegmentDividerStyles(props: { sizePreset?: SizePreset }): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `margin-block: ${spacingRem(segmentButtonLayoutPresets[sizePreset].dividerMarginBlock)};`;
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
  /* flex (не grid): центрированный ряд [иконка?] + Text, где текст сжимается с ellipsis;
     grid с auto-колонками тянет трек к max-content и ломает усечение. */
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
})<{ sizePreset?: SizePreset }>`
  inline-size: 1px;
  background-color: ${(props) => getTheme(props).colors.border};
  ${(props) => getSegmentDividerStyles(props)}
`;

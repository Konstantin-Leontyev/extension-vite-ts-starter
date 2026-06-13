import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { SPACING_REM, spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Пресеты размера: габарит бокса и размер галки. */
export const checkboxSizePresets = {
  small: {
    blockSize: 12,
    checkSize: 8,
  },
  medium: {
    blockSize: 16,
    checkSize: 8,
  },
  large: {
    blockSize: 20,
    checkSize: 12,
  },
} as const satisfies Record<string, { blockSize: SpacingPx; checkSize: SpacingPx }>;

export type CheckboxSizePreset = keyof typeof checkboxSizePresets;

const DEFAULT_SIZE_PRESET: CheckboxSizePreset = 'large';

/** Оси вида бокса (без layout — он на корне). */
export type CheckboxControlStyleProps = {
  inverted?: boolean;
  sizePreset?: CheckboxSizePreset;
};

/** Публичные пропы: layout — на корень, оси вида — на бокс. */
export type CheckboxStyleProps = LayoutProps & CheckboxControlStyleProps;

const CHECKBOX_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'inverted',
  'sizePreset',
]);

/** SVG-галка как data-URI; `#` в цвете кодируется для URL. */
function checkIcon(strokeColor: string): string {
  const stroke = strokeColor.replace('#', '%23');

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath stroke='${stroke}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2.5 6 5 8.5 9.5 3.5'/%3E%3C/svg%3E")`;
}

/** Габариты, рамка и checked-вид бокса по осям sizePreset/inverted. */
export function getCheckboxControlStyles(
  props: CheckboxControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { inverted = false, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const preset = checkboxSizePresets[sizePreset];
  const dimension = spacingRem(preset.blockSize);
  const checkDimension = spacingRem(preset.checkSize);

  // inverted: белое поле + primary-галка (подсветка строки); иначе primary-поле + inverse-галка.
  const checkedBackground = inverted ? theme.colors.inverse : theme.colors.primary;
  const checkedIcon = inverted
    ? checkIcon(theme.colors.primary)
    : checkIcon(theme.colors.inverse);

  return [
    'flex-shrink: 0;',
    `inline-size: ${dimension};`,
    `block-size: ${dimension};`,
    'appearance: none;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${SPACING_REM[4]};`,
    `box-shadow: ${theme.shadow.surface};`,
    `&:checked {
      background-color: ${checkedBackground};
      background-image: ${checkedIcon};
      background-repeat: no-repeat;
      background-position: center;
      background-size: ${checkDimension} ${checkDimension};
      border-color: ${theme.colors.primary};
    }`,
  ].join('\n');
}

export const StyledCheckboxRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: inline-flex;
  gap: ${SPACING_REM[8]};
  align-items: center;
  cursor: pointer;
  ${(props) => getLayoutStyles(props)}
`;

export const StyledCheckboxControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !CHECKBOX_PROP_NAMES.has(prop),
})<CheckboxStyleProps>`
  ${(props) => getCheckboxControlStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

export const StyledCheckboxLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset',
})<{ sizePreset?: CheckboxSizePreset }>`
  display: flex;
  align-items: center;
  min-block-size: ${(props) =>
    spacingRem(checkboxSizePresets[props.sizePreset ?? DEFAULT_SIZE_PRESET].blockSize)};
`;

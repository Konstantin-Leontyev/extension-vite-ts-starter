import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { DISABLED_OPACITY, getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Габарит бокса и размер галки — собственный ряд checkbox, мельче общих контролов. */
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
} as const satisfies Record<SizePreset, { blockSize: SpacingPx; checkSize: SpacingPx }>;

const DEFAULT_CHECKED_MARK: CheckboxCheckedMark = 'check';
const DEFAULT_UNCHECKED_MARK: CheckboxUncheckedMark = 'none';

/** Иконка в checked-состоянии; по умолчанию галка. */
export type CheckboxCheckedMark = 'check' | 'minus';

/** Иконка в unchecked-состоянии; по умолчанию без иконки. */
export type CheckboxUncheckedMark = 'none' | 'plus';

/** Оси вида бокса (без layout — он на корне). */
export type CheckboxControlStyleProps = {
  checkedMark?: CheckboxCheckedMark;
  inverted?: boolean;
  sizePreset?: SizePreset;
  uncheckedMark?: CheckboxUncheckedMark;
};

/** Публичные пропы: layout — на корень, оси вида — на бокс. */
export type CheckboxStyleProps = LayoutProps & CheckboxControlStyleProps;

const CHECKBOX_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'checkedMark',
  'inverted',
  'sizePreset',
  'uncheckedMark',
]);

/** SVG-марка как data-URI; `#` в цвете кодируется для URL. */
function markIcon(pathD: string, strokeColor: string): string {
  const stroke = strokeColor.replace('#', '%23');

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath stroke='${stroke}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='${pathD}'/%3E%3C/svg%3E")`;
}

function checkIcon(strokeColor: string): string {
  return markIcon('M2.5 6 5 8.5 9.5 3.5', strokeColor);
}

function plusIcon(strokeColor: string): string {
  return markIcon('M3 6h6M6 3v6', strokeColor);
}

function minusIcon(strokeColor: string): string {
  return markIcon('M3 6h6', strokeColor);
}

function markBackground(mark: string, dimension: string): string {
  return [
    `background-image: ${mark};`,
    'background-repeat: no-repeat;',
    'background-position: center;',
    `background-size: ${dimension} ${dimension};`,
  ].join('\n');
}

/** Габариты, рамка и checked-вид бокса по осям sizePreset/inverted. */
export function getCheckboxControlStyles(
  props: CheckboxControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    checkedMark = DEFAULT_CHECKED_MARK,
    inverted = false,
    sizePreset = DEFAULT_SIZE_PRESET,
    uncheckedMark = DEFAULT_UNCHECKED_MARK,
  } = props;
  const preset = checkboxSizePresets[sizePreset];
  const dimension = spacingRem(preset.blockSize);
  const markDimension = spacingRem(preset.checkSize);

  // inverted: белое поле + primary-иконка (подсветка строки); иначе primary-поле + inverse-иконка.
  const checkedBackground = inverted ? theme.colors.inverse : theme.colors.primary;
  const uncheckedStroke = inverted ? theme.colors.primary : theme.colors.default;
  const checkedStroke = inverted ? theme.colors.primary : theme.colors.inverse;
  const checkedMarkIcon =
    checkedMark === 'minus' ? minusIcon(checkedStroke) : checkIcon(checkedStroke);

  const rules = [
    'flex-shrink: 0;',
    `inline-size: ${dimension};`,
    `block-size: ${dimension};`,
    'appearance: none;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${spacingRem(4)};`,
    `box-shadow: ${theme.shadow.surface};`,
  ];

  if (uncheckedMark === 'plus') {
    rules.push(
      `&:not(:checked) {
        ${markBackground(plusIcon(uncheckedStroke), markDimension)}
      }`
    );
  }

  rules.push(
    `&:checked {
      background-color: ${checkedBackground};
      ${markBackground(checkedMarkIcon, markDimension)}
      border-color: ${theme.colors.primary};
    }`
  );

  return rules.join('\n');
}

export const StyledCheckboxRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: inline-grid;
  grid-auto-flow: column;
  /* Треки к началу: при растяжении корня родителем (flex/grid-колонка) лейбл
     остаётся прижат к боксу, а не уезжает в центр раздутой колонки. */
  justify-content: start;
  gap: ${spacingRem(8)};
  align-items: center;
  cursor: pointer;
  ${(props) => getLayoutStyles(props)}

  /* disabled приходит на input; корень-label об этом не знает — реагируем
     структурно через :has, чтобы убрать вводящий в заблуждение pointer и
     приглушить весь контрол как disabled-кнопку. reset.ts уже глушит сам бокс
     (DISABLED_OPACITY) — opacity на корне сложилась бы с этим, поэтому боксу
     возвращаем opacity: 1, итог ровно DISABLED_OPACITY на всём контроле. */
  &:has(:disabled) {
    cursor: not-allowed;
    opacity: ${DISABLED_OPACITY};
  }

  &:has(:disabled) input:disabled {
    opacity: 1;
  }
`;

export const StyledCheckboxControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !CHECKBOX_PROP_NAMES.has(prop),
})<CheckboxStyleProps>`
  ${(props) => getCheckboxControlStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

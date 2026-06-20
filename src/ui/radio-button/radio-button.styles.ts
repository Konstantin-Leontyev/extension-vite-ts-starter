import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Публичные пропы: только layout — на корень. */
export type RadioButtonStyleProps = LayoutProps;

const RADIO_DIMENSION: SpacingPx = 20;

/** Габариты, рамка и checked-точка кружка. */
export function getRadioButtonControlStyles(props: { theme: AppTheme }): string {
  const theme = getTheme(props);
  const dimension = spacingRem(RADIO_DIMENSION);

  return [
    'flex-shrink: 0;',
    `inline-size: ${dimension};`,
    `block-size: ${dimension};`,
    'appearance: none;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    'border-radius: 50%;',
    `box-shadow: ${theme.shadow.surface};`,
    `&:checked {
      background-color: ${theme.colors.surface};
      background-image: radial-gradient(circle at center, ${theme.colors.primary} 48%, transparent 49%);
      border-color: ${theme.colors.primary};
    }`,
  ].join('\n');
}

export const StyledRadioButtonRoot = styled.label.withConfig({
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
`;

export const StyledRadioButtonControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${(props) => getRadioButtonControlStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

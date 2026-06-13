import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { roundButtonSizePresets } from '@ui/round-button/round-button.styles';
import { SPACING_REM, spacingRem } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/** Заливка карточки: surface, фон страницы или прозрачная (без тени). */
export type CardBackground = 'background' | 'default' | 'transparent';

export type CardStyleProps = LayoutProps & {
  background?: CardBackground;
  hasHeader?: boolean;
};

const CARD_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'background',
  'hasHeader',
]);

export function getCardStyles(props: CardStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const { background = 'default', hasHeader = false } = props;

  const rules: string[] = [
    hasHeader
      ? 'grid-template-rows: auto minmax(0, 1fr);'
      : 'grid-template-rows: minmax(0, 1fr);',
  ];

  if (background === 'transparent') {
    rules.push('background-color: transparent;');
    rules.push('box-shadow: none;');
  } else {
    const fill =
      background === 'background' ? theme.colors.background : theme.colors.surface;

    rules.push(`background-color: ${fill};`);
    rules.push(`box-shadow: ${theme.shadow.surface};`);
  }

  return rules.join('\n');
}

export const StyledCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !CARD_PROP_NAMES.has(prop),
})<CardStyleProps>`
  position: relative;
  display: grid;
  min-inline-size: 0;
  min-block-size: 0;
  padding: ${SPACING_REM[16]};
  overflow: hidden;
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${SPACING_REM[12]};
  ${(props) => getCardStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/** Высота кнопки закрытия — единый источник с пресетом RoundButton в Card. */
const closeIconSize = spacingRem(roundButtonSizePresets.medium);

export const StyledCardHeader = styled.header.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasCloseIcon',
})<{ hasCloseIcon?: boolean }>`
  display: grid;
  row-gap: ${SPACING_REM[4]};

  /* Однострочная шапка центрируется по кнопке закрытия. */
  ${(props) =>
    props.hasCloseIcon === true
      ? `min-block-size: ${closeIconSize};\nalign-content: center;`
      : ''}
`;

export const StyledCardBody = styled.div`
  position: relative;
  display: grid;
  min-inline-size: 0;
  min-block-size: 0;
  background-color: inherit;
`;

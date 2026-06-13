import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { SPACING_REM } from '@ui/spacing';

export const StyledProfileMenu = styled.div`
  position: relative;
`;

export const StyledProfileMenuHeader = styled.div`
  display: grid;
  gap: ${SPACING_REM[12]};
  place-items: center;
  margin-block-start: ${SPACING_REM[16]};
`;

export const StyledProfileMenuContent = styled.div`
  display: grid;
  grid-template-rows: auto auto auto;
  block-size: 100%;
  min-block-size: 0;
`;

export const StyledProfileMenuActions = styled.div`
  margin-block-start: ${SPACING_REM[12]};
  padding-inline: ${SPACING_REM[4]};
`;

export const StyledProfileMenuLegal = styled.nav`
  display: flex;
  gap: ${SPACING_REM[8]};
  align-items: center;
  justify-content: center;
  padding-block-start: ${SPACING_REM[16]};
`;

export const StyledProfileMenuLegalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.muted};
  padding-inline: ${SPACING_REM[8]};
`;

import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { SPACING_REM } from '@ui/spacing';

export const StyledHeader = styled.header`
  position: sticky;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-block-size: 3rem;
  padding-block: ${SPACING_REM[12]};
  padding-inline: ${SPACING_REM[16]};
`;

export const StyledHeaderBrand = styled(NavLink)`
  justify-self: start;
  color: inherit;
  text-decoration: none;
`;

export const StyledHeaderActions = styled.div`
  /* Третья колонка грида 1fr auto 1fr (центр зарезервирован под список вкладок ресурса). */
  grid-column: 3;
  display: flex;
  gap: ${SPACING_REM[12]};
  align-items: center;
  justify-self: end;
`;

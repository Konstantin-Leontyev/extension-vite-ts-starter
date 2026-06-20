import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { spacingRem } from '@ui/spacing';

export const StyledHeader = styled.header`
  position: sticky;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-block-size: 3rem;
  padding-block: ${spacingRem(12)};
  padding-inline: ${spacingRem(16)};
`;

export const StyledHeaderBrand = styled(NavLink)`
  justify-self: start;
  color: inherit;
  text-decoration: none;
`;

export const StyledHeaderProject = styled.div`
  grid-column: 2;
  display: grid;
  place-items: center;
  justify-self: center;
  min-block-size: 3rem;
  padding-inline: ${spacingRem(4)};
`;

export const StyledHeaderActions = styled.div`
  /* Третья колонка грида 1fr auto 1fr (центр — название проекта). */
  grid-column: 3;
  display: grid;
  grid-auto-flow: column;
  gap: ${spacingRem(12)};
  align-items: center;
  justify-self: end;
`;

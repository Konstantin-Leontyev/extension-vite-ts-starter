import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { spacingRem } from '@ui/spacing';

export const StyledProfileMenu = styled.div`
  position: relative;
`;

export const StyledProfileMenuHeader = styled.div`
  display: grid;
  gap: ${spacingRem(12)};
  place-items: center;
`;

/** Колонка регионов: шапка (auto) → скролл (1fr) → действия (auto) → правовые (auto). */
export const StyledProfileMenuContent = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto auto;
  block-size: 100%;
  min-block-size: 0;
`;

export const StyledProfileMenuProjects = styled.div`
  display: grid;
  gap: ${spacingRem(12)};
`;

export const StyledProfileMenuActions = styled.div`
  margin-block-start: ${spacingRem(12)};
  padding-inline: ${spacingRem(4)};
`;

export const StyledProfileMenuIconBadge = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  inline-size: ${spacingRem(24)};
  block-size: ${spacingRem(24)};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.primary} 14%, ${theme.colors.surface})`};
  border-radius: 50%;

  & svg {
    inline-size: ${spacingRem(24)};
    block-size: ${spacingRem(24)};
  }
`;

export const StyledProfileMenuLegal = styled.nav`
  display: grid;
  grid-auto-flow: column;
  gap: ${spacingRem(8)};
  align-items: center;
  justify-content: center;
  padding-block-start: ${spacingRem(16)};
`;

export const StyledProfileMenuLegalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.muted};
  padding-inline: ${spacingRem(8)};
`;

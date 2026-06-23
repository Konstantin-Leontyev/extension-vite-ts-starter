import styled from 'styled-components';

import { spacingRem } from '@ui/spacing';

export const StyledModelDownloadGate = styled.div`
  display: grid;
  flex-grow: 1;
  min-block-size: 100%;
  place-items: center;
  padding: ${spacingRem(24)};
`;

export const StyledModelDownloadGateCard = styled.div`
  display: grid;
  gap: ${spacingRem(16)};
  min-inline-size: 0;
`;

export const StyledModelDownloadGateCopy = styled.div`
  display: grid;
  gap: ${spacingRem(8)};
`;

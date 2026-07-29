// TODO: ручное ревью — components/model-download-gate/model-download-gate.styles.ts
import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

export const StyledModelDownloadGate = styled.div`
  display: grid;
  flex-grow: 1;
  place-items: center;
  min-block-size: 100%;
  padding: ${getSpacingValue(24)};
`;

export const StyledModelDownloadGateCard = styled.div`
  display: grid;
  gap: ${getSpacingValue(16)};
  min-inline-size: 0;
`;

export const StyledModelDownloadGateCopy = styled.div`
  display: grid;
  gap: ${getSpacingValue(8)};
`;

// TODO: ручное ревью — ui/table/table-group-cell/table-group-cell.styles.ts
import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/** Голова группы: expander + текст в одной линии без nest-отступа (шеврон под «+»). */
export const StyledTableGroupCell = styled.span`
  display: inline-flex;
  gap: ${getSpacingValue(8)};
  align-items: center;
  min-inline-size: 0;
  vertical-align: middle;

  > * {
    flex-shrink: 0;
  }

  > :last-child {
    flex-shrink: 1;
    min-inline-size: 0;
  }
`;

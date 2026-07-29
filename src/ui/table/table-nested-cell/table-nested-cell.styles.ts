// TODO: ручное ревью — ui/table/table-nested-cell/table-nested-cell.styles.ts
import styled from 'styled-components';

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme } from '@ui/theme';

/** Отступ member-ячейки по nestDepth (2× cell padding на уровень). */
const TABLE_NEST_INDENT_BY_DEPTH: Record<1 | 2, SpacingValue> = {
  1: 24,
  2: 48,
};

function tableNestIndentPx(nestDepth: number): SpacingValue {
  return nestDepth === 2 ? TABLE_NEST_INDENT_BY_DEPTH[2] : TABLE_NEST_INDENT_BY_DEPTH[1];
}

export const StyledTableMemberPrefix = styled.span`
  flex-shrink: 0;
  color: ${(props) => getTheme(props).colors.muted};
`;

/** Строка под группой: nest-отступ + префикс + контент. */
export const StyledTableNestedCell = styled.span<{ $nestDepth: number }>`
  display: inline-flex;
  gap: ${getSpacingValue(8)};
  align-items: center;
  min-inline-size: 0;
  padding-inline-start: ${(props) =>
    getSpacingValue(tableNestIndentPx(props.$nestDepth))};
  vertical-align: middle;

  > * {
    flex-shrink: 0;
  }

  > :last-child {
    flex-shrink: 1;
    min-inline-size: 0;
  }
`;

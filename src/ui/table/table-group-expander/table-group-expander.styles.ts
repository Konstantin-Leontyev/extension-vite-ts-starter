// TODO: ручное ревью — ui/table/table-group-expander/table-group-expander.styles.ts
import styled from 'styled-components';

import { checkboxSizePresets } from '@ui/checkbox';
import { getSpacingValue } from '@ui/spacing';
import { getTheme } from '@ui/theme';

/** Габарит как Checkbox small — выравнивается под «+» в шапке keyword-колонки. */
const groupExpanderBlockSizeRem = getSpacingValue(checkboxSizePresets.small.size);

/**
 * Раскрытие группы: bordered box как у Checkbox small, шеврон внутри.
 * Рендерится в keyword-ячейке сразу после группового чекбокса (lead Table).
 */
export const StyledTableGroupExpander = styled.button`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  inline-size: ${groupExpanderBlockSizeRem};
  block-size: ${groupExpanderBlockSizeRem};
  color: ${(props) => getTheme(props).colors.default};
  appearance: none;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${getSpacingValue(4)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};

  > svg {
    inline-size: ${getSpacingValue(8)};
    block-size: ${getSpacingValue(8)};
  }
`;

/**
 * Файл: `src/ui/table/table-group-expander/table-group-expander.styles.ts`
 * Определяет внешний вид компонента TableGroupExpander.
 *
 * Основные задачи:
 * 1. Хранить сторону кнопки в `GROUP_EXPANDER_BLOCK_SIZE`
 * 2. Предоставить styled-узел `StyledTableGroupExpander`
 *
 * Потребители:
 *  - `src/ui/table/table-group-expander/index.tsx` — собирает компонент TableGroupExpander
 *  - `src/pages/showcase/table-demo/index.tsx` — рендерит раскрытие группы в демо-таблице
 */

import styled from 'styled-components';

import { checkboxSizePresets } from '@ui/checkbox';
import { getSpacingValue } from '@ui/spacing';
import { getTheme } from '@ui/theme';

/**
 * GROUP_EXPANDER_BLOCK_SIZE — задаёт сторону кнопки раскрытия группы.
 * Совпадает с габаритом Checkbox размера `small`, чтобы выровняться с кнопкой «+»
 * в шапке keyword-колонки.
 */
const GROUP_EXPANDER_BLOCK_SIZE = getSpacingValue(checkboxSizePresets.small.size);

/**
 * StyledTableGroupExpander — задаёт корневой узел компонента TableGroupExpander.
 * Базируется на `<button>`: рамка как у Checkbox размера `small`, шеврон внутри.
 * Рендерится в keyword-ячейке сразу после группового чекбокса в лид-слоте Table.
 *
 * Встроенные стили:
 *  - `display: grid` и `place-items: center` — центрирует шеврон
 *  - `flex-shrink: 0` — кнопка не сжимается в лид-слоте
 *  - `inline-size` и `block-size` — сторона из `GROUP_EXPANDER_BLOCK_SIZE`
 *  - `appearance: none` — сбрасывает нативное оформление кнопки
 *  - `background-color`, `border`, `border-radius` и `box-shadow` — поверхность как у Checkbox
 */
export const StyledTableGroupExpander = styled.button`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  inline-size: ${GROUP_EXPANDER_BLOCK_SIZE};
  block-size: ${GROUP_EXPANDER_BLOCK_SIZE};
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

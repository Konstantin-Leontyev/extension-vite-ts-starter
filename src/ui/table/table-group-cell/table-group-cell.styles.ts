/**
 * Файл: `src/ui/table/table-group-cell/table-group-cell.styles.ts`
 * Определяет внешний вид компонента TableGroupCell.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledTableGroupCell`
 *
 * Потребители:
 *  - `src/ui/table/table-group-cell/index.tsx` — собирает компонент TableGroupCell
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledTableGroupCell — задаёт корневой узел компонента TableGroupCell.
 * Базируется на `<span>`: expander и текст головы группы в одну линию без отступа
 * вложенности. Шеврон выравнивается под кнопку «+» шапки.
 *
 * Встроенные стили:
 *  - `display: inline-flex` — expander и текст в одном потоке
 *  - `gap` — отступ между expander и текстом
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `vertical-align: middle` — выравнивание в строке таблицы
 */
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

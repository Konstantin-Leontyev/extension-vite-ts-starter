/**
 * Файл: `src/ui/table/table-nested-cell/table-nested-cell.styles.ts`
 * Определяет внешний вид компонента TableNestedCell.
 *
 * Основные задачи:
 * 1. Хранить отступы вложенности в `TABLE_NEST_INDENT_BY_DEPTH`
 * 2. Предоставить styled-узел `StyledTableNestedCell`
 *
 * Потребители:
 *  - `src/ui/table/table-nested-cell/index.tsx` — собирает компонент TableNestedCell
 */

import styled from 'styled-components';

import { getSpacingValue, type SpacingValue } from '@ui/spacing';

/**
 * TABLE_NEST_INDENT_BY_DEPTH — хранит отступ member-ячейки для каждого уровня вложенности.
 * Ключ — глубина `nestDepth`, значение — ключ шкалы отступов из `@ui/spacing`.
 */
const TABLE_NEST_INDENT_BY_DEPTH: Record<1 | 2, SpacingValue> = {
  1: 24,
  2: 48,
};

/**
 * getTableNestIndent — возвращает ключ шкалы отступа member-ячейки по `nestDepth`.
 *
 * @param nestDepth глубина вложенности строки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
function getTableNestIndent(nestDepth: 1 | 2): SpacingValue {
  return TABLE_NEST_INDENT_BY_DEPTH[nestDepth];
}

/**
 * StyledTableNestedCell — задаёт корневой узел компонента TableNestedCell.
 * Базируется на `<span>`: отступ по `nestDepth`, префикс и контент в одну линию.
 *
 * Встроенные стили:
 *  - `display: inline-flex` — оправданное исключение из grid по умолчанию:
 *    отсутствующий условный сосед не занимает место. Контент, последний ребёнок,
 *    забирает остаток ширины и сжимается с обрезкой; префикс остаётся фиксированным
 *  - `gap` — отступ между префиксом и контентом
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `padding-inline-start` — отступ вложенности по `nestDepth` через `getTableNestIndent`
 *  - `vertical-align: middle` — выравнивание в строке таблицы
 *  - `flex-shrink: 0` на прямых детях — префикс и соседние слоты не сжимаются
 *  - `flex-shrink: 1` и `min-inline-size: 0` на последнем ребёнке — контент
 *    сжимается и обрезается по ширине ячейки
 */
export const StyledTableNestedCell = styled.span<{ $nestDepth: 1 | 2 }>`
  display: inline-flex;
  gap: ${getSpacingValue(8)};
  align-items: center;
  min-inline-size: 0;
  padding-inline-start: ${(props) =>
    getSpacingValue(getTableNestIndent(props.$nestDepth))};
  vertical-align: middle;

  > * {
    flex-shrink: 0;
  }

  > :last-child {
    flex-shrink: 1;
    min-inline-size: 0;
  }
`;

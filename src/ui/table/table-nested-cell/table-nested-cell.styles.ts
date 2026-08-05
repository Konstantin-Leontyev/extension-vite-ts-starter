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
 * На уровень — удвоенный горизонтальный отступ ячейки.
 */
const TABLE_NEST_INDENT_BY_DEPTH: Record<1 | 2, SpacingValue> = {
  1: 24,
  2: 48,
};

/**
 * resolveTableNestIndent — возвращает ключ шкалы отступа member-ячейки по `nestDepth`.
 *
 * @param nestDepth глубина вложенности строки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
function resolveTableNestIndent(nestDepth: number): SpacingValue {
  return nestDepth === 2 ? TABLE_NEST_INDENT_BY_DEPTH[2] : TABLE_NEST_INDENT_BY_DEPTH[1];
}

/**
 * StyledTableNestedCell — задаёт корневой узел компонента TableNestedCell.
 * Базируется на `<span>`: отступ по `nestDepth`, префикс и контент в одну линию.
 *
 * Встроенные стили:
 *  - `display: inline-flex` — префикс и контент в одном потоке
 *  - `gap` — отступ между префиксом и контентом
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `padding-inline-start` — отступ вложенности по `nestDepth` через `resolveTableNestIndent`
 *  - `vertical-align: middle` — выравнивание в строке таблицы
 *  - `flex-shrink: 0` на прямых детях — префикс и соседние слоты не сжимаются
 *  - `flex-shrink: 1` и `min-inline-size: 0` на последнем ребёнке — контент
 *    сжимается и обрезается по ширине ячейки
 */
export const StyledTableNestedCell = styled.span<{ $nestDepth: number }>`
  display: inline-flex;
  gap: ${getSpacingValue(8)};
  align-items: center;
  min-inline-size: 0;
  padding-inline-start: ${(props) =>
    getSpacingValue(resolveTableNestIndent(props.$nestDepth))};
  vertical-align: middle;

  > * {
    flex-shrink: 0;
  }

  > :last-child {
    flex-shrink: 1;
    min-inline-size: 0;
  }
`;

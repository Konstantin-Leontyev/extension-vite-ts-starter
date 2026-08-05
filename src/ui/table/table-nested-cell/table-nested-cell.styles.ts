/**
 * Файл: `src/ui/table/table-nested-cell/table-nested-cell.styles.ts`
 * Определяет внешний вид компонентов TableNestedCell и TableMemberPrefix.
 *
 * Основные задачи:
 * 1. Хранить отступы вложенности в `TABLE_NEST_INDENT_BY_DEPTH`
 * 2. Предоставить styled-узлы `StyledTableMemberPrefix` и `StyledTableNestedCell`
 *
 * Потребители:
 *  - `src/ui/table/table-nested-cell/index.tsx` — собирает компоненты TableNestedCell и TableMemberPrefix
 *  - `src/pages/showcase/table-demo/index.tsx` — рендерит вложенные строки в демо-таблице
 */

import styled from 'styled-components';

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme } from '@ui/theme';

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
 * StyledTableMemberPrefix — задаёт префикс member-строки компонента TableMemberPrefix.
 * Базируется на `<span>` и принимает нативные атрибуты элемента.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — префикс не сжимается при нехватке места
 *  - `color` — приглушённый цвет из темы
 */
export const StyledTableMemberPrefix = styled.span`
  flex-shrink: 0;
  color: ${(props) => getTheme(props).colors.muted};
`;

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

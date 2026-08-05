/**
 * Файл: `src/ui/table/table-nested-cell/index.tsx`
 * Предоставляет компоненты TableNestedCell и TableMemberPrefix для отображения
 * вложенной ячейки таблицы и префикса member-строки.
 *
 * Поддерживает:
 *  - содержимое через `children`
 *  - глубину вложенности через проп `nestDepth`
 *
 * Основные задачи:
 * 1. Экспортировать компоненты TableNestedCell и TableMemberPrefix
 * 2. Типизировать пропсы через `TableNestedCellProps` и `TableMemberPrefixProps`
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/index.tsx` — рендерит вложенные строки демо-таблицы
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import {
  StyledTableMemberPrefix,
  StyledTableNestedCell,
} from './table-nested-cell.styles';

/**
 * TableNestedCellProps — представляет пропсы компонента TableNestedCell.
 *
 * @property children — содержимое вложенной ячейки: префикс и текст или поле
 * @property nestDepth — глубина вложенности строки
 */
type TableNestedCellProps = {
  children: ReactNode;
  nestDepth: number;
};

/**
 * TableNestedCell — отображает вложенную ячейку member-строки таблицы.
 *
 * @example
 * <TableNestedCell nestDepth={row.nestDepth ?? 1}>
 *   <TableMemberPrefix>↳</TableMemberPrefix>
 *   <Text ellipsis sizePreset={textSize}>
 *     {row.product}
 *   </Text>
 * </TableNestedCell>
 */
export function TableNestedCell({ children, nestDepth }: TableNestedCellProps) {
  return (
    <StyledTableNestedCell $nestDepth={nestDepth}>{children}</StyledTableNestedCell>
  );
}

/**
 * TableMemberPrefixProps — представляет пропсы компонента TableMemberPrefix.
 */
type TableMemberPrefixProps = Omit<ComponentPropsWithRef<'span'>, 'className' | 'style'>;

/**
 * TableMemberPrefix — отображает префикс member-строки таблицы.
 *
 * @example
 * <TableMemberPrefix>↳</TableMemberPrefix>
 */
export function TableMemberPrefix(props: TableMemberPrefixProps) {
  return <StyledTableMemberPrefix aria-hidden="true" {...props} />;
}

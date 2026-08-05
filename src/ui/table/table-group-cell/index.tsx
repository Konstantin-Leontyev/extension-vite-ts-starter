/**
 * Файл: `src/ui/table/table-group-cell/index.tsx`
 * Предоставляет компонент TableGroupCell для отображения головы группы в таблице.
 *
 * Поддерживает:
 *  - содержимое через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TableGroupCell
 * 2. Типизировать пропсы через `TableGroupCellProps`
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/index.tsx` — рендерит головы групп демо-таблицы
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { StyledTableGroupCell } from './table-group-cell.styles';

/**
 * TableGroupCellProps — представляет пропсы компонента TableGroupCell.
 *
 * @property children — содержимое головы группы: expander и подпись
 */
type TableGroupCellProps = Omit<ComponentPropsWithRef<'span'>, 'className' | 'style'> & {
  children: ReactNode;
};

/**
 * TableGroupCell — отображает голову группы в ячейке таблицы.
 *
 * @example
 * <TableGroupCell>
 *   {expander}
 *   <Text ellipsis fontWeight={600} sizePreset={textSize}>
 *     {row.product}
 *   </Text>
 * </TableGroupCell>
 * <TableGroupCell>
 *   <TableMemberPrefix>↳</TableMemberPrefix>
 *   {expander}
 *   {label}
 * </TableGroupCell>
 */
export function TableGroupCell(props: TableGroupCellProps) {
  return <StyledTableGroupCell {...props} />;
}

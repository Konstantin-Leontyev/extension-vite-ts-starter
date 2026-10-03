/**
 * Файл: `src/ui/table/table-cell/index.tsx`
 * Предоставляет компонент TableCell для отображения ячейки таблицы.
 *
 * Поддерживает:
 *  - размерный ряд через проп `size`
 *  - горизонтальное выравнивание через проп `textAlign`
 *  - обрезку с многоточием через проп `ellipsis`
 *  - запрет переноса строк через проп `nowrap`
 *  - ячейку шапки через проп `head`
 *  - область заголовка через проп `scope`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TableCell
 * 2. Типизировать пропсы через `TableCellProps`
 * 3. Экспортировать тип `TableCellHeadProps`
 * 4. Реэкспортировать `StyledTableCellLead` и тип `TableCellAlign`
 *
 * Потребители:
 *  - `src/ui/table/index.tsx` — рендерит ячейки Table
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { StyledTableCell, type TableCellStyleProps } from './table-cell.styles';

/**
 * TableCellHeadProps — представляет пропсы заголовочной ячейки TableCell.
 * Поле `scope` допустимо только вместе с `head`.
 *
 * @property head — включает ячейку шапки: корневой тег становится `<th>`
 * @property scope — область заголовка для ячейки шапки
 */
type TableCellHeadProps =
  | {
      head: true;
      scope?: 'col' | 'colgroup' | 'row' | 'rowgroup';
    }
  | {
      head?: false;
      scope?: never;
    };

/**
 * TableCellProps — представляет пропсы компонента TableCell.
 */
type TableCellProps = TableCellStyleProps &
  TableCellHeadProps &
  Omit<
    ComponentPropsWithRef<'td'>,
    'className' | 'scope' | 'style' | keyof TableCellStyleProps
  >;

/**
 * TableCell — отображает ячейку таблицы.
 *
 * @example
 * <TableCell textAlign="end" size={size}>
 *   <Text size={textSize}>{rowIndex + 1}</Text>
 * </TableCell>
 * <TableCell head scope="col" size={size}>
 *   <Text size={textSize}>{column.header}</Text>
 * </TableCell>
 */
export function TableCell({ head, ...props }: TableCellProps) {
  return <StyledTableCell as={head ? 'th' : undefined} head={head} {...props} />;
}

export { StyledTableCellLead, type TableCellAlign } from './table-cell.styles';
export type { TableCellHeadProps };

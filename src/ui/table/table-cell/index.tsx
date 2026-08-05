/**
 * Файл: `src/ui/table/table-cell/index.tsx`
 * Предоставляет компонент TableCell для отображения ячейки таблицы.
 *
 * Поддерживает:
 *  - размерный ряд через проп `sizePreset`
 *  - горизонтальное выравнивание через проп `align`
 *  - обрезку с многоточием через проп `ellipsis`
 *  - запрет переноса строк через проп `nowrap`
 *  - ячейку шапки или подвала через проп `head`
 *  - область заголовка через проп `scope`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TableCell
 * 2. Типизировать пропсы через `TableCellProps`
 * 3. Реэкспортировать `StyledTableCellLead` и тип `TableCellAlign`
 *
 * Потребители:
 *  - `src/ui/table/index.tsx` — рендерит ячейки Table
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { StyledTableCell, type TableCellStyleProps } from './table-cell.styles';

/**
 * TableCellProps — представляет пропсы компонента TableCell.
 *
 * @property head — включает ячейку шапки или подвала: корневой тег становится `<th>`
 * @property scope — область заголовка для ячейки шапки
 */
type TableCellProps = TableCellStyleProps & {
  head?: boolean;
  scope?: 'col' | 'colgroup' | 'row' | 'rowgroup';
} & Omit<
    ComponentPropsWithRef<'td'>,
    'className' | 'scope' | 'style' | keyof TableCellStyleProps
  >;

/**
 * TableCell — отображает ячейку таблицы.
 *
 * @example
 * <TableCell align="end" sizePreset={sizePreset}>
 *   <Text sizePreset={textSize}>{rowIndex + 1}</Text>
 * </TableCell>
 * <TableCell head scope="col" sizePreset={sizePreset}>
 *   <Text sizePreset={textSize}>{column.header}</Text>
 * </TableCell>
 */
export function TableCell({ head, ...props }: TableCellProps) {
  return <StyledTableCell as={head ? 'th' : undefined} {...props} />;
}

export { StyledTableCellLead, type TableCellAlign } from './table-cell.styles';

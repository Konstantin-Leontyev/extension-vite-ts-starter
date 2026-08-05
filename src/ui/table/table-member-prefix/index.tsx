/**
 * Файл: `src/ui/table/table-member-prefix/index.tsx`
 * Предоставляет компонент TableMemberPrefix для отображения префикса member-строки.
 *
 * Поддерживает:
 *  - содержимое через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TableMemberPrefix
 * 2. Типизировать пропсы через `TableMemberPrefixProps`
 * 3. Выставлять `aria-hidden` — префикс декоративный
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/index.tsx` — рендерит префикс вложенных строк демо-таблицы
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { StyledTableMemberPrefix } from './table-member-prefix.styles';

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

/**
 * Файл: `src/ui/table/table-inline-field/index.tsx`
 * Предоставляет компонент TableInlineField для отображения поля ввода в ячейке таблицы.
 *
 * Поддерживает:
 *  - выравнивание текста через проп `textAlign`
 *  - размер текста через проп `textSize`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TableInlineField
 * 2. Типизировать пропсы через `TableInlineFieldProps`
 *
 * Потребители:
 *  - `src/pages/showcase/table-demo/index.tsx` — рендерит поля add и edit в демо-таблице
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import {
  StyledTableInlineField,
  type TableInlineFieldStyleProps,
} from './table-inline-field.styles';

/**
 * TableInlineFieldProps — представляет пропсы компонента TableInlineField.
 */
type TableInlineFieldProps = TableInlineFieldStyleProps &
  Omit<
    ComponentPropsWithRef<'input'>,
    'className' | 'style' | keyof TableInlineFieldStyleProps
  >;

/**
 * TableInlineField — отображает поле ввода в ячейке таблицы.
 *
 * @example
 * <TableInlineField
 *   placeholder="Product"
 *   textSize={textSize}
 *   value={addDraft.product}
 *   onChange={(event) =>
 *     setAddDraft((current) => ({ ...current, product: event.target.value }))
 *   }
 * />
 * <TableInlineField
 *   inputMode="numeric"
 *   placeholder="Stock"
 *   textAlign="end"
 *   textSize={textSize}
 *   value={addDraft.stock}
 *   onChange={(event) =>
 *     setAddDraft((current) => ({ ...current, stock: event.target.value }))
 *   }
 * />
 */
export function TableInlineField(props: TableInlineFieldProps) {
  return <StyledTableInlineField {...props} />;
}

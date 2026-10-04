/**
 * Файл: `src/pages/showcase/position-listbox/index.tsx`
 * Предоставляет компонент PositionListbox для выбора позиции иконки в витрине
 * дизайн-системы. Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - подпись через проп `label`
 *  - обработчик изменения выбранной позиции через проп `onChange`
 *  - перечень позиций через проп `positions`
 *  - выбранную позицию через проп `value`
 *
 * Основные задачи:
 * 1. Экспортировать компонент PositionListbox
 * 2. Типизировать пропсы через `PositionListboxProps`
 *
 * Потребители:
 *  - `src/pages/showcase/icon-group/index.tsx` — выбирает позицию иконки
 */

import { DEFAULT_ICON_POSITION, type IconPosition } from '@ui/icon';
import { Listbox } from '@ui/listbox';

import { getListboxOptions } from '../get-listbox-options';

/**
 * DEFAULT_POSITION_LISTBOX_VALUE — задаёт позицию по умолчанию.
 * Используется, когда вызывающий код не передал проп `value`.
 */
const DEFAULT_POSITION_LISTBOX_VALUE = DEFAULT_ICON_POSITION;

/**
 * PositionListboxProps — представляет пропсы компонента PositionListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранной позиции
 * @property positions — перечень допустимых позиций из настраиваемого компонента,
 *   например `ICON_POSITION_KEYS`
 * @property value — текущая выбранная позиция
 */
type PositionListboxProps<Position extends string> = {
  label: string;
  onChange: (position: Position) => void;
  positions: readonly Position[];
  value?: Position;
};

/**
 * PositionListbox — отображает листбокс выбора позиции в витрине дизайн-системы.
 *
 * @example
 * <PositionListbox
 *   label="Position:"
 *   positions={ICON_POSITION_KEYS}
 *   value={position}
 *   onChange={setPosition}
 * />
 */
export function PositionListbox<Position extends string = IconPosition>({
  label,
  onChange,
  positions,
  value = DEFAULT_POSITION_LISTBOX_VALUE as Position,
}: PositionListboxProps<Position>) {
  return (
    <Listbox
      label={label}
      options={getListboxOptions(positions)}
      value={value}
      onChange={(nextPosition) => onChange(nextPosition as Position)}
    />
  );
}

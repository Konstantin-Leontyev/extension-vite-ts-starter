/**
 * Файл: `src/pages/showcase/shape-listbox/index.tsx`
 * Предоставляет компонент ShapeListbox для выбора формы в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - подпись через проп `label`
 *  - обработчик изменения выбранной формы через проп `onChange`
 *  - перечень форм через проп `shapes`
 *  - выбранную форму через проп `value`
 *  - состояние «от контрола» через проп `allowInherit`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ShapeListbox
 * 2. Типизировать пропсы через `ShapeListboxProps`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают форму:
 *     - `src/pages/showcase/control-group/index.tsx`
 *     - `src/pages/showcase/date-range-input-settings/index.tsx`
 *     - `src/pages/showcase/icon-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/search-field-settings/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset } from '@ui/presets';

/**
 * getShapeListboxOptions — преобразует перечень форм в опции Listbox.
 *
 * @param shapes исходный перечень форм
 * @returns опции для Listbox
 */
function getShapeListboxOptions<Shape extends string>(
  shapes: readonly Shape[]
): ListboxOption[] {
  return shapes.map((shape) => ({
    label: shape,
    value: shape,
  }));
}

/**
 * FROM_CONTROL_OPTION_LABEL — задаёт подпись опции «от контрола».
 */
const FROM_CONTROL_OPTION_LABEL = 'From control';

/**
 * FROM_CONTROL_OPTION_VALUE — задаёт ключ опции «от контрола».
 * Не совпадает с ключами `ShapePreset` и `IconShapePreset`.
 */
const FROM_CONTROL_OPTION_VALUE = 'from-control';

/**
 * ShapeListboxBaseProps — представляет общие пропсы ShapeListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property shapes — перечень допустимых форм из настраиваемого компонента,
 *   например `SHAPE_PRESET_KEYS`
 * @property value — текущая выбранная форма. Без значения форма
 *   выводится из контрола
 */
type ShapeListboxBaseProps<Shape extends string> = {
  label: string;
  shapes: readonly Shape[];
  value?: Shape;
};

/**
 * ShapeListboxProps — представляет пропсы компонента ShapeListbox.
 *
 * @property allowInherit — включает опцию «от контрола»
 * @property onChange — обработчик изменения выбранной формы
 */
type ShapeListboxProps<Shape extends string> = ShapeListboxBaseProps<Shape> &
  (
    | { allowInherit: true; onChange: (shape?: Shape) => void }
    | { allowInherit?: false; onChange: (shape: Shape) => void }
  );

/**
 * ShapeListbox — отображает листбокс выбора формы в витрине дизайн-системы.
 *
 * @example
 * <ShapeListbox
 *   label="Shape:"
 *   shapes={SHAPE_PRESET_KEYS}
 *   value={shape}
 *   onChange={setShape}
 * />
 */
export function ShapeListbox<Shape extends string = ShapePreset>(
  props: ShapeListboxProps<Shape>
) {
  const { allowInherit, label, onChange, shapes, value } = props;
  const options = getShapeListboxOptions(shapes);
  const listboxOptions =
    allowInherit === true
      ? [
          { label: FROM_CONTROL_OPTION_LABEL, value: FROM_CONTROL_OPTION_VALUE },
          ...options,
        ]
      : options;

  return (
    <Listbox
      label={label}
      options={listboxOptions}
      value={value ?? (allowInherit === true ? FROM_CONTROL_OPTION_VALUE : undefined)}
      onChange={(nextShape) => {
        if (nextShape === FROM_CONTROL_OPTION_VALUE) {
          if (allowInherit === true) {
            onChange(undefined);
          }

          return;
        }

        onChange(nextShape as Shape);
      }}
    />
  );
}

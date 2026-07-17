/**
 * Файл: `src/pages/design-system/shape-listbox/index.tsx`
 * Предоставляет листбокс выбора формы для витрины дизайн-системы.
 * Ограничивает использование только витриной, не для продуктового кода и `@ui/`.
 *
 * Основные задачи:
 * 1. Предоставить выбор формы в панелях настроек компонентов витрины
 * 2. Экспортировать компонент `ShapeListbox`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают форму строки-поля:
 *     - `src/pages/design-system/button-settings/index.tsx`
 *     - `src/pages/design-system/tag-settings/index.tsx`
 *     - `src/pages/design-system/input-settings/index.tsx`
 *     - `src/pages/design-system/listbox-settings/index.tsx`
 *     - `src/pages/design-system/combobox-settings/index.tsx`
 *     - `src/pages/design-system/stepper-settings/index.tsx`
 *     - `src/pages/design-system/segment-button-settings/index.tsx`
 *     - `src/pages/design-system/range-input-settings/index.tsx`
 *     - `src/pages/design-system/date-input-settings/index.tsx`
 *     - `src/pages/design-system/date-range-input-settings/index.tsx`
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
 * ShapeListboxProps — представляет пропсы компонента ShapeListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранной формы
 * @property shapes — перечень допустимых форм из настраиваемого компонента,
 *   например `SHAPE_PRESET_KEYS`
 * @property value — текущая выбранная форма
 */
type ShapeListboxProps<Shape extends string> = {
  label: string;
  onChange: (shape: Shape) => void;
  shapes: readonly Shape[];
  value: Shape;
};

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
export function ShapeListbox<Shape extends string = ShapePreset>({
  label,
  onChange,
  shapes,
  value,
}: ShapeListboxProps<Shape>) {
  return (
    <Listbox
      label={label}
      options={getShapeListboxOptions(shapes)}
      reserveErrorSpace={false}
      value={value}
      onChange={(nextShape) => onChange(nextShape as Shape)}
    />
  );
}

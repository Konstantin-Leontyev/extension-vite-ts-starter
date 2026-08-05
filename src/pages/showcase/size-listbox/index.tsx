/**
 * Файл: `src/pages/showcase/size-listbox/index.tsx`
 * Предоставляет компонент SizeListbox для выбора размера в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - подпись через проп `label`
 *  - обработчик изменения выбранного размера через проп `onChange`
 *  - перечень размеров через проп `sizes`
 *  - выбранный размер через проп `value`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SizeListbox
 * 2. Типизировать пропсы через `SizeListboxProps`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают размер:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/checkbox-settings/index.tsx`
 *     - `src/pages/showcase/control-group/index.tsx`
 *     - `src/pages/showcase/icon-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 *     - `src/pages/showcase/progress-bar-settings/index.tsx`
 *     - `src/pages/showcase/radio-button-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/spinner-settings/index.tsx`
 *     - `src/pages/showcase/switch-settings/index.tsx`
 *     - `src/pages/showcase/table-settings/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *     - `src/pages/showcase/text-group/index.tsx`
 *     - `src/pages/showcase/title-group/index.tsx`
 *     - `src/pages/showcase/toast-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';

/**
 * getSizeListboxOptions — преобразует перечень размеров в опции Listbox.
 *
 * @param sizes исходный перечень размеров
 * @returns опции для Listbox
 */
function getSizeListboxOptions<Size extends string>(
  sizes: readonly Size[]
): ListboxOption[] {
  return sizes.map((size) => ({
    label: size,
    value: size,
  }));
}

/**
 * DEFAULT_SIZE_LISTBOX_VALUE — задаёт размер по умолчанию для отображения в листбоксе.
 * Проп размера Text без значения подставляет `normal` — то же значение здесь.
 * Панели передают состояние как есть, не дублируя это умолчание запасными значениями.
 * Используется, когда вызывающий код не передал проп `value`.
 */
const DEFAULT_SIZE_LISTBOX_VALUE = DEFAULT_SIZE_PRESET;

/**
 * SizeListboxProps — представляет пропсы компонента SizeListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранного размера
 * @property sizes — перечень допустимых размеров из настраиваемого компонента,
 *   например `SIZE_PRESET_KEYS`, `TAG_SIZE_PRESET_KEYS` или `TEXT_SIZE_PRESET_KEYS`
 * @property value — текущий выбранный размер, по умолчанию `normal`
 */
type SizeListboxProps<Size extends string> = {
  label: string;
  onChange: (size: Size) => void;
  sizes: readonly Size[];
  value?: Size;
};

/**
 * SizeListbox — отображает листбокс выбора размера в витрине дизайн-системы.
 *
 * @example
 * <SizeListbox
 *   label="Size:"
 *   sizes={SIZE_PRESET_KEYS}
 *   value={sizePreset}
 *   onChange={setSizePreset}
 * />
 * <SizeListbox
 *   label="Text size:"
 *   sizes={TEXT_SIZE_PRESET_KEYS}
 *   value={sizePreset}
 *   onChange={setSizePreset}
 * />
 */
export function SizeListbox<Size extends string = SizePreset>({
  label,
  onChange,
  sizes,
  value = DEFAULT_SIZE_LISTBOX_VALUE as Size,
}: SizeListboxProps<Size>) {
  return (
    <Listbox
      label={label}
      options={getSizeListboxOptions(sizes)}
      value={value}
      onChange={(nextSize) => onChange(nextSize as Size)}
    />
  );
}

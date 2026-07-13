/**
 * Файл: `src/pages/design-system/size-listbox/index.tsx`
 * Предоставляет листбокс выбора размера для витрины дизайн-системы.
 * Ограничивает использование только витриной, не для продуктового кода и `@ui/`.
 *
 * Основные задачи:
 * 1. Предоставить выбор размера в панелях настроек компонентов витрины
 * 2. Экспортировать компонент `SizeListbox`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают размер:
 *     - `src/pages/design-system/button-settings/index.tsx`
 *     - `src/pages/design-system/tag-settings/index.tsx`
 *     - `src/pages/design-system/toast-settings/index.tsx`
 *     - `src/pages/design-system/text-settings/index.tsx`
 *     - `src/pages/design-system/card-settings/index.tsx`
 *     - `src/pages/design-system/input-settings/index.tsx`
 *     - `src/pages/design-system/listbox-settings/index.tsx`
 *     - `src/pages/design-system/combobox-settings/index.tsx`
 *     - `src/pages/design-system/checkbox-settings/index.tsx`
 *     - `src/pages/design-system/switch-settings/index.tsx`
 *     - `src/pages/design-system/spinner-settings/index.tsx`
 *     - `src/pages/design-system/progress-settings/index.tsx`
 *     - `src/pages/design-system/stepper-settings/index.tsx`
 *     - `src/pages/design-system/segment-button-settings/index.tsx`
 *     - `src/pages/design-system/range-input-settings/index.tsx`
 *     - `src/pages/design-system/date-input-settings/index.tsx`
 *     - `src/pages/design-system/date-range-input-settings/index.tsx`
 *     - `src/pages/design-system/modal-settings/index.tsx`
 *     - `src/pages/design-system/table-settings/index.tsx`
 *     - `src/pages/design-system/round-button-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SizePreset } from '@ui/presets';

/**
 * getSizeListboxOptions — преобразует перечень размеров в опции Listbox.
 *
 * @param sizes — исходный перечень размеров
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
 * SizeListboxProps — представляет пропсы компонента SizeListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property sizes — перечень допустимых размеров из настраиваемого компонента,
 *   например `SIZE_PRESET_KEYS`, `TAG_SIZE_PRESET_KEYS` или `TEXT_SIZE_PRESET_KEYS`
 * @property value — текущий выбранный размер
 * @property onChange — обработчик изменения выбранного размера
 */
type SizeListboxProps<Size extends string> = {
  label: string;
  sizes: readonly Size[];
  value: Size;
  onChange: (size: Size) => void;
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
 *   label="Size preset:"
 *   sizes={TEXT_SIZE_PRESET_KEYS}
 *   value={sizePreset}
 *   onChange={setSizePreset}
 * />
 */
export function SizeListbox<Size extends string = SizePreset>({
  label,
  sizes,
  value,
  onChange,
}: SizeListboxProps<Size>) {
  return (
    <Listbox
      label={label}
      options={getSizeListboxOptions(sizes)}
      reserveErrorSpace={false}
      value={value}
      onChange={(nextSize) => onChange(nextSize as Size)}
    />
  );
}

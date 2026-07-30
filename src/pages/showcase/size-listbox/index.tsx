/**
 * Файл: `src/pages/showcase/size-listbox/index.tsx`
 * Предоставляет листбокс выбора размера для витрины дизайн-системы.
 * Ограничивает использование только витриной, не для продуктового кода и `@ui/`.
 *
 * Основные задачи:
 * 1. Предоставить выбор размера в панелях настроек компонентов витрины
 * 2. Экспортировать компонент `SizeListbox`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают размер:
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/checkbox-settings/index.tsx`
 *     - `src/pages/showcase/control-group/index.tsx`
 *     - `src/pages/showcase/date-range-input-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 *     - `src/pages/showcase/progress-bar-settings/index.tsx`
 *     - `src/pages/showcase/radio-button-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/icon-button-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *     - `src/pages/showcase/spinner-settings/index.tsx`
 *     - `src/pages/showcase/stepper-settings/index.tsx`
 *     - `src/pages/showcase/switch-settings/index.tsx`
 *     - `src/pages/showcase/table-settings/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *     - `src/pages/showcase/text-group/index.tsx`
 *     - `src/pages/showcase/title-group/index.tsx`
 *     - `src/pages/showcase/toast-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SizePreset } from '@ui/presets';

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
 * SizeListboxProps — представляет пропсы компонента SizeListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранного размера
 * @property sizes — перечень допустимых размеров из настраиваемого компонента,
 *   например `SIZE_PRESET_KEYS`, `TAG_SIZE_PRESET_KEYS` или `TEXT_SIZE_PRESET_KEYS`
 * @property value — текущий выбранный размер
 */
type SizeListboxProps<Size extends string> = {
  label: string;
  onChange: (size: Size) => void;
  sizes: readonly Size[];
  value: Size;
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
  value,
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

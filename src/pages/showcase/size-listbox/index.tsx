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
 *  - состояние «от контрола» через проп `allowInherit`
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
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
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
 * Используется, когда вызывающий код не передал проп `value` и не включил `allowInherit`.
 */
const DEFAULT_SIZE_LISTBOX_VALUE = DEFAULT_SIZE_PRESET;

/**
 * FROM_CONTROL_OPTION_LABEL — задаёт подпись опции «от контрола».
 */
const FROM_CONTROL_OPTION_LABEL = 'From control';

/**
 * FROM_CONTROL_OPTION_VALUE — задаёт ключ опции «от контрола».
 * Не совпадает с ключами размерных рядов витрины.
 */
const FROM_CONTROL_OPTION_VALUE = 'from-control';

/**
 * SizeListboxBaseProps — представляет общие пропсы SizeListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property sizes — перечень допустимых размеров из настраиваемого компонента,
 *   например `SIZE_PRESET_KEYS`, `TAG_SIZE_PRESET_KEYS` или `TEXT_SIZE_PRESET_KEYS`
 * @property value — текущий выбранный размер. Без значения размер
 *   выводится из контрола
 */
type SizeListboxBaseProps<Size extends string> = {
  label: string;
  sizes: readonly Size[];
  value?: Size;
};

/**
 * SizeListboxProps — представляет пропсы компонента SizeListbox.
 *
 * @property allowInherit — включает опцию «от контрола»
 * @property onChange — обработчик изменения выбранного размера
 */
type SizeListboxProps<Size extends string> = SizeListboxBaseProps<Size> &
  (
    | { allowInherit: true; onChange: (size?: Size) => void }
    | { allowInherit?: false; onChange: (size: Size) => void }
  );

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
export function SizeListbox<Size extends string = SizePreset>(
  props: SizeListboxProps<Size>
) {
  const { allowInherit, label, onChange, sizes, value } = props;
  const options = getSizeListboxOptions(sizes);
  const listboxOptions =
    allowInherit === true
      ? [
          { label: FROM_CONTROL_OPTION_LABEL, value: FROM_CONTROL_OPTION_VALUE },
          ...options,
        ]
      : options;
  const listboxValue =
    allowInherit === true
      ? (value ?? FROM_CONTROL_OPTION_VALUE)
      : (value ?? (DEFAULT_SIZE_LISTBOX_VALUE as Size));

  return (
    <Listbox
      label={label}
      options={listboxOptions}
      value={listboxValue}
      onChange={(nextSize) => {
        if (nextSize === FROM_CONTROL_OPTION_VALUE) {
          if (allowInherit === true) {
            onChange(undefined);
          }

          return;
        }

        onChange(nextSize as Size);
      }}
    />
  );
}

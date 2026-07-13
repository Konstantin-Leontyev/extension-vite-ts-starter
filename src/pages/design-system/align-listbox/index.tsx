/**
 * Файл: `src/pages/design-system/align-listbox/index.tsx`
 * Предоставляет листбокс выбора выравнивания текста для витрины дизайн-системы.
 * Ограничивает использование только витриной, не для продуктового кода и `@ui/`.
 *
 * Основные задачи:
 * 1. Предоставить выбор выравнивания в панелях настроек компонентов витрины
 * 2. Экспортировать компонент `AlignListbox`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают выравнивание текста:
 *     - `src/pages/design-system/text-settings/index.tsx`
 *     - `src/pages/design-system/card-settings/index.tsx`
 *     - `src/pages/design-system/range-input-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { type TextAlignPreset } from '@ui/text';

/**
 * getAlignListboxOptions — преобразует перечень выравниваний в опции Listbox.
 *
 * @param aligns — исходный перечень выравниваний
 * @returns опции для Listbox
 */
function getAlignListboxOptions<Align extends string>(
  aligns: readonly Align[]
): ListboxOption[] {
  return aligns.map((align) => ({
    label: align,
    value: align,
  }));
}

/**
 * AlignListboxProps — представляет пропсы компонента AlignListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property aligns — перечень допустимых выравниваний из настраиваемого компонента,
 *   например `TEXT_ALIGN_PRESET_KEYS`
 * @property value — текущее выбранное выравнивание
 * @property onChange — обработчик изменения выбранного выравнивания
 */
type AlignListboxProps<Align extends string> = {
  label: string;
  aligns: readonly Align[];
  value: Align;
  onChange: (align: Align) => void;
};

/**
 * AlignListbox — отображает листбокс выбора выравнивания в витрине дизайн-системы.
 *
 * @example
 * <AlignListbox
 *   label="Align:"
 *   aligns={TEXT_ALIGN_PRESET_KEYS}
 *   value={align ?? 'start'}
 *   onChange={(nextAlign) => onChange('align', nextAlign)}
 * />
 */
export function AlignListbox<Align extends string = TextAlignPreset>({
  label,
  aligns,
  value,
  onChange,
}: AlignListboxProps<Align>) {
  return (
    <Listbox
      label={label}
      options={getAlignListboxOptions(aligns)}
      reserveErrorSpace={false}
      value={value}
      onChange={(nextAlign) => onChange(nextAlign as Align)}
    />
  );
}

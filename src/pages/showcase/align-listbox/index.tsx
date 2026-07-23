/**
 * Файл: `src/pages/showcase/align-listbox/index.tsx`
 * Предоставляет листбокс выбора выравнивания текста для витрины дизайн-системы.
 * Ограничивает использование только витриной, не для продуктового кода и `@ui/`.
 *
 * Основные задачи:
 * 1. Предоставить выбор выравнивания в панелях настроек компонентов витрины
 * 2. Экспортировать компонент `AlignListbox`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают выравнивание текста:
 *     - `src/pages/showcase/text-settings/index.tsx`
 *     - `src/pages/showcase/heading-group/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { type TextAlignPreset } from '@ui/text';

/**
 * getAlignListboxOptions — преобразует перечень выравниваний в опции Listbox.
 *
 * @param aligns исходный перечень выравниваний
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
 * DEFAULT_ALIGN_LISTBOX_VALUE — задаёт выравнивание по умолчанию.
 * Проп выравнивания компонента без значения не добавляет CSS-правил,
 * что совпадает с браузерным умолчанием `start`. Панели передают состояние
 * как есть, не дублируя это умолчание запасными значениями.
 * Используется, когда вызывающий код не передал проп `value`.
 */
const DEFAULT_ALIGN_LISTBOX_VALUE: TextAlignPreset = 'start';

/**
 * AlignListboxProps — представляет пропсы компонента AlignListbox.
 *
 * @property aligns — перечень допустимых выравниваний из настраиваемого компонента,
 *   например `TEXT_ALIGN_PRESET_KEYS`
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранного выравнивания
 * @property value — текущее выбранное выравнивание, по умолчанию `start`
 */
type AlignListboxProps<Align extends string> = {
  aligns: readonly Align[];
  label: string;
  onChange: (align: Align) => void;
  value?: Align;
};

/**
 * AlignListbox — отображает листбокс выбора выравнивания в витрине дизайн-системы.
 *
 * @example
 * <AlignListbox
 *   label="Align:"
 *   aligns={TEXT_ALIGN_PRESET_KEYS}
 *   value={align}
 *   onChange={(nextAlign) => onChange('align', nextAlign)}
 * />
 */
export function AlignListbox<Align extends string = TextAlignPreset>({
  aligns,
  label,
  onChange,
  value = DEFAULT_ALIGN_LISTBOX_VALUE as Align,
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

/**
 * Файл: `src/pages/showcase/background-listbox/index.tsx`
 * Предоставляет листбокс выбора заливки Card-поверхности для витрины дизайн-системы.
 * Ограничивает использование только витриной, не для продуктового кода и `@ui/`.
 *
 * Основные задачи:
 * 1. Предоставить выбор заливки в панелях настроек компонентов на базе Card
 * 2. Экспортировать компонент `BackgroundListbox`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают заливку:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 */

import { CARD_BACKGROUND_KEYS, type CardBackground } from '@ui/card';
import { Listbox, type ListboxOption } from '@ui/listbox';

/**
 * BACKGROUND_LISTBOX_OPTIONS — формирует опции выбора заливки из `CARD_BACKGROUND_KEYS`.
 */
const BACKGROUND_LISTBOX_OPTIONS: ListboxOption[] = CARD_BACKGROUND_KEYS.map(
  (background) => ({
    label: background,
    value: background,
  })
);

/**
 * BackgroundListboxProps — представляет пропсы компонента BackgroundListbox.
 *
 * @property onChange — обработчик изменения выбранной заливки
 * @property value — текущая выбранная заливка
 */
type BackgroundListboxProps = {
  onChange: (background: CardBackground) => void;
  value: CardBackground;
};

/**
 * BackgroundListbox — отображает листбокс выбора заливки в витрине дизайн-системы.
 *
 * @example
 * <BackgroundListbox
 *   value={state.background}
 *   onChange={(background) => onChange('background', background)}
 * />
 */
export function BackgroundListbox({ onChange, value }: BackgroundListboxProps) {
  return (
    <Listbox
      label="Background:"
      options={BACKGROUND_LISTBOX_OPTIONS}
      reserveErrorSpace={false}
      value={value}
      onChange={(nextBackground) => onChange(nextBackground as CardBackground)}
    />
  );
}

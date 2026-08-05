/**
 * Файл: `src/pages/showcase/background-listbox/index.tsx`
 * Предоставляет компонент BackgroundListbox для выбора заливки Card-поверхности
 * в витрине дизайн-системы. Используется только в витрине: в продуктовый код
 * и `@ui/` не входит. Зашивает перечень `CARD_BACKGROUND_KEYS` внутри сателлита.
 *
 * Поддерживает:
 *  - подпись через проп `label`
 *  - обработчик изменения выбранной заливки через проп `onChange`
 *  - выбранную заливку через проп `value`
 *
 * Основные задачи:
 * 1. Экспортировать компонент BackgroundListbox
 * 2. Типизировать пропсы через `BackgroundListboxProps`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают заливку:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 */

import { CARD_BACKGROUND_KEYS, type CardBackground } from '@ui/card';
import { Listbox, type ListboxOption } from '@ui/listbox';

/**
 * getBackgroundListboxOptions — преобразует `CARD_BACKGROUND_KEYS` в опции Listbox.
 *
 * @returns опции для Listbox
 */
function getBackgroundListboxOptions(): ListboxOption[] {
  return CARD_BACKGROUND_KEYS.map((background) => ({
    label: background,
    value: background,
  }));
}

/**
 * BackgroundListboxProps — представляет пропсы компонента BackgroundListbox.
 *
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранной заливки
 * @property value — текущая выбранная заливка
 */
type BackgroundListboxProps = {
  label: string;
  onChange: (background: CardBackground) => void;
  value: CardBackground;
};

/**
 * BackgroundListbox — отображает листбокс выбора заливки в витрине дизайн-системы.
 *
 * @example
 * <BackgroundListbox
 *   label="Background:"
 *   value={state.background}
 *   onChange={(background) => onChange('background', background)}
 * />
 */
export function BackgroundListbox({ label, onChange, value }: BackgroundListboxProps) {
  return (
    <Listbox
      label={label}
      options={getBackgroundListboxOptions()}
      value={value}
      onChange={(nextBackground) => onChange(nextBackground as CardBackground)}
    />
  );
}

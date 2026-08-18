/**
 * Файл: `src/pages/showcase/background-listbox/index.tsx`
 * Предоставляет компонент BackgroundListbox для выбора заливки поверхности
 * в витрине дизайн-системы. Используется только в витрине: в продуктовый код
 * и `@ui/` не входит. Зашивает перечень `SURFACE_BACKGROUND_PRESET_KEYS` внутри сателлита.
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

import { Listbox, type ListboxOption } from '@ui/listbox';
import { SURFACE_BACKGROUND_PRESET_KEYS, type SurfaceBackgroundPreset } from '@ui/surface';

/**
 * getBackgroundListboxOptions — преобразует `SURFACE_BACKGROUND_PRESET_KEYS` в опции Listbox.
 *
 * @returns опции для Listbox
 */
function getBackgroundListboxOptions(): ListboxOption[] {
  return SURFACE_BACKGROUND_PRESET_KEYS.map((background) => ({
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
  onChange: (background: SurfaceBackgroundPreset) => void;
  value: SurfaceBackgroundPreset;
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
      onChange={(nextBackground) => onChange(nextBackground as SurfaceBackgroundPreset)}
    />
  );
}

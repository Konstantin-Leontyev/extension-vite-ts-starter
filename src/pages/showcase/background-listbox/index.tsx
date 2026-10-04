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
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
 */

import { Listbox } from '@ui/listbox';
import {
  DEFAULT_SURFACE_BACKGROUND,
  SURFACE_BACKGROUND_PRESET_KEYS,
  type SurfaceBackgroundPreset,
} from '@ui/surface';

import { getListboxOptions } from '../showcase-listbox-options';

/**
 * DEFAULT_BACKGROUND_LISTBOX_VALUE — задаёт заливку по умолчанию.
 * Используется, когда вызывающий код не передал проп `value`.
 */
const DEFAULT_BACKGROUND_LISTBOX_VALUE = DEFAULT_SURFACE_BACKGROUND;

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
  value?: SurfaceBackgroundPreset;
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
export function BackgroundListbox({
  label,
  onChange,
  value = DEFAULT_BACKGROUND_LISTBOX_VALUE,
}: BackgroundListboxProps) {
  return (
    <Listbox
      label={label}
      options={getListboxOptions(SURFACE_BACKGROUND_PRESET_KEYS)}
      value={value}
      onChange={(nextBackground) => onChange(nextBackground as SurfaceBackgroundPreset)}
    />
  );
}

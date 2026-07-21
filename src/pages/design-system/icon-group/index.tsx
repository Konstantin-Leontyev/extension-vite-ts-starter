/**
 * Файл: `src/pages/design-system/icon-group/index.tsx`
 * Предоставляет компонент IconGroup для настройки иконки компонента в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - тон глифа иконки через проп `fill`
 *  - выбор глифа через проп `icon`. Без `icon` контрол `Icon:` не рендерится
 *  - обработчик изменения тона глифа через проп `onFillChange`
 *  - обработчик изменения тона секции через проп `onToneChange`
 *  - позицию иконки через проп `position`
 *  - флаг показа иконки через проп `show`. Без `show` иконка неотключаема и группа
 *    рендерится всегда
 *  - тон секции иконки через проп `tone`
 *
 * Основные задачи:
 * 1. Экспортировать компонент IconGroup
 * 2. Типизировать пропсы через `IconGroupProps`
 *
 * Потребители:
 *  - панели настроек витрины — настраивают иконку компонента:
 *     - `src/pages/design-system/button-settings/index.tsx`
 *     - `src/pages/design-system/range-input-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Combobox, type ComboboxOption } from '@ui/combobox';
import { ICON_POSITION_KEYS, type IconPosition } from '@ui/icon';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ToneListbox } from '../tone-listbox';

/**
 * ICON_POSITION_OPTIONS — формирует опции листбокса позиции иконки из `ICON_POSITION_KEYS`.
 * Используется в `Listbox` позиции внутри IconGroup.
 */
const ICON_POSITION_OPTIONS: ListboxOption[] = ICON_POSITION_KEYS.map((position) => ({
  label: position,
  value: position,
}));

/**
 * IconGroupIconSelect — представляет опциональный выбор глифа иконки.
 *
 * @property onChange — обработчик изменения ключа глифа
 * @property options — опции Combobox с глифами
 * @property value — текущий ключ глифа
 */
type IconGroupIconSelect = {
  onChange: (value: string) => void;
  options: ComboboxOption[];
  value: string;
};

/**
 * IconGroupPosition — представляет выбор позиции иконки.
 *
 * @property onChange — обработчик изменения позиции
 * @property value — текущая позиция
 */
type IconGroupPosition = {
  onChange: (position: IconPosition) => void;
  value: IconPosition;
};

/**
 * IconGroupProps — представляет пропсы компонента IconGroup.
 *
 * @property fill — текущий тон глифа иконки
 * @property icon — выбор глифа. Без него контрол `Icon:` не рендерится
 * @property onFillChange — обработчик изменения тона глифа
 * @property onToneChange — обработчик изменения тона секции
 * @property position — позиция иконки
 * @property show — флаг показа иконки. Без него иконка неотключаема и группа рендерится всегда
 * @property tone — текущий тон секции иконки
 */
type IconGroupProps = {
  fill: TonePreset;
  icon?: IconGroupIconSelect;
  onFillChange: (tone: TonePreset) => void;
  onToneChange: (tone: TonePreset) => void;
  position: IconGroupPosition;
  show?: { checked: boolean; onChange: (checked: boolean) => void };
  tone: TonePreset;
};

/**
 * IconGroup — отображает группу настроек иконки в витрине дизайн-системы.
 *
 * @example
 * // Button: флаг, выбор глифа, тона и позиция
 * <IconGroup
 *   fill={state.iconFill}
 *   icon={{
 *     options: COMBOBOX_OPTIONS,
 *     value: state.iconKey,
 *     onChange: (value) => onChange('iconKey', value as IconKey),
 *   }}
 *   position={{
 *     value: state.iconPosition,
 *     onChange: (position) => onChange('iconPosition', position),
 *   }}
 *   show={{ checked: state.withIcon, onChange: (checked) => onChange('withIcon', checked) }}
 *   tone={state.iconTone}
 *   onFillChange={(tone) => onChange('iconFill', tone)}
 *   onToneChange={(tone) => onChange('iconTone', tone)}
 * />
 * // RangeInput: без выбора глифа
 * <IconGroup
 *   fill={state.iconFill}
 *   position={{
 *     value: state.iconPosition,
 *     onChange: (position) => onChange('iconPosition', position),
 *   }}
 *   tone={state.iconTone}
 *   onFillChange={(tone) => onChange('iconFill', tone)}
 *   onToneChange={(tone) => onChange('iconTone', tone)}
 * />
 */
export function IconGroup({
  fill,
  icon,
  onFillChange,
  onToneChange,
  position,
  show,
  tone,
}: IconGroupProps) {
  const expanded = !show || show.checked;

  return (
    <>
      {show && (
        <Checkbox
          checked={show.checked}
          sizePreset="medium"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            show.onChange(event.target.checked)
          }
        >
          Show icon
        </Checkbox>
      )}

      {expanded && (
        <>
          {icon && (
            <Combobox
              label="Icon:"
              options={icon.options}
              reserveErrorSpace={false}
              value={icon.value}
              onChange={icon.onChange}
            />
          )}

          <ToneListbox
            label="Icon tone:"
            tones={TONE_PRESET_KEYS}
            value={tone}
            onChange={onToneChange}
          />

          <ToneListbox
            excludeTone={tone}
            label="Icon fill tone:"
            tones={TONE_PRESET_KEYS}
            value={fill}
            onChange={onFillChange}
          />

          <Listbox
            label="Icon position:"
            options={ICON_POSITION_OPTIONS}
            reserveErrorSpace={false}
            value={position.value}
            onChange={(value) => position.onChange(value as IconPosition)}
          />
        </>
      )}
    </>
  );
}

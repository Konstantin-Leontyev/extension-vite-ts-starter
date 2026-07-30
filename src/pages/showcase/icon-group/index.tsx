/**
 * Файл: `src/pages/showcase/icon-group/index.tsx`
 * Предоставляет компонент IconGroup для настройки иконки компонента в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - тон глифа иконки через проп `fill`
 *  - опции глифов через проп `iconOptions`. Без `iconOptions` контрол `Icon:` не рендерится
 *  - ключ глифа через проп `iconValue`
 *  - суффикс лейблов через проп `name`. Например для SegmentButton — A, B или C
 *  - обработчик изменения тона глифа через проп `onFillChange`
 *  - обработчик изменения ключа глифа через проп `onIconChange`
 *  - обработчик изменения позиции через проп `onPositionChange`. Без `onPositionChange`
 *    контрол позиции не рендерится
 *  - обработчик показа иконки через проп `onShowChange`. Без `onShowChange` иконка
 *    неотключаема и группа рендерится всегда
 *  - обработчик изменения тона секции через проп `onToneChange`. Без пары
 *    `tone` / `onToneChange` контрол тона секции не рендерится
 *  - позицию иконки через проп `position`
 *  - показ иконки через проп `show`
 *  - тон секции иконки через проп `tone`. Без пары `tone` / `onToneChange`
 *    контрол тона секции не рендерится
 *
 * Основные задачи:
 * 1. Экспортировать компонент IconGroup
 * 2. Типизировать пропсы через `IconGroupProps`
 *
 * Потребители:
 *  - панели настроек витрины дизайн-системы — настраивают иконку компонента:
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/combobox-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/icon-button-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Combobox, type ComboboxOption } from '@ui/combobox';
import { ICON_POSITION_KEYS, type IconPosition } from '@ui/icon';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ToneListbox } from '../tone-listbox';

/**
 * getIconPositionListboxOptions — преобразует `ICON_POSITION_KEYS` в опции Listbox.
 *
 * @returns опции для Listbox позиции
 */
function getIconPositionListboxOptions(): ListboxOption[] {
  return ICON_POSITION_KEYS.map((position) => ({
    label: position,
    value: position,
  }));
}

/**
 * IconGroupProps — представляет пропсы компонента IconGroup.
 *
 * @property fill — текущий тон глифа иконки
 * @property iconOptions — опции Combobox с глифами. Без него контрол `Icon:` не рендерится
 * @property iconValue — текущий ключ глифа
 * @property name — суффикс лейблов группы. Например A даёт `Show icon A` и `Icon A tone:`
 * @property onFillChange — обработчик изменения тона глифа
 * @property onIconChange — обработчик изменения ключа глифа
 * @property onPositionChange — обработчик изменения позиции. Без него контрол позиции
 *   не рендерится
 * @property onShowChange — обработчик показа иконки. Без него иконка неотключаема
 * @property onToneChange — обработчик изменения тона секции. Без него и без `tone`
 *   контрол тона секции не рендерится
 * @property position — текущая позиция иконки
 * @property show — включает показ иконки при переданном `onShowChange`
 * @property tone — текущий тон секции иконки. Без него и без `onToneChange`
 *   контрол тона секции не рендерится
 */
type IconGroupProps = {
  fill: TonePreset;
  iconOptions?: ComboboxOption[];
  iconValue?: string;
  name?: string;
  onFillChange: (tone: TonePreset) => void;
  onIconChange?: (value: string) => void;
  onPositionChange?: (position: IconPosition) => void;
  onShowChange?: (show: boolean) => void;
  onToneChange?: (tone: TonePreset) => void;
  position?: IconPosition;
  show?: boolean;
  tone?: TonePreset;
};

/**
 * formatIconGroupLabel — собирает лейбл контрола с опциональным суффиксом `name`.
 *
 * @param base базовый лейбл контрола
 * @param name суффикс сегмента, например A
 * @returns лейбл с суффиксом или исходный `base`
 */
function formatIconGroupLabel(base: string, name?: string): string {
  if (!name) {
    return base;
  }

  if (base === 'Show icon') {
    return `Show icon ${name}`;
  }

  if (base.startsWith('Icon ') && base.endsWith(':')) {
    return `Icon ${name} ${base.slice('Icon '.length)}`;
  }

  if (base === 'Icon:') {
    return `Icon ${name}:`;
  }

  return base;
}

/**
 * IconGroup — отображает группу настроек иконки в витрине дизайн-системы.
 *
 * @example
 * // Button: флаг, выбор глифа, тона и позиция
 * <IconGroup
 *   fill={state.iconFill}
 *   iconOptions={COMBOBOX_OPTIONS}
 *   iconValue={state.iconKey}
 *   position={state.iconPosition}
 *   show={state.withIcon}
 *   tone={state.iconTone}
 *   onFillChange={(tone) => onChange('iconFill', tone)}
 *   onIconChange={(value) => onChange('iconKey', value as IconKey)}
 *   onPositionChange={(position) => onChange('iconPosition', position)}
 *   onShowChange={(checked) => onChange('withIcon', checked)}
 *   onToneChange={(tone) => onChange('iconTone', tone)}
 * />
 * // IconButton: без позиции и флага показа
 * <IconGroup
 *   fill={state.iconFill}
 *   iconOptions={COMBOBOX_OPTIONS}
 *   iconValue={state.iconKey}
 *   tone={state.iconTone}
 *   onFillChange={(tone) => onChange('iconFill', tone)}
 *   onIconChange={(value) => onChange('iconKey', value as IconKey)}
 *   onToneChange={(tone) => onChange('iconTone', tone)}
 * />
 */
export function IconGroup({
  fill,
  iconOptions,
  iconValue,
  name,
  onFillChange,
  onIconChange,
  onPositionChange,
  onShowChange,
  onToneChange,
  position,
  show,
  tone,
}: IconGroupProps) {
  const isExpanded = onShowChange === undefined || Boolean(show);

  return (
    <>
      {onShowChange !== undefined && (
        <Checkbox
          checked={Boolean(show)}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onShowChange(event.target.checked)
          }
        >
          {formatIconGroupLabel('Show icon', name)}
        </Checkbox>
      )}

      {isExpanded && (
        <>
          {iconOptions !== undefined && onIconChange !== undefined && (
            <Combobox
              label={formatIconGroupLabel('Icon:', name)}
              options={iconOptions}
              reserveErrorSpace={false}
              value={iconValue}
              onChange={onIconChange}
            />
          )}

          {onToneChange !== undefined && tone !== undefined && (
            <ToneListbox
              label={formatIconGroupLabel('Icon tone:', name)}
              tones={TONE_PRESET_KEYS}
              value={tone}
              onChange={onToneChange}
            />
          )}

          <ToneListbox
            excludeTone={tone}
            label={formatIconGroupLabel('Icon fill tone:', name)}
            tones={TONE_PRESET_KEYS}
            value={fill}
            onChange={onFillChange}
          />

          {onPositionChange !== undefined && position !== undefined && (
            <Listbox
              label={formatIconGroupLabel('Icon position:', name)}
              options={getIconPositionListboxOptions()}
              reserveErrorSpace={false}
              value={position}
              onChange={(value) => onPositionChange(value as IconPosition)}
            />
          )}
        </>
      )}
    </>
  );
}

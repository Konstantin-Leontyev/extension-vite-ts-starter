/**
 * Файл: `src/pages/showcase/icon-group/index.tsx`
 * Предоставляет компонент IconGroup для настройки иконки компонента в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - тон глифа иконки через проп `fill`
 *  - опции глифов через проп `iconOptions`. Без `iconOptions` контрол `Icon:` не рендерится
 *  - ключ глифа через проп `iconValue`
 *  - префикс подписей контролов через проп `labelPrefix`. Пустой префикс даёт подписи
 *    без него, например `Tone:` у панели Icon. Сегменты SegmentButton передают
 *    `Icon A` и `Icon B`
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
 * 3. Рендерить единый блок настроек иконки в порядке: показ, глиф, тон секции,
 *    тон глифа и позиция
 * 4. Строить подписи контролов из префикса `labelPrefix`
 *
 * Потребители:
 *  - панели настроек витрины дизайн-системы — настраивают иконку компонента:
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/combobox-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/icon-settings/index.tsx`
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
 * DEFAULT_ICON_GROUP_LABEL_PREFIX — задаёт префикс подписей контролов по умолчанию.
 * Используется, когда вызывающий код не передал проп `labelPrefix`.
 */
const DEFAULT_ICON_GROUP_LABEL_PREFIX = 'Icon';

/**
 * IconGroupProps — представляет пропсы компонента IconGroup.
 *
 * @property fill — текущий тон глифа иконки
 * @property iconOptions — опции Combobox с глифами. Без него контрол `Icon:` не рендерится
 * @property iconValue — текущий ключ глифа
 * @property labelPrefix — префикс подписей контролов, например `Icon A`.
 *   Пустая строка даёт подписи без префикса
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
  iconOptions?: readonly ComboboxOption[];
  iconValue?: string;
  labelPrefix?: string;
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
 * resolveIconGroupLabel — возвращает подпись контрола группы из префикса и имени поля.
 * С префиксом — `Icon tone:`, `Icon A tone:`. С пустым префиксом слово поля
 * начинает подпись с заглавной буквы — `Tone:`.
 *
 * Как работает:
 * 1. При пустом префиксе делает первую букву `name` заглавной и добавляет `:`
 * 2. Иначе склеивает префикс, имя поля и `:`
 *
 * @param labelPrefix префикс подписей контролов
 * @param name имя поля в нижнем регистре, например `tone`
 * @returns подпись контрола с двоеточием
 */
function resolveIconGroupLabel(labelPrefix: string, name: string): string {
  if (labelPrefix === '') {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}:`;
  }

  return `${labelPrefix} ${name}:`;
}

/**
 * resolveIconGroupIconLabel — возвращает подпись Combobox глифа из префикса.
 * С префиксом — `Icon:`, `Icon A:`. С пустым префиксом — `Icon:`.
 *
 * Как работает:
 * 1. При пустом префиксе возвращает `Icon:`
 * 2. Иначе возвращает префикс с `:`
 *
 * @param labelPrefix префикс подписей контролов
 * @returns подпись Combobox глифа с двоеточием
 */
function resolveIconGroupIconLabel(labelPrefix: string): string {
  if (labelPrefix === '') {
    return 'Icon:';
  }

  return `${labelPrefix}:`;
}

/**
 * resolveIconGroupShowLabel — возвращает подпись чекбокса показа.
 * С префиксом — `Show icon`, `Show icon A`. Пустой префикс даёт `Show icon`.
 *
 * Как работает:
 * 1. При пустом префиксе возвращает `Show icon`
 * 2. Иначе возвращает `Show` и префикс с пониженной первой буквой
 *
 * @param labelPrefix префикс подписей контролов
 * @returns подпись чекбокса показа
 */
function resolveIconGroupShowLabel(labelPrefix: string): string {
  if (labelPrefix === '') {
    return 'Show icon';
  }

  return `Show ${labelPrefix.charAt(0).toLowerCase()}${labelPrefix.slice(1)}`;
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
 * // Icon: без позиции и флага показа, пустой префикс
 * <IconGroup
 *   fill={state.iconFill}
 *   iconOptions={COMBOBOX_OPTIONS}
 *   iconValue={state.iconKey}
 *   labelPrefix=""
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
  labelPrefix = DEFAULT_ICON_GROUP_LABEL_PREFIX,
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
          {resolveIconGroupShowLabel(labelPrefix)}
        </Checkbox>
      )}

      {isExpanded && (
        <>
          {iconOptions !== undefined && onIconChange !== undefined && (
            <Combobox
              label={resolveIconGroupIconLabel(labelPrefix)}
              options={iconOptions}
              value={iconValue}
              onChange={onIconChange}
            />
          )}

          {onToneChange !== undefined && tone !== undefined && (
            <ToneListbox
              label={resolveIconGroupLabel(labelPrefix, 'tone')}
              tones={TONE_PRESET_KEYS}
              value={tone}
              onChange={onToneChange}
            />
          )}

          <ToneListbox
            excludeTone={tone}
            label={resolveIconGroupLabel(labelPrefix, 'fill tone')}
            tones={TONE_PRESET_KEYS}
            value={fill}
            onChange={onFillChange}
          />

          {onPositionChange !== undefined && position !== undefined && (
            <Listbox
              label={resolveIconGroupLabel(labelPrefix, 'position')}
              options={getIconPositionListboxOptions()}
              value={position}
              onChange={(value) => onPositionChange(value as IconPosition)}
            />
          )}
        </>
      )}
    </>
  );
}

/**
 * Файл: `src/pages/showcase/icon-group/index.tsx`
 * Предоставляет компонент IconGroup для настройки иконки компонента в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - тон глифа иконки через проп `fill`
 *  - опции глифов через проп `iconOptions`. Без `iconOptions` контрол `Icon:` не рендерится
 *  - ключ глифа через проп `iconValue`
 *  - префикс подписей контролов через проп `labelPrefix`. Без пропа подписи
 *    без префикса, например `Tone:` и `Fill:` у панели Icon. Сегменты SegmentButton
 *    передают `Left icon` и `Right icon`
 *  - обработчик изменения тона глифа через проп `onFillChange`
 *  - обработчик изменения ключа глифа через проп `onIconChange`
 *  - обработчик изменения позиции через проп `onPositionChange`. Без `onPositionChange`
 *    контрол позиции не рендерится
 *  - обработчик изменения формы окна через проп `onShapeChange`. Без `onShapeChange`
 *    контрол формы не рендерится
 *  - обработчик показа иконки через проп `onShowChange`. Без `onShowChange` иконка
 *    неотключаема и группа рендерится всегда
 *  - обработчик изменения тона секции через проп `onToneChange`. Без пары
 *    `tone` / `onToneChange` контрол тона секции не рендерится
 *  - позицию иконки через проп `position`
 *  - форму окна иконки через проп `shape`
 *  - показ иконки через проп `show`
 *  - тон секции иконки через проп `tone`
 *
 * Основные задачи:
 * 1. Экспортировать компонент IconGroup
 * 2. Типизировать пропсы через `IconGroupProps`
 * 3. Рендерить единый блок настроек иконки в порядке: показ, глиф, форма окна,
 *    тон секции, тон глифа и позиция
 * 4. Собирать подписи контролов через `resolveGroupFieldLabel`,
 *    `resolveGroupContentLabel` и `resolveGroupFlagLabel` из
 *    `src/pages/showcase/showcase-labels.ts`
 *
 * Потребители:
 *  - панели настроек витрины дизайн-системы — настраивают иконку компонента:
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/combobox-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/search-field-settings/index.tsx`
 *     - `src/pages/showcase/icon-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Combobox, type ComboboxOption } from '@ui/combobox';
import {
  ICON_POSITION_KEYS,
  ICON_SHAPE_PRESET_KEYS,
  type IconPosition,
  type IconShapePreset,
} from '@ui/icon';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ShapeListbox } from '../shape-listbox';
import {
  resolveGroupContentLabel,
  resolveGroupFieldLabel,
  resolveGroupFlagLabel,
} from '../showcase-labels';
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
 * @property labelPrefix — префикс подписей контролов, например `Icon A`.
 *   Без пропа подписи без префикса
 * @property onFillChange — обработчик изменения тона глифа
 * @property onIconChange — обработчик изменения ключа глифа
 * @property onPositionChange — обработчик изменения позиции. Без него контрол позиции
 *   не рендерится
 * @property onShapeChange — обработчик изменения формы окна. Без него контрол формы
 *   не рендерится
 * @property onShowChange — обработчик показа иконки. Без него иконка неотключаема
 * @property onToneChange — обработчик изменения тона секции. Без него и без `tone`
 *   контрол тона секции не рендерится
 * @property position — текущая позиция иконки
 * @property shape — текущая форма окна иконки
 * @property show — включает показ иконки при переданном `onShowChange`
 * @property tone — текущий тон секции иконки
 */
type IconGroupProps = {
  fill: TonePreset;
  iconOptions?: readonly ComboboxOption[];
  iconValue?: string;
  labelPrefix?: string;
  onFillChange: (tone: TonePreset) => void;
  onIconChange?: (value: string) => void;
  onPositionChange?: (position: IconPosition) => void;
  onShapeChange?: (shape: IconShapePreset) => void;
  onShowChange?: (show: boolean) => void;
  onToneChange?: (tone: TonePreset) => void;
  position?: IconPosition;
  shape?: IconShapePreset;
  show?: boolean;
  tone?: TonePreset;
};

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
 * // Icon: без позиции, флага показа и префикса
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
  labelPrefix,
  onFillChange,
  onIconChange,
  onPositionChange,
  onShapeChange,
  onShowChange,
  onToneChange,
  position,
  shape,
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
          {resolveGroupFlagLabel(labelPrefix, 'Icon', 'Show')}
        </Checkbox>
      )}

      {isExpanded && (
        <>
          {iconOptions !== undefined && onIconChange !== undefined && (
            <Combobox
              label={resolveGroupContentLabel(labelPrefix, 'Icon')}
              options={iconOptions}
              value={iconValue}
              onChange={onIconChange}
            />
          )}

          {onShapeChange !== undefined && shape !== undefined && (
            <ShapeListbox
              label={resolveGroupFieldLabel(labelPrefix, 'shape')}
              shapes={ICON_SHAPE_PRESET_KEYS}
              value={shape}
              onChange={onShapeChange}
            />
          )}

          {onToneChange !== undefined && tone !== undefined && (
            <ToneListbox
              label={resolveGroupFieldLabel(labelPrefix, 'tone')}
              tones={TONE_PRESET_KEYS}
              value={tone}
              onChange={onToneChange}
            />
          )}

          <ToneListbox
            excludeTone={tone}
            label={resolveGroupFieldLabel(labelPrefix, 'fill')}
            tones={TONE_PRESET_KEYS}
            value={fill}
            onChange={onFillChange}
          />

          {onPositionChange !== undefined && position !== undefined && (
            <Listbox
              label={resolveGroupFieldLabel(labelPrefix, 'position')}
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

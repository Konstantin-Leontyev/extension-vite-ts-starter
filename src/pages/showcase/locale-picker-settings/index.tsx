/**
 * Файл: `src/pages/showcase/locale-picker-settings/index.tsx`
 * Определяет панель настроек компонента LocalePicker в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, вида триггера, рамки вида
 * `icon`, иконки вида `field`, сброса выбора вида `field`, плейсхолдера поиска,
 * текста пустого результата, подписи, плейсхолдера и состояния `disabled`
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `LocalePickerWidgetState`
 * 2. Экспортировать компонент `LocalePickerSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета LocalePicker
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type IconPosition } from '@ui/icon';
import {
  DEFAULT_LISTBOX_EMPTY_MESSAGE,
  DEFAULT_LISTBOX_PLACEHOLDER,
  Listbox,
  type ListboxAppearance,
  type ListboxOption,
} from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { DEFAULT_SEARCH_FIELD_PLACEHOLDER } from '@ui/search-field';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * LOCALE_PICKER_APPEARANCE_OPTIONS — задаёт опции вида триггера LocalePicker.
 * Используется в контроле `Appearance:` панели настроек LocalePicker.
 */
const LOCALE_PICKER_APPEARANCE_OPTIONS: ListboxOption[] = [
  { label: 'field', value: 'field' },
  { label: 'icon', value: 'icon' },
];

/**
 * LocalePickerWidgetState — представляет состояние настроек компонента LocalePicker в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента LocalePicker.
 * Используется для синхронизации значений между панелью управления и демонстрационным LocalePicker.
 *
 * @property appearance — вид триггера
 * @property borderTone — тон рамки триггера вида `icon`
 * @property disabled — включает недоступное состояние
 * @property emptyMessage — текст при пустом результате поиска
 * @property iconFill — тон глифа шеврона у вида `field`
 * @property iconPosition — позиция шеврона относительно значения у вида `field`
 * @property iconTone — тон секции шеврона у вида `field`
 * @property label — подпись над триггером
 * @property placeholder — плейсхолдер пустого триггера
 * @property searchPlaceholder — плейсхолдер поля поиска
 * @property shape — форма поверхности
 * @property showBorder — включает рамку триггера вида `icon`
 * @property showClearButton — включает кнопку сброса выбора у вида `field` при выбранном значении
 * @property showShadow — включает тень триггера вида `icon` при включённой рамке
 * @property size — размер компонента
 * @property value — буфер выбранного значения в превью. В панель не выносится
 */
export type LocalePickerWidgetState = {
  appearance: ListboxAppearance;
  borderTone: TonePreset;
  disabled: boolean;
  emptyMessage: string;
  iconFill: TonePreset;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  shape: ShapePreset;
  showBorder: boolean;
  showClearButton: boolean;
  showShadow: boolean;
  size: SizePreset;
  value: string;
};

/**
 * LocalePickerSettingsProps — представляет пропсы компонента LocalePickerSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек LocalePicker
 */
type LocalePickerSettingsProps = {
  onChange: <K extends keyof LocalePickerWidgetState>(
    key: K,
    value: LocalePickerWidgetState[K]
  ) => void;
  state: LocalePickerWidgetState;
};

/**
 * LocalePickerSettings — отображает панель настроек LocalePicker в витрине дизайн-системы.
 *
 * @example
 * <LocalePickerSettings state={localePicker} onChange={updateLocalePicker} />
 */
export function LocalePickerSettings({ onChange, state }: LocalePickerSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ControlGroup
        label={state.label}
        shape={state.shape}
        size={state.size}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => onChange('shape', shape)}
        onSizeChange={(size) => onChange('size', size)}
      />

      <Listbox
        label="Appearance:"
        options={LOCALE_PICKER_APPEARANCE_OPTIONS}
        value={state.appearance}
        onChange={(value) => onChange('appearance', value as ListboxAppearance)}
      />

      {state.appearance === 'icon' && (
        <BorderGroup
          borderTone={state.borderTone}
          showBorder={state.showBorder}
          showShadow={state.showShadow}
          onBorderToneChange={(tone) => onChange('borderTone', tone)}
          onShowBorderChange={(show) => onChange('showBorder', show)}
          onShowShadowChange={(show) => onChange('showShadow', show)}
        />
      )}

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_LISTBOX_PLACEHOLDER,
            value: state.placeholder,
            onChange: (value) => onChange('placeholder', value),
          },
        ]}
        labelPrefix="Placeholder"
      />

      {state.appearance === 'field' && (
        <IconGroup
          fill={state.iconFill}
          labelPrefix="Icon"
          position={state.iconPosition}
          tone={state.iconTone}
          onFillChange={(tone) => onChange('iconFill', tone)}
          onPositionChange={(position) => onChange('iconPosition', position)}
          onToneChange={(tone) => onChange('iconTone', tone)}
        />
      )}

      {state.appearance === 'field' && (
        <Checkbox
          checked={state.showClearButton}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('showClearButton', event.target.checked)
          }
        >
          Show clear button
        </Checkbox>
      )}

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_SEARCH_FIELD_PLACEHOLDER,
            value: state.searchPlaceholder,
            onChange: (value) => onChange('searchPlaceholder', value),
          },
        ]}
        labelPrefix="Search placeholder"
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_LISTBOX_EMPTY_MESSAGE,
            value: state.emptyMessage,
            onChange: (value) => onChange('emptyMessage', value),
          },
        ]}
        labelPrefix="Empty message"
      />

      <Checkbox
        checked={state.disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabled', event.target.checked)
        }
      >
        Disabled
      </Checkbox>
    </StyledSettingsForm>
  );
}

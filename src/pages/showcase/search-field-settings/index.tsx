/**
 * Файл: `src/pages/showcase/search-field-settings/index.tsx`
 * Определяет панель настроек компонента SearchField в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, иконки, подписи,
 * плейсхолдера и состояния `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SearchFieldWidgetState`
 * 2. Экспортировать компонент `SearchFieldSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета SearchField
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type IconPosition } from '@ui/icon';
import { Input } from '@ui/input';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';

/**
 * SearchFieldWidgetState — представляет состояние настроек компонента SearchField в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента SearchField, кроме витринных ключей:
 * `iconKey` выбирает глиф для пропа `icon` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным SearchField.
 *
 * @property borderTone — тон рамки
 * @property disabled — включает недоступное состояние поля
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора глифа иконки для превью
 * @property iconPosition — позиция иконки относительно поля
 * @property iconTone — тон секции иконки
 * @property label — подпись над полем
 * @property placeholder — плейсхолдер значения
 * @property shape — форма строки-поля
 * @property showBorder — включает рамку контрола
 * @property showIcon — включает секцию иконки
 * @property showShadow — включает тень при включённой рамке
 * @property size — размер контрола
 * @property value — значение поля
 */
export type SearchFieldWidgetState = {
  borderTone: TonePreset;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  label: string;
  placeholder: string;
  shape: ShapePreset;
  showBorder: boolean;
  showIcon: boolean;
  showShadow: boolean;
  size: SizePreset;
  value: string;
};

/**
 * SearchFieldSettingsProps — представляет пропсы компонента SearchFieldSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек SearchField
 */
type SearchFieldSettingsProps = {
  onChange: <K extends keyof SearchFieldWidgetState>(
    key: K,
    value: SearchFieldWidgetState[K]
  ) => void;
  state: SearchFieldWidgetState;
};

/**
 * SearchFieldSettings — отображает панель настроек SearchField в витрине дизайн-системы.
 *
 * @example
 * <SearchFieldSettings state={searchField} onChange={updateSearchField} />
 */
export function SearchFieldSettings({ onChange, state }: SearchFieldSettingsProps) {
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

      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <IconGroup
        fill={state.iconFill}
        iconOptions={COMBOBOX_OPTIONS}
        iconValue={state.iconKey}
        labelPrefix="Icon"
        position={state.iconPosition}
        show={state.showIcon}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onIconChange={(value) => onChange('iconKey', value as IconKey)}
        onPositionChange={(position) => onChange('iconPosition', position)}
        onShowChange={(checked) => onChange('showIcon', checked)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <Input
        label="Placeholder:"
        value={state.placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('placeholder', event.target.value)
        }
        onClear={() => onChange('placeholder', '')}
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

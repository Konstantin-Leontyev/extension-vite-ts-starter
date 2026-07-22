/**
 * Файл: `src/pages/design-system/round-button-settings/index.tsx`
 * Определяет панель настроек компонента RoundButton в витрине дизайн-системы.
 * Содержит контролы для изменения размера, иконки, режима с границей и состояния `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `RoundButtonWidgetState`
 * 2. Экспортировать компонент `RoundButtonSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета RoundButton
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import {
  ROUND_BUTTON_SIZE_PRESET_KEYS,
  type RoundButtonSizePreset,
} from '@ui/round-button';
import { type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { IconGroup } from '../icon-group';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { SizeListbox } from '../size-listbox';

/**
 * RoundButtonWidgetState — представляет состояние настроек компонента RoundButton в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента RoundButton, кроме витринных ключей:
 * `iconKey` выбирает иконку для `children` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным RoundButton.
 *
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора иконки для превью
 * @property iconTone — тон поверхности круга
 * @property showBorder — включает границу
 * @property sizePreset — размер кнопки
 */
export type RoundButtonWidgetState = {
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconTone: TonePreset;
  showBorder: boolean;
  sizePreset: RoundButtonSizePreset;
};

/**
 * RoundButtonSettingsProps — представляет пропсы компонента RoundButtonSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек RoundButton
 */
type RoundButtonSettingsProps = {
  onChange: <K extends keyof RoundButtonWidgetState>(
    key: K,
    value: RoundButtonWidgetState[K]
  ) => void;
  state: RoundButtonWidgetState;
};

/**
 * RoundButtonSettings — отображает панель настроек RoundButton в витрине дизайн-системы.
 *
 * @example
 * <RoundButtonSettings state={roundButton} onChange={updateRoundButton} />
 */
export function RoundButtonSettings({ onChange, state }: RoundButtonSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={ROUND_BUTTON_SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => onChange('sizePreset', size)}
      />

      <IconGroup
        fill={state.iconFill}
        icon={{
          options: COMBOBOX_OPTIONS,
          value: state.iconKey,
          onChange: (value) => onChange('iconKey', value as IconKey),
        }}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <Checkbox
        checked={state.showBorder}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showBorder', event.target.checked)
        }
      >
        Show border
      </Checkbox>

      <Checkbox
        checked={state.disabled}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabled', event.target.checked)
        }
      >
        Disabled
      </Checkbox>
    </StyledSettingsForm>
  );
}

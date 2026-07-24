/**
 * Файл: `src/pages/showcase/round-button-settings/index.tsx`
 * Определяет панель настроек компонента RoundButton в витрине дизайн-системы.
 * Содержит контролы для изменения размера, иконки и её тонов, отступа окна Icon,
 * режима с границей и состояния `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `RoundButtonWidgetState`
 * 2. Экспортировать компонент `RoundButtonSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета RoundButton
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { getIconPadding } from '@ui/icon';
import {
  ROUND_BUTTON_SIZE_PRESET_KEYS,
  type RoundButtonSizePreset,
} from '@ui/round-button';
import { type SpacingValue } from '@ui/spacing';
import { type TonePreset } from '@ui/tones';

import { IconGroup } from '../icon-group';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

/**
 * resolveIconPaddingSizePreset — возвращает ключ размерного ряда под текущий `iconPadding`.
 * Если отступ совпадает с мостом от `sizePreset` кнопки — возвращает его.
 * Иначе берёт первый ключ ряда, у которого `getIconPadding` даёт то же значение.
 *
 * @param iconPadding текущий отступ окна Icon
 * @param sizePreset размер кнопки
 * @returns ключ ряда для контрола отступа окна Icon
 */
function resolveIconPaddingSizePreset(
  iconPadding: SpacingValue,
  sizePreset: RoundButtonSizePreset
): RoundButtonSizePreset {
  if (getIconPadding(sizePreset) === iconPadding) {
    return sizePreset;
  }

  return (
    ROUND_BUTTON_SIZE_PRESET_KEYS.find((key) => getIconPadding(key) === iconPadding) ??
    sizePreset
  );
}

/**
 * RoundButtonWidgetState — представляет состояние настроек компонента RoundButton в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента RoundButton, кроме витринных ключей:
 * `iconKey` выбирает иконку для `children` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным RoundButton.
 *
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора иконки для превью
 * @property iconPadding — отступ окна Icon. При смене `sizePreset` синхронизируется
 *   мостом `getIconPadding`
 * @property iconTone — тон поверхности круга
 * @property showBorder — включает границу
 * @property sizePreset — размер кнопки
 */
export type RoundButtonWidgetState = {
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconPadding: SpacingValue;
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
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('iconPadding', getIconPadding(size));
        }}
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

      <SizeListbox
        label="Icon padding:"
        sizes={ROUND_BUTTON_SIZE_PRESET_KEYS}
        value={resolveIconPaddingSizePreset(state.iconPadding, state.sizePreset)}
        onChange={(size) => onChange('iconPadding', getIconPadding(size))}
      />

      <Checkbox
        checked={state.showBorder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showBorder', event.target.checked)
        }
      >
        Show border
      </Checkbox>

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

/**
 * Файл: `src/pages/showcase/switch-settings/index.tsx`
 * Определяет панель настроек компонента Switch в витрине дизайн-системы.
 * Содержит контролы для изменения размера, тона, подписи и состояний
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SwitchWidgetState`
 * 2. Экспортировать компонент `SwitchSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета тумблера
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { SIZE_PRESET_KEYS, getTextSize, type SizePreset } from '@ui/presets';
import { type TextSizePreset, type TextTonePreset } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * SwitchWidgetState — представляет состояние настроек компонента Switch в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Switch, кроме витринного ключа:
 * `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным тумблером.
 *
 * @property checked — включает тумблер
 * @property disabled — включает недоступное состояние
 * @property sizePreset — размер дорожки
 * @property text — подпись тумблера
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 * @property tone — тон включённого состояния
 */
export type SwitchWidgetState = {
  checked: boolean;
  disabled: boolean;
  sizePreset: SizePreset;
  text: string;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTonePreset;
  tone: TonePreset;
};

/**
 * SwitchSettingsProps — представляет пропсы компонента SwitchSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек тумблера
 */
type SwitchSettingsProps = {
  onChange: <K extends keyof SwitchWidgetState>(
    key: K,
    value: SwitchWidgetState[K]
  ) => void;
  state: SwitchWidgetState;
};

/**
 * SwitchSettings — отображает панель настроек Switch в витрине дизайн-системы.
 *
 * @example
 * <SwitchSettings state={switchState} onChange={updateSwitch} />
 */
export function SwitchSettings({ onChange, state }: SwitchSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getTextSize(size));
        }}
      />

      <ToneListbox
        label="Tone:"
        tones={TONE_PRESET_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />

      <TextGroup
        contents={[
          {
            value: state.text,
            onChange: (value) => onChange('text', value),
          },
        ]}
        italic={state.textItalic}
        labelPrefix="Text"
        set
        size={state.textSize}
        tones={[
          {
            value: state.textTone,
            onChange: (tone) => onChange('textTone', tone),
          },
        ]}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
      />

      <Checkbox
        checked={state.checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('checked', event.target.checked)
        }
      >
        Checked
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

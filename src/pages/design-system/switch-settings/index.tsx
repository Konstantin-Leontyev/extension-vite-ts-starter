import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SizePreset } from '@ui/presets';
import { TONE_PRESET_OPTIONS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';

export type SwitchWidgetState = {
  checked: boolean;
  disabled: boolean;
  label: string;
  sizePreset: SizePreset;
  tone: TonePreset;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

type SwitchSettingsProps = {
  onChange: <K extends keyof SwitchWidgetState>(
    key: K,
    value: SwitchWidgetState[K]
  ) => void;
  state: SwitchWidgetState;
};

export function SwitchSettings({ onChange, state }: SwitchSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Input
        label="Label:"
        reserveErrorSpace={false}
        value={state.label}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('label', event.target.value)
        }
      />

      <Listbox
        label="Size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.sizePreset}
        onChange={(value) => onChange('sizePreset', value as SizePreset)}
      />

      <Listbox
        label="Tone:"
        options={TONE_PRESET_OPTIONS}
        reserveErrorSpace={false}
        value={state.tone}
        onChange={(value) => onChange('tone', value as TonePreset)}
      />

      <Checkbox
        checked={state.checked}
        label="Checked"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('checked', event.target.checked)
        }
      />

      <Checkbox
        checked={state.disabled}
        label="Disabled"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabled', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

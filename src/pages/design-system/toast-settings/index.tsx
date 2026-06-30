import { type ChangeEvent } from 'react';

import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SizePreset } from '@ui/presets';
import { TONE_PRESET_OPTIONS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';

export type ToastWidgetState = {
  message: string;
  sizePreset: SizePreset;
  tone: TonePreset;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

type ToastSettingsProps = {
  onChange: <K extends keyof ToastWidgetState>(
    key: K,
    value: ToastWidgetState[K]
  ) => void;
  state: ToastWidgetState;
};

export function ToastSettings({ onChange, state }: ToastSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Input
        label="Message:"
        reserveErrorSpace={false}
        value={state.message}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('message', event.target.value)
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
    </StyledSettingsForm>
  );
}

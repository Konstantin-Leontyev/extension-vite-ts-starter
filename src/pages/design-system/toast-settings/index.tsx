import { type ChangeEvent } from 'react';

import { Input } from '@ui/input';
import { Listbox } from '@ui/listbox';
import { TONE_PRESET_OPTIONS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';

export type ToastWidgetState = {
  message: string;
  tone: TonePreset;
};

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
        label="Tone:"
        options={TONE_PRESET_OPTIONS}
        reserveErrorSpace={false}
        value={state.tone}
        onChange={(value) => onChange('tone', value as TonePreset)}
      />
    </StyledSettingsForm>
  );
}

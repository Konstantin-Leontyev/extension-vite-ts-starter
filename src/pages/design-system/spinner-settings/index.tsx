import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SizePreset } from '@ui/presets';
import { TONE_PRESET_OPTIONS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';

export type SpinnerWidgetState = {
  sizePreset: SizePreset;
  tone: TonePreset;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

type SpinnerSettingsProps = {
  onChange: <K extends keyof SpinnerWidgetState>(
    key: K,
    value: SpinnerWidgetState[K]
  ) => void;
  state: SpinnerWidgetState;
};

export function SpinnerSettings({ onChange, state }: SpinnerSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
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

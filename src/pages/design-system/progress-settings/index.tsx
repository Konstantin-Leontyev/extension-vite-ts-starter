import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SizePreset } from '@ui/presets';
import { TONE_PRESET_OPTIONS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';

export type ProgressWidgetState = {
  showLabel: boolean;
  sizePreset: SizePreset;
  tone: TonePreset;
  valuePercent: number;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

type ProgressSettingsProps = {
  onChange: <K extends keyof ProgressWidgetState>(
    key: K,
    value: ProgressWidgetState[K]
  ) => void;
  state: ProgressWidgetState;
};

function parseValuePercent(raw: string): number {
  const parsed = Number.parseInt(raw, 10);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  if (parsed < 0) {
    return 0;
  }

  if (parsed > 100) {
    return 100;
  }

  return parsed;
}

export function ProgressSettings({ onChange, state }: ProgressSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Input
        inputMode="numeric"
        label="Value (%):"
        reserveErrorSpace={false}
        value={String(state.valuePercent)}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('valuePercent', parseValuePercent(event.target.value))
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
        checked={state.showLabel}
        label="Show label"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showLabel', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

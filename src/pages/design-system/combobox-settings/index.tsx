import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';

import { StyledSettingsForm } from '../design-system.styles';
import { COMBOBOX_DEMO_OPTIONS } from './options';

export type ComboboxWidgetState = {
  disabled: boolean;
  label: string;
  shape: ShapePreset;
  sizePreset: SizePreset;
  value: string;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

const SHAPE_OPTIONS: ListboxOption[] = [
  { label: 'default', value: 'default' },
  { label: 'round', value: 'round' },
];

type ComboboxSettingsProps = {
  onChange: <K extends keyof ComboboxWidgetState>(
    key: K,
    value: ComboboxWidgetState[K]
  ) => void;
  state: ComboboxWidgetState;
};

export function ComboboxSettings({ onChange, state }: ComboboxSettingsProps) {
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
        label="Shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.shape}
        onChange={(value) => onChange('shape', value as ShapePreset)}
      />

      <Listbox
        label="Value:"
        options={COMBOBOX_DEMO_OPTIONS}
        reserveErrorSpace={false}
        value={state.value}
        onChange={(value) => onChange('value', value as string)}
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

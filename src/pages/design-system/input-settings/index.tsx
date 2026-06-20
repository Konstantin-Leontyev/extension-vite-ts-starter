import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';

import { StyledSettingsForm } from '../design-system.styles';

export type InputWidgetState = {
  disabled: boolean;
  error: string;
  label: string;
  placeholder: string;
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

type InputSettingsProps = {
  onChange: <K extends keyof InputWidgetState>(
    key: K,
    value: InputWidgetState[K]
  ) => void;
  state: InputWidgetState;
};

export function InputSettings({ onChange, state }: InputSettingsProps) {
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

      <Input
        label="Placeholder:"
        reserveErrorSpace={false}
        value={state.placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('placeholder', event.target.value)
        }
      />

      <Input
        label="Value:"
        reserveErrorSpace={false}
        value={state.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('value', event.target.value)
        }
      />

      <Input
        label="Error:"
        reserveErrorSpace={false}
        value={state.error}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('error', event.target.value)
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

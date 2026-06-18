import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type CheckboxSizePreset } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';

import { StyledSettingsForm } from '../design-system.styles';

export type CheckboxWidgetState = {
  bare: boolean;
  checked: boolean;
  disabled: boolean;
  inverted: boolean;
  label: string;
  sizePreset: CheckboxSizePreset;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

type CheckboxSettingsProps = {
  onChange: <K extends keyof CheckboxWidgetState>(
    key: K,
    value: CheckboxWidgetState[K]
  ) => void;
  state: CheckboxWidgetState;
};

export function CheckboxSettings({ onChange, state }: CheckboxSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Listbox
        label="Size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.sizePreset}
        onChange={(value) => onChange('sizePreset', value as CheckboxSizePreset)}
      />

      <Input
        disabled={state.bare}
        label="Label:"
        reserveErrorSpace={false}
        value={state.label}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('label', event.target.value)
        }
      />

      <Checkbox
        checked={state.bare}
        label="Bare"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('bare', event.target.checked)
        }
      />

      <Checkbox
        checked={state.inverted}
        label="Inverted"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('inverted', event.target.checked)
        }
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

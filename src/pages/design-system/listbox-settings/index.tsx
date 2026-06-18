import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ListboxShape, type ListboxSizePreset } from '@ui/listbox';

import { StyledSettingsForm } from '../design-system.styles';
import { LISTBOX_DEMO_OPTIONS } from './options';

export type ListboxWidgetState = {
  disabled: boolean;
  inlineCheckbox: boolean;
  label: string;
  multiple: boolean;
  shape: ListboxShape;
  sizePreset: ListboxSizePreset;
  value: string | string[];
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

type ListboxSettingsProps = {
  onChange: <K extends keyof ListboxWidgetState>(
    key: K,
    value: ListboxWidgetState[K]
  ) => void;
  state: ListboxWidgetState;
};

export function ListboxSettings({ onChange, state }: ListboxSettingsProps) {
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
        onChange={(value) => onChange('sizePreset', value as ListboxSizePreset)}
      />

      <Listbox
        label="Shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.shape}
        onChange={(value) => onChange('shape', value as ListboxShape)}
      />

      <Listbox
        label="Value:"
        multiple={state.multiple}
        options={LISTBOX_DEMO_OPTIONS}
        reserveErrorSpace={false}
        value={state.value}
        onChange={(value) => onChange('value', value)}
      />

      <Checkbox
        checked={state.disabled}
        label="Disabled"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabled', event.target.checked)
        }
      />

      <Checkbox
        checked={state.inlineCheckbox}
        label="Inline checkbox"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('inlineCheckbox', event.target.checked)
        }
      />

      <Checkbox
        checked={state.multiple}
        label="Multiple"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('multiple', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

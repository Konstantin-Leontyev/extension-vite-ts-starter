import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';

import { StyledSettingsForm } from '../design-system.styles';

export type DateInputWidgetState = {
  dayShape?: ShapePreset;
  disabled: boolean;
  maxDay: string;
  minDay: string;
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

type DateInputSettingsProps = {
  onChange: <K extends keyof DateInputWidgetState>(
    key: K,
    value: DateInputWidgetState[K]
  ) => void;
  state: DateInputWidgetState;
};

export function DateInputSettings({ onChange, state }: DateInputSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Listbox
        label="Size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.sizePreset}
        onChange={(value) => {
          onChange('sizePreset', value as SizePreset);
        }}
      />

      <Listbox
        label="Shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.shape}
        onChange={(value) => {
          onChange('shape', value as ShapePreset);
        }}
      />

      <Listbox
        label="Day shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.dayShape ?? state.shape}
        onChange={(value) => {
          onChange('dayShape', value as ShapePreset);
        }}
      />

      <Input
        label="Value:"
        reserveErrorSpace={false}
        value={state.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('value', event.target.value);
        }}
      />

      <Input
        label="Min day:"
        reserveErrorSpace={false}
        value={state.minDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('minDay', event.target.value);
        }}
      />

      <Input
        label="Max day:"
        reserveErrorSpace={false}
        value={state.maxDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('maxDay', event.target.value);
        }}
      />

      <Checkbox
        checked={state.disabled}
        label="Disabled"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('disabled', event.target.checked);
        }}
      />
    </StyledSettingsForm>
  );
}

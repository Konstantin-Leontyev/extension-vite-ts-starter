import { type ChangeEvent } from 'react';
import { useTheme } from 'styled-components';

import { Checkbox } from '@ui/checkbox';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { Stepper } from '@ui/stepper';
import { Text } from '@ui/text';

import { StyledSettingsField, StyledSettingsForm } from '../design-system.styles';

const STEP_FIELD_ID = 'design-system-stepper-step';
const STEP_LABEL_ID = 'design-system-stepper-step-label';

export type StepperWidgetState = {
  disabled: boolean;
  shape: ShapePreset;
  sizePreset: SizePreset;
  step: number;
  value: number;
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

type StepperSettingsProps = {
  onChange: <K extends keyof StepperWidgetState>(
    key: K,
    value: StepperWidgetState[K]
  ) => void;
  state: StepperWidgetState;
};

export function StepperSettings({ onChange, state }: StepperSettingsProps) {
  const theme = useTheme();

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
        label="Shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.shape}
        onChange={(value) => onChange('shape', value as ShapePreset)}
      />

      <StyledSettingsField>
        <Text
          as="label"
          color={theme.colors.muted}
          htmlFor={STEP_FIELD_ID}
          id={STEP_LABEL_ID}
          sizePreset="medium"
        >
          Step:
        </Text>
        <Stepper
          align="center"
          aria-labelledby={STEP_LABEL_ID}
          id={STEP_FIELD_ID}
          min={1}
          sizePreset="medium"
          step={1}
          value={state.step}
          onChange={(value) => onChange('step', value)}
        />
      </StyledSettingsField>

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

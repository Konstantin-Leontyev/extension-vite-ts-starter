import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { FIELDSET_BORDER_TONE_OPTIONS, type FieldsetBorderTone } from '@ui/fieldset';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';

import { StyledSettingsForm } from '../design-system.styles';

export type FieldsetWidgetState = {
  borderTone: FieldsetBorderTone;
  disabledA: boolean;
  disabledB: boolean;
  label: string;
  labelA: string;
  labelB: string;
  selected: 'a' | 'b';
};

const SELECTED_OPTIONS: ListboxOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
];

type FieldsetSettingsProps = {
  onChange: <K extends keyof FieldsetWidgetState>(
    key: K,
    value: FieldsetWidgetState[K]
  ) => void;
  state: FieldsetWidgetState;
};

export function FieldsetSettings({ onChange, state }: FieldsetSettingsProps) {
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

      <Input
        label="Label A:"
        reserveErrorSpace={false}
        value={state.labelA}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('labelA', event.target.value)
        }
      />

      <Input
        label="Label B:"
        reserveErrorSpace={false}
        value={state.labelB}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('labelB', event.target.value)
        }
      />

      <Listbox
        label="Border tone:"
        options={FIELDSET_BORDER_TONE_OPTIONS}
        reserveErrorSpace={false}
        value={state.borderTone}
        onChange={(value) => onChange('borderTone', value as FieldsetBorderTone)}
      />

      <Listbox
        label="Selected:"
        options={SELECTED_OPTIONS}
        reserveErrorSpace={false}
        value={state.selected}
        onChange={(value) =>
          onChange('selected', value as FieldsetWidgetState['selected'])
        }
      />

      <Checkbox
        checked={state.disabledA}
        label="Disable A"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabledA', event.target.checked)
        }
      />

      <Checkbox
        checked={state.disabledB}
        label="Disable B"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabledB', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

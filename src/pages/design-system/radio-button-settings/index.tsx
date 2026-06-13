import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';

import { StyledSettingsForm } from '../design-system.styles';

export type RadioButtonWidgetState = {
  bare: boolean;
  disabledA: boolean;
  disabledB: boolean;
  labelA: string;
  labelB: string;
  selected: 'a' | 'b';
};

const SELECTED_OPTIONS: ListboxOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
];

type RadioButtonSettingsProps = {
  onChange: <K extends keyof RadioButtonWidgetState>(
    key: K,
    value: RadioButtonWidgetState[K]
  ) => void;
  state: RadioButtonWidgetState;
};

export function RadioButtonSettings({ onChange, state }: RadioButtonSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Input
        disabled={state.bare}
        label="Label A:"
        reserveErrorSpace={false}
        value={state.labelA}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('labelA', event.target.value)
        }
      />

      <Input
        disabled={state.bare}
        label="Label B:"
        reserveErrorSpace={false}
        value={state.labelB}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('labelB', event.target.value)
        }
      />

      <Listbox
        label="Selected:"
        options={SELECTED_OPTIONS}
        reserveErrorSpace={false}
        value={state.selected}
        onChange={(value) =>
          onChange('selected', value as RadioButtonWidgetState['selected'])
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

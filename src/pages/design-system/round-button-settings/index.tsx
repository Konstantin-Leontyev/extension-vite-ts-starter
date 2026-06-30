import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type RoundButtonSizePreset } from '@ui/round-button';

import { StyledSettingsForm } from '../design-system.styles';
import {
  SHOWCASE_ICON_COMBOBOX_OPTIONS,
  isShowcaseIconKey,
  type ShowcaseIconKey,
} from '../showcase-icons';

export type RoundButtonWidgetState = {
  disabled: boolean;
  iconKey: ShowcaseIconKey;
  sizePreset: RoundButtonSizePreset;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
  { label: 'huge', value: 'huge' },
];

type RoundButtonSettingsProps = {
  onChange: <K extends keyof RoundButtonWidgetState>(
    key: K,
    value: RoundButtonWidgetState[K]
  ) => void;
  state: RoundButtonWidgetState;
};

export function RoundButtonSettings({ onChange, state }: RoundButtonSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Listbox
        label="Size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.sizePreset}
        onChange={(value) => onChange('sizePreset', value as RoundButtonSizePreset)}
      />

      <Combobox
        label="Icon:"
        options={SHOWCASE_ICON_COMBOBOX_OPTIONS}
        reserveErrorSpace={false}
        value={state.iconKey}
        onChange={(value) => {
          if (isShowcaseIconKey(value)) {
            onChange('iconKey', value);
          }
        }}
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

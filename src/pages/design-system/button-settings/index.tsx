import { type ChangeEvent } from 'react';

import { type ButtonIconPosition } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import {
  TONE_PRESET_OPTIONS,
  toTonePresetOptions,
  tonePresetsExcludingFill,
  type TonePreset,
} from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import {
  SHOWCASE_ICON_COMBOBOX_OPTIONS,
  isShowcaseIconKey,
  type ShowcaseIconKey,
} from '../showcase-icons';

export type ButtonWidgetState = {
  active: boolean;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: ShowcaseIconKey;
  iconPosition: ButtonIconPosition;
  iconTone: TonePreset;
  textColor: TonePreset;
  shape: ShapePreset;
  sizePreset: SizePreset;
  text: string;
  tone: TonePreset;
  withIcon: boolean;
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

const ICON_POSITION_OPTIONS: ListboxOption[] = [
  { label: 'end', value: 'end' },
  { label: 'start', value: 'start' },
];

type ButtonSettingsProps = {
  onChange: <K extends keyof ButtonWidgetState>(
    key: K,
    value: ButtonWidgetState[K]
  ) => void;
  state: ButtonWidgetState;
};

export function ButtonSettings({ onChange, state }: ButtonSettingsProps) {
  const textColorOptions = tonePresetsExcludingFill(state.tone);
  const iconFillOptions = state.withIcon ? tonePresetsExcludingFill(state.iconTone) : [];

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

      <Listbox
        label="Button tone:"
        options={TONE_PRESET_OPTIONS}
        reserveErrorSpace={false}
        value={state.tone}
        onChange={(value) => onChange('tone', value as TonePreset)}
      />

      <Input
        label="Button text:"
        reserveErrorSpace={false}
        value={state.text}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('text', event.target.value)
        }
      />

      <Listbox
        label="Button text color:"
        options={toTonePresetOptions(textColorOptions)}
        reserveErrorSpace={false}
        value={textColorOptions.includes(state.textColor) ? state.textColor : 'default'}
        onChange={(value) => onChange('textColor', value as TonePreset)}
      />

      <Checkbox
        checked={state.withIcon}
        label="Icon:"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withIcon', event.target.checked)
        }
      />

      {state.withIcon && (
        <>
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

          <Listbox
            label="Icon tone:"
            options={TONE_PRESET_OPTIONS}
            reserveErrorSpace={false}
            value={state.iconTone}
            onChange={(value) => onChange('iconTone', value as TonePreset)}
          />

          <Listbox
            label="Icon fill:"
            options={toTonePresetOptions(iconFillOptions)}
            reserveErrorSpace={false}
            value={iconFillOptions.includes(state.iconFill) ? state.iconFill : 'default'}
            onChange={(value) => onChange('iconFill', value as TonePreset)}
          />

          <Listbox
            label="Icon position:"
            options={ICON_POSITION_OPTIONS}
            reserveErrorSpace={false}
            value={state.iconPosition}
            onChange={(value) => onChange('iconPosition', value as ButtonIconPosition)}
          />
        </>
      )}

      <Checkbox
        checked={state.active}
        label="Active"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('active', event.target.checked)
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

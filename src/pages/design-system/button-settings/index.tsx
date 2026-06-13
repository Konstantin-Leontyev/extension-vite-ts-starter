import { type ChangeEvent } from 'react';

import {
  BUTTON_COLORED_TONES,
  type ButtonIconPosition,
  type ButtonShape,
  type ButtonSizePreset,
  type ButtonTone,
} from '@ui/button/button.styles';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';

import { StyledSettingsForm } from '../design-system.styles';

export type ButtonWidgetState = {
  active: boolean;
  disabled: boolean;
  iconFill: ButtonTone;
  iconPosition: ButtonIconPosition;
  iconTone: ButtonTone;
  textColor: ButtonTone;
  shape: ButtonShape;
  sizePreset: ButtonSizePreset;
  text: string;
  tone: ButtonTone;
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

const TONE_OPTIONS: ListboxOption[] = [
  { label: 'default', value: 'default' },
  { label: 'primary', value: 'primary' },
  { label: 'success', value: 'success' },
  { label: 'warning', value: 'warning' },
  { label: 'danger', value: 'danger' },
];

const ICON_POSITION_OPTIONS: ListboxOption[] = [
  { label: 'end', value: 'end' },
  { label: 'start', value: 'start' },
];

function toToneOptions(tones: ButtonTone[]): ListboxOption[] {
  return tones.map((tone) => ({ label: tone, value: tone }));
}

/** Цвет текста нельзя задать равным заливке кнопки — иначе текст сольётся. */
function getTextColorOptions(tone: ButtonTone): ButtonTone[] {
  return ['default', ...BUTTON_COLORED_TONES.filter((value) => value !== tone)];
}

/** Цвет глифа нельзя задать равным фону иконки — иначе глиф сольётся. */
function getIconFillOptions(iconTone: ButtonTone): ButtonTone[] {
  return ['default', ...BUTTON_COLORED_TONES.filter((value) => value !== iconTone)];
}

type ButtonSettingsProps = {
  onChange: <K extends keyof ButtonWidgetState>(
    key: K,
    value: ButtonWidgetState[K]
  ) => void;
  state: ButtonWidgetState;
};

export function ButtonSettings({ onChange, state }: ButtonSettingsProps) {
  const textColorOptions = getTextColorOptions(state.tone);
  const iconFillOptions = state.withIcon ? getIconFillOptions(state.iconTone) : [];

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Listbox
        label="Size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.sizePreset}
        onChange={(value) => onChange('sizePreset', value as ButtonSizePreset)}
      />

      <Listbox
        label="Shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.shape}
        onChange={(value) => onChange('shape', value as ButtonShape)}
      />

      <Listbox
        label="Tone:"
        options={TONE_OPTIONS}
        reserveErrorSpace={false}
        value={state.tone}
        onChange={(value) => onChange('tone', value as ButtonTone)}
      />

      <Input
        label="Text:"
        reserveErrorSpace={false}
        value={state.text}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('text', event.target.value)
        }
      />

      <Listbox
        label="Text color:"
        options={toToneOptions(textColorOptions)}
        reserveErrorSpace={false}
        value={textColorOptions.includes(state.textColor) ? state.textColor : 'default'}
        onChange={(value) => onChange('textColor', value as ButtonTone)}
      />

      <Checkbox
        checked={state.withIcon}
        label="With icon"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withIcon', event.target.checked)
        }
      />

      {state.withIcon && (
        <>
          <Listbox
            label="Icon tone:"
            options={TONE_OPTIONS}
            reserveErrorSpace={false}
            value={state.iconTone}
            onChange={(value) => onChange('iconTone', value as ButtonTone)}
          />

          <Listbox
            label="Icon fill:"
            options={toToneOptions(iconFillOptions)}
            reserveErrorSpace={false}
            value={iconFillOptions.includes(state.iconFill) ? state.iconFill : 'default'}
            onChange={(value) => onChange('iconFill', value as ButtonTone)}
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

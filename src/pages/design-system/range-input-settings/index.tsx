import { type CSSProperties, type ChangeEvent } from 'react';

import {
  BUTTON_COLORED_TONES,
  type ButtonShape,
  type ButtonSizePreset,
  type ButtonTone,
} from '@ui/button/button.styles';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { type InputShape, type InputSizePreset } from '@ui/input/input.styles';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ListboxShape, type ListboxSizePreset } from '@ui/listbox/listbox.styles';
import { type RangeValue, type ResolvedRangeInputValidationMessages } from '@ui/range-input';
import { textSizePresets, type TextSizePreset } from '@ui/text/text.styles';

import { StyledSettingsForm } from '../design-system.styles';

export type RangeInputWidgetState = {
  buttonShape: ButtonShape;
  buttonSizePreset: ButtonSizePreset;
  buttonText: string;
  buttonTextColor: ButtonTone;
  buttonTone: ButtonTone;
  disabled: boolean;
  fromPlaceholder: string;
  inputShape: InputShape;
  inputSizePreset: InputSizePreset;
  label: string;
  placeholder: string;
  shape: ListboxShape;
  sizePreset: ListboxSizePreset;
  title: string;
  titleAlign: CSSProperties['textAlign'];
  titleSizePreset: TextSizePreset;
  toPlaceholder: string;
  validationMessages: ResolvedRangeInputValidationMessages;
  value: RangeValue;
  withClear: boolean;
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

const TITLE_ALIGN_OPTIONS: ListboxOption[] = [
  { label: 'start', value: 'start' },
  { label: 'center', value: 'center' },
  { label: 'end', value: 'end' },
];

const TITLE_SIZE_PRESET_OPTIONS: ListboxOption[] = (
  Object.keys(textSizePresets) as TextSizePreset[]
).map((preset) => ({ label: preset, value: preset }));

const TONE_OPTIONS: ListboxOption[] = [
  { label: 'default', value: 'default' },
  { label: 'primary', value: 'primary' },
  { label: 'success', value: 'success' },
  { label: 'warning', value: 'warning' },
  { label: 'danger', value: 'danger' },
];

function toToneOptions(tones: ButtonTone[]): ListboxOption[] {
  return tones.map((tone) => ({ label: tone, value: tone }));
}

/** Цвет текста нельзя задать равным заливке кнопки — иначе текст сольётся. */
function getTextColorOptions(tone: ButtonTone): ButtonTone[] {
  return ['default', ...BUTTON_COLORED_TONES.filter((value) => value !== tone)];
}

type RangeInputSettingsProps = {
  onChange: <K extends keyof RangeInputWidgetState>(
    key: K,
    value: RangeInputWidgetState[K]
  ) => void;
  state: RangeInputWidgetState;
};

export function RangeInputSettings({ onChange, state }: RangeInputSettingsProps) {
  const buttonTextColorOptions = getTextColorOptions(state.buttonTone);

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
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

      <Input
        label="Label:"
        reserveErrorSpace={false}
        value={state.label}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('label', event.target.value)
        }
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
        label="Title:"
        reserveErrorSpace={false}
        value={state.title}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('title', event.target.value)
        }
      />

      <Listbox
        label="Title align:"
        options={TITLE_ALIGN_OPTIONS}
        reserveErrorSpace={false}
        value={state.titleAlign ?? 'center'}
        onChange={(value) => onChange('titleAlign', value as CSSProperties['textAlign'])}
      />

      <Listbox
        label="Title size preset:"
        options={TITLE_SIZE_PRESET_OPTIONS}
        reserveErrorSpace={false}
        value={state.titleSizePreset}
        onChange={(value) => onChange('titleSizePreset', value as TextSizePreset)}
      />

      <Input
        label="From placeholder:"
        reserveErrorSpace={false}
        value={state.fromPlaceholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('fromPlaceholder', event.target.value)
        }
      />

      <Input
        label="To placeholder:"
        reserveErrorSpace={false}
        value={state.toPlaceholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('toPlaceholder', event.target.value)
        }
      />

      <Input
        label="Validation empty bounds:"
        reserveErrorSpace={false}
        value={state.validationMessages.emptyBounds}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('validationMessages', {
            ...state.validationMessages,
            emptyBounds: event.target.value,
          })
        }
      />

      <Input
        label="Validation invalid from:"
        reserveErrorSpace={false}
        value={state.validationMessages.invalidFrom}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('validationMessages', {
            ...state.validationMessages,
            invalidFrom: event.target.value,
          })
        }
      />

      <Input
        label="Validation invalid to:"
        reserveErrorSpace={false}
        value={state.validationMessages.invalidTo}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('validationMessages', {
            ...state.validationMessages,
            invalidTo: event.target.value,
          })
        }
      />

      <Listbox
        label="Input size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.inputSizePreset}
        onChange={(value) => onChange('inputSizePreset', value as InputSizePreset)}
      />

      <Listbox
        label="Input shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.inputShape}
        onChange={(value) => onChange('inputShape', value as InputShape)}
      />

      <Listbox
        label="Button size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.buttonSizePreset}
        onChange={(value) => onChange('buttonSizePreset', value as ButtonSizePreset)}
      />

      <Listbox
        label="Button shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.buttonShape}
        onChange={(value) => onChange('buttonShape', value as ButtonShape)}
      />

      <Listbox
        label="Button tone:"
        options={TONE_OPTIONS}
        reserveErrorSpace={false}
        value={state.buttonTone}
        onChange={(value) => onChange('buttonTone', value as ButtonTone)}
      />

      <Input
        label="Button text:"
        reserveErrorSpace={false}
        value={state.buttonText}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('buttonText', event.target.value)
        }
      />

      <Listbox
        label="Button text color:"
        options={toToneOptions(buttonTextColorOptions)}
        reserveErrorSpace={false}
        value={
          buttonTextColorOptions.includes(state.buttonTextColor)
            ? state.buttonTextColor
            : 'default'
        }
        onChange={(value) => onChange('buttonTextColor', value as ButtonTone)}
      />

      <Checkbox
        checked={state.withClear}
        label="Clear button"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withClear', event.target.checked)
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

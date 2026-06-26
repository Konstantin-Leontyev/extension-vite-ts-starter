import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset } from '@ui/presets';
import { type TagSizePreset } from '@ui/tag';
import {
  TONE_PRESET_OPTIONS,
  toTonePresetOptions,
  tonePresetsExcludingFill,
  type TonePreset,
} from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';

export type TagWidgetState = {
  borderColor: TonePreset;
  dot: boolean;
  dotColor: TonePreset;
  shape: ShapePreset;
  sizePreset: TagSizePreset;
  bordered: boolean;
  tinted: boolean;
  text: string;
  textColor: TonePreset;
  tone: TonePreset;
};

const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'thin', value: 'thin' },
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

const SHAPE_OPTIONS: ListboxOption[] = [
  { label: 'default', value: 'default' },
  { label: 'round', value: 'round' },
];

type TagSettingsProps = {
  onChange: <K extends keyof TagWidgetState>(key: K, value: TagWidgetState[K]) => void;
  state: TagWidgetState;
};

export function TagSettings({ onChange, state }: TagSettingsProps) {
  const textColorOptions = tonePresetsExcludingFill(state.tone);

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Listbox
        label="Size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.sizePreset}
        onChange={(value) => onChange('sizePreset', value as TagSizePreset)}
      />

      <Listbox
        label="Shape:"
        options={SHAPE_OPTIONS}
        reserveErrorSpace={false}
        value={state.shape}
        onChange={(value) => onChange('shape', value as ShapePreset)}
      />

      <Listbox
        label="Fill tone:"
        options={TONE_PRESET_OPTIONS}
        reserveErrorSpace={false}
        value={state.tone}
        onChange={(value) => onChange('tone', value as TonePreset)}
      />

      <Input
        label="Tag text:"
        reserveErrorSpace={false}
        value={state.text}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('text', event.target.value)
        }
      />

      <Listbox
        label="Text color:"
        options={toTonePresetOptions(textColorOptions)}
        reserveErrorSpace={false}
        value={textColorOptions.includes(state.textColor) ? state.textColor : 'default'}
        onChange={(value) => onChange('textColor', value as TonePreset)}
      />

      <Checkbox
        checked={state.tinted}
        label="Tinted"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('tinted', event.target.checked)
        }
      />

      <Checkbox
        checked={state.bordered}
        label="Border"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('bordered', event.target.checked)
        }
      />

      {state.bordered && (
        <Listbox
          label="Border color:"
          options={TONE_PRESET_OPTIONS}
          reserveErrorSpace={false}
          value={state.borderColor}
          onChange={(value) => onChange('borderColor', value as TonePreset)}
        />
      )}

      <Checkbox
        checked={state.dot}
        label="Dot"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('dot', event.target.checked)
        }
      />

      {state.dot && (
        <Listbox
          label="Dot color:"
          options={TONE_PRESET_OPTIONS}
          reserveErrorSpace={false}
          value={state.dotColor}
          onChange={(value) => onChange('dotColor', value as TonePreset)}
        />
      )}
    </StyledSettingsForm>
  );
}

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import {
  SEGMENT_TEXT_COLOR_OPTIONS,
  type SegmentTextColor,
} from '@ui/segment-button';

import { StyledSettingsForm } from '../design-system.styles';

export type SegmentButtonWidgetState = {
  centerDisabled: boolean;
  centerText: string;
  centerTextColor: SegmentTextColor;
  leftDisabled: boolean;
  leftText: string;
  leftTextColor: SegmentTextColor;
  rightDisabled: boolean;
  rightText: string;
  rightTextColor: SegmentTextColor;
  segmentCount: '2' | '3';
  shape: ShapePreset;
  sizePreset: SizePreset;
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

const SEGMENT_COUNT_OPTIONS: ListboxOption[] = [
  { label: '2', value: '2' },
  { label: '3', value: '3' },
];

type SegmentButtonSettingsProps = {
  onChange: <K extends keyof SegmentButtonWidgetState>(
    key: K,
    value: SegmentButtonWidgetState[K]
  ) => void;
  state: SegmentButtonWidgetState;
};

export function SegmentButtonSettings({ onChange, state }: SegmentButtonSettingsProps) {
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
        label="Segments:"
        options={SEGMENT_COUNT_OPTIONS}
        reserveErrorSpace={false}
        value={state.segmentCount}
        onChange={(value) =>
          onChange('segmentCount', value as SegmentButtonWidgetState['segmentCount'])
        }
      />

      <Input
        label="Left button text:"
        reserveErrorSpace={false}
        value={state.leftText}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('leftText', event.target.value)
        }
      />

      <Listbox
        label="Left button text color:"
        options={SEGMENT_TEXT_COLOR_OPTIONS}
        reserveErrorSpace={false}
        value={state.leftTextColor}
        onChange={(value) => onChange('leftTextColor', value as SegmentTextColor)}
      />

      <Checkbox
        checked={state.leftDisabled}
        label="Left button disabled"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('leftDisabled', event.target.checked)
        }
      />

      {state.segmentCount === '3' && (
        <>
          <Input
            label="Center button text:"
            reserveErrorSpace={false}
            value={state.centerText}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange('centerText', event.target.value)
            }
          />

          <Listbox
            label="Center button text color:"
            options={SEGMENT_TEXT_COLOR_OPTIONS}
            reserveErrorSpace={false}
            value={state.centerTextColor}
            onChange={(value) => onChange('centerTextColor', value as SegmentTextColor)}
          />

          <Checkbox
            checked={state.centerDisabled}
            label="Center button disabled"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange('centerDisabled', event.target.checked)
            }
          />
        </>
      )}

      <Input
        label="Right button text:"
        reserveErrorSpace={false}
        value={state.rightText}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('rightText', event.target.value)
        }
      />

      <Listbox
        label="Right button text color:"
        options={SEGMENT_TEXT_COLOR_OPTIONS}
        reserveErrorSpace={false}
        value={state.rightTextColor}
        onChange={(value) => onChange('rightTextColor', value as SegmentTextColor)}
      />

      <Checkbox
        checked={state.rightDisabled}
        label="Right button disabled"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('rightDisabled', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

/**
 * Файл: `src/pages/design-system/radio-button-settings/index.tsx`
 * Определяет панель настроек компонента RadioButton в витрине дизайн-системы.
 * Содержит контролы для изменения размера, подписей, выбора варианта и режима `bare` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `RadioButtonWidgetState`
 * 2. Экспортировать компонент `RadioButtonSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета переключателя
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { getRadioButtonTextSize } from '@ui/radio-button';
import {
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';

import { StyledSettingsForm } from '../design-system.styles';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * RadioButtonWidgetState — представляет состояние настроек компонента RadioButton в витрине дизайн-системы.
 * Часть ключей задаёт общие пропсы обоих переключателей в демо, остальные — отдельные параметры вариантов A и B.
 * Используется для синхронизации значений между панелью управления и демонстрационной парой переключателей.
 *
 * @property bare — включает режим без обёртки и подписи
 * @property disabledA — включает disabled для варианта A
 * @property disabledB — включает disabled для варианта B
 * @property labelA — подпись варианта A
 * @property labelB — подпись варианта B
 * @property selected — активный вариант в группе
 * @property sizePreset — размер переключателя
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 */
export type RadioButtonWidgetState = {
  bare: boolean;
  disabledA: boolean;
  disabledB: boolean;
  labelA: string;
  labelB: string;
  selected: 'a' | 'b';
  sizePreset: SizePreset;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTone;
};

/**
 * SELECTED_OPTIONS — хранит опции Listbox для выбора активного переключателя.
 * Используется в панели настроек для поля Selected.
 */
const SELECTED_OPTIONS: ListboxOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
];

/**
 * RadioButtonSettingsProps — представляет пропсы компонента RadioButtonSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек переключателя
 */
type RadioButtonSettingsProps = {
  onChange: <K extends keyof RadioButtonWidgetState>(
    key: K,
    value: RadioButtonWidgetState[K]
  ) => void;
  state: RadioButtonWidgetState;
};

/**
 * RadioButtonSettings — отображает панель настроек RadioButton в витрине дизайн-системы.
 *
 * @example
 * <RadioButtonSettings state={radioButton} onChange={updateRadioButton} />
 */
export function RadioButtonSettings({ onChange, state }: RadioButtonSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getRadioButtonTextSize(size));
        }}
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

      <Input
        disabled={state.bare}
        label="Text A:"
        reserveErrorSpace={false}
        value={state.labelA}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('labelA', event.target.value)
        }
      />

      <Input
        disabled={state.bare}
        label="Text B:"
        reserveErrorSpace={false}
        value={state.labelB}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('labelB', event.target.value)
        }
      />

      <SizeListbox
        label="Text size:"
        sizes={TEXT_SIZE_PRESET_KEYS}
        value={state.textSize}
        onChange={(size) => onChange('textSize', size)}
      />

      <ToneListbox
        label="Text tone:"
        tones={TEXT_TONE_KEYS}
        value={state.textTone}
        onChange={(tone) => onChange('textTone', tone)}
      />

      <Checkbox
        checked={state.textItalic}
        label="Show italic"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('textItalic', event.target.checked)
        }
      />

      <Checkbox
        checked={state.bare}
        label="Show bare"
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

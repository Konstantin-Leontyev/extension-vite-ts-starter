/**
 * Файл: `src/pages/showcase/radio-button-settings/index.tsx`
 * Определяет панель настроек компонента RadioButton в витрине дизайн-системы.
 * Содержит контролы для изменения размера, выбора варианта, подписей и состояний
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `RadioButtonWidgetState`
 * 2. Экспортировать компонент `RadioButtonSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета переключателя
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * RadioButtonWidgetState — представляет состояние настроек компонента RadioButton в витрине дизайн-системы.
 * Часть ключей задаёт общие пропсы обоих переключателей в демо, остальные — отдельные параметры вариантов A и B.
 * Витринные ключи: `textA` и `textB` хранят содержимое `children` вариантов.
 * Используется для синхронизации значений между панелью управления и демонстрационной парой переключателей.
 *
 * @property disabledA — включает недоступное состояние варианта A
 * @property disabledB — включает недоступное состояние варианта B
 * @property selected — активный вариант в группе
 * @property size — размер переключателя
 * @property textA — подпись варианта A
 * @property textB — подпись варианта B
 */
export type RadioButtonWidgetState = {
  disabledA: boolean;
  disabledB: boolean;
  selected: 'a' | 'b';
  size: SizePreset;
  textA: string;
  textB: string;
};

/**
 * SELECTED_OPTIONS — задаёт опции листбокса активного переключателя.
 * Используется в `Listbox` поля Selected внутри RadioButtonSettings.
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
        value={state.size}
        onChange={(size) => onChange('size', size)}
      />

      <Listbox
        label="Selected:"
        options={SELECTED_OPTIONS}
        value={state.selected}
        onChange={(value) =>
          onChange('selected', value as RadioButtonWidgetState['selected'])
        }
      />

      <TextGroup
        contents={[
          {
            label: 'Text A:',
            value: state.textA,
            onChange: (value) => onChange('textA', value),
          },
          {
            label: 'Text B:',
            value: state.textB,
            onChange: (value) => onChange('textB', value),
          },
        ]}
        labelPrefix="Text"
        set
      />

      <Checkbox
        checked={state.disabledA}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabledA', event.target.checked)
        }
      >
        Disable A
      </Checkbox>

      <Checkbox
        checked={state.disabledB}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabledB', event.target.checked)
        }
      >
        Disable B
      </Checkbox>
    </StyledSettingsForm>
  );
}

/**
 * Файл: `src/pages/showcase/stepper-settings/index.tsx`
 * Определяет панель настроек компонента Stepper в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, границ, шага, суффикса,
 * значения, его текстовых настроек и недоступного состояния в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `StepperWidgetState`
 * 2. Экспортировать компонент `StepperSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета счётчика
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { Stepper, getStepperTextSize } from '@ui/stepper';
import {
  Text,
  type TextAlignPreset,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';

import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsField, StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * STEP_FIELD_ID — задаёт id поля шага в панели настроек.
 * Связывает подпись `Step:` с контролом Stepper через `htmlFor` и `id`.
 */
const STEP_FIELD_ID = 'showcase-stepper-step';

/**
 * STEP_LABEL_ID — задаёт id подписи поля шага в панели настроек.
 * Передаётся в `aria-labelledby` у Stepper как доступное имя.
 */
const STEP_LABEL_ID = 'showcase-stepper-step-label';

/**
 * StepperWidgetState — представляет состояние настроек компонента Stepper в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Stepper.
 * Используется для синхронизации значений между панелью управления и демонстрационным счётчиком.
 *
 * @property disabled — включает недоступное состояние
 * @property max — верхняя граница значения
 * @property min — нижняя граница значения
 * @property shape — форма поля
 * @property sizePreset — размер компонента
 * @property step — шаг изменения значения
 * @property suffix — подпись единицы внутри поля
 * @property textAlign — горизонтальное выравнивание пары «значение + суффикс»
 * @property textItalic — включает курсив значения и суффикса
 * @property textSize — размер значения и суффикса
 * @property textTone — тон значения и суффикса
 * @property value — числовое значение счётчика
 */
export type StepperWidgetState = {
  disabled: boolean;
  max?: number;
  min?: number;
  shape: ShapePreset;
  sizePreset: SizePreset;
  step: number;
  suffix: string;
  textAlign?: TextAlignPreset;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone?: TextTone;
  value: number;
};

/**
 * StepperSettingsProps — представляет пропсы компонента StepperSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек счётчика
 */
type StepperSettingsProps = {
  onChange: <K extends keyof StepperWidgetState>(
    key: K,
    value: StepperWidgetState[K]
  ) => void;
  state: StepperWidgetState;
};

/**
 * StepperSettings — отображает панель настроек Stepper в витрине дизайн-системы.
 *
 * @example
 * <StepperSettings state={stepper} onChange={updateStepper} />
 */
export function StepperSettings({ onChange, state }: StepperSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getStepperTextSize(size));
        }}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <Input
        inputMode="numeric"
        label="Min:"
        reserveErrorSpace={false}
        value={state.min === undefined ? '' : String(state.min)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const parsed = Number(event.target.value);

          if (event.target.value.trim() === '') {
            onChange('min', undefined);
          } else if (Number.isFinite(parsed)) {
            onChange('min', parsed);
          }
        }}
      />

      <Input
        inputMode="numeric"
        label="Max:"
        reserveErrorSpace={false}
        value={state.max === undefined ? '' : String(state.max)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const parsed = Number(event.target.value);

          if (event.target.value.trim() === '') {
            onChange('max', undefined);
          } else if (Number.isFinite(parsed)) {
            onChange('max', parsed);
          }
        }}
      />

      <StyledSettingsField>
        <Text
          as="label"
          htmlFor={STEP_FIELD_ID}
          id={STEP_LABEL_ID}
          sizePreset="normal"
          tone="muted"
        >
          Step:
        </Text>
        <Stepper
          aria-labelledby={STEP_LABEL_ID}
          id={STEP_FIELD_ID}
          min={1}
          textAlign="center"
          value={state.step}
          onChange={(value) => onChange('step', value)}
        />
      </StyledSettingsField>

      <Input
        label="Suffix:"
        reserveErrorSpace={false}
        value={state.suffix}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('suffix', event.target.value)
        }
      />

      <TextGroup
        align={state.textAlign}
        contents={[
          {
            value: String(state.value),
            onChange: (nextValue) => {
              const parsed = Number(nextValue);

              if (nextValue.trim() !== '' && Number.isFinite(parsed)) {
                onChange('value', parsed);
              }
            },
          },
        ]}
        italic={state.textItalic}
        labelPrefix="Value"
        size={state.textSize}
        tones={[
          {
            value: state.textTone,
            onChange: (tone) => onChange('textTone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('textAlign', align)}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
      />

      <Checkbox
        checked={state.disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabled', event.target.checked)
        }
      >
        Disabled
      </Checkbox>
    </StyledSettingsForm>
  );
}

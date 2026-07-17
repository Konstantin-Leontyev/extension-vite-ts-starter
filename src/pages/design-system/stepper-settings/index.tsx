/**
 * Файл: `src/pages/design-system/stepper-settings/index.tsx`
 * Определяет панель настроек компонента Stepper в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, границ, шага, суффикса,
 * значения, его выравнивания и недоступного состояния в реальном времени.
 * Границы, шаг и суффикс — параметры счётчика; значение — контент нативного
 * поля, поэтому его инпут и выравнивание идут после параметров, на месте
 * текстовой группы.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `StepperWidgetState`
 * 2. Экспортировать компонент `StepperSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета счётчика
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
import { Stepper } from '@ui/stepper';
import { TEXT_ALIGN_PRESET_KEYS, Text, type TextAlignPreset } from '@ui/text';

import { AlignListbox } from '../align-listbox';
import { StyledSettingsField, StyledSettingsForm } from '../design-system.styles';
import { ShapeListbox } from '../shape-listbox';
import { SizeListbox } from '../size-listbox';

/**
 * STEP_FIELD_ID — задаёт id поля шага в панели настроек.
 * Связывает подпись `Step:` с контролом Stepper через `htmlFor` и `id`.
 */
const STEP_FIELD_ID = 'design-system-stepper-step';

/**
 * STEP_LABEL_ID — задаёт id подписи поля шага в панели настроек.
 * Передаётся в `aria-labelledby` у Stepper как доступное имя.
 */
const STEP_LABEL_ID = 'design-system-stepper-step-label';

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
 * @property value — числовое значение счётчика
 * @property valueAlign — горизонтальное выравнивание значения
 */
export type StepperWidgetState = {
  disabled: boolean;
  max?: number;
  min?: number;
  shape: ShapePreset;
  sizePreset: SizePreset;
  step: number;
  suffix: string;
  value: number;
  valueAlign?: TextAlignPreset;
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
 * <StepperSettings state={stepperState} onChange={updateStepper} />
 */
export function StepperSettings({ onChange, state }: StepperSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => onChange('sizePreset', size)}
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
          sizePreset="medium"
          tone="muted"
        >
          Step:
        </Text>
        <Stepper
          aria-labelledby={STEP_LABEL_ID}
          id={STEP_FIELD_ID}
          min={1}
          sizePreset="medium"
          value={state.step}
          valueAlign="center"
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

      <Input
        inputMode="numeric"
        label="Value:"
        reserveErrorSpace={false}
        value={String(state.value)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const parsed = Number(event.target.value);

          if (event.target.value.trim() !== '' && Number.isFinite(parsed)) {
            onChange('value', parsed);
          }
        }}
      />

      <AlignListbox
        aligns={TEXT_ALIGN_PRESET_KEYS}
        label="Value align:"
        value={state.valueAlign}
        onChange={(align) => onChange('valueAlign', align)}
      />

      <Checkbox
        checked={state.disabled}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabled', event.target.checked)
        }
      >
        Disabled
      </Checkbox>
    </StyledSettingsForm>
  );
}

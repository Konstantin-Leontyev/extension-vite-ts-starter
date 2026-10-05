/**
 * Файл: `src/pages/showcase/stepper-settings/index.tsx`
 * Определяет панель настроек компонента Stepper в витрине дизайн-системы.
 * Содержит контролы для изменения подписи, размера, формы, минимума, максимума, шага,
 * суффикса и недоступного состояния в реальном времени.
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
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { Stepper } from '@ui/stepper';

import { ControlGroup } from '../control-group';
import { StyledSettingsForm } from '../showcase.styles';

/**
 * StepperWidgetState — представляет состояние настроек компонента Stepper в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Stepper.
 * Используется для синхронизации значений между панелью управления и демонстрационным счётчиком.
 *
 * @property disabled — включает недоступное состояние
 * @property label — подпись над полем
 * @property max — верхняя граница значения
 * @property min — нижняя граница значения
 * @property shape — форма поля
 * @property size — размер компонента
 * @property step — шаг изменения значения
 * @property suffix — подпись единицы внутри поля
 * @property value — числовое значение счётчика
 */
export type StepperWidgetState = {
  disabled: boolean;
  label: string;
  max?: number;
  min?: number;
  shape: ShapePreset;
  size: SizePreset;
  step: number;
  suffix: string;
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
  /**
   * handleOptionalBoundChange — записывает границу Min или Max из ввода поля.
   * Пустая строка снимает границу. Нечисловой ввод границу не меняет.
   *
   * @param key ключ границы в состоянии витрины
   * @param event событие поля ввода
   */
  function handleOptionalBoundChange(
    key: 'max' | 'min',
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const rawValue = event.target.value;
    const parsed = Number(rawValue);

    if (rawValue.trim() === '') {
      onChange(key, undefined);
      return;
    }

    if (Number.isFinite(parsed)) {
      onChange(key, parsed);
    }
  }

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ControlGroup
        label={state.label}
        shape={state.shape}
        size={state.size}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => onChange('shape', shape)}
        onSizeChange={(size) => onChange('size', size)}
      />

      <Input
        label="Suffix:"
        value={state.suffix}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('suffix', event.target.value)
        }
        onClear={() => onChange('suffix', '')}
      />

      <Input
        inputMode="numeric"
        label="Min:"
        value={state.min === undefined ? '' : String(state.min)}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleOptionalBoundChange('min', event)
        }
        onClear={() => onChange('min', undefined)}
      />

      <Input
        inputMode="numeric"
        label="Max:"
        value={state.max === undefined ? '' : String(state.max)}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleOptionalBoundChange('max', event)
        }
        onClear={() => onChange('max', undefined)}
      />

      <Stepper
        label="Step:"
        min={1}
        value={state.step}
        onChange={(value) => onChange('step', value)}
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

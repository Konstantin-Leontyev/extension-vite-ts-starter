/**
 * Файл: `src/pages/showcase/input-settings/index.tsx`
 * Определяет панель настроек компонента Input в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, подписи, плейсхолдера,
 * кнопки сброса, ошибки и состояний в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `InputWidgetState`
 * 2. Экспортировать компонент `InputSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Input
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ControlGroup } from '../control-group';
import { FieldErrorGroup } from '../field-error-group';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * InputWidgetState — представляет состояние настроек компонента Input в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Input.
 * Используется для синхронизации значений между панелью управления и демонстрационным Input.
 *
 * @property borderTone — тон рамки
 * @property disabled — включает недоступное состояние поля
 * @property error — текст ошибки под полем
 * @property errorPlaceholder — подсказка в зарезервированной полоске, пока нет ошибки.
 *   Задаётся только при включённом `reserveErrorSpace`
 * @property invalid — включает обводку ошибки без текста, если проп `error` не передан
 * @property label — подпись над полем
 * @property placeholder — плейсхолдер значения
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки. Опционален:
 *   дефолт компонента не хранится в стейте
 * @property shape — форма строки-поля
 * @property showBorder — включает рамку контрола
 * @property showClearButton — включает кнопку сброса
 * @property showShadow — включает тень при включённой рамке
 * @property size — размер контрола
 * @property value — значение поля
 */
export type InputWidgetState = {
  borderTone: TonePreset;
  disabled: boolean;
  error: string;
  errorPlaceholder?: string;
  invalid: boolean;
  label: string;
  placeholder: string;
  reserveErrorSpace?: boolean;
  shape: ShapePreset;
  showBorder: boolean;
  showClearButton: boolean;
  showShadow: boolean;
  size: SizePreset;
  value: string;
};

/**
 * InputSettingsProps — представляет пропсы компонента InputSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек Input
 */
type InputSettingsProps = {
  onChange: <K extends keyof InputWidgetState>(
    key: K,
    value: InputWidgetState[K]
  ) => void;
  state: InputWidgetState;
};

/**
 * InputSettings — отображает панель настроек Input в витрине дизайн-системы.
 *
 * @example
 * <InputSettings state={input} onChange={updateInput} />
 */
export function InputSettings({ onChange, state }: InputSettingsProps) {
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

      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <TextGroup
        contents={[
          {
            value: state.placeholder,
            onChange: (value) => onChange('placeholder', value),
          },
        ]}
        labelPrefix="Placeholder"
      />

      <Checkbox
        checked={state.showClearButton}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showClearButton', event.target.checked)
        }
      >
        Show clear button
      </Checkbox>

      <FieldErrorGroup
        errorPlaceholder={state.errorPlaceholder}
        reserveErrorSpace={state.reserveErrorSpace}
        onErrorPlaceholderChange={(value) => onChange('errorPlaceholder', value)}
        onReserveErrorSpaceChange={(reserve) => onChange('reserveErrorSpace', reserve)}
      />

      <Checkbox
        checked={state.invalid}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const checked = event.target.checked;
          onChange('invalid', checked);

          if (!checked) {
            onChange('error', '');
          }
        }}
      >
        Invalid
      </Checkbox>

      {state.invalid && (
        <TextGroup
          contents={[
            {
              value: state.error,
              onChange: (value) => onChange('error', value),
            },
          ]}
          labelPrefix="Error"
        />
      )}

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

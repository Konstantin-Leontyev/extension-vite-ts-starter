/**
 * Файл: `src/pages/showcase/range-input-settings/index.tsx`
 * Определяет панель настроек компонента RangeInput в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, иконки, подписи, плейсхолдеров,
 * заголовка, полей `from` и `to`, кнопки применения, текстов валидации и состояний
 * `withClear`, `reserveErrorSpace` и `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `RangeInputWidgetState`
 * 2. Экспортировать компонент `RangeInputSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета RangeInput
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type IconPosition } from '@ui/icon';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import {
  DEFAULT_RANGE_INPUT_FROM_PLACEHOLDER,
  DEFAULT_RANGE_INPUT_PLACEHOLDER,
  DEFAULT_RANGE_INPUT_TO_PLACEHOLDER,
  DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES,
  type RangeValue,
  type ResolvedRangeInputValidationMessages,
} from '@ui/range-input';
import {
  type TextAlignPreset,
  type TextSizePreset,
  type TextTonePreset,
} from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ControlGroup } from '../control-group';
import { FieldErrorGroup } from '../field-error-group';
import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * RangeInputWidgetState — представляет состояние настроек компонента RangeInput в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента RangeInput, кроме витринных ключей: `withClear`
 * управляет передачей `onClear` в превью.
 * Пустая строка заголовка означает вызов без пропа. Отметка `Set*`
 * живёт внутри TextGroup.
 * Используется для синхронизации значений между панелью управления и демонстрационным RangeInput.
 *
 * @property buttonShape — форма кнопки применения. Стартует с формы контрола
 * @property buttonSize — размер кнопки применения. Стартует с размера контрола
 * @property buttonText — текст кнопки применения
 * @property buttonTextTone — тон лейбла кнопки применения
 * @property buttonTone — семантический тон кнопки применения
 * @property disabled — включает недоступное состояние
 * @property errorPlaceholder — подсказка в зарезервированной полоске панели, пока нет ошибки.
 *   Задаётся только при включённом `reserveErrorSpace`
 * @property fromPlaceholder — плейсхолдер поля `from`
 * @property iconFill — тон глифа шеврона и кнопки сброса
 * @property iconPosition — позиция шеврона и кнопки сброса относительно значения
 * @property iconTone — тон секции шеврона и кнопки сброса
 * @property inputShape — форма полей `from` и `to`. Стартует с формы контрола
 * @property inputSize — размер полей `from` и `to`. Стартует с размера контрола
 * @property label — подпись над триггером
 * @property placeholder — плейсхолдер неактивного триггера
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property shape — форма поверхности
 * @property size — размер компонента
 * @property title — заголовок панели
 * @property titleAlign — выравнивание заголовка панели
 * @property titleItalic — включает курсив заголовка панели
 * @property titleSize — размер заголовка панели
 * @property titleTone — тон заголовка панели
 * @property toPlaceholder — плейсхолдер поля `to`
 * @property validationMessages — тексты встроенной валидации
 * @property value — буфер выбранного диапазона в превью. В панель не выносится
 * @property withClear — витринный ключ показа сброса. Выключенный — превью без `onClear`
 */
export type RangeInputWidgetState = {
  buttonShape: ShapePreset;
  buttonSize: SizePreset;
  buttonText: string;
  buttonTextTone: TextTonePreset;
  buttonTone: TonePreset;
  disabled: boolean;
  errorPlaceholder?: string;
  fromPlaceholder: string;
  iconFill: TonePreset;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  inputShape: ShapePreset;
  inputSize: SizePreset;
  label: string;
  placeholder: string;
  reserveErrorSpace: boolean;
  shape: ShapePreset;
  size: SizePreset;
  title: string;
  titleAlign: TextAlignPreset;
  titleItalic: boolean;
  titleSize: TextSizePreset;
  titleTone: TextTonePreset;
  toPlaceholder: string;
  validationMessages: ResolvedRangeInputValidationMessages;
  value: RangeValue;
  withClear: boolean;
};

/**
 * RangeInputSettingsProps — представляет пропсы компонента RangeInputSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек RangeInput
 */
type RangeInputSettingsProps = {
  onChange: <K extends keyof RangeInputWidgetState>(
    key: K,
    value: RangeInputWidgetState[K]
  ) => void;
  state: RangeInputWidgetState;
};

/**
 * RangeInputSettings — отображает панель настроек RangeInput в витрине дизайн-системы.
 *
 * @example
 * <RangeInputSettings state={rangeInput} onChange={updateRangeInput} />
 */
export function RangeInputSettings({ onChange, state }: RangeInputSettingsProps) {
  /**
   * handleValidationMessageChange — записывает один текст валидации в состояние витрины.
   *
   * @param key ключ текста валидации
   * @param value введённый текст
   */
  function handleValidationMessageChange(
    key: keyof ResolvedRangeInputValidationMessages,
    value: string
  ): void {
    onChange('validationMessages', {
      ...state.validationMessages,
      [key]: value,
    });
  }

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ControlGroup
        label={state.label}
        shape={state.shape}
        size={state.size}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => {
          onChange('shape', shape);
          onChange('inputShape', shape);
          onChange('buttonShape', shape);
        }}
        onSizeChange={(size) => {
          onChange('size', size);
          onChange('inputSize', size);
          onChange('buttonSize', size);
        }}
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RANGE_INPUT_PLACEHOLDER,
            value: state.placeholder,
            onChange: (value) => onChange('placeholder', value),
          },
        ]}
        labelPrefix="Placeholder"
      />

      <IconGroup
        fill={state.iconFill}
        labelPrefix="Icon"
        position={state.iconPosition}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onPositionChange={(position) => onChange('iconPosition', position)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <Checkbox
        checked={state.withClear}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withClear', event.target.checked)
        }
      >
        Show clear
      </Checkbox>

      <TextGroup
        align={state.titleAlign}
        contents={[
          {
            value: state.title,
            onChange: (value) => onChange('title', value),
          },
        ]}
        italic={state.titleItalic}
        labelPrefix="Title"
        size={state.titleSize}
        tones={[
          {
            value: state.titleTone,
            onChange: (tone) => onChange('titleTone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onItalicChange={(value) => onChange('titleItalic', value)}
        onSizeChange={(size) => onChange('titleSize', size)}
      />

      <SizeListbox
        label="Input size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.inputSize}
        onChange={(size) => onChange('inputSize', size)}
      />

      <ShapeListbox
        label="Input shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.inputShape}
        onChange={(shape) => onChange('inputShape', shape)}
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RANGE_INPUT_FROM_PLACEHOLDER,
            value: state.fromPlaceholder,
            onChange: (value) => onChange('fromPlaceholder', value),
          },
        ]}
        labelPrefix="From placeholder"
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RANGE_INPUT_TO_PLACEHOLDER,
            value: state.toPlaceholder,
            onChange: (value) => onChange('toPlaceholder', value),
          },
        ]}
        labelPrefix="To placeholder"
      />

      <FieldErrorGroup
        errorPlaceholder={state.errorPlaceholder}
        reserveErrorSpace={state.reserveErrorSpace}
        onErrorPlaceholderChange={(value) => onChange('errorPlaceholder', value)}
        onReserveErrorSpaceChange={(reserve) =>
          onChange('reserveErrorSpace', reserve === true)
        }
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES.emptyBounds,
            value: state.validationMessages.emptyBounds,
            onChange: (value) => handleValidationMessageChange('emptyBounds', value),
          },
        ]}
        labelPrefix="Validation empty bounds"
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES.invalidFrom,
            value: state.validationMessages.invalidFrom,
            onChange: (value) => handleValidationMessageChange('invalidFrom', value),
          },
        ]}
        labelPrefix="From validation error"
      />

      <TextGroup
        contents={[
          {
            boxedString: DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES.invalidTo,
            value: state.validationMessages.invalidTo,
            onChange: (value) => handleValidationMessageChange('invalidTo', value),
          },
        ]}
        labelPrefix="To validation error"
      />

      <SizeListbox
        label="Button size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.buttonSize}
        onChange={(size) => onChange('buttonSize', size)}
      />

      <ShapeListbox
        label="Button shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.buttonShape}
        onChange={(shape) => onChange('buttonShape', shape)}
      />

      <ToneListbox
        label="Button tone:"
        tones={TONE_PRESET_KEYS}
        value={state.buttonTone}
        onChange={(tone) => onChange('buttonTone', tone)}
      />

      <TextGroup
        contents={[
          {
            value: state.buttonText,
            onChange: (value) => onChange('buttonText', value),
          },
        ]}
        labelPrefix="Button text"
        tones={[
          {
            value: state.buttonTextTone,
            onChange: (tone) => onChange('buttonTextTone', tone),
          },
        ]}
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

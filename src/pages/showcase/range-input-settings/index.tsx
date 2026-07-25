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
import { Input } from '@ui/input';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import {
  type RangeValue,
  type ResolvedRangeInputValidationMessages,
} from '@ui/range-input';
import { type TextAlignPreset, type TextSizePreset, type TextTone } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TitleGroup } from '../title-group';
import { ToneListbox } from '../tone-listbox';

/**
 * RangeInputWidgetState — представляет состояние настроек компонента RangeInput в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента RangeInput, кроме витринных ключей: `withClear`
 * управляет передачей `onClear` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным RangeInput.
 *
 * @property buttonShape — форма кнопки применения
 * @property buttonSizePreset — размер кнопки применения
 * @property buttonText — текст кнопки применения
 * @property buttonTextTone — тон лейбла кнопки применения
 * @property buttonTone — семантический тон кнопки применения
 * @property disabled — включает недоступное состояние
 * @property fromPlaceholder — плейсхолдер поля `from`
 * @property iconFill — тон глифа шеврона и кнопки сброса
 * @property iconPosition — позиция шеврона и кнопки сброса относительно значения
 * @property iconTone — тон секции шеврона и кнопки сброса
 * @property inputShape — форма полей `from` и `to`
 * @property inputSizePreset — размер полей `from` и `to`
 * @property label — подпись над триггером
 * @property placeholder — плейсхолдер неактивного триггера
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 * @property title — заголовок панели
 * @property titleAlign — выравнивание заголовка панели
 * @property titleSizePreset — размер заголовка панели
 * @property titleTone — тон заголовка панели
 * @property toPlaceholder — плейсхолдер поля `to`
 * @property validationMessages — тексты встроенной валидации
 * @property value — значение диапазона в превью
 * @property withClear — витринный ключ показа сброса. Выключенный — превью без `onClear`
 */
export type RangeInputWidgetState = {
  buttonShape: ShapePreset;
  buttonSizePreset: SizePreset;
  buttonText: string;
  buttonTextTone: TonePreset;
  buttonTone: TonePreset;
  disabled: boolean;
  fromPlaceholder: string;
  iconFill: TonePreset;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  inputShape: ShapePreset;
  inputSizePreset: SizePreset;
  label: string;
  placeholder: string;
  reserveErrorSpace: boolean;
  shape: ShapePreset;
  sizePreset: SizePreset;
  title: string;
  titleAlign: TextAlignPreset;
  titleSizePreset: TextSizePreset;
  titleTone: TextTone;
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
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ControlGroup
        label={state.label}
        shape={state.shape}
        sizePreset={state.sizePreset}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => onChange('shape', shape)}
        onSizeChange={(size) => onChange('sizePreset', size)}
      />

      <Checkbox
        checked={state.withClear}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withClear', event.target.checked)
        }
      >
        Show clear icon
      </Checkbox>

      <IconGroup
        fill={state.iconFill}
        position={{
          value: state.iconPosition,
          onChange: (position) => onChange('iconPosition', position),
        }}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <Input
        label="Placeholder:"
        reserveErrorSpace={false}
        value={state.placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('placeholder', event.target.value)
        }
      />

      <TitleGroup
        align={state.titleAlign}
        labelPrefix="Title"
        size={state.titleSizePreset}
        title={state.title}
        tone={state.titleTone}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onSizeChange={(size) => onChange('titleSizePreset', size)}
        onTitleChange={(title) => onChange('title', title)}
        onToneChange={(tone) => onChange('titleTone', tone)}
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

      <SizeListbox
        label="Input size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.inputSizePreset}
        onChange={(size) => onChange('inputSizePreset', size)}
      />

      <ShapeListbox
        label="Input shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.inputShape}
        onChange={(shape) => onChange('inputShape', shape)}
      />

      <SizeListbox
        label="Button size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.buttonSizePreset}
        onChange={(size) => onChange('buttonSizePreset', size)}
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

      <Input
        label="Button text:"
        reserveErrorSpace={false}
        value={state.buttonText}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('buttonText', event.target.value)
        }
      />

      <ToneListbox
        excludeTone={state.buttonTone}
        label="Button text tone:"
        tones={TONE_PRESET_KEYS}
        value={state.buttonTextTone}
        onChange={(tone) => onChange('buttonTextTone', tone)}
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

      <Checkbox
        checked={state.reserveErrorSpace}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('reserveErrorSpace', event.target.checked)
        }
      >
        Reserve error space
      </Checkbox>

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

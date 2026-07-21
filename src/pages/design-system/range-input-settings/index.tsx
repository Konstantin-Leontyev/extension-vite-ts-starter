/**
 * Файл: `src/pages/design-system/range-input-settings/index.tsx`
 * Определяет панель настроек компонента RangeInput в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, иконки, подписи, плейсхолдеров,
 * заголовка, полей from и to, кнопки применения, текстов валидации и состояний
 * `withClear` и `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `RangeInputWidgetState`
 * 2. Экспортировать компонент `RangeInputSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета RangeInput
 */

import { type CSSProperties, type ChangeEvent } from 'react';

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
import {
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  type TextSizePreset,
} from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { AlignListbox } from '../align-listbox';
import { StyledSettingsForm } from '../design-system.styles';
import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import { SizeListbox } from '../size-listbox';
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
 * @property fromPlaceholder — плейсхолдер поля from
 * @property iconFill — тон глифа шеврона и кнопки сброса
 * @property iconPosition — позиция шеврона и кнопки сброса относительно значения
 * @property iconTone — тон секции шеврона и кнопки сброса
 * @property inputShape — форма полей from и to
 * @property inputSizePreset — размер полей from и to
 * @property label — подпись над триггером
 * @property placeholder — плейсхолдер неактивного триггера
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 * @property title — заголовок панели
 * @property titleAlign — выравнивание заголовка панели
 * @property titleSizePreset — размер заголовка панели
 * @property toPlaceholder — плейсхолдер поля to
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
  shape: ShapePreset;
  sizePreset: SizePreset;
  title: string;
  titleAlign: CSSProperties['textAlign'];
  titleSizePreset: TextSizePreset;
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

      <Checkbox
        checked={state.withClear}
        sizePreset="medium"
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
        label="Label:"
        reserveErrorSpace={false}
        value={state.label}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('label', event.target.value)
        }
      />

      <Input
        label="Placeholder:"
        reserveErrorSpace={false}
        value={state.placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('placeholder', event.target.value)
        }
      />

      <Input
        label="Title:"
        reserveErrorSpace={false}
        value={state.title}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('title', event.target.value)
        }
      />

      <SizeListbox
        label="Title size:"
        sizes={TEXT_SIZE_PRESET_KEYS}
        value={state.titleSizePreset}
        onChange={(size) => onChange('titleSizePreset', size)}
      />

      <AlignListbox
        aligns={TEXT_ALIGN_PRESET_KEYS}
        label="Title align:"
        value={state.titleAlign}
        onChange={(align) => onChange('titleAlign', align)}
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

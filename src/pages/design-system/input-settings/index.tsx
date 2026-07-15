/**
 * Файл: `src/pages/design-system/input-settings/index.tsx`
 * Определяет панель настроек компонента Input в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, выравнивания, значения,
 * ошибки и состояний в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `InputWidgetState`
 * 2. Экспортировать компонент `InputSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета поля ввода
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
import { TEXT_ALIGN_PRESET_KEYS, type TextAlignPreset } from '@ui/text';

import { AlignListbox } from '../align-listbox';
import { StyledSettingsForm } from '../design-system.styles';
import { ShapeListbox } from '../shape-listbox';
import { SizeListbox } from '../size-listbox';

/**
 * InputWidgetState — представляет состояние настроек компонента Input в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Input.
 * Используется для синхронизации значений между панелью управления и демонстрационным полем ввода.
 *
 * @property align — горизонтальное выравнивание значения
 * @property disabled — включает недоступное состояние поля
 * @property error — текст ошибки под полем
 * @property errorAlign — горизонтальное выравнивание строки ошибки
 * @property invalid — включает кольцо ошибки без текста
 * @property label — подпись над полем
 * @property placeholder — плейсхолдер значения
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property shape — форма строки-поля
 * @property sizePreset — размер контрола
 * @property value — значение поля
 */
export type InputWidgetState = {
  align?: TextAlignPreset;
  disabled: boolean;
  error: string;
  errorAlign: TextAlignPreset;
  invalid: boolean;
  label: string;
  placeholder: string;
  reserveErrorSpace: boolean;
  shape: ShapePreset;
  sizePreset: SizePreset;
  value: string;
};

/**
 * InputSettingsProps — представляет пропсы компонента InputSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек поля ввода
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

      <AlignListbox
        label="Align:"
        aligns={TEXT_ALIGN_PRESET_KEYS}
        value={state.align}
        onChange={(align) => onChange('align', align)}
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
        label="Value:"
        reserveErrorSpace={false}
        value={state.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('value', event.target.value)
        }
      />

      <Input
        label="Error:"
        reserveErrorSpace={false}
        value={state.error}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('error', event.target.value)
        }
      />

      {state.error.trim() !== '' && (
        <AlignListbox
          label="Error align:"
          aligns={TEXT_ALIGN_PRESET_KEYS}
          value={state.errorAlign}
          onChange={(align) => onChange('errorAlign', align)}
        />
      )}

      <Checkbox
        checked={state.invalid}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('invalid', event.target.checked)
        }
      >
        Invalid
      </Checkbox>

      <Checkbox
        checked={state.reserveErrorSpace}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('reserveErrorSpace', event.target.checked)
        }
      >
        Reserve error space
      </Checkbox>

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

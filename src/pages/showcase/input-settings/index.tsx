/**
 * Файл: `src/pages/showcase/input-settings/index.tsx`
 * Определяет панель настроек компонента Input в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, подписи, плейсхолдера,
 * значения, выравнивания, ошибки и состояний в реальном времени.
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
import { Input } from '@ui/input';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { TEXT_ALIGN_PRESET_KEYS, type TextAlignPreset } from '@ui/text';

import { AlignListbox } from '../align-listbox';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * InputWidgetState — представляет состояние настроек компонента Input в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Input.
 * Используется для синхронизации значений между панелью управления и демонстрационным Input.
 *
 * @property disabled — включает недоступное состояние поля
 * @property error — текст ошибки под полем
 * @property errorAlign — горизонтальное выравнивание строки ошибки
 * @property invalid — включает кольцо ошибки без текста
 * @property label — подпись над полем
 * @property placeholder — плейсхолдер значения
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property shape — форма строки-поля
 * @property showBorder — включает рамку контрола
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 * @property value — значение поля
 */
export type InputWidgetState = {
  disabled: boolean;
  error: string;
  errorAlign: TextAlignPreset;
  invalid: boolean;
  label: string;
  placeholder: string;
  reserveErrorSpace: boolean;
  shape: ShapePreset;
  showBorder: boolean;
  sizePreset: SizePreset;
  textAlign?: TextAlignPreset;
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
        checked={state.showBorder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showBorder', event.target.checked)
        }
      >
        Show border
      </Checkbox>

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
        label="Error:"
        reserveErrorSpace={false}
        value={state.error}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('error', event.target.value)
        }
      />

      {state.error.trim() !== '' && (
        <AlignListbox
          aligns={TEXT_ALIGN_PRESET_KEYS}
          label="Error align:"
          value={state.errorAlign}
          onChange={(align) => onChange('errorAlign', align)}
        />
      )}

      <TextGroup
        align={state.textAlign}
        contents={[
          {
            value: state.value,
            onChange: (value) => onChange('value', value),
          },
        ]}
        labelPrefix="Value"
        onAlignChange={(align) => onChange('textAlign', align)}
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
        checked={state.invalid}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('invalid', event.target.checked)
        }
      >
        Invalid
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

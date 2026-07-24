/**
 * Файл: `src/pages/showcase/input-settings/index.tsx`
 * Определяет панель настроек компонента Input в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, подписи, плейсхолдера,
 * значения, выравнивания, курсива, ошибки и состояний в реальном времени.
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
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TextAlignPreset } from '@ui/text';

import { ControlGroup } from '../control-group';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * InputWidgetState — представляет состояние настроек компонента Input в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Input.
 * Используется для синхронизации значений между панелью управления и демонстрационным Input.
 *
 * @property disabled — включает недоступное состояние поля
 * @property error — текст ошибки под полем
 * @property errorAlign — горизонтальное выравнивание строки ошибки
 * @property errorItalic — включает курсив строки ошибки
 * @property invalid — включает кольцо ошибки без текста
 * @property label — подпись над полем
 * @property placeholder — плейсхолдер значения
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property shape — форма строки-поля
 * @property showBorder — включает рамку контрола
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 * @property textItalic — включает курсив значения
 * @property value — значение поля
 */
export type InputWidgetState = {
  disabled: boolean;
  error: string;
  errorAlign: TextAlignPreset;
  errorItalic: boolean;
  invalid: boolean;
  label: string;
  placeholder: string;
  reserveErrorSpace: boolean;
  shape: ShapePreset;
  showBorder: boolean;
  sizePreset: SizePreset;
  textAlign?: TextAlignPreset;
  textItalic: boolean;
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
        sizePreset={state.sizePreset}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => onChange('shape', shape)}
        onSizeChange={(size) => onChange('sizePreset', size)}
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
        label="Placeholder:"
        reserveErrorSpace={false}
        value={state.placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('placeholder', event.target.value)
        }
      />

      <TextGroup
        align={state.textAlign}
        contents={[
          {
            value: state.value,
            onChange: (value) => onChange('value', value),
          },
        ]}
        italic={state.textItalic}
        labelPrefix="Text"
        showOptionsWithEmptyContent
        onAlignChange={(align) => onChange('textAlign', align)}
        onItalicChange={(value) => onChange('textItalic', value)}
      />

      <Checkbox
        checked={state.reserveErrorSpace}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('reserveErrorSpace', event.target.checked)
        }
      >
        Reserve error space
      </Checkbox>

      <TextGroup
        align={state.errorAlign}
        contents={[
          {
            value: state.error,
            onChange: (value) => onChange('error', value),
          },
        ]}
        italic={state.errorItalic}
        labelPrefix="Error"
        show={{
          checked: state.invalid,
          label: 'Invalid',
          onChange: (checked) => onChange('invalid', checked),
        }}
        onAlignChange={(align) => onChange('errorAlign', align)}
        onItalicChange={(value) => onChange('errorItalic', value)}
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

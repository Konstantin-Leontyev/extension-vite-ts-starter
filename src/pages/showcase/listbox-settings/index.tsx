/**
 * Файл: `src/pages/showcase/listbox-settings/index.tsx`
 * Определяет панель настроек компонента Listbox в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, иконки, режима
 * множественного выбора, чекбоксов в строках, сброса выбора, подписи,
 * плейсхолдера и состояния `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ListboxWidgetState`
 * 2. Экспортировать компонент `ListboxSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Listbox
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type IconPosition } from '@ui/icon';
import { Input } from '@ui/input';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { StyledSettingsForm } from '../showcase.styles';

/**
 * ListboxWidgetState — представляет состояние настроек компонента Listbox в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Listbox.
 * Используется для синхронизации значений между панелью управления и демонстрационным Listbox.
 *
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа шеврона
 * @property iconPosition — позиция шеврона относительно значения
 * @property iconTone — тон секции шеврона
 * @property inlineCheckbox — включает чекбоксы в строках опций
 * @property label — подпись над триггером
 * @property multiple — включает множественный выбор
 * @property placeholder — плейсхолдер неактивного триггера
 * @property shape — форма поверхности
 * @property showClear — включает кнопку сброса выбора при выбранном значении
 * @property sizePreset — размер компонента
 * @property value — буфер выбранного значения в превью. В панель не выносится
 */
export type ListboxWidgetState = {
  disabled: boolean;
  iconFill: TonePreset;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  inlineCheckbox: boolean;
  label: string;
  multiple: boolean;
  placeholder: string;
  shape: ShapePreset;
  showClear: boolean;
  sizePreset: SizePreset;
  value: string | string[];
};

/**
 * ListboxSettingsProps — представляет пропсы компонента ListboxSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек Listbox
 */
type ListboxSettingsProps = {
  onChange: <K extends keyof ListboxWidgetState>(
    key: K,
    value: ListboxWidgetState[K]
  ) => void;
  state: ListboxWidgetState;
};

/**
 * ListboxSettings — отображает панель настроек Listbox в витрине дизайн-системы.
 *
 * @example
 * <ListboxSettings state={listbox} onChange={updateListbox} />
 */
export function ListboxSettings({ onChange, state }: ListboxSettingsProps) {
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

      <IconGroup
        fill={state.iconFill}
        position={state.iconPosition}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onPositionChange={(position) => onChange('iconPosition', position)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <Checkbox
        checked={state.multiple}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('multiple', event.target.checked)
        }
      >
        Multiple
      </Checkbox>

      {state.multiple && (
        <Checkbox
          checked={state.inlineCheckbox}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('inlineCheckbox', event.target.checked)
          }
        >
          Inline checkbox
        </Checkbox>
      )}

      <Checkbox
        checked={state.showClear}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showClear', event.target.checked)
        }
      >
        Show clear
      </Checkbox>

      <Input
        label="Placeholder:"
        value={state.placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('placeholder', event.target.value)
        }
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

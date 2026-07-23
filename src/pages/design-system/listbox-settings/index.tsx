/**
 * Файл: `src/pages/design-system/listbox-settings/index.tsx`
 * Определяет панель настроек компонента Listbox в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, иконки, значения, режима
 * множественного выбора, чекбоксов в строках, подписи, плейсхолдера, резерва
 * ошибки и состояния `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ListboxWidgetState`
 * 2. Экспортировать компонент `ListboxSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Listbox
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type IconPosition } from '@ui/icon';
import { Input } from '@ui/input';
import { Listbox } from '@ui/listbox';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import { SizeListbox } from '../size-listbox';
import { LISTBOX_DEMO_OPTIONS } from './options';

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
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 * @property value — выбранное значение в превью
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
  reserveErrorSpace: boolean;
  shape: ShapePreset;
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

      <Listbox
        label="Value:"
        multiple={state.multiple}
        options={LISTBOX_DEMO_OPTIONS}
        reserveErrorSpace={false}
        value={state.value}
        onChange={(value) => onChange('value', value)}
      />

      <Checkbox
        checked={state.multiple}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('multiple', event.target.checked)
        }
      >
        Multiple
      </Checkbox>

      {state.multiple && (
        <Checkbox
          checked={state.inlineCheckbox}
          sizePreset="medium"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('inlineCheckbox', event.target.checked)
          }
        >
          Inline checkbox
        </Checkbox>
      )}

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

/**
 * Файл: `src/pages/showcase/combobox-settings/index.tsx`
 * Определяет панель настроек компонента Combobox в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, иконки, сброса выбора, подписи,
 * плейсхолдеров, текста пустого результата, резерва высоты под строку ошибки,
 * демо-иконок опций и состояния `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ComboboxWidgetState`
 * 2. Экспортировать компонент `ComboboxSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Combobox
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
 * ComboboxWidgetState — представляет состояние настроек компонента Combobox в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Combobox, кроме витринных ключей:
 * `withIcon` управляет подстановкой иконок в демо-опции превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным Combobox.
 *
 * @property disabled — включает недоступное состояние
 * @property emptyMessage — текст при пустом результате поиска
 * @property iconFill — тон глифа шеврона
 * @property iconPosition — позиция шеврона относительно значения
 * @property iconTone — тон секции шеврона
 * @property label — подпись над триггером
 * @property placeholder — плейсхолдер неактивного триггера
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property searchPlaceholder — плейсхолдер поля поиска
 * @property shape — форма поверхности
 * @property showClear — включает кнопку сброса выбора при выбранном значении
 * @property sizePreset — размер компонента
 * @property value — буфер выбранного значения в превью. В панель не выносится
 * @property withIcon — витринный ключ показа иконок в демо-опциях. Выключенный — опции без иконок
 */
export type ComboboxWidgetState = {
  disabled: boolean;
  emptyMessage: string;
  iconFill: TonePreset;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  label: string;
  placeholder: string;
  reserveErrorSpace: boolean;
  searchPlaceholder: string;
  shape: ShapePreset;
  showClear: boolean;
  sizePreset: SizePreset;
  value: string;
  withIcon: boolean;
};

/**
 * ComboboxSettingsProps — представляет пропсы компонента ComboboxSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек Combobox
 */
type ComboboxSettingsProps = {
  onChange: <K extends keyof ComboboxWidgetState>(
    key: K,
    value: ComboboxWidgetState[K]
  ) => void;
  state: ComboboxWidgetState;
};

/**
 * ComboboxSettings — отображает панель настроек Combobox в витрине дизайн-системы.
 *
 * @example
 * <ComboboxSettings state={combobox} onChange={updateCombobox} />
 */
export function ComboboxSettings({ onChange, state }: ComboboxSettingsProps) {
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
        checked={state.withIcon}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withIcon', event.target.checked)
        }
      >
        Show option icons
      </Checkbox>

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

      <Input
        label="Search placeholder:"
        value={state.searchPlaceholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('searchPlaceholder', event.target.value)
        }
      />

      <Input
        label="Empty message:"
        value={state.emptyMessage}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('emptyMessage', event.target.value)
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

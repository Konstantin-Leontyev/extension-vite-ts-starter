/**
 * Файл: `src/pages/showcase/listbox-settings/index.tsx`
 * Определяет панель настроек компонента Listbox в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, вида триггера, рамки вида
 * `icon`, иконки вида `field`, сброса выбора вида `field`, поиска, демо-иконок
 * опций, режима множественного выбора, чекбоксов в строках, подписи, плейсхолдера и
 * состояния `disabled` в реальном времени.
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
import { Listbox, type ListboxAppearance, type ListboxOption } from '@ui/listbox';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * LISTBOX_APPEARANCE_OPTIONS — задаёт опции вида триггера Listbox.
 * Используется в контроле `Appearance:` панели настроек Listbox.
 */
const LISTBOX_APPEARANCE_OPTIONS: ListboxOption[] = [
  { label: 'field', value: 'field' },
  { label: 'icon', value: 'icon' },
];

/**
 * ListboxWidgetState — представляет состояние настроек компонента Listbox в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Listbox, кроме витринных ключей:
 * `withIcon` управляет подстановкой иконок в демо-опции превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным Listbox.
 *
 * @property appearance — вид триггера
 * @property borderTone — тон рамки триггера вида `icon`
 * @property disabled — включает недоступное состояние
 * @property emptyMessage — текст при пустом результате поиска
 * @property iconFill — тон глифа шеврона у вида `field`
 * @property iconPosition — позиция шеврона относительно значения у вида `field`
 * @property iconTone — тон секции шеврона у вида `field`
 * @property inlineCheckbox — включает чекбоксы в строках опций
 * @property label — подпись над триггером
 * @property multiple — включает множественный выбор
 * @property placeholder — плейсхолдер пустого триггера
 * @property searchPlaceholder — плейсхолдер поля поиска
 * @property shape — форма поверхности
 * @property showBorder — включает рамку триггера вида `icon`
 * @property showClearButton — включает кнопку сброса выбора у вида `field` при выбранном значении
 * @property showSearch — включает поле поиска в панели
 * @property showShadow — включает тень триггера вида `icon` при включённой рамке
 * @property size — размер компонента
 * @property value — буфер выбранного значения в превью. В панель не выносится
 * @property withIcon — витринный ключ показа иконок в демо-опциях. Выключенный — опции без иконок
 */
export type ListboxWidgetState = {
  appearance: ListboxAppearance;
  borderTone: TonePreset;
  disabled: boolean;
  emptyMessage: string;
  iconFill: TonePreset;
  iconPosition: IconPosition;
  iconTone: TonePreset;
  inlineCheckbox: boolean;
  label: string;
  multiple: boolean;
  placeholder: string;
  searchPlaceholder: string;
  shape: ShapePreset;
  showBorder: boolean;
  showClearButton: boolean;
  showSearch: boolean;
  showShadow: boolean;
  size: SizePreset;
  value: string | string[];
  withIcon: boolean;
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
        size={state.size}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => onChange('shape', shape)}
        onSizeChange={(size) => onChange('size', size)}
      />

      <Listbox
        label="Appearance:"
        options={LISTBOX_APPEARANCE_OPTIONS}
        value={state.appearance}
        onChange={(value) => onChange('appearance', value as ListboxAppearance)}
      />

      {state.appearance === 'icon' && (
        <BorderGroup
          borderTone={state.borderTone}
          showBorder={state.showBorder}
          showShadow={state.showShadow}
          onBorderToneChange={(tone) => onChange('borderTone', tone)}
          onShowBorderChange={(show) => onChange('showBorder', show)}
          onShowShadowChange={(show) => onChange('showShadow', show)}
        />
      )}

      <TextGroup
        contents={[
          {
            value: state.placeholder,
            onChange: (value) => onChange('placeholder', value),
          },
        ]}
        labelPrefix="Placeholder"
      />

      {state.appearance === 'field' && (
        <IconGroup
          fill={state.iconFill}
          labelPrefix="Icon"
          position={state.iconPosition}
          tone={state.iconTone}
          onFillChange={(tone) => onChange('iconFill', tone)}
          onPositionChange={(position) => onChange('iconPosition', position)}
          onToneChange={(tone) => onChange('iconTone', tone)}
        />
      )}

      {state.appearance === 'field' && (
        <Checkbox
          checked={state.showClearButton}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('showClearButton', event.target.checked)
          }
        >
          Show clear button
        </Checkbox>
      )}

      <Checkbox
        checked={state.showSearch}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showSearch', event.target.checked)
        }
      >
        Show search
      </Checkbox>

      {state.showSearch && (
        <>
          <TextGroup
            contents={[
              {
                value: state.searchPlaceholder,
                onChange: (value) => onChange('searchPlaceholder', value),
              },
            ]}
            labelPrefix="Search placeholder"
          />

          <TextGroup
            contents={[
              {
                value: state.emptyMessage,
                onChange: (value) => onChange('emptyMessage', value),
              },
            ]}
            labelPrefix="Empty message"
          />
        </>
      )}

      <Checkbox
        checked={state.withIcon}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withIcon', event.target.checked)
        }
      >
        Show option icons
      </Checkbox>

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

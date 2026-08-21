/**
 * Файл: `src/pages/showcase/icon-settings/index.tsx`
 * Определяет панель настроек компонента Icon в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, иконки и её тонов,
 * отступа окна, роли `as`, hover, а при `as="button"` — состояний `active`
 * и `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `IconWidgetState`
 * 2. Экспортировать компонент `IconSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние
 *    с превью виджета Icon
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import {
  ICON_SHAPE_PRESET_KEYS,
  ICON_SIZE_PRESET_KEYS,
  getIconPadding,
  type IconShapePreset,
  type IconSizePreset,
} from '@ui/icon';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SpacingValue } from '@ui/spacing';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import {
  ICON_OPTIONS,
  resolveIconPaddingSizePreset,
  type IconKey,
} from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

/**
 * IconWidgetState — представляет состояние настроек компонента Icon в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Icon, кроме витринных ключей:
 * `iconKey` выбирает иконку для `children` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным Icon.
 *
 * @property active — включает зафиксированное нажатое состояние
 * @property as — корневой тег окна или действия
 * @property borderTone — тон рамки
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора иконки для превью
 * @property iconTone — тон заливки окна
 * @property padding — отступ окна Icon
 * @property shape — форма окна
 * @property showBorder — включает рамку
 * @property showHover — включает канал hover
 * @property showShadow — включает тень при включённой рамке
 * @property size — размер окна
 */
export type IconWidgetState = {
  active: boolean;
  as: 'button' | 'span';
  borderTone: TonePreset;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconTone: TonePreset;
  padding: SpacingValue;
  shape: IconShapePreset;
  showBorder: boolean;
  showHover: boolean;
  showShadow: boolean;
  size: IconSizePreset;
};

/**
 * ICON_TYPE_OPTIONS — задаёт опции листбокса роли Icon.
 * Значение опции — проп `as`: `button` для действия, `span` для окна.
 * Используется в `Listbox` поля Type внутри IconSettings.
 */
const ICON_TYPE_OPTIONS: ListboxOption[] = [
  { label: 'Button', value: 'button' },
  { label: 'Icon', value: 'span' },
];

/**
 * IconSettingsProps — представляет пропсы компонента IconSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек Icon
 */
type IconSettingsProps = {
  onChange: <K extends keyof IconWidgetState>(key: K, value: IconWidgetState[K]) => void;
  state: IconWidgetState;
};

/**
 * IconSettings — отображает панель настроек Icon в витрине дизайн-системы.
 *
 * @example
 * <IconSettings state={icon} onChange={updateIcon} />
 */
export function IconSettings({ onChange, state }: IconSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={ICON_SIZE_PRESET_KEYS}
        value={state.size}
        onChange={(size) => {
          onChange('size', size);
          onChange('padding', getIconPadding(size));
        }}
      />

      <ShapeListbox
        label="Shape:"
        shapes={ICON_SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <IconGroup
        fill={state.iconFill}
        iconOptions={ICON_OPTIONS}
        iconValue={state.iconKey}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onIconChange={(value) => onChange('iconKey', value as IconKey)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <SizeListbox
        label="Padding:"
        sizes={ICON_SIZE_PRESET_KEYS}
        value={resolveIconPaddingSizePreset(state.padding, state.size)}
        onChange={(size) => onChange('padding', getIconPadding(size))}
      />

      <Listbox
        label="Type:"
        options={ICON_TYPE_OPTIONS}
        value={state.as}
        onChange={(value) => onChange('as', value as IconWidgetState['as'])}
      />

      <Checkbox
        checked={state.showHover}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showHover', event.target.checked)
        }
      >
        Show hover
      </Checkbox>

      {state.as === 'button' && (
        <>
          <Checkbox
            checked={state.active}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange('active', event.target.checked)
            }
          >
            Active
          </Checkbox>

          <Checkbox
            checked={state.disabled}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange('disabled', event.target.checked)
            }
          >
            Disabled
          </Checkbox>
        </>
      )}
    </StyledSettingsForm>
  );
}

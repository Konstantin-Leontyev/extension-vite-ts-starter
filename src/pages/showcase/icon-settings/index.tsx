/**
 * Файл: `src/pages/showcase/icon-settings/index.tsx`
 * Определяет панель настроек компонента Icon в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, иконки и её тонов, отступа
 * окна, рамки, тени, hover и состояния `disabled` в реальном времени.
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
import { ICON_SHAPE_PRESET_KEYS, getIconPadding, type IconShapePreset } from '@ui/icon';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type SpacingValue } from '@ui/spacing';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

/**
 * resolveIconPaddingSizePreset — возвращает ключ размерного ряда под текущий `padding`.
 * Если отступ совпадает с мостом от `sizePreset` — возвращает его.
 * Иначе берёт первый ключ ряда, у которого `getIconPadding` даёт то же значение.
 *
 * @param padding текущий отступ окна Icon
 * @param sizePreset размер окна Icon
 * @returns ключ ряда для контрола отступа окна Icon
 */
function resolveIconPaddingSizePreset(
  padding: SpacingValue,
  sizePreset: SizePreset
): SizePreset {
  if (getIconPadding(sizePreset) === padding) {
    return sizePreset;
  }

  return SIZE_PRESET_KEYS.find((key) => getIconPadding(key) === padding) ?? sizePreset;
}

/**
 * IconWidgetState — представляет состояние настроек компонента Icon в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Icon, кроме витринных ключей:
 * `iconKey` выбирает иконку для `children` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным Icon.
 *
 * @property borderTone — тон рамки
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора иконки для превью
 * @property iconTone — тон заливки окна
 * @property padding — отступ окна Icon. При смене `sizePreset` синхронизируется
 *   мостом `getIconPadding`
 * @property shape — форма окна
 * @property showBorder — включает рамку
 * @property showHover — включает канал hover
 * @property showShadow — включает тень при включённой рамке
 * @property sizePreset — размер окна
 */
export type IconWidgetState = {
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
  sizePreset: SizePreset;
};

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
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('padding', getIconPadding(size));
        }}
      />

      <ShapeListbox
        label="Shape:"
        shapes={ICON_SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <IconGroup
        fill={state.iconFill}
        iconOptions={COMBOBOX_OPTIONS}
        iconValue={state.iconKey}
        labelPrefix=""
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onIconChange={(value) => onChange('iconKey', value as IconKey)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <SizeListbox
        label="Padding:"
        sizes={SIZE_PRESET_KEYS}
        value={resolveIconPaddingSizePreset(state.padding, state.sizePreset)}
        onChange={(size) => onChange('padding', getIconPadding(size))}
      />

      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <Checkbox
        checked={state.showHover}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showHover', event.target.checked)
        }
      >
        Show hover
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

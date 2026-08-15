/**
 * Файл: `src/pages/showcase/search-field-settings/index.tsx`
 * Определяет панель настроек компонента SearchField в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, формы сброса, формы секции иконки, рамки, иконки, подписи,
 * плейсхолдера, значения, выравнивания, курсива и состояния `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SearchFieldWidgetState`
 * 2. Экспортировать компонент `SearchFieldSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета SearchField
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import {
  ICON_SHAPE_PRESET_KEYS,
  resolveIconShape,
  type IconPosition,
  type IconShapePreset,
} from '@ui/icon';
import { Input } from '@ui/input';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TextAlignPreset } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * SearchFieldWidgetState — представляет состояние настроек компонента SearchField в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента SearchField, кроме витринных ключей:
 * `iconKey` выбирает глиф для пропа `icon` в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным SearchField.
 *
 * @property borderTone — тон рамки
 * @property clearShape — форма кнопки сброса. Стартует с вывода из `shape`
 * @property disabled — включает недоступное состояние поля
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора глифа иконки для превью
 * @property iconPosition — позиция иконки относительно поля
 * @property iconShape — форма секции иконки. Стартует с вывода из `shape`
 * @property iconTone — тон секции иконки
 * @property label — подпись над полем
 * @property placeholder — плейсхолдер значения
 * @property shape — форма строки-поля
 * @property showBorder — включает рамку контрола
 * @property showIcon — включает секцию иконки
 * @property showShadow — включает тень при включённой рамке
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 * @property textItalic — включает курсив значения
 * @property value — значение поля
 */
export type SearchFieldWidgetState = {
  borderTone: TonePreset;
  clearShape: IconShapePreset;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconPosition: IconPosition;
  iconShape: IconShapePreset;
  iconTone: TonePreset;
  label: string;
  placeholder: string;
  shape: ShapePreset;
  showBorder: boolean;
  showIcon: boolean;
  showShadow: boolean;
  sizePreset: SizePreset;
  textAlign?: TextAlignPreset;
  textItalic: boolean;
  value: string;
};

/**
 * SearchFieldSettingsProps — представляет пропсы компонента SearchFieldSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек SearchField
 */
type SearchFieldSettingsProps = {
  onChange: <K extends keyof SearchFieldWidgetState>(
    key: K,
    value: SearchFieldWidgetState[K]
  ) => void;
  state: SearchFieldWidgetState;
};

/**
 * SearchFieldSettings — отображает панель настроек SearchField в витрине дизайн-системы.
 *
 * @example
 * <SearchFieldSettings state={searchField} onChange={updateSearchField} />
 */
export function SearchFieldSettings({ onChange, state }: SearchFieldSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ControlGroup
        label={state.label}
        shape={state.shape}
        sizePreset={state.sizePreset}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => {
          onChange('shape', shape);
          onChange('clearShape', resolveIconShape(shape));
          onChange('iconShape', resolveIconShape(shape));
        }}
        onSizeChange={(size) => onChange('sizePreset', size)}
      />

      <ShapeListbox
        label="Clear shape:"
        shapes={ICON_SHAPE_PRESET_KEYS}
        value={state.clearShape}
        onChange={(shape) => onChange('clearShape', shape)}
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
        iconOptions={COMBOBOX_OPTIONS}
        iconValue={state.iconKey}
        position={state.iconPosition}
        shape={state.iconShape}
        show={state.showIcon}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onIconChange={(value) => onChange('iconKey', value as IconKey)}
        onPositionChange={(position) => onChange('iconPosition', position)}
        onShapeChange={(shape) => onChange('iconShape', shape)}
        onShowChange={(checked) => onChange('showIcon', checked)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <Input
        label="Placeholder:"
        value={state.placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('placeholder', event.target.value)
        }
        onClear={() => onChange('placeholder', '')}
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

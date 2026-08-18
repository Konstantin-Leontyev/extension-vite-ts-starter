/**
 * Файл: `src/pages/showcase/button-settings/index.tsx`
 * Определяет панель настроек компонента Button в витрине дизайн-системы.
 * Содержит контролы для изменения подписи, размера, формы, тона, иконки,
 * содержимого и тона лейбла и состояний `active` и `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ButtonWidgetState`
 * 2. Экспортировать компонент `ButtonSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Button
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { resolveIconShape, type IconPosition, type IconShapePreset } from '@ui/icon';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type TextTonePreset } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ControlGroup } from '../control-group';
import { IconGroup } from '../icon-group';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * ButtonWidgetState — представляет состояние настроек компонента Button в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Button, кроме витринных ключей: `withIcon`
 * управляет передачей иконки в превью, `text` хранит содержимое `children`, `iconKey`
 * выбирает глиф для превью.
 * Используется для синхронизации значений между панелью управления и демонстрационным Button.
 *
 * @property active — включает зафиксированное нажатое состояние
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора глифа иконки для превью
 * @property iconPosition — позиция иконки относительно лейбла
 * @property iconShape — форма секции иконки. Стартует с вывода из `shape`
 * @property iconTone — тон секции иконки
 * @property label — подпись над кнопкой
 * @property shape — форма кнопки
 * @property size — размер компонента
 * @property text — содержимое лейбла
 * @property textTone — тон лейбла
 * @property tone — семантический тон
 * @property withIcon — витринный ключ показа иконки. Выключенный — превью без иконки
 */
export type ButtonWidgetState = {
  active: boolean;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconPosition: IconPosition;
  iconShape: IconShapePreset;
  iconTone: TonePreset;
  label: string;
  shape: ShapePreset;
  size: SizePreset;
  text: string;
  textTone: TextTonePreset;
  tone: TonePreset;
  withIcon: boolean;
};

/**
 * ButtonSettingsProps — представляет пропсы компонента ButtonSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек кнопки
 */
type ButtonSettingsProps = {
  onChange: <K extends keyof ButtonWidgetState>(
    key: K,
    value: ButtonWidgetState[K]
  ) => void;
  state: ButtonWidgetState;
};

/**
 * ButtonSettings — отображает панель настроек Button в витрине дизайн-системы.
 *
 * @example
 * <ButtonSettings state={button} onChange={updateButton} />
 */
export function ButtonSettings({ onChange, state }: ButtonSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ControlGroup
        label={state.label}
        shape={state.shape}
        size={state.size}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => {
          onChange('shape', shape);
          onChange('iconShape', resolveIconShape(shape));
        }}
        onSizeChange={(size) => onChange('size', size)}
      />

      <ToneListbox
        label="Tone:"
        tones={TONE_PRESET_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />

      <IconGroup
        fill={state.iconFill}
        iconOptions={COMBOBOX_OPTIONS}
        iconValue={state.iconKey}
        labelPrefix="Icon"
        position={state.iconPosition}
        shape={state.iconShape}
        show={state.withIcon}
        tone={state.iconTone}
        onFillChange={(tone) => onChange('iconFill', tone)}
        onIconChange={(value) => onChange('iconKey', value as IconKey)}
        onPositionChange={(position) => onChange('iconPosition', position)}
        onShapeChange={(shape) => onChange('iconShape', shape)}
        onShowChange={(checked) => onChange('withIcon', checked)}
        onToneChange={(tone) => onChange('iconTone', tone)}
      />

      <TextGroup
        contents={[
          {
            value: state.text,
            onChange: (value) => onChange('text', value),
          },
        ]}
        labelPrefix="Text"
        set
        tones={[
          {
            value: state.textTone,
            onChange: (tone) => onChange('textTone', tone),
          },
        ]}
      />

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
    </StyledSettingsForm>
  );
}

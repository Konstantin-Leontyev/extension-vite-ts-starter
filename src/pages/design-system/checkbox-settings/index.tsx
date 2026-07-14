/**
 * Файл: `src/pages/design-system/checkbox-settings/index.tsx`
 * Определяет панель настроек компонента Checkbox в витрине дизайн-системы.
 * Содержит контролы для изменения размера, режима `inverted`, подписи и состояний
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `CheckboxWidgetState`
 * 2. Экспортировать компонент `CheckboxSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета чекбокса
 */

import { type ChangeEvent } from 'react';

import { Checkbox, getCheckboxTextSize } from '@ui/checkbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type TextSizePreset, type TextTone } from '@ui/text';

import { StyledSettingsForm } from '../design-system.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * CheckboxWidgetState — представляет состояние настроек компонента Checkbox в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Checkbox, кроме витринных ключей:
 * `showText` управляет передачей подписи в превью, `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным чекбоксом.
 *
 * @property checked — включает отмеченное состояние бокса
 * @property disabled — включает недоступное состояние
 * @property inverted — включает инвертированную палитру
 * @property showText — витринный ключ показа подписи. Выключенный — бокс без обёртки
 * @property sizePreset — размер бокса
 * @property text — подпись бокса
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 */
export type CheckboxWidgetState = {
  checked: boolean;
  disabled: boolean;
  inverted: boolean;
  showText: boolean;
  sizePreset: SizePreset;
  text: string;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTone;
};

/**
 * CheckboxSettingsProps — представляет пропсы компонента CheckboxSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек чекбокса
 */
type CheckboxSettingsProps = {
  onChange: <K extends keyof CheckboxWidgetState>(
    key: K,
    value: CheckboxWidgetState[K]
  ) => void;
  state: CheckboxWidgetState;
};

/**
 * CheckboxSettings — отображает панель настроек Checkbox в витрине дизайн-системы.
 *
 * @example
 * <CheckboxSettings state={checkbox} onChange={updateCheckbox} />
 */
export function CheckboxSettings({ onChange, state }: CheckboxSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getCheckboxTextSize(size));
        }}
      />

      <Checkbox
        checked={state.inverted}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('inverted', event.target.checked)
        }
      >
        Show inverted
      </Checkbox>

      <TextGroup
        contents={[
          {
            label: 'Text:',
            value: state.text,
            onChange: (value) => onChange('text', value),
          },
        ]}
        italic={state.textItalic}
        show={{
          checked: state.showText,
          onChange: (checked) => onChange('showText', checked),
        }}
        size={state.textSize}
        tone={state.textTone}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
        onToneChange={(tone) => onChange('textTone', tone)}
      />

      <Checkbox
        checked={state.checked}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('checked', event.target.checked)
        }
      >
        Checked
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

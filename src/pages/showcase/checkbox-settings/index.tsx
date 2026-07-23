/**
 * Файл: `src/pages/showcase/checkbox-settings/index.tsx`
 * Определяет панель настроек компонента Checkbox в витрине дизайн-системы.
 * Содержит контролы для изменения размера, режима `inverted`, марок, подписи и состояний
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `CheckboxWidgetState`
 * 2. Экспортировать компонент `CheckboxSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета чекбокса
 */

import { type ChangeEvent } from 'react';

import {
  CHECKBOX_CHECKED_MARK_KEYS,
  CHECKBOX_UNCHECKED_MARK_KEYS,
  Checkbox,
  getCheckboxTextSize,
  type CheckboxCheckedMark,
  type CheckboxUncheckedMark,
} from '@ui/checkbox';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type TextSizePreset, type TextTone } from '@ui/text';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * CheckboxWidgetState — представляет состояние настроек компонента Checkbox в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Checkbox, кроме витринных ключей:
 * `showText` управляет передачей подписи в превью, `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным чекбоксом.
 *
 * @property checked — включает отмеченное состояние бокса
 * @property checkedMark — иконка в checked-состоянии
 * @property disabled — включает недоступное состояние
 * @property inverted — включает инвертированную палитру
 * @property showText — витринный ключ показа подписи. Выключенный — бокс без обёртки
 * @property sizePreset — размер бокса
 * @property text — подпись бокса
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 * @property uncheckedMark — иконка в unchecked-состоянии
 */
export type CheckboxWidgetState = {
  checked: boolean;
  checkedMark: CheckboxCheckedMark;
  disabled: boolean;
  inverted: boolean;
  showText: boolean;
  sizePreset: SizePreset;
  text: string;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTone;
  uncheckedMark: CheckboxUncheckedMark;
};

/**
 * CHECKED_MARK_OPTIONS — формирует опции листбокса checked-марки из
 * `CHECKBOX_CHECKED_MARK_KEYS`.
 * Используется в `Listbox` checked-марки внутри CheckboxSettings.
 */
const CHECKED_MARK_OPTIONS: ListboxOption[] = CHECKBOX_CHECKED_MARK_KEYS.map((mark) => ({
  label: mark,
  value: mark,
}));

/**
 * UNCHECKED_MARK_OPTIONS — формирует опции листбокса unchecked-марки из
 * `CHECKBOX_UNCHECKED_MARK_KEYS`.
 * Используется в `Listbox` unchecked-марки внутри CheckboxSettings.
 */
const UNCHECKED_MARK_OPTIONS: ListboxOption[] = CHECKBOX_UNCHECKED_MARK_KEYS.map(
  (mark) => ({
    label: mark,
    value: mark,
  })
);

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
        tones={[
          {
            label: 'Text tone:',
            value: state.textTone,
            onChange: (tone) => onChange('textTone', tone),
          },
        ]}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
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

      {state.checked ? (
        <Listbox
          label="Checked mark:"
          options={CHECKED_MARK_OPTIONS}
          reserveErrorSpace={false}
          sizePreset="medium"
          value={state.checkedMark}
          onChange={(value) => onChange('checkedMark', value as CheckboxCheckedMark)}
        />
      ) : (
        <Listbox
          label="Unchecked mark:"
          options={UNCHECKED_MARK_OPTIONS}
          reserveErrorSpace={false}
          sizePreset="medium"
          value={state.uncheckedMark}
          onChange={(value) => onChange('uncheckedMark', value as CheckboxUncheckedMark)}
        />
      )}

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

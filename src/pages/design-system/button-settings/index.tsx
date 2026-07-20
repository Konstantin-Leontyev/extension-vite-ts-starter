/**
 * Файл: `src/pages/design-system/button-settings/index.tsx`
 * Определяет панель настроек компонента Button в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, тона, иконки, текста лейбла
 * и состояний `active` и `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ButtonWidgetState`
 * 2. Экспортировать компонент `ButtonSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета кнопки
 */

import { type ChangeEvent } from 'react';

import { getButtonTextSize, type ButtonIconPosition } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { Listbox, type ListboxOption } from '@ui/listbox';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { type TextSizePreset, type TextTone } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { ShapeListbox } from '../shape-listbox';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * ButtonWidgetState — представляет состояние настроек компонента Button в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Button, кроме витринных ключей: `withIcon`
 * управляет передачей иконки в превью, `text` хранит содержимое `children`, `iconKey`
 * выбирает глиф для превью.
 * Используется для синхронизации значений между панелью управления и демонстрационной кнопкой.
 *
 * @property active — включает зафиксированное нажатое состояние
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа иконки
 * @property iconKey — витринный ключ выбора глифа иконки для превью
 * @property iconPosition — позиция иконки относительно лейбла
 * @property iconTone — тон секции иконки
 * @property shape — форма кнопки
 * @property sizePreset — размер компонента
 * @property text — витринный ключ содержимого `children`
 * @property textItalic — включает курсив лейбла
 * @property textSize — размер лейбла
 * @property textTone — тон лейбла
 * @property tone — семантический тон
 * @property withIcon — витринный ключ показа иконки. Выключенный — превью без иконки
 */
export type ButtonWidgetState = {
  active: boolean;
  disabled: boolean;
  iconFill: TonePreset;
  iconKey: IconKey;
  iconPosition: ButtonIconPosition;
  iconTone: TonePreset;
  shape: ShapePreset;
  sizePreset: SizePreset;
  text: string;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTone;
  tone: TonePreset;
  withIcon: boolean;
};

/**
 * ICON_POSITION_OPTIONS — задаёт опции листбокса позиции иконки.
 * Используется в контроле `Icon position:` панели настроек Button.
 */
const ICON_POSITION_OPTIONS: ListboxOption[] = [
  { label: 'end', value: 'end' },
  { label: 'start', value: 'start' },
];

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
 * <ButtonSettings state={buttonState} onChange={updateButton} />
 */
export function ButtonSettings({ onChange, state }: ButtonSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getButtonTextSize(size));
        }}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <ToneListbox
        label="Tone:"
        tones={TONE_PRESET_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />

      <Checkbox
        checked={state.withIcon}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('withIcon', event.target.checked)
        }
      >
        Show icon
      </Checkbox>

      {state.withIcon && (
        <>
          <Combobox
            label="Icon:"
            options={COMBOBOX_OPTIONS}
            reserveErrorSpace={false}
            value={state.iconKey}
            onChange={(value) => onChange('iconKey', value as IconKey)}
          />

          <ToneListbox
            label="Icon tone:"
            tones={TONE_PRESET_KEYS}
            value={state.iconTone}
            onChange={(tone) => onChange('iconTone', tone)}
          />

          <ToneListbox
            excludeTone={state.iconTone}
            label="Icon fill tone:"
            tones={TONE_PRESET_KEYS}
            value={state.iconFill}
            onChange={(tone) => onChange('iconFill', tone)}
          />

          <Listbox
            label="Icon position:"
            options={ICON_POSITION_OPTIONS}
            reserveErrorSpace={false}
            value={state.iconPosition}
            onChange={(value) => onChange('iconPosition', value as ButtonIconPosition)}
          />
        </>
      )}

      <TextGroup
        contents={[
          {
            label: 'Text:',
            value: state.text,
            onChange: (value) => onChange('text', value),
          },
        ]}
        italic={state.textItalic}
        size={state.textSize}
        tone={state.textTone}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
        onToneChange={(tone) => onChange('textTone', tone)}
      />

      <Checkbox
        checked={state.active}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('active', event.target.checked)
        }
      >
        Active
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

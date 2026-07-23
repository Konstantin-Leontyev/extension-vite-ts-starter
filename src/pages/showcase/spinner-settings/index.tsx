/**
 * Файл: `src/pages/showcase/spinner-settings/index.tsx`
 * Определяет панель настроек компонента Spinner в витрине дизайн-системы.
 * Содержит контролы для изменения размера, тона, подписи и резерва высоты подписи в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SpinnerWidgetState`
 * 2. Экспортировать компонент `SpinnerSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета загрузки
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { getSpinnerTextSize } from '@ui/spinner';
import { type TextSizePreset, type TextTone } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * SpinnerWidgetState — представляет состояние настроек компонента Spinner в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Spinner, кроме витринных ключей:
 * `showText` управляет передачей подписи в превью, `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным индикатором.
 *
 * @property reserveTextSpace — включает резерв высоты под подпись
 * @property showText — витринный ключ показа подписи. Выключенный — индикатор без текста
 * @property sizePreset — размер спиннера
 * @property text — подпись под индикатором
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 * @property tone — семантический тон
 */
export type SpinnerWidgetState = {
  reserveTextSpace: boolean;
  showText: boolean;
  sizePreset: SizePreset;
  text: string;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTone;
  tone: TonePreset;
};

/**
 * SpinnerSettingsProps — представляет пропсы компонента SpinnerSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек индикатора
 */
type SpinnerSettingsProps = {
  onChange: <K extends keyof SpinnerWidgetState>(
    key: K,
    value: SpinnerWidgetState[K]
  ) => void;
  state: SpinnerWidgetState;
};

/**
 * SpinnerSettings — отображает панель настроек Spinner в витрине дизайн-системы.
 *
 * @example
 * <SpinnerSettings state={spinner} onChange={updateSpinner} />
 */
export function SpinnerSettings({ onChange, state }: SpinnerSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getSpinnerTextSize(size));
        }}
      />

      <ToneListbox
        label="Tone:"
        tones={TONE_PRESET_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />

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
        checked={state.reserveTextSpace}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('reserveTextSpace', event.target.checked)
        }
      >
        Reserve text space
      </Checkbox>
    </StyledSettingsForm>
  );
}

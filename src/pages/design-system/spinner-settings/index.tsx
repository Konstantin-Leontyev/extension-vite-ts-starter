/**
 * Файл: `src/pages/design-system/spinner-settings/index.tsx`
 * Определяет панель настроек компонента Spinner в витрине дизайн-системы.
 * Содержит контролы для изменения размера, тона и подписи в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SpinnerWidgetState`
 * 2. Экспортировать компонент `SpinnerSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета загрузки
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { getSpinnerTextSize } from '@ui/spinner';
import {
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * SpinnerWidgetState — представляет состояние настроек компонента Spinner в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Spinner.
 * Используется для синхронизации значений между панелью управления и демонстрационным индикатором.
 *
 * @property reserveTextSpace — включает резерв высоты под подпись
 * @property sizePreset — размер спиннера
 * @property text — подпись под индикатором
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 * @property tone — семантический тон
 */
export type SpinnerWidgetState = {
  reserveTextSpace: boolean;
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

      <Input
        label="Text:"
        reserveErrorSpace={false}
        value={state.text}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('text', event.target.value)
        }
      />

      <SizeListbox
        label="Text size:"
        sizes={TEXT_SIZE_PRESET_KEYS}
        value={state.textSize}
        onChange={(size) => onChange('textSize', size)}
      />

      <ToneListbox
        label="Text tone:"
        tones={TEXT_TONE_KEYS}
        value={state.textTone}
        onChange={(tone) => onChange('textTone', tone)}
      />

      <Checkbox
        checked={state.textItalic}
        label="Show italic"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('textItalic', event.target.checked)
        }
      />

      <Checkbox
        checked={state.reserveTextSpace}
        label="Reserve text space"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('reserveTextSpace', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

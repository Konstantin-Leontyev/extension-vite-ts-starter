/**
 * Файл: `src/pages/design-system/progress-bar-settings/index.tsx`
 * Определяет панель настроек компонента ProgressBar в витрине дизайн-системы.
 * Содержит контролы для изменения размера, тона, значения и подписи в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ProgressBarWidgetState`
 * 2. Экспортировать компонент `ProgressBarSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета полосы прогресса
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { getProgressBarTextSize } from '@ui/progress-bar';
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
 * ProgressBarWidgetState — представляет состояние настроек компонента ProgressBar в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента ProgressBar.
 * Используется для синхронизации значений между панелью управления и демонстрационной полосой прогресса.
 *
 * @property showLabel — включает подпись с процентом выполнения
 * @property sizePreset — размер полосы
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 * @property tone — семантический тон заливки
 * @property value — доля заполнения от 0 до 1
 */
export type ProgressBarWidgetState = {
  showLabel: boolean;
  sizePreset: SizePreset;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTone;
  tone: TonePreset;
  value: number;
};

/**
 * parseValueFromPercent — преобразует строку с процентом в долю заполнения для пропа `value`.
 *
 * @param raw — введённое значение в процентах
 * @returns доля заполнения от 0 до 1
 */
function parseValueFromPercent(raw: string): number {
  const parsed = Number.parseInt(raw, 10);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  if (parsed < 0) {
    return 0;
  }

  if (parsed > 100) {
    return 1;
  }

  return parsed / 100;
}

/**
 * ProgressBarSettingsProps — представляет пропсы компонента ProgressBarSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек полосы прогресса
 */
type ProgressBarSettingsProps = {
  onChange: <K extends keyof ProgressBarWidgetState>(
    key: K,
    value: ProgressBarWidgetState[K]
  ) => void;
  state: ProgressBarWidgetState;
};

/**
 * ProgressBarSettings — отображает панель настроек ProgressBar в витрине дизайн-системы.
 *
 * @example
 * <ProgressBarSettings state={progress} onChange={updateProgress} />
 */
export function ProgressBarSettings({ onChange, state }: ProgressBarSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getProgressBarTextSize(size));
        }}
      />

      <ToneListbox
        label="Tone:"
        tones={TONE_PRESET_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />

      <Input
        inputMode="numeric"
        label="Text:"
        reserveErrorSpace={false}
        value={String(Math.round(state.value * 100))}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('value', parseValueFromPercent(event.target.value))
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
        checked={state.showLabel}
        label="Show text"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showLabel', event.target.checked)
        }
      />

      <Checkbox
        checked={state.textItalic}
        label="Show italic"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('textItalic', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

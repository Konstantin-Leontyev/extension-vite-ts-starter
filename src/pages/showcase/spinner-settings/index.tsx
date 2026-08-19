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
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * SpinnerWidgetState — представляет состояние настроек компонента Spinner в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Spinner, кроме витринного ключа:
 * `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным индикатором.
 *
 * @property reserveTextSpace — включает резерв высоты под подпись
 * @property size — размер спиннера
 * @property text — подпись под индикатором
 * @property tone — семантический тон
 */
export type SpinnerWidgetState = {
  reserveTextSpace: boolean;
  size: SizePreset;
  text: string;
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
        value={state.size}
        onChange={(size) => onChange('size', size)}
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
            value: state.text,
            onChange: (value) => onChange('text', value),
          },
        ]}
        labelPrefix="Text"
      />

      <Checkbox
        checked={state.reserveTextSpace}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('reserveTextSpace', event.target.checked)
        }
      >
        Reserve text space
      </Checkbox>
    </StyledSettingsForm>
  );
}

/**
 * Файл: `src/pages/design-system/spinner-settings/index.tsx`
 * Определяет панель настроек компонента Spinner в витрине дизайн-системы.
 * Содержит контролы для изменения размера и тона в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SpinnerWidgetState`
 * 2. Экспортировать компонент `SpinnerSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета загрузки
 */

import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * SpinnerWidgetState — представляет состояние настроек компонента Spinner в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Spinner.
 * Используется для синхронизации значений между панелью управления и демонстрационным индикатором.
 *
 * @property sizePreset — размер спиннера
 * @property tone — семантический тон
 */
export type SpinnerWidgetState = {
  sizePreset: SizePreset;
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
        onChange={(size) => onChange('sizePreset', size)}
      />

      <ToneListbox
        label="Tone:"
        tones={TONE_PRESET_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />
    </StyledSettingsForm>
  );
}

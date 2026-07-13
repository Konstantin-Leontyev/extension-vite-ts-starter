/**
 * Файл: `src/pages/design-system/toast-settings/index.tsx`
 * Определяет панель настроек виджета Toast в витрине дизайн-системы.
 * Содержит контролы для изменения сообщения, размера и тона в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ToastWidgetState`
 * 2. Экспортировать компонент `ToastSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета уведомлений
 */

import { type ChangeEvent } from 'react';

import { Input } from '@ui/input';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * ToastWidgetState — представляет состояние настроек компонента уведомлений в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента уведомлений.
 * Используется для синхронизации значений между панелью управления и демонстрационным уведомлением.
 *
 * @property message — текст сообщения в уведомлении
 * @property sizePreset — размер уведомления
 * @property tone — семантический тон уведомления
 */
export type ToastWidgetState = {
  message: string;
  sizePreset: SizePreset;
  tone: TonePreset;
};

/**
 * ToastSettingsProps — представляет пропсы компонента ToastSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек уведомления
 */
type ToastSettingsProps = {
  onChange: <K extends keyof ToastWidgetState>(
    key: K,
    value: ToastWidgetState[K]
  ) => void;
  state: ToastWidgetState;
};

/**
 * ToastSettings — отображает панель настроек Toast в витрине дизайн-системы.
 *
 * @example
 * <ToastSettings state={toast} onChange={updateToast} />
 */
export function ToastSettings({ onChange, state }: ToastSettingsProps) {
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

      <Input
        label="Message:"
        reserveErrorSpace={false}
        value={state.message}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('message', event.target.value)
        }
      />
    </StyledSettingsForm>
  );
}

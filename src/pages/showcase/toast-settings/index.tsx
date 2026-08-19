/**
 * Файл: `src/pages/showcase/toast-settings/index.tsx`
 * Определяет панель настроек компонента Toast в витрине дизайн-системы.
 * Содержит контролы для изменения размера, тона и текста сообщения в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ToastWidgetState`
 * 2. Экспортировать компонент `ToastSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета уведомления
 */

import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * ToastWidgetState — представляет состояние настроек компонента Toast в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Toast, кроме `message`:
 * это поле запроса `ToastInput`, состояние целиком уходит в `showToast`,
 * а в превью передаётся как `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным уведомлением.
 *
 * @property message — текст сообщения в уведомлении
 * @property size — размер уведомления
 * @property tone — семантический тон уведомления
 */
export type ToastWidgetState = {
  message: string;
  size: SizePreset;
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
            value: state.message,
            onChange: (value) => onChange('message', value),
          },
        ]}
        labelPrefix="Text"
      />
    </StyledSettingsForm>
  );
}

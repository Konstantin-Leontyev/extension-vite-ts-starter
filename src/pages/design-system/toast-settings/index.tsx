/**
 * Файл: `src/pages/design-system/toast-settings/index.tsx`
 * Определяет панель настроек компонента Toast в витрине дизайн-системы.
 * Содержит контролы для изменения размера, тона и текста сообщения в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ToastWidgetState`
 * 2. Экспортировать компонент `ToastSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета уведомлений
 */

import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type TextSizePreset, type TextTone } from '@ui/text';
import { getToastTextSize } from '@ui/toast';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * ToastWidgetState — представляет состояние настроек компонента Toast в витрине дизайн-системы.
 * Ключи совпадают с именами пропов Toast, кроме `message`:
 * это поле запроса `ToastInput`, состояние целиком уходит в `showToast`,
 * а в превью передаётся как `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным уведомлением.
 *
 * @property message — текст сообщения в уведомлении
 * @property sizePreset — размер уведомления
 * @property textItalic — включает курсив текста сообщения
 * @property textSize — размер текста сообщения
 * @property textTone — тон текста сообщения
 * @property tone — семантический тон уведомления
 */
export type ToastWidgetState = {
  message: string;
  sizePreset: SizePreset;
  textItalic: boolean;
  textSize: TextSizePreset;
  textTone: TextTone;
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
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getToastTextSize(size));
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
            value: state.message,
            onChange: (value) => onChange('message', value),
          },
        ]}
        italic={state.textItalic}
        size={state.textSize}
        tone={state.textTone}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
        onToneChange={(tone) => onChange('textTone', tone)}
      />
    </StyledSettingsForm>
  );
}

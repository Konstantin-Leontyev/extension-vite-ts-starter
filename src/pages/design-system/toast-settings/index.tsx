/**
 * Файл: pages/design-system/toast-settings/index.tsx
 * Настройки тоста в витрине дизайн-системы.
 * Позволяет изменять сообщение, размер и тон тоста в реальном времени.
 *
 * Потребители: страница дизайн-системы (`pages/design-system/index.tsx`).
 */

import { type ChangeEvent } from 'react';

import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type SizePreset } from '@ui/presets';
import { type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { ToneListbox } from '../tone-listbox';

/**
 * ToastWidgetState — состояние настроек тоста в витрине дизайн-системы.
 * Используется для синхронизации значений между панелью управления и демонстрационным тостом.
 *
 * @property message — текст сообщения тоста
 * @property sizePreset — размер тоста из канона `SizePreset`
 * @property tone — семантический тон тоста
 */
export type ToastWidgetState = {
  message: string;
  sizePreset: SizePreset;
  tone: TonePreset;
};

/**
 * SIZE_OPTIONS — опции размера для Listbox в настройках тоста.
 * Значения соответствуют канону SizePreset из `@ui/presets`.
 */
const SIZE_OPTIONS: ListboxOption[] = [
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
];

/**
 * ToastSettingsProps — пропсы компонента ToastSettings.
 *
 * @property onChange — универсальный обработчик изменения любого поля состояния.
 *   Дженерик K захватывает ключ, чтобы value строго соответствовало типу этого поля.
 * @property state — текущее состояние настроек тоста.
 */
type ToastSettingsProps = {
  onChange: <K extends keyof ToastWidgetState>(
    key: K,
    value: ToastWidgetState[K]
  ) => void;
  state: ToastWidgetState;
};

/**
 * ToastSettings — панель управления тостом в витрине дизайн-системы.
 * Позволяет настроить сообщение, размер и тон для демонстрации компонента Toast.
 */
export function ToastSettings({ onChange, state }: ToastSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Listbox
        label="Size:"
        options={SIZE_OPTIONS}
        reserveErrorSpace={false}
        value={state.sizePreset}
        onChange={(value) => onChange('sizePreset', value as SizePreset)}
      />

      <ToneListbox
        label="Tone:"
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

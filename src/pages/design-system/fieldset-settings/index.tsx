/**
 * Файл: `src/pages/design-system/fieldset-settings/index.tsx`
 * Определяет панель настроек компонента Fieldset в витрине дизайн-системы.
 * Содержит контролы для изменения тона рамки, заголовка, демо-опций и состояний
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `FieldsetWidgetState`
 * 2. Экспортировать компонент `FieldsetSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета группы полей
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { FIELDSET_BORDER_TONE_KEYS, type FieldsetBorderTone } from '@ui/fieldset';
import { Input } from '@ui/input';
import { Listbox, type ListboxOption } from '@ui/listbox';
import { type TextSizePreset, type TextTone } from '@ui/text';

import { StyledSettingsForm } from '../design-system.styles';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * FieldsetWidgetState — представляет состояние настроек компонента Fieldset в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Fieldset, кроме витринных ключей:
 * `selected`, `textA`, `textB`, `disabledA` и `disabledB` задают демо-группу RadioButton
 * в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационной
 * группой полей.
 *
 * @property borderTone — тон рамки
 * @property disabledA — включает недоступное состояние варианта A
 * @property disabledB — включает недоступное состояние варианта B
 * @property label — заголовок в `<legend>`
 * @property legendItalic — включает курсив заголовка
 * @property legendSizePreset — размер заголовка
 * @property legendTone — тон заголовка
 * @property selected — активный вариант в демо-группе
 * @property textA — подпись варианта A
 * @property textB — подпись варианта B
 */
export type FieldsetWidgetState = {
  borderTone: FieldsetBorderTone;
  disabledA: boolean;
  disabledB: boolean;
  label: string;
  legendItalic: boolean;
  legendSizePreset: TextSizePreset;
  legendTone: TextTone;
  selected: 'a' | 'b';
  textA: string;
  textB: string;
};

/**
 * SELECTED_OPTIONS — задаёт опции листбокса активного переключателя в демо.
 * Используется в `Listbox` поля Selected внутри FieldsetSettings.
 */
const SELECTED_OPTIONS: ListboxOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
];

/**
 * FieldsetSettingsProps — представляет пропсы компонента FieldsetSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек группы полей
 */
type FieldsetSettingsProps = {
  onChange: <K extends keyof FieldsetWidgetState>(
    key: K,
    value: FieldsetWidgetState[K]
  ) => void;
  state: FieldsetWidgetState;
};

/**
 * FieldsetSettings — отображает панель настроек Fieldset в витрине дизайн-системы.
 *
 * @example
 * <FieldsetSettings state={fieldset} onChange={updateFieldset} />
 */
export function FieldsetSettings({ onChange, state }: FieldsetSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <ToneListbox
        label="Border tone:"
        tones={FIELDSET_BORDER_TONE_KEYS}
        value={state.borderTone}
        onChange={(tone) => onChange('borderTone', tone)}
      />

      <Listbox
        label="Selected:"
        options={SELECTED_OPTIONS}
        reserveErrorSpace={false}
        value={state.selected}
        onChange={(value) =>
          onChange('selected', value as FieldsetWidgetState['selected'])
        }
      />

      <TextGroup
        contents={[
          {
            label: 'Text:',
            value: state.label,
            onChange: (value) => onChange('label', value),
          },
        ]}
        italic={state.legendItalic}
        size={state.legendSizePreset}
        tones={[
          {
            label: 'Text tone:',
            value: state.legendTone,
            onChange: (tone) => onChange('legendTone', tone),
          },
        ]}
        onItalicChange={(value) => onChange('legendItalic', value)}
        onSizeChange={(size) => onChange('legendSizePreset', size)}
      />

      <Input
        label="Text A:"
        reserveErrorSpace={false}
        value={state.textA}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('textA', event.target.value)
        }
      />

      <Input
        label="Text B:"
        reserveErrorSpace={false}
        value={state.textB}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('textB', event.target.value)
        }
      />

      <Checkbox
        checked={state.disabledA}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabledA', event.target.checked)
        }
      >
        Disable A
      </Checkbox>

      <Checkbox
        checked={state.disabledB}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('disabledB', event.target.checked)
        }
      >
        Disable B
      </Checkbox>
    </StyledSettingsForm>
  );
}

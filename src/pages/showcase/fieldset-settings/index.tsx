/**
 * Файл: `src/pages/showcase/fieldset-settings/index.tsx`
 * Определяет панель настроек компонента Fieldset в витрине дизайн-системы.
 * Содержит контролы для изменения тона рамки и заголовка в реальном времени.
 * Оставляет демо-группу RadioButton в превью без настроек — у RadioButton своя панель.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `FieldsetWidgetState`
 * 2. Экспортировать компонент `FieldsetSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета группы полей
 */

import { FIELDSET_BORDER_TONE_PRESET_KEYS, type FieldsetBorderTonePreset } from '@ui/fieldset';
import { type TextAlignPreset, type TextSizePreset, type TextTonePreset } from '@ui/text';

import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * FieldsetWidgetState — представляет состояние настроек компонента Fieldset в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Fieldset, кроме витринных ключей:
 * `selected` управляет активным вариантом демо-группы RadioButton в превью.
 * Используется для синхронизации значений между панелью управления и демонстрационной
 * группой полей.
 *
 * @property borderTone — тон рамки
 * @property label — заголовок в `<legend>`
 * @property legendAlign — выравнивание заголовка
 * @property legendItalic — включает курсив заголовка
 * @property legendSize — размер заголовка
 * @property legendTone — тон заголовка
 * @property selected — витринный ключ активного варианта демо-группы
 */
export type FieldsetWidgetState = {
  borderTone: FieldsetBorderTonePreset;
  label: string;
  legendAlign?: TextAlignPreset;
  legendItalic: boolean;
  legendSize: TextSizePreset;
  legendTone: TextTonePreset;
  selected: 'a' | 'b';
};

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
        tones={FIELDSET_BORDER_TONE_PRESET_KEYS}
        value={state.borderTone}
        onChange={(tone) => onChange('borderTone', tone)}
      />

      <TextGroup
        align={state.legendAlign}
        contents={[
          {
            value: state.label,
            onChange: (value) => onChange('label', value),
          },
        ]}
        italic={state.legendItalic}
        labelPrefix="Legend"
        size={state.legendSize}
        tones={[
          {
            value: state.legendTone,
            onChange: (tone) => onChange('legendTone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('legendAlign', align)}
        onItalicChange={(value) => onChange('legendItalic', value)}
        onSizeChange={(size) => onChange('legendSize', size)}
      />
    </StyledSettingsForm>
  );
}

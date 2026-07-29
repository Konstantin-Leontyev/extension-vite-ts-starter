/**
 * Файл: `src/pages/showcase/text-settings/index.tsx`
 * Определяет панель настроек компонента Text в витрине дизайн-системы.
 * Содержит контролы для изменения содержимого, размера, выравнивания, тона, обрезания и курсива текста в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `TextWidgetState`
 * 2. Экспортировать компонент `TextSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета текста
 */

import { type TextAlignPreset, type TextSizePreset, type TextTone } from '@ui/text';

import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * TextWidgetState — представляет состояние настроек компонента Text в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Text.
 * Используется для синхронизации значений между панелью управления и демонстрационным текстом.
 *
 * @property align — выравнивание текста. Без значения компонент рендерит
 *   браузерное умолчание `start`. Фолбэк отображения — в `AlignListbox`
 * @property children — содержимое текста
 * @property ellipsis — включает однострочное обрезание с многоточием
 * @property italic — включает курсивное начертание
 * @property sizePreset — типографический пресет
 * @property tone — тон текста
 */
export type TextWidgetState = {
  align?: TextAlignPreset;
  children: string;
  ellipsis: boolean;
  italic: boolean;
  sizePreset: TextSizePreset;
  tone: TextTone;
};

/**
 * TextSettingsProps — представляет пропсы компонента TextSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек текста
 */
type TextSettingsProps = {
  onChange: <K extends keyof TextWidgetState>(key: K, value: TextWidgetState[K]) => void;
  state: TextWidgetState;
};

/**
 * TextSettings — отображает панель настроек Text в витрине дизайн-системы.
 *
 * @example
 * <TextSettings state={text} onChange={updateText} />
 */
export function TextSettings({ onChange, state }: TextSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <TextGroup
        align={state.align}
        contents={[
          {
            label: 'Sample:',
            value: state.children,
            onChange: (value) => onChange('children', value),
          },
        ]}
        ellipsis={{
          checked: state.ellipsis,
          onChange: (checked) => onChange('ellipsis', checked),
        }}
        italic={state.italic}
        labelPrefix=""
        size={state.sizePreset}
        tones={[
          {
            value: state.tone,
            onChange: (tone) => onChange('tone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('align', align)}
        onItalicChange={(value) => onChange('italic', value)}
        onSizeChange={(size) => onChange('sizePreset', size)}
      />
    </StyledSettingsForm>
  );
}

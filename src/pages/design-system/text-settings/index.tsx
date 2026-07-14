/**
 * Файл: `src/pages/design-system/text-settings/index.tsx`
 * Определяет панель настроек компонента Text в витрине дизайн-системы.
 * Содержит контролы для изменения размера, тона, выравнивания, текста и обрезания в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `TextWidgetState`
 * 2. Экспортировать компонент `TextSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета текста
 */

import { type CSSProperties, type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import {
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';

import { AlignListbox } from '../align-listbox';
import { StyledSettingsForm } from '../design-system.styles';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * TextWidgetState — представляет состояние настроек компонента Text в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Text.
 * Используется для синхронизации значений между панелью управления и демонстрационным текстом.
 *
 * @property align — выравнивание текста
 * @property children — содержимое текста
 * @property ellipsis — включает однострочное обрезание с многоточием
 * @property italic — включает курсивное начертание
 * @property sizePreset — типографический пресет
 * @property tone — тон текста
 */
export type TextWidgetState = {
  align: CSSProperties['textAlign'];
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
      <SizeListbox
        label="Size:"
        sizes={TEXT_SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => onChange('sizePreset', size)}
      />

      <AlignListbox
        label="Align:"
        aligns={TEXT_ALIGN_PRESET_KEYS}
        value={state.align ?? 'start'}
        onChange={(align) => onChange('align', align)}
      />

      <ToneListbox
        label="Tone:"
        tones={TEXT_TONE_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />

      <Input
        label="Sample:"
        reserveErrorSpace={false}
        value={state.children}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('children', event.target.value)
        }
      />

      <Checkbox
        checked={state.ellipsis}
        label="Show ellipsis"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('ellipsis', event.target.checked)
        }
      />

      <Checkbox
        checked={state.italic}
        label="Show italic"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('italic', event.target.checked)
        }
      />
    </StyledSettingsForm>
  );
}

/**
 * Файл: `src/pages/design-system/tag-settings/index.tsx`
 * Определяет панель настроек компонента Tag в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, тонов, режимов и текста в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `TagWidgetState`
 * 2. Экспортировать компонент `TagSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета метки
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { SHAPE_PRESET_KEYS, type ShapePreset } from '@ui/presets';
import { TAG_SIZE_PRESET_KEYS, type TagSizePreset } from '@ui/tag';
import { TEXT_TONE_KEYS, type TextTone } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { StyledSettingsForm } from '../design-system.styles';
import { ShapeListbox } from '../shape-listbox';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * TagWidgetState — представляет состояние настроек компонента Tag в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Tag.
 * Используется для синхронизации значений между панелью управления и демонстрационной меткой.
 *
 * @property borderTone — тон границы в режиме `bordered`
 * @property bordered — включает режим с границей
 * @property children — содержимое метки
 * @property dot — включает точку-индикатор
 * @property dotTone — тон точки
 * @property shape — форма метки
 * @property sizePreset — размер метки
 * @property textTone — тон текста
 * @property tinted — включает режим мягкой заливки
 * @property tone — тон заливки
 */
export type TagWidgetState = {
  borderTone: TonePreset;
  bordered: boolean;
  children: string;
  dot: boolean;
  dotTone: TonePreset;
  shape: ShapePreset;
  sizePreset: TagSizePreset;
  textTone: TextTone;
  tinted: boolean;
  tone: TonePreset;
};

/**
 * TagSettingsProps — представляет пропсы компонента TagSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек метки
 */
type TagSettingsProps = {
  onChange: <K extends keyof TagWidgetState>(key: K, value: TagWidgetState[K]) => void;
  state: TagWidgetState;
};

/**
 * TagSettings — отображает панель настроек Tag в витрине дизайн-системы.
 *
 * @example
 * <TagSettings state={tag} onChange={updateTag} />
 */
export function TagSettings({ onChange, state }: TagSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={TAG_SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => onChange('sizePreset', size)}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <ToneListbox
        label="Tone:"
        tones={TONE_PRESET_KEYS}
        value={state.tone}
        onChange={(tone) => onChange('tone', tone)}
      />

      <ToneListbox
        excludeTone={state.tone}
        label="Text tone:"
        tones={TEXT_TONE_KEYS}
        value={state.textTone}
        onChange={(tone) => onChange('textTone', tone)}
      />

      <Checkbox
        checked={state.bordered}
        label="Show border"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('bordered', event.target.checked)
        }
      />

      {state.bordered && (
        <ToneListbox
          label="Border tone:"
          tones={TONE_PRESET_KEYS}
          value={state.borderTone}
          onChange={(tone) => onChange('borderTone', tone)}
        />
      )}

      <Checkbox
        checked={state.dot}
        label="Show dot"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('dot', event.target.checked)
        }
      />

      {state.dot && (
        <ToneListbox
          label="Dot tone:"
          tones={TONE_PRESET_KEYS}
          value={state.dotTone}
          onChange={(tone) => onChange('dotTone', tone)}
        />
      )}

      <Checkbox
        checked={state.tinted}
        label="Show tinted"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('tinted', event.target.checked)
        }
      />

      <Input
        label="Tag text:"
        reserveErrorSpace={false}
        value={state.children}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('children', event.target.value)
        }
      />
    </StyledSettingsForm>
  );
}

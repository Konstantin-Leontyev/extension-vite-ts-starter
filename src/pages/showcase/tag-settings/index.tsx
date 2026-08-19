/**
 * Файл: `src/pages/showcase/tag-settings/index.tsx`
 * Определяет панель настроек компонента Tag в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, тонов, режимов и текста в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `TagWidgetState`
 * 2. Экспортировать компонент `TagSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета метки
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { SHAPE_PRESET_KEYS, type ShapePreset } from '@ui/presets';
import { TAG_SIZE_PRESET_KEYS, type TagSizePreset } from '@ui/tag';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { BorderGroup } from '../border-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * TagWidgetState — представляет состояние настроек компонента Tag в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Tag, кроме витринного ключа:
 * `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационной меткой.
 *
 * @property borderTone — тон рамки при включённом `showBorder`
 * @property dotTone — тон точки
 * @property shape — форма метки
 * @property showBorder — включает рамку
 * @property showDot — включает точку-индикатор
 * @property showShadow — включает тень при включённой рамке
 * @property size — размер метки
 * @property text — содержимое метки
 * @property tinted — включает режим мягкой заливки
 * @property tone — тон заливки
 */
export type TagWidgetState = {
  borderTone: TonePreset;
  dotTone: TonePreset;
  shape: ShapePreset;
  showBorder: boolean;
  showDot: boolean;
  showShadow: boolean;
  size: TagSizePreset;
  text: string;
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
        value={state.size}
        onChange={(size) => onChange('size', size)}
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

      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <Checkbox
        checked={state.showDot}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showDot', event.target.checked)
        }
      >
        Show dot
      </Checkbox>

      {state.showDot && (
        <ToneListbox
          label="Dot tone:"
          tones={TONE_PRESET_KEYS}
          value={state.dotTone}
          onChange={(tone) => onChange('dotTone', tone)}
        />
      )}

      <TextGroup
        contents={[
          {
            value: state.text,
            onChange: (value) => onChange('text', value),
          },
        ]}
        labelPrefix="Text"
      />

      <Checkbox
        checked={state.tinted}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('tinted', event.target.checked)
        }
      >
        Show tinted
      </Checkbox>
    </StyledSettingsForm>
  );
}

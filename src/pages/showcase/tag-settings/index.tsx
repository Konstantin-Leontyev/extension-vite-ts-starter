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
import { TAG_SIZE_PRESET_KEYS, getTagTextSize, type TagSizePreset } from '@ui/tag';
import { type TextSizePreset, type TextTone } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * TagWidgetState — представляет состояние настроек компонента Tag в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Tag, кроме витринных ключей:
 * `showText` управляет передачей содержимого в превью, `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационной меткой.
 *
 * @property borderTone — тон границы при включённом `showBorder`
 * @property dotTone — тон точки
 * @property shape — форма метки
 * @property showBorder — включает границу
 * @property showDot — включает точку-индикатор
 * @property showText — витринный ключ показа текста. Выключенный — метка без текста
 * @property sizePreset — размер метки
 * @property text — содержимое метки
 * @property textItalic — включает курсив текста метки
 * @property textSize — размер текста метки
 * @property textTone — тон текста метки
 * @property tinted — включает режим мягкой заливки
 * @property tone — тон заливки
 */
export type TagWidgetState = {
  borderTone: TonePreset;
  dotTone: TonePreset;
  shape: ShapePreset;
  showBorder: boolean;
  showDot: boolean;
  showText: boolean;
  sizePreset: TagSizePreset;
  text: string;
  textItalic: boolean;
  textSize: TextSizePreset;
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
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getTagTextSize(size));
        }}
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

      <Checkbox
        checked={state.showBorder}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showBorder', event.target.checked)
        }
      >
        Show border
      </Checkbox>

      {state.showBorder && (
        <ToneListbox
          label="Border tone:"
          tones={TONE_PRESET_KEYS}
          value={state.borderTone}
          onChange={(tone) => onChange('borderTone', tone)}
        />
      )}

      <Checkbox
        checked={state.showDot}
        sizePreset="medium"
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

      <Checkbox
        checked={state.tinted}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('tinted', event.target.checked)
        }
      >
        Show tinted
      </Checkbox>

      <TextGroup
        contents={[
          {
            label: 'Text:',
            value: state.text,
            onChange: (value) => onChange('text', value),
          },
        ]}
        italic={state.textItalic}
        show={{
          checked: state.showText,
          onChange: (checked) => onChange('showText', checked),
        }}
        size={state.textSize}
        tones={[
          {
            label: 'Text tone:',
            value: state.textTone,
            onChange: (tone) => onChange('textTone', tone),
          },
        ]}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
      />
    </StyledSettingsForm>
  );
}

/**
 * Файл: `src/pages/design-system/text-group/index.tsx`
 * Предоставляет компонент TextGroup для настройки текста компонента в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Основные задачи:
 * 1. Экспортировать компонент `TextGroup`
 * 2. Типизировать пропсы через `TextGroupProps`
 * 3. Рендерить единый блок текстовых настроек: флаг показа, поля содержимого,
 *    размер, тон и курсив
 * 4. Скрывать настройки текста при выключенном флаге показа
 *
 * Потребители:
 *  - панели настроек витрины — настраивают текст компонента:
 *     - `src/pages/design-system/tag-settings/index.tsx`
 *     - `src/pages/design-system/toast-settings/index.tsx`
 *     - `src/pages/design-system/spinner-settings/index.tsx`
 *     - `src/pages/design-system/progress-bar-settings/index.tsx`
 *     - `src/pages/design-system/checkbox-settings/index.tsx`
 *     - `src/pages/design-system/radio-button-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import {
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';

import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * TextGroupContent — представляет одно поле ввода содержимого текстовой группы.
 *
 * @property label — подпись поля, например `Text:` или `Text A:`
 * @property value — текущее содержимое
 * @property onChange — обработчик изменения содержимого
 */
type TextGroupContent = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

/**
 * TextGroupProps — представляет пропсы компонента TextGroup.
 *
 * @property contents — поля ввода содержимого. Отсутствуют, когда содержимое
 *   генерируется компонентом из значения, как процент ProgressBar
 * @property italic — текущее значение курсива
 * @property show — флаг показа текста. Без него текст компонента неотключаем
 *   и группа рендерится всегда
 * @property size — текущий размер текста
 * @property tone — текущий тон текста
 * @property onItalicChange — обработчик изменения курсива
 * @property onSizeChange — обработчик изменения размера текста
 * @property onToneChange — обработчик изменения тона текста
 */
type TextGroupProps = {
  contents?: readonly TextGroupContent[];
  italic: boolean;
  show?: { checked: boolean; onChange: (checked: boolean) => void };
  size: TextSizePreset;
  tone: TextTone;
  onItalicChange: (value: boolean) => void;
  onSizeChange: (size: TextSizePreset) => void;
  onToneChange: (tone: TextTone) => void;
};

/**
 * TextGroup — отображает текстовую группу настроек в витрине дизайн-системы.
 * При выключенном флаге `show` скрывает инпуты содержимого и настройки вида текста.
 *
 * @example
 * <TextGroup
 *   contents={[
 *     { label: 'Text:', value: state.text, onChange: (value) => onChange('text', value) },
 *   ]}
 *   italic={state.textItalic}
 *   show={{ checked: state.showText, onChange: (checked) => onChange('showText', checked) }}
 *   size={state.textSize}
 *   tone={state.textTone}
 *   onItalicChange={(value) => onChange('textItalic', value)}
 *   onSizeChange={(size) => onChange('textSize', size)}
 *   onToneChange={(tone) => onChange('textTone', tone)}
 * />
 */
export function TextGroup({
  contents,
  italic,
  show,
  size,
  tone,
  onItalicChange,
  onSizeChange,
  onToneChange,
}: TextGroupProps) {
  const expanded = !show || show.checked;

  return (
    <>
      {show && (
        <Checkbox
          checked={show.checked}
          sizePreset="medium"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            show.onChange(event.target.checked)
          }
        >
          Show text
        </Checkbox>
      )}

      {expanded && (
        <>
          {contents?.map((content) => (
            <Input
              key={content.label}
              label={content.label}
              reserveErrorSpace={false}
              value={content.value}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                content.onChange(event.target.value)
              }
            />
          ))}

          <SizeListbox
            label="Text size:"
            sizes={TEXT_SIZE_PRESET_KEYS}
            value={size}
            onChange={onSizeChange}
          />

          <ToneListbox
            label="Text tone:"
            tones={TEXT_TONE_KEYS}
            value={tone}
            onChange={onToneChange}
          />

          <Checkbox
            checked={italic}
            sizePreset="medium"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onItalicChange(event.target.checked)
            }
          >
            Show italic
          </Checkbox>
        </>
      )}
    </>
  );
}

/**
 * Файл: `src/pages/design-system/text-group/index.tsx`
 * Предоставляет компонент TextGroup для настройки текста компонента в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - выравнивание текста через проп `align`
 *  - поля содержимого через проп `contents`. Без `contents` поля ввода не рендерятся
 *  - курсив через проп `italic`
 *  - обработчик изменения выравнивания через проп `onAlignChange`. Без него контрол
 *    `Text align:` не рендерится
 *  - обработчик изменения курсива через проп `onItalicChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - показ текста через проп `show`. Без `show` текст неотключаем и группа рендерится всегда
 *  - размер текста через проп `size`
 *  - листбоксы тона через проп `tones`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TextGroup
 * 2. Типизировать пропсы через `TextGroupProps`
 *
 * Потребители:
 *  - панели настроек витрины — настраивают текст компонента:
 *     - `src/pages/design-system/button-settings/index.tsx`
 *     - `src/pages/design-system/tag-settings/index.tsx`
 *     - `src/pages/design-system/toast-settings/index.tsx`
 *     - `src/pages/design-system/spinner-settings/index.tsx`
 *     - `src/pages/design-system/progress-bar-settings/index.tsx`
 *     - `src/pages/design-system/checkbox-settings/index.tsx`
 *     - `src/pages/design-system/radio-button-settings/index.tsx`
 *     - `src/pages/design-system/switch-settings/index.tsx`
 *     - `src/pages/design-system/fieldset-settings/index.tsx`
 *     - `src/pages/design-system/stepper-settings/index.tsx`
 *     - `src/pages/design-system/segment-button-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import {
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  type TextAlignPreset,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';

import { AlignListbox } from '../align-listbox';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * TextGroupContent — представляет одно поле ввода содержимого текстовой группы.
 *
 * @property label — подпись поля, например `Text:` или `Text A:`
 * @property onChange — обработчик изменения содержимого
 * @property value — текущее содержимое
 */
type TextGroupContent = {
  label: string;
  onChange: (value: string) => void;
  value: string;
};

/**
 * TextGroupTone — представляет один листбокс тона текстовой группы.
 * Один элемент — обычный виджет. Несколько — по тону на содержимое,
 * например сегменты SegmentButton.
 *
 * @property label — подпись листбокса, например `Text tone:` или `Text A tone:`
 * @property onChange — обработчик изменения тона
 * @property value — текущий тон. Без значения листбокс показывает `default`
 */
type TextGroupTone = {
  label: string;
  onChange: (tone: TextTone) => void;
  value?: TextTone;
};

/**
 * TextGroupProps — представляет пропсы компонента TextGroup.
 *
 * @property align — текущее выравнивание текста
 * @property contents — поля ввода содержимого. Отсутствуют, когда содержимое
 *   генерируется компонентом из значения, как процент ProgressBar
 * @property italic — текущее значение курсива
 * @property onAlignChange — обработчик изменения выравнивания текста.
 *   Без него контрол `Text align:` не рендерится — у компонента нет текстовой оси выравнивания
 * @property onItalicChange — обработчик изменения курсива
 * @property onSizeChange — обработчик изменения размера текста
 * @property show — включает показ текста. Без него текст компонента неотключаем
 *   и группа рендерится всегда
 * @property size — текущий размер текста
 * @property tones — листбоксы тона: один или несколько по содержимым
 */
type TextGroupProps = {
  align?: TextAlignPreset;
  contents?: readonly TextGroupContent[];
  italic: boolean;
  onAlignChange?: (align: TextAlignPreset) => void;
  onItalicChange: (value: boolean) => void;
  onSizeChange: (size: TextSizePreset) => void;
  show?: { checked: boolean; onChange: (checked: boolean) => void };
  size: TextSizePreset;
  tones: readonly TextGroupTone[];
};

/**
 * TextGroup — отображает текстовую группу настроек в витрине дизайн-системы.
 *
 * @example
 * <TextGroup
 *   contents={[
 *     { label: 'Text:', value: state.text, onChange: (value) => onChange('text', value) },
 *   ]}
 *   italic={state.textItalic}
 *   show={{ checked: state.showText, onChange: (checked) => onChange('showText', checked) }}
 *   size={state.textSize}
 *   tones={[
 *     {
 *       label: 'Text tone:',
 *       value: state.textTone,
 *       onChange: (tone) => onChange('textTone', tone),
 *     },
 *   ]}
 *   onItalicChange={(value) => onChange('textItalic', value)}
 *   onSizeChange={(size) => onChange('textSize', size)}
 * />
 */
export function TextGroup({
  align,
  contents,
  italic,
  onAlignChange,
  onItalicChange,
  onSizeChange,
  show,
  size,
  tones,
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

          {onAlignChange && (
            <AlignListbox
              aligns={TEXT_ALIGN_PRESET_KEYS}
              label="Text align:"
              value={align}
              onChange={onAlignChange}
            />
          )}

          {tones.map((toneControl) => (
            <ToneListbox
              key={toneControl.label}
              label={toneControl.label}
              tones={TEXT_TONE_KEYS}
              value={toneControl.value}
              onChange={toneControl.onChange}
            />
          ))}

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

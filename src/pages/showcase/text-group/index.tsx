/**
 * Файл: `src/pages/showcase/text-group/index.tsx`
 * Предоставляет компонент TextGroup для настройки текста компонента в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - выравнивание текста через проп `align`
 *  - поля содержимого через проп `contents`. Без `contents` поля ввода не рендерятся
 *  - обрезание с многоточием через проп `ellipsis`. Без `ellipsis` флаг не рендерится
 *  - курсив через проп `italic`
 *  - префикс подписей контролов через проп `labelPrefix`. Без пропа подписи
 *    без префикса, например `Size:`
 *  - обработчик изменения выравнивания через проп `onAlignChange`. Без него контрол
 *    выравнивания не рендерится
 *  - обработчик изменения курсива через проп `onItalicChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - размер текста через проп `size`
 *  - листбоксы тона через проп `tones`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TextGroup
 * 2. Типизировать пропсы через `TextGroupProps`
 * 3. Рендерить единый блок текстовых настроек в порядке: чекбокс `Set*`,
 *    содержимое, размер, выравнивание, тон, обрезание и курсив
 * 4. Собирать подписи контролов через `resolveGroupFieldLabel`,
 *    `resolveGroupContentLabel` и `resolveGroupFlagLabel` из
 *    `src/pages/showcase/showcase-labels.ts`
 *
 * Потребители:
 *  - панели настроек витрины — настраивают текст компонента:
 *     - `src/pages/showcase/text-settings/index.tsx`
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *     - `src/pages/showcase/toast-settings/index.tsx`
 *     - `src/pages/showcase/spinner-settings/index.tsx`
 *     - `src/pages/showcase/checkbox-settings/index.tsx`
 *     - `src/pages/showcase/radio-button-settings/index.tsx`
 *     - `src/pages/showcase/switch-settings/index.tsx`
 *     - `src/pages/showcase/fieldset-settings/index.tsx`
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/control-group/index.tsx`
 *     - `src/pages/showcase/field-error-group/index.tsx`
 */

import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import {
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_PRESET_KEYS,
  type TextAlignPreset,
  type TextSizePreset,
  type TextTonePreset,
} from '@ui/text';

import { AlignListbox } from '../align-listbox';
import {
  resolveGroupContentLabel,
  resolveGroupFieldLabel,
  resolveGroupFlagLabel,
} from '../showcase-labels';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * TextGroupContent — представляет одно поле ввода содержимого текстовой группы.
 *
 * @property label — подпись поля, например `Text A:` или `Sample:`. Без значения
 *   собирается из `labelPrefix` — `Text:`, `Legend:`. Без префикса — `Text:`
 * @property onChange — обработчик изменения содержимого
 * @property value — текущее содержимое
 */
type TextGroupContent = {
  label?: string;
  onChange: (value: string) => void;
  value: string;
};

/**
 * TextGroupTone — представляет один листбокс тона текстовой группы.
 * Один элемент — обычный виджет. Несколько — по тону на содержимое,
 * когда в одной группе несколько полей.
 *
 * @property label — подпись листбокса, например `Text A tone:`. Без значения
 *   собирается из `labelPrefix` — `Text tone:`, `Legend tone:`. Без префикса — `Tone:`
 * @property onChange — обработчик изменения тона
 * @property value — текущий тон. Без значения листбокс показывает `neutral`
 */
type TextGroupTone = {
  label?: string;
  onChange: (tone: TextTonePreset) => void;
  value?: TextTonePreset;
};

/**
 * TextGroupProps — представляет пропсы компонента TextGroup.
 * При переданных `contents` контролы размера, выравнивания, тона, обрезания и курсива
 * скрыты, пока все поля содержимого пустые: нет текста — не к чему применять настройки.
 * Пустое содержимое после blur схлопывается в чекбокс `Set*`.
 * Без `contents` эти контролы остаются.
 *
 * @property align — текущее выравнивание текста
 * @property contents — поля ввода содержимого. Без `contents` поля ввода не рендерятся
 * @property ellipsis — контрол обрезания с многоточием. Без него флаг `Show ellipsis`
 *   не рендерится — проп `ellipsis` есть только у Text
 * @property italic — текущее значение курсива. Без пары `italic` / `onItalicChange`
 *   флаг не рендерится — у компонента нет пропа `italic`
 * @property labelPrefix — префикс подписей контролов, например `Legend`.
 *   Без пропа подписи без префикса
 * @property onAlignChange — обработчик изменения выравнивания текста.
 *   Без него контрол выравнивания не рендерится — у компонента нет пропа `align`
 * @property onItalicChange — обработчик изменения курсива
 * @property onSizeChange — обработчик изменения размера текста.
 *   Без него листбокс размера не рендерится
 * @property size — текущий размер текста
 * @property tones — листбоксы тона: один или несколько по содержимым.
 *   Без значения или с пустым перечнем листбоксы тона не рендерятся
 */
type TextGroupProps = {
  align?: TextAlignPreset;
  contents?: readonly TextGroupContent[];
  ellipsis?: { checked: boolean; onChange: (checked: boolean) => void };
  italic?: boolean;
  labelPrefix?: string;
  onAlignChange?: (align: TextAlignPreset) => void;
  onItalicChange?: (value: boolean) => void;
  onSizeChange?: (size: TextSizePreset) => void;
  size?: TextSizePreset;
  tones?: readonly TextGroupTone[];
};

/**
 * TextGroup — отображает текстовую группу настроек в витрине дизайн-системы.
 *
 * @example
 * <TextGroup
 *   contents={[
 *     { value: state.text, onChange: (value) => onChange('text', value) },
 *   ]}
 *   italic={state.textItalic}
 *   labelPrefix="Text"
 *   size={state.textSize}
 *   tones={[
 *     { value: state.textTone, onChange: (tone) => onChange('textTone', tone) },
 *   ]}
 *   onItalicChange={(value) => onChange('textItalic', value)}
 *   onSizeChange={(size) => onChange('textSize', size)}
 * />
 */
export function TextGroup({
  align,
  contents,
  ellipsis,
  italic,
  labelPrefix,
  onAlignChange,
  onItalicChange,
  onSizeChange,
  size,
  tones,
}: TextGroupProps) {
  const [isSetChecked, setIsSetChecked] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const setCheckboxRef = useRef<HTMLInputElement>(null);
  const shouldReturnFocusToSetCheckboxRef = useRef(false);
  const hasContents = contents !== undefined;
  const hasContentValue =
    !hasContents || contents.some((content) => content.value.trim() !== '');
  const isSetExpanded = hasContentValue || isSetChecked || isContentFocused;
  const showSetCheckbox = hasContents && !isSetExpanded;
  const shouldFocusContent = hasContents && isSetChecked && !hasContentValue;

  useLayoutEffect(() => {
    if (shouldReturnFocusToSetCheckboxRef.current) {
      shouldReturnFocusToSetCheckboxRef.current = false;
      setCheckboxRef.current?.focus();
      return;
    }

    if (shouldFocusContent) {
      contentInputRef.current?.focus();
    }
  }, [isSetChecked, shouldFocusContent]);

  function handleContentFocus() {
    setIsContentFocused(true);
  }

  function handleContentBlur(event: FocusEvent<HTMLInputElement>) {
    setIsContentFocused(false);

    if (event.target.value.trim() !== '') {
      return;
    }

    shouldReturnFocusToSetCheckboxRef.current = true;
    setIsSetChecked(false);
  }

  function handleSetChange(event: ChangeEvent<HTMLInputElement>) {
    setIsSetChecked(event.target.checked);
  }

  return (
    <>
      {showSetCheckbox && (
        <Checkbox checked={isSetChecked} ref={setCheckboxRef} onChange={handleSetChange}>
          {resolveGroupFlagLabel(labelPrefix, 'Text', 'Set')}
        </Checkbox>
      )}

      {isSetExpanded && (
        <>
          {contents?.map((content, index) => {
            const contentLabel =
              content.label ?? resolveGroupContentLabel(labelPrefix, 'Text');

            return (
              <Input
                key={`${contentLabel}-${index}`}
                label={contentLabel}
                ref={index === 0 ? contentInputRef : undefined}
                value={content.value}
                onBlur={handleContentBlur}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  content.onChange(event.target.value)
                }
                onClear={() => content.onChange('')}
                onFocus={handleContentFocus}
              />
            );
          })}

          {hasContentValue && (
            <>
              {onSizeChange && (
                <SizeListbox
                  label={resolveGroupFieldLabel(labelPrefix, 'size')}
                  sizes={TEXT_SIZE_PRESET_KEYS}
                  value={size}
                  onChange={onSizeChange}
                />
              )}

              {onAlignChange && (
                <AlignListbox
                  aligns={TEXT_ALIGN_PRESET_KEYS}
                  label={resolveGroupFieldLabel(labelPrefix, 'align')}
                  value={align}
                  onChange={onAlignChange}
                />
              )}

              {tones?.map((toneControl, index) => {
                const toneLabel =
                  toneControl.label ?? resolveGroupFieldLabel(labelPrefix, 'tone');

                return (
                  <ToneListbox
                    key={`${toneLabel}-${index}`}
                    label={toneLabel}
                    tones={TEXT_TONE_PRESET_KEYS}
                    value={toneControl.value}
                    onChange={toneControl.onChange}
                  />
                );
              })}

              {ellipsis && (
                <Checkbox
                  checked={ellipsis.checked}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    ellipsis.onChange(event.target.checked)
                  }
                >
                  Show ellipsis
                </Checkbox>
              )}

              {onItalicChange && italic !== undefined && (
                <Checkbox
                  checked={italic}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onItalicChange(event.target.checked)
                  }
                >
                  Show italic
                </Checkbox>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

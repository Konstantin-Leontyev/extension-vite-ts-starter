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
 *    без префикса, например `Size:` у панели Text
 *  - обработчик изменения выравнивания через проп `onAlignChange`. Без него контрол
 *    выравнивания не рендерится
 *  - обработчик изменения курсива через проп `onItalicChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - флаг `Show*` через проп `show` — зеркало булева пропа. Чекбокс виден всегда.
 *    Опциональный `show.label` задаёт подпись. Без него подпись собирается из
 *    `labelPrefix` — `Show text`, `Show legend`. Пример переопределения — `Invalid`
 *    у текста ошибки панели Input
 *  - флаг `Set*` через проп `set` — чекбокс необязательного содержимого. Отметка
 *    живёт локально. Непустой текст — чекбокса нет; пустое поле после blur
 *    схлопывается в `Set title`. Опциональный `set.label` задаёт подпись.
 *    `show` и `set` взаимно исключены
 *  - размер текста через проп `size`
 *  - листбоксы тона через проп `tones`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TextGroup
 * 2. Типизировать пропсы через `TextGroupProps`
 * 3. Рендерить единый блок текстовых настроек в порядке: флаг показа или отметки,
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
 *     - `src/pages/showcase/progress-bar-settings/index.tsx`
 *     - `src/pages/showcase/checkbox-settings/index.tsx`
 *     - `src/pages/showcase/radio-button-settings/index.tsx`
 *     - `src/pages/showcase/switch-settings/index.tsx`
 *     - `src/pages/showcase/fieldset-settings/index.tsx`
 *     - `src/pages/showcase/stepper-settings/index.tsx`
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/search-field-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
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
 * например сегменты SegmentButton.
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
 * TextGroupBaseProps — представляет общие пропсы компонента TextGroup.
 *
 * @property align — текущее выравнивание текста
 * @property contents — поля ввода содержимого. Отсутствуют, когда содержимое
 *   генерируется компонентом из значения, как процент ProgressBar
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
type TextGroupBaseProps = {
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
 * TextGroupRequiredText — представляет пропсы неотключаемого текста.
 * Флаги `show` и `set` недопустимы: текст неотключаем и группа рендерится всегда.
 */
type TextGroupRequiredText = {
  set?: never;
  show?: never;
};

/**
 * TextGroupSetFlag — представляет пропсы флага необязательного содержимого.
 * Поля содержимого обязательны. Флаг `show` недопустим.
 *
 * @property contents — поля ввода содержимого
 * @property set — флаг необязательного содержимого. Отметка живёт локально
 *   и наружу не поднимается. Поле `label` задаёт подпись чекбокса.
 *   Без него подпись собирается из `labelPrefix`
 */
type TextGroupSetFlag = {
  contents: readonly TextGroupContent[];
  set: { label?: string } | true;
  show?: never;
};

/**
 * TextGroupShowFlag — представляет пропсы флага-зеркала булева пропа.
 * Флаг `set` недопустим.
 *
 * @property show — флаг-зеркало булева пропа. Поле `label` задаёт подпись
 *   чекбокса. Без него подпись собирается из `labelPrefix`
 */
type TextGroupShowFlag = {
  set?: never;
  show: {
    checked: boolean;
    label?: string;
    onChange: (checked: boolean) => void;
  };
};

/**
 * TextGroupProps — представляет пропсы компонента TextGroup.
 * При переданных `contents` контролы размера, выравнивания, тона, обрезания и курсива
 * скрыты, пока все поля содержимого пустые: нет текста — не к чему применять настройки.
 * Без `contents` эти контролы остаются — содержимое генерируется компонентом,
 * как процент ProgressBar.
 * Флаги `show` и `set` закрыты размеченным объединением: у группы либо зеркало
 * булева пропа, либо чекбокс необязательного содержимого, либо ни того ни другого.
 */
type TextGroupProps = TextGroupBaseProps &
  (TextGroupRequiredText | TextGroupSetFlag | TextGroupShowFlag);

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
 *   show={{ checked: state.showText, onChange: (checked) => onChange('showText', checked) }}
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
  set,
  show,
  size,
  tones,
}: TextGroupProps) {
  const [isSetChecked, setIsSetChecked] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const setCheckboxRef = useRef<HTMLInputElement>(null);
  const shouldReturnFocusToSetCheckboxRef = useRef(false);
  const hasContentValue =
    contents === undefined || contents.some((content) => content.value.trim() !== '');
  const isSetExpanded = hasContentValue || isSetChecked || isContentFocused;
  const isExpanded = set ? isSetExpanded : !show || show.checked;
  const showSetCheckbox = Boolean(set) && !isSetExpanded;
  const shouldFocusContent = Boolean(set) && isSetChecked && !hasContentValue;
  const setLabel = typeof set === 'object' ? set.label : undefined;

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

    if (!set || event.target.value.trim() !== '') {
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
      {show && (
        <Checkbox
          checked={show.checked}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            show.onChange(event.target.checked)
          }
        >
          {show.label ?? resolveGroupFlagLabel(labelPrefix, 'Text', 'Show')}
        </Checkbox>
      )}

      {showSetCheckbox && (
        <Checkbox checked={isSetChecked} ref={setCheckboxRef} onChange={handleSetChange}>
          {setLabel ?? resolveGroupFlagLabel(labelPrefix, 'Text', 'Set')}
        </Checkbox>
      )}

      {isExpanded && (
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
                onBlur={set ? handleContentBlur : undefined}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  content.onChange(event.target.value)
                }
                onClear={() => content.onChange('')}
                onFocus={set ? handleContentFocus : undefined}
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

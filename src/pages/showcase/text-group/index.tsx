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
 *  - префикс подписей контролов через проп `labelPrefix`. Пустой префикс даёт подписи
 *    без него, например `Size:` у панели Text
 *  - обработчик изменения выравнивания через проп `onAlignChange`. Без него контрол
 *    выравнивания не рендерится
 *  - обработчик изменения курсива через проп `onItalicChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - показ текста через проп `show`. Без `show` текст неотключаем и группа рендерится всегда.
 *    Опциональный `show.label` задаёт подпись чекбокса. Без него подпись собирается из
 *    `labelPrefix` — `Show text`, `Show legend`. Пример переопределения — `Invalid`
 *    у текста ошибки панели Input
 *  - показ опций стилей при пустом содержимом через проп `showOptionsWithEmptyContent`.
 *    По умолчанию выключен. Эталон — Text-группа Input: плейсхолдер снаружи группы
 *    делит типографику с текстом поля
 *  - размер текста через проп `size`
 *  - листбоксы тона через проп `tones`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TextGroup
 * 2. Типизировать пропсы через `TextGroupProps`
 * 3. Рендерить единый блок текстовых настроек в порядке: показ, содержимое, размер,
 *    выравнивание, тон, обрезание и курсив
 * 4. Строить подписи контролов из префикса `labelPrefix`
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
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
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
 * @property label — подпись поля, например `Text A:` или `Sample:`. Без значения
 *   собирается из `labelPrefix` — `Text:`, `Legend:`. При пустом префиксе — `Text:`
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
 *   собирается из `labelPrefix` — `Text tone:`, `Legend tone:`. При пустом префиксе — `Tone:`
 * @property onChange — обработчик изменения тона
 * @property value — текущий тон. Без значения листбокс показывает `neutral`
 */
type TextGroupTone = {
  label?: string;
  onChange: (tone: TextTone) => void;
  value?: TextTone;
};

/**
 * DEFAULT_TEXT_GROUP_LABEL_PREFIX — задаёт префикс подписей контролов по умолчанию.
 * Используется, когда вызывающий код не передал проп `labelPrefix`.
 */
const DEFAULT_TEXT_GROUP_LABEL_PREFIX = 'Text';

/**
 * DEFAULT_TEXT_GROUP_SHOW_OPTIONS_WITH_EMPTY_CONTENT — задаёт показ опций стилей
 * при пустых `contents` по умолчанию.
 * Используется, когда вызывающий код не передал проп `showOptionsWithEmptyContent`.
 */
const DEFAULT_TEXT_GROUP_SHOW_OPTIONS_WITH_EMPTY_CONTENT = false;

/**
 * resolveTextGroupLabel — возвращает подпись контрола группы из префикса и имени поля.
 * С префиксом — `Text size:`, `Legend size:`. С пустым префиксом слово поля
 * начинает подпись с заглавной буквы — `Size:`.
 *
 * Как работает:
 * 1. При пустом префиксе делает первую букву `name` заглавной и добавляет `:`
 * 2. Иначе склеивает префикс, имя поля и `:`
 *
 * @param labelPrefix префикс подписей контролов
 * @param name имя поля в нижнем регистре, например `size`
 * @returns подпись контрола с двоеточием
 */
function resolveTextGroupLabel(labelPrefix: string, name: string): string {
  if (labelPrefix === '') {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}:`;
  }

  return `${labelPrefix} ${name}:`;
}

/**
 * resolveTextGroupContentLabel — возвращает подпись инпута содержимого из префикса.
 * С префиксом — `Text:`, `Legend:`. С пустым префиксом — `Text:`.
 * Панель Text передаёт `Sample:` явно через `contents[].label`.
 *
 * Как работает:
 * 1. При пустом префиксе возвращает `Text:`
 * 2. Иначе возвращает префикс с `:`
 *
 * @param labelPrefix префикс подписей контролов
 * @returns подпись инпута содержимого с двоеточием
 */
function resolveTextGroupContentLabel(labelPrefix: string): string {
  if (labelPrefix === '') {
    return 'Text:';
  }

  return `${labelPrefix}:`;
}

/**
 * resolveTextGroupShowLabel — возвращает подпись чекбокса показа.
 * С префиксом — `Show text`, `Show legend`. Пустой префикс даёт `Show text`.
 *
 * Как работает:
 * 1. При пустом префиксе возвращает `Show text`
 * 2. Иначе возвращает `Show` и префикс в нижнем регистре
 *
 * @param labelPrefix префикс подписей контролов
 * @returns подпись чекбокса показа
 */
function resolveTextGroupShowLabel(labelPrefix: string): string {
  if (labelPrefix === '') {
    return 'Show text';
  }

  return `Show ${labelPrefix.toLowerCase()}`;
}

/**
 * TextGroupProps — представляет пропсы компонента TextGroup.
 * При переданных `contents` контролы размера, выравнивания, тона, обрезания и курсива
 * скрыты, пока все поля содержимого пустые: нет текста — не к чему применять настройки.
 * Исключение — `showOptionsWithEmptyContent`. Без `contents` эти контролы остаются —
 * содержимое генерируется компонентом, как процент ProgressBar.
 *
 * @property align — текущее выравнивание текста
 * @property contents — поля ввода содержимого. Отсутствуют, когда содержимое
 *   генерируется компонентом из значения, как процент ProgressBar
 * @property ellipsis — контрол обрезания с многоточием. Без него флаг `Show ellipsis`
 *   не рендерится — проп `ellipsis` есть только у Text
 * @property italic — текущее значение курсива. Без пары `italic` / `onItalicChange`
 *   флаг не рендерится — у компонента нет оси курсива
 * @property labelPrefix — префикс подписей контролов, например `Legend`.
 *   Пустая строка даёт подписи без префикса
 * @property onAlignChange — обработчик изменения выравнивания текста.
 *   Без него контрол выравнивания не рендерится — у компонента нет текстовой оси выравнивания
 * @property onItalicChange — обработчик изменения курсива
 * @property onSizeChange — обработчик изменения размера текста.
 *   Без пары `size` / `onSizeChange` листбокс размера не рендерится
 * @property show — контрол показа текста. Без него текст компонента неотключаем
 *   и группа рендерится всегда. Поле `label` задаёт подпись чекбокса. Без него
 *   подпись собирается из `labelPrefix`
 * @property showOptionsWithEmptyContent — показывает контролы размера, выравнивания,
 *   тона, обрезания и курсива при пустых `contents`. По умолчанию выключен
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
  show?: {
    checked: boolean;
    label?: string;
    onChange: (checked: boolean) => void;
  };
  showOptionsWithEmptyContent?: boolean;
  size?: TextSizePreset;
  tones?: readonly TextGroupTone[];
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
  ellipsis,
  italic,
  labelPrefix = DEFAULT_TEXT_GROUP_LABEL_PREFIX,
  onAlignChange,
  onItalicChange,
  onSizeChange,
  show,
  showOptionsWithEmptyContent = DEFAULT_TEXT_GROUP_SHOW_OPTIONS_WITH_EMPTY_CONTENT,
  size,
  tones,
}: TextGroupProps) {
  const isExpanded = !show || show.checked;
  const hasContentValue =
    contents === undefined || contents.some((content) => content.value.trim() !== '');
  const showTextOptions = hasContentValue || showOptionsWithEmptyContent;

  return (
    <>
      {show && (
        <Checkbox
          checked={show.checked}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            show.onChange(event.target.checked)
          }
        >
          {show.label ?? resolveTextGroupShowLabel(labelPrefix)}
        </Checkbox>
      )}

      {isExpanded && (
        <>
          {contents?.map((content, index) => {
            const contentLabel =
              content.label ?? resolveTextGroupContentLabel(labelPrefix);

            return (
              <Input
                key={`${contentLabel}-${index}`}
                label={contentLabel}
                value={content.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  content.onChange(event.target.value)
                }
              />
            );
          })}

          {showTextOptions && (
            <>
              {onSizeChange && size !== undefined && (
                <SizeListbox
                  label={resolveTextGroupLabel(labelPrefix, 'size')}
                  sizes={TEXT_SIZE_PRESET_KEYS}
                  value={size}
                  onChange={onSizeChange}
                />
              )}

              {onAlignChange && (
                <AlignListbox
                  aligns={TEXT_ALIGN_PRESET_KEYS}
                  label={resolveTextGroupLabel(labelPrefix, 'align')}
                  value={align}
                  onChange={onAlignChange}
                />
              )}

              {tones?.map((toneControl, index) => {
                const toneLabel =
                  toneControl.label ?? resolveTextGroupLabel(labelPrefix, 'tone');

                return (
                  <ToneListbox
                    key={`${toneLabel}-${index}`}
                    label={toneLabel}
                    tones={TEXT_TONE_KEYS}
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

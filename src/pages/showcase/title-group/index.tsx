/**
 * Файл: `src/pages/showcase/title-group/index.tsx`
 * Предоставляет компонент TitleGroup для настройки заголовка или подзаголовка
 * в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - выравнивание заголовка через проп `align`
 *  - префикс подписей контролов через проп `labelPrefix`
 *  - обработчик изменения выравнивания через проп `onAlignChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - обработчик изменения содержимого через проп `onTitleChange`
 *  - обработчик изменения тона через проп `onToneChange`
 *  - показ заголовка через проп `show`. Без `show` текст неотключаем и группа
 *    рендерится всегда. Пустое поле содержимого выключает флаг по уходу фокуса
 *  - размер заголовка через проп `size`
 *  - содержимое заголовка через проп `title`
 *  - тон заголовка через проп `tone`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TitleGroup
 * 2. Типизировать пропсы через `TitleGroupProps`
 * 3. Рендерить единый блок настроек заголовка: показ, содержимое, размер,
 *    выравнивание и тон
 * 4. Собирать подписи контролов через `resolveGroupFieldLabel`,
 *    `resolveGroupContentLabel` и `resolveGroupFlagLabel` из
 *    `src/pages/showcase/showcase-labels.ts`
 *
 * Потребители:
 *  - панели настроек витрины — настраивают заголовок и подзаголовок:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 */

import { useRef, type ChangeEvent, type FocusEvent } from 'react';

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
import {
  resolveGroupContentLabel,
  resolveGroupFieldLabel,
  resolveGroupFlagLabel,
} from '../showcase-labels';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * TitleGroupProps — представляет пропсы компонента TitleGroup.
 *
 * @property align — текущее выравнивание заголовка
 * @property labelPrefix — префикс подписей контролов, например `Title` или `Subtitle`
 * @property onAlignChange — обработчик изменения выравнивания
 * @property onSizeChange — обработчик изменения размера
 * @property onTitleChange — обработчик изменения содержимого заголовка
 * @property onToneChange — обработчик изменения тона
 * @property show — контрол показа заголовка. Без него текст неотключаем
 *   и группа рендерится всегда. Поле `label` задаёт подпись чекбокса. Без него
 *   подпись собирается из `labelPrefix`
 * @property size — текущий размер заголовка
 * @property title — текущее содержимое заголовка
 * @property tone — текущий тон заголовка
 */
type TitleGroupProps = {
  align?: TextAlignPreset;
  labelPrefix: string;
  onAlignChange: (align: TextAlignPreset) => void;
  onSizeChange: (size: TextSizePreset) => void;
  onTitleChange: (title: string) => void;
  onToneChange: (tone: TextTone) => void;
  show?: {
    checked: boolean;
    label?: string;
    onChange: (checked: boolean) => void;
  };
  size?: TextSizePreset;
  title: string;
  tone: TextTone;
};

/**
 * TitleGroup — отображает блок настроек заголовка в витрине дизайн-системы.
 *
 * @example
 * <TitleGroup
 *   align={state.titleAlign}
 *   labelPrefix="Title"
 *   show={{ checked: state.showTitle, onChange: (checked) => onChange('showTitle', checked) }}
 *   size={state.titleSizePreset}
 *   title={state.title}
 *   tone={state.titleTone}
 *   onAlignChange={(align) => onChange('titleAlign', align)}
 *   onSizeChange={(size) => onChange('titleSizePreset', size)}
 *   onTitleChange={(title) => onChange('title', title)}
 *   onToneChange={(tone) => onChange('titleTone', tone)}
 * />
 */
export function TitleGroup({
  align,
  labelPrefix,
  onAlignChange,
  onSizeChange,
  onTitleChange,
  onToneChange,
  show,
  size,
  title,
  tone,
}: TitleGroupProps) {
  const isExpanded = !show || show.checked;
  const showCheckboxRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {show && (
        <Checkbox
          checked={show.checked}
          ref={showCheckboxRef}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            show.onChange(event.target.checked)
          }
        >
          {show.label ?? resolveGroupFlagLabel(labelPrefix, 'Title', 'Show')}
        </Checkbox>
      )}

      {isExpanded && (
        <>
          <Input
            label={resolveGroupContentLabel(labelPrefix, 'Title')}
            value={title}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              if (show && event.target.value.trim() === '') {
                show.onChange(false);
                showCheckboxRef.current?.focus();
              }
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onTitleChange(event.target.value)
            }
          />

          <SizeListbox
            label={resolveGroupFieldLabel(labelPrefix, 'size')}
            sizes={TEXT_SIZE_PRESET_KEYS}
            value={size}
            onChange={onSizeChange}
          />

          <AlignListbox
            aligns={TEXT_ALIGN_PRESET_KEYS}
            label={resolveGroupFieldLabel(labelPrefix, 'align')}
            value={align}
            onChange={onAlignChange}
          />

          <ToneListbox
            label={resolveGroupFieldLabel(labelPrefix, 'tone')}
            tones={TEXT_TONE_KEYS}
            value={tone}
            onChange={onToneChange}
          />
        </>
      )}
    </>
  );
}

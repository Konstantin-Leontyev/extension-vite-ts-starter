/**
 * Файл: `src/pages/showcase/heading-group/index.tsx`
 * Предоставляет компонент HeadingGroup для настройки заголовка или подзаголовка
 * Card-поверхности в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Основные задачи:
 * 1. Экспортировать компонент `HeadingGroup`
 * 2. Типизировать пропсы через `HeadingGroupProps`
 * 3. Рендерить единый блок настроек заголовка: содержимое, размер,
 *    выравнивание и тон
 * 4. Строить подписи контролов из префикса `labelPrefix`
 *
 * Потребители:
 *  - панели настроек витрины — настраивают заголовок и подзаголовок:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 */

import { type CSSProperties, type ChangeEvent } from 'react';

import { Input } from '@ui/input';
import {
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';

import { AlignListbox } from '../align-listbox';
import { SizeListbox } from '../size-listbox';
import { ToneListbox } from '../tone-listbox';

/**
 * HeadingGroupProps — представляет пропсы компонента HeadingGroup.
 *
 * @property align — текущее выравнивание заголовка
 * @property labelPrefix — префикс подписей контролов, например `Title` или `Subtitle`
 * @property onAlignChange — обработчик изменения выравнивания
 * @property onSizeChange — обработчик изменения размера
 * @property onTextChange — обработчик изменения содержимого
 * @property onToneChange — обработчик изменения тона
 * @property size — текущий размер заголовка
 * @property text — текущее содержимое заголовка
 * @property tone — текущий тон заголовка
 */
type HeadingGroupProps = {
  align: CSSProperties['textAlign'];
  labelPrefix: string;
  onAlignChange: (align: CSSProperties['textAlign']) => void;
  onSizeChange: (size: TextSizePreset) => void;
  onTextChange: (text: string) => void;
  onToneChange: (tone: TextTone) => void;
  size: TextSizePreset;
  text: string;
  tone: TextTone;
};

/**
 * HeadingGroup — отображает блок настроек заголовка в витрине дизайн-системы.
 *
 * @example
 * <HeadingGroup
 *   align={state.titleAlign}
 *   labelPrefix="Title"
 *   size={state.titleSizePreset}
 *   text={state.title}
 *   tone={state.titleTone}
 *   onAlignChange={(align) => onChange('titleAlign', align)}
 *   onSizeChange={(size) => onChange('titleSizePreset', size)}
 *   onTextChange={(text) => onChange('title', text)}
 *   onToneChange={(tone) => onChange('titleTone', tone)}
 * />
 */
export function HeadingGroup({
  align,
  labelPrefix,
  onAlignChange,
  onSizeChange,
  onTextChange,
  onToneChange,
  size,
  text,
  tone,
}: HeadingGroupProps) {
  return (
    <>
      <Input
        label={`${labelPrefix}:`}
        reserveErrorSpace={false}
        value={text}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onTextChange(event.target.value)
        }
      />

      <SizeListbox
        label={`${labelPrefix} size:`}
        sizes={TEXT_SIZE_PRESET_KEYS}
        value={size}
        onChange={onSizeChange}
      />

      <AlignListbox
        aligns={TEXT_ALIGN_PRESET_KEYS}
        label={`${labelPrefix} align:`}
        value={align}
        onChange={onAlignChange}
      />

      <ToneListbox
        label={`${labelPrefix} tone:`}
        tones={TEXT_TONE_KEYS}
        value={tone}
        onChange={onToneChange}
      />
    </>
  );
}

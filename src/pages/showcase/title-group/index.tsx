/**
 * Файл: `src/pages/showcase/title-group/index.tsx`
 * Предоставляет компонент TitleGroup для настройки заголовка или подзаголовка
 * Card-поверхности в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - выравнивание заголовка через проп `align`
 *  - обработчик изменения выравнивания через проп `onAlignChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - обработчик изменения содержимого через проп `onTitleChange`
 *  - обработчик изменения тона через проп `onToneChange`
 *  - размер заголовка через проп `size`
 *  - содержимое заголовка через проп `title`
 *  - префикс подписей контролов через проп `titlePrefix`
 *  - тон заголовка через проп `tone`
 *
 * Основные задачи:
 * 1. Экспортировать компонент TitleGroup
 * 2. Типизировать пропсы через `TitleGroupProps`
 * 3. Рендерить единый блок настроек заголовка: содержимое, размер,
 *    выравнивание и тон
 * 4. Строить подписи контролов из префикса `titlePrefix`
 *
 * Потребители:
 *  - панели настроек витрины — настраивают заголовок и подзаголовок:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

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
 * TitleGroupProps — представляет пропсы компонента TitleGroup.
 *
 * @property align — текущее выравнивание заголовка
 * @property onAlignChange — обработчик изменения выравнивания
 * @property onSizeChange — обработчик изменения размера
 * @property onTitleChange — обработчик изменения содержимого заголовка
 * @property onToneChange — обработчик изменения тона
 * @property size — текущий размер заголовка
 * @property title — текущее содержимое заголовка
 * @property titlePrefix — префикс подписей контролов, например `Title` или `Subtitle`
 * @property tone — текущий тон заголовка
 */
type TitleGroupProps = {
  align: TextAlignPreset;
  onAlignChange: (align: TextAlignPreset) => void;
  onSizeChange: (size: TextSizePreset) => void;
  onTitleChange: (title: string) => void;
  onToneChange: (tone: TextTone) => void;
  size: TextSizePreset;
  title: string;
  titlePrefix: string;
  tone: TextTone;
};

/**
 * TitleGroup — отображает блок настроек заголовка в витрине дизайн-системы.
 *
 * @example
 * <TitleGroup
 *   align={state.titleAlign}
 *   size={state.titleSizePreset}
 *   title={state.title}
 *   titlePrefix="Title"
 *   tone={state.titleTone}
 *   onAlignChange={(align) => onChange('titleAlign', align)}
 *   onSizeChange={(size) => onChange('titleSizePreset', size)}
 *   onTitleChange={(title) => onChange('title', title)}
 *   onToneChange={(tone) => onChange('titleTone', tone)}
 * />
 */
export function TitleGroup({
  align,
  onAlignChange,
  onSizeChange,
  onTitleChange,
  onToneChange,
  size,
  title,
  titlePrefix,
  tone,
}: TitleGroupProps) {
  return (
    <>
      <Input
        label={`${titlePrefix}:`}
        reserveErrorSpace={false}
        value={title}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onTitleChange(event.target.value)
        }
      />

      <SizeListbox
        label={`${titlePrefix} size:`}
        sizes={TEXT_SIZE_PRESET_KEYS}
        value={size}
        onChange={onSizeChange}
      />

      <AlignListbox
        aligns={TEXT_ALIGN_PRESET_KEYS}
        label={`${titlePrefix} align:`}
        value={align}
        onChange={onAlignChange}
      />

      <ToneListbox
        label={`${titlePrefix} tone:`}
        tones={TEXT_TONE_KEYS}
        value={tone}
        onChange={onToneChange}
      />
    </>
  );
}

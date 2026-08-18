/**
 * Файл: `src/pages/showcase/showcase-text-node.ts`
 * Содержит хелпер пакета текстового узла для превью витрины дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Основные задачи:
 * 1. Предоставить функцию `resolveTextNodeProps`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — собирает пакет текстового узла для превью
 */

import {
  type TextAlignPreset,
  type TextNodeStyleProps,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';
import { type AllOrNone } from '@ui/type-utils';

/**
 * ResolveTextNodeParams — представляет поля сборки пакета текстового узла.
 *
 * @property align — выравнивание текста
 * @property italic — включает курсив
 * @property leadingKey — ключ ведущей строки в пакете
 * @property prefix — префикс имён пропсов
 * @property size — размер текста
 * @property text — ведущая строка узла
 * @property tone — тон текста
 */
type ResolveTextNodeParams<Prefix extends string, Leading extends string = Prefix> = {
  align?: TextAlignPreset;
  italic?: boolean;
  leadingKey?: Leading;
  prefix: Prefix;
  size?: TextSizePreset;
  text: string;
  tone?: TextTone;
};

/**
 * resolveTextNodeProps — возвращает пакет пропсов текстового узла.
 * При непустой строке отдаёт ведущий ключ вместе с зависимыми, иначе гасит пакет.
 * Используется в `src/pages/showcase/index.tsx`.
 *
 * @param params поля сборки пакета текстового узла
 * @returns пакет пропсов текстового узла для передачи в потребитель
 *
 * @example
 * resolveTextNodeProps({ prefix: 'title', text: modal.title })
 * resolveTextNodeProps({
 *   prefix: 'text',
 *   leadingKey: 'children',
 *   text: tag.text,
 * })
 */
export function resolveTextNodeProps<
  Prefix extends string,
  Leading extends string = Prefix,
>({
  align,
  italic,
  leadingKey,
  prefix,
  size,
  text,
  tone,
}: ResolveTextNodeParams<Prefix, Leading>): AllOrNone<
  { [K in Leading]: string } & TextNodeStyleProps<Prefix>
> {
  const resolvedLeadingKey = leadingKey ?? prefix;

  return (
    text.trim() !== ''
      ? {
          [resolvedLeadingKey]: text,
          [`${prefix}Align`]: align,
          [`${prefix}Italic`]: italic,
          [`${prefix}Size`]: size,
          [`${prefix}Tone`]: tone,
        }
      : {}
  ) as AllOrNone<{ [K in Leading]: string } & TextNodeStyleProps<Prefix>>;
}

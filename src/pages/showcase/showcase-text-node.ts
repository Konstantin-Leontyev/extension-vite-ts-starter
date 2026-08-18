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
  type TextNodeProps,
  type TextSizePreset,
  type TextTonePreset,
} from '@ui/text';

/**
 * ResolveTextNodeParams — представляет поля сборки пакета текстового узла.
 *
 * @property align — выравнивание текста
 * @property italic — включает курсив
 * @property prefix — префикс имён пропсов
 * @property size — размер текста
 * @property text — ведущая строка узла
 * @property tone — тон текста
 */
type ResolveTextNodeParams<Prefix extends string> = {
  align?: TextAlignPreset;
  italic?: boolean;
  prefix: Prefix;
  size?: TextSizePreset;
  text: string;
  tone?: TextTonePreset;
};

/**
 * resolveTextNodeProps — возвращает пакет пропсов текстового узла.
 * При непустой строке отдаёт ведущий ключ вместе с зависимыми, иначе гасит пакет.
 * Используется в `src/pages/showcase/index.tsx`.
 *
 * @param params поля сборки пакета
 * @returns пакет пропсов текстового узла для передачи в потребитель
 *
 * @example
 * resolveTextNodeProps({ prefix: 'title', text: modal.title })
 */
export function resolveTextNodeProps<Prefix extends string>({
  align,
  italic,
  prefix,
  size,
  text,
  tone,
}: ResolveTextNodeParams<Prefix>): TextNodeProps<Prefix> {
  return (
    text.trim() !== ''
      ? {
          [prefix]: text,
          [`${prefix}Align`]: align,
          [`${prefix}Italic`]: italic,
          [`${prefix}Size`]: size,
          [`${prefix}Tone`]: tone,
        }
      : {}
  ) as TextNodeProps<Prefix>;
}

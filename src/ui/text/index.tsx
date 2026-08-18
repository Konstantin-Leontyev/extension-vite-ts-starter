/**
 * Файл: `src/ui/text/index.tsx`
 * Предоставляет компонент Text для отображения текста.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - курсивное начертание через проп `italic`
 *  - выравнивание через проп `align`
 *  - перенос строк через проп `whiteSpace`
 *  - обрезку с многоточием через проп `ellipsis`
 *  - переопределение цвета через проп `color`
 *  - переопределение размера шрифта через проп `fontSize`
 *  - переопределение насыщенности через проп `fontWeight`
 *  - переопределение высоты строки через проп `lineHeight`
 *  - переопределение корневого элемента через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Text
 * 2. Типизировать пропсы через `TextProps`
 * 3. Экспортировать типы `ChildrenTextProps` и `TextNodeProps`
 * 4. Предоставить функцию `resolveTextNodeProps` — пакет текстового узла по префиксу
 * 5. Реэкспортировать публичное API стилей: `TEXT_ALIGN_PRESET_KEYS`, `TEXT_SIZE_PRESET_KEYS`,
 *    `TEXT_TONE_KEYS`, `textSizePresets`, `getEllipsisStyles`, `getNativeFieldTextStyles`,
 *    `getTextLineHeight`, `getTextProperties`, `getTextToneColor` и типы
 *
 * Потребители:
 *  - контролы, например Button, Tag и Listbox — рендерят текст внутри себя
 *  - страницы и виджеты приложения, например HomePage — рендерят подписи, заголовки и лейблы
 *  - `@ui/presets` и `@ui/table/column-sizing` — используют реэкспорты типографики
 *  - `@ui/card` и `@ui/range-input` — подключают `TextNodeProps`
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  createElement,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
} from 'react';

import { type AllOrNone } from '@ui/type-utils';

import {
  StyledText,
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  getEllipsisStyles,
  getNativeFieldTextStyles,
  getTextLineHeight,
  getTextProperties,
  getTextToneColor,
  textSizePresets,
  type TextAlignPreset,
  type TextSizePreset,
  type TextStyleProps,
  type TextTone,
} from './text.styles';

/**
 * ChildrenTextProps — представляет пропсы содержимого и текста.
 * Поля текста допустимы только вместе с `children`.
 * Подключается локально через `& ChildrenTextProps` у потребителей
 * с опциональным содержимым.
 *
 * @property children — содержимое
 * @property textItalic — включает курсив текста
 * @property textSize — размер текста
 * @property textTone — тон текста
 */
type ChildrenTextProps =
  | {
      children: ReactNode;
      textItalic?: boolean;
      textSize?: TextSizePreset;
      textTone?: TextTone;
    }
  | {
      children?: never;
      textItalic?: never;
      textSize?: never;
      textTone?: never;
    };

/**
 * TextNodeProps — представляет пропсы текстового узла.
 * Поля узла допустимы только вместе с ведущей строкой `${Prefix}`.
 * Дополнительные ключи, завязанные на ту же строку, передаются вторым параметром.
 * Подключается локально через `& TextNodeProps` у потребителей
 * с опциональным текстовым узлом.
 *
 * @template Prefix префикс имён пропсов, например `title` или `subtitle`
 * @template Extra дополнительные поля той же ветки, например `titleAs` и `titleId`
 */
type TextNodeProps<
  Prefix extends string,
  Extra extends object = Record<never, never>,
> = AllOrNone<
  {
    [K in Prefix]: string;
  } & {
    [K in `${Prefix}Align`]?: TextAlignPreset;
  } & {
    [K in `${Prefix}Italic`]?: boolean;
  } & {
    [K in `${Prefix}SizePreset`]?: TextSizePreset;
  } & {
    [K in `${Prefix}Tone`]?: TextTone;
  } & Extra
>;

/**
 * resolveTextNodeProps — возвращает пакет пропсов текстового узла по префиксу.
 * При непустой строке отдаёт ведущий ключ вместе с зависимыми, иначе гасит пакет.
 * Используется в `src/pages/showcase`.
 *
 * @param prefix префикс имён пропсов
 * @param text ведущая строка узла
 * @param align выравнивание текста
 * @param italic включает курсив
 * @param sizePreset размер текста
 * @param tone тон текста
 * @returns пакет пропсов текстового узла для передачи в потребитель
 */
function resolveTextNodeProps<Prefix extends string>(
  prefix: Prefix,
  text: string,
  align?: TextAlignPreset,
  italic?: boolean,
  sizePreset?: TextSizePreset,
  tone?: TextTone
): TextNodeProps<Prefix> {
  return (
    text.trim() !== ''
      ? {
          [prefix]: text,
          [`${prefix}Align`]: align,
          [`${prefix}Italic`]: italic,
          [`${prefix}SizePreset`]: sizePreset,
          [`${prefix}Tone`]: tone,
        }
      : {}
  ) as TextNodeProps<Prefix>;
}

/**
 * TextProps — представляет пропсы компонента Text.
 *
 * @template T тип корневого элемента, по умолчанию `span`
 *
 * @property as — переопределяет корневой HTML-тег, например `<p>`, `<div>`, `<h1>`
 */
type TextProps<T extends ElementType = 'span'> = {
  as?: T;
} & TextStyleProps &
  Omit<ComponentPropsWithRef<T>, 'className' | 'style' | keyof TextStyleProps>;

/**
 * Text — отображает текст с типографикой и тоном из темы.
 *
 * @example
 * // Прямое использование: текст, заголовки
 * <Text>Обычный текст</Text>
 * <Text as="h1" sizePreset="bold" tone="primary">Заголовок</Text>
 * // Подпись поля — компонент FieldLabel из @ui/field-label, не Text напрямую
 * // Внутри контрола — через пропсы родителя, не tone на Text из вызывающего кода:
 * <Button textTone="primary" sizePreset="large">Сохранить</Button>
 */
export function Text<T extends ElementType = 'span'>(props: TextProps<T>) {
  return createElement(StyledText, props);
}

/* eslint-disable react-refresh/only-export-components -- публичные типы, пресеты и резолвер */
export {
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  getEllipsisStyles,
  getNativeFieldTextStyles,
  getTextLineHeight,
  getTextProperties,
  getTextToneColor,
  resolveTextNodeProps,
  textSizePresets,
  type ChildrenTextProps,
  type TextAlignPreset,
  type TextNodeProps,
  type TextSizePreset,
  type TextTone,
};

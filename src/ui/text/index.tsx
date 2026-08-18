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
 * 3. Экспортировать типы `TextProps` и `TextNodeProps`
 * 4. Реэкспортировать публичное API стилей: `TEXT_ALIGN_PRESET_KEYS`, `TEXT_SIZE_PRESET_KEYS`,
 *    `TEXT_TONE_PRESET_KEYS`, `textSizePresets`, `getEllipsisStyles`,
 *    `getTextLineHeight`, `getTextProperties`, `getTextToneColor` и типы
 *
 * Потребители:
 *  - контролы, например Button, Tag и Listbox — рендерят текст внутри себя
 *  - страницы и виджеты приложения, например HomePage — рендерят подписи, заголовки и лейблы
 *  - `@ui/presets` и `@ui/table/column-sizing` — используют реэкспорты типографики
 *  - `@ui/card`, `@ui/range-input` и `@ui/modal` — подключают `TextNodeProps`
 *  - `@ui/field-error` и `@ui/field-label` — подключают `TextProps`
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { createElement, type ComponentPropsWithRef } from 'react';

import { type AllOrNone } from '@ui/type-utils';

import {
  StyledText,
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_PRESET_KEYS,
  getEllipsisStyles,
  getTextLineHeight,
  getTextProperties,
  getTextToneColor,
  textSizePresets,
  type TextAlignPreset,
  type TextSizePreset,
  type TextStyleProps,
  type TextTonePreset,
} from './text.styles';

/**
 * TextHeadingTag — представляет допустимые HTML-теги заголовка у Text.
 */
type TextHeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * TextPlainTag — представляет допустимые обычные текстовые HTML-теги у Text.
 */
type TextPlainTag = 'p' | 'span';

/**
 * TextCaptionTag — представляет допустимые HTML-теги подписи у Text.
 */
type TextCaptionTag = 'label' | 'legend';

/**
 * TextListItemTag — представляет допустимый HTML-тег пункта списка у Text.
 */
type TextListItemTag = 'li';

/**
 * TextTag — представляет объединение допустимых корневых HTML-тегов у Text.
 */
type TextTag = TextCaptionTag | TextHeadingTag | TextListItemTag | TextPlainTag;

/**
 * TextNodeStyleProps — представляет пропсы стилизации текстового узла с префиксом имён.
 * Входит в пакет `TextNodeProps`.
 *
 * @template Prefix префикс имён пропсов, например `title` или `subtitle`
 */
type TextNodeStyleProps<Prefix extends string> = {
  [K in `${Prefix}Align`]?: TextAlignPreset;
} & {
  [K in `${Prefix}Italic`]?: boolean;
} & {
  [K in `${Prefix}Size`]?: TextSizePreset;
} & {
  [K in `${Prefix}Tone`]?: TextTonePreset;
};

/**
 * TextNodeProps — представляет пропсы текстового узла.
 * Поля узла допустимы только вместе с ведущей строкой `${Prefix}`.
 * Уровень заголовка `titleLevel` входит в пакет только при префиксе `title`.
 * Подключается локально через `& TextNodeProps` у потребителей
 * с опциональным текстовым узлом.
 *
 * @template Prefix префикс имён пропсов, например `title` или `subtitle`
 */
type TextNodeProps<Prefix extends string> = AllOrNone<
  {
    [K in Prefix]: string;
  } & TextNodeStyleProps<Prefix> &
    (Prefix extends 'title' ? { titleLevel?: TextHeadingTag } : Record<never, never>)
>;

/**
 * TextProps — представляет пропсы компонента Text.
 *
 * @template T тип корневого элемента
 *
 * @property as — переопределяет корневой HTML-тег, например `<p>`, `<h1>`, `<label>`
 */
type TextProps<T extends TextTag> = {
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
export function Text<T extends TextTag = 'span'>(props: TextProps<T>) {
  return createElement(StyledText, props);
}

/* eslint-disable react-refresh/only-export-components -- публичные типы и пресеты */
export {
  TEXT_ALIGN_PRESET_KEYS,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_PRESET_KEYS,
  getEllipsisStyles,
  getTextLineHeight,
  getTextProperties,
  getTextToneColor,
  textSizePresets,
  type TextAlignPreset,
  type TextNodeProps,
  type TextProps,
  type TextSizePreset,
  type TextTonePreset,
};

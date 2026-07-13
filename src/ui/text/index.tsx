/**
 * Файл: `src/ui/text/index.tsx`
 * Предоставляет компонент Text для отображения текста.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - переопределение корневого элемента через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Text
 * 2. Типизировать пропсы через `TextProps`
 * 3. Реэкспортировать публичное API стилей: `TEXT_TONE_KEYS`, `textSizePresets`,
 *    `getTextProperties`, `getTextToneKey`, `getTextToneColor` и типы
 *
 * Потребители:
 *  - контролы, например Button, Tag и Listbox — рендерят текст внутри себя
 *  - страницы и виджеты приложения, например Home — рендерят подписи, заголовки и лейблы
 *  - `@ui/presets` и `@ui/table/column-sizing` — используют реэкспорты типографики
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { createElement, type ComponentPropsWithRef, type ElementType } from 'react';

import {
  StyledText,
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  getTextProperties,
  getTextToneColor,
  getTextToneKey,
  textSizePresets,
  type TextSizePreset,
  type TextStyleProps,
  type TextTone,
} from './text.styles';

/**
 * TextProps — представляет пропсы компонента Text.
 *
 * @template T — тип корневого элемента, по умолчанию `span`
 *
 * @property as — переопределяет корневой HTML-тег, например `<p>`, `<div>`, `<h1>`
 */
type TextProps<T extends ElementType = 'span'> = {
  as?: T;
} & TextStyleProps &
  Omit<ComponentPropsWithRef<T>, keyof TextStyleProps | 'className' | 'style'>;

/**
 * Text — отображает текст с типографикой и тоном из темы.
 *
 * @example
 * // Прямое использование: подписи, заголовки, muted-лейблы
 * <Text>Обычный текст</Text>
 * <Text as="h1" sizePreset="bold" tone="primary">Заголовок</Text>
 * <Text as="label" sizePreset="medium" tone="muted">Подпись поля</Text>
 * // Внутри контрола — через пропсы родителя, не tone на Text снаружи:
 * <Button textTone="primary" sizePreset="large">Сохранить</Button>
 */
export function Text<T extends ElementType = 'span'>(props: TextProps<T>) {
  return createElement(StyledText, props);
}

/* eslint-disable react-refresh/only-export-components -- публичные типы и пресеты */
export {
  TEXT_SIZE_PRESET_KEYS,
  TEXT_TONE_KEYS,
  getTextProperties,
  getTextToneColor,
  getTextToneKey,
  textSizePresets,
  type TextSizePreset,
  type TextTone,
};

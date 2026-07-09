/**
 * Файл: index.tsx
 * Это точка входа для компонента Text и его публичного API.
 * Предоставляет компонент для отображения текста с поддержкой:
 * - типографических пресетов (sizePreset — TextSizePreset)
 * - семантических тонов (tone — TextTone)
 * - layout-свойств (отступы, позиционирование, размеры)
 * - переопределения корневого элемента через as-проп
 *
 * Основные задачи:
 * 1. Экспортировать компонент Text для использования в приложении
 * 2. Реэкспортировать типы и пресеты (TEXT_TONE_KEYS, textSizePresets) для
 *    контролов, ДС и утилит (@ui/presets, column-sizing)
 * 3. Обеспечить типизацию с поддержкой as-пропа (полиморфный компонент)
 *
 * Типичное использование в kit: `Text` внутри контрола (Button, Tag, …) — тон
 * задаётся через проп `textTone` родительского компонента, который пробрасывает
 * его в `Text` как `tone`; размер текста контрола — через `getTextSize` из `@ui/presets`.
 */

import { createElement, type ComponentPropsWithRef, type ElementType } from 'react';

import {
  StyledText,
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
 * TextProps — тип пропсов компонента Text.
 * Поддерживает все пропсы из TextStyleProps (размер, тон, layout, стили)
 * и стандартные атрибуты DOM-элемента через ComponentPropsWithRef.
 *
 * @template T — тип корневого элемента (по умолчанию 'span')
 *
 * @property as — переопределяет корневой HTML-тег (например, 'p', 'div', 'h1')
 * Остальные пропсы — из TextStyleProps и нативных атрибутов элемента
 */
type TextProps<T extends ElementType = 'span'> = {
  as?: T;
} & TextStyleProps &
  Omit<ComponentPropsWithRef<T>, keyof TextStyleProps | 'className' | 'style'>;

/**
 * Text — основной компонент для отображения текста.
 * Использует StyledText из text.styles.ts и поддерживает все его пропсы.
 *
 * @example
 * // Прямой call site (подписи, заголовки, muted-лейблы)
 * <Text>Обычный текст</Text>
 * <Text as="h1" sizePreset="bold" tone="primary">Заголовок</Text>
 * <Text as="label" sizePreset="medium" tone="muted">Подпись поля</Text>
 * // Внутри контрола — через пропы родителя, не tone на Text снаружи:
 * <Button textTone="primary" sizePreset="large">Сохранить</Button>
 */
export function Text<T extends ElementType = 'span'>(props: TextProps<T>) {
  return createElement(StyledText, props);
}

/* eslint-disable react-refresh/only-export-components -- публичные типы и пресеты */
export {
  TEXT_TONE_KEYS,
  getTextProperties,
  getTextToneColor,
  getTextToneKey,
  textSizePresets,
  type TextSizePreset,
  type TextTone,
};

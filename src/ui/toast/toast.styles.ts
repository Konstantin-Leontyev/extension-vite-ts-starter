/**
 * Файл: `src/ui/toast/toast.styles.ts`
 * Стилизованные компоненты Toast и утилиты их вида.
 * Определяет размерный ряд (из канона `@ui/presets`) и семантический тон (акцентная полоса).
 *
 * Основные задачи:
 * 1. Предоставить тип `ToastStyleProps` (layout + оси вида)
 * 2. Предоставить функции `getToastStyles` и `getToastTextSize`
 * 3. Предоставить стилизованный компонент `StyledToast`
 *
 * Особенности:
 *  - `tone` — акцентная полоса слева (`border-inline-start`), а не заливка
 *  - `minBlockSize`, `padding` и `textSize` — по канону `SizePreset` (`getMinBlockSize`, `getPadding`, `getTextSize`)
 *  - `shape` — `resolveBlockRadius(DEFAULT_SHAPE_PRESET, …)` (значение по умолчанию — 8 px)
 *
 * Потребители: `src/ui/toast/index.tsx`.
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPadding,
  getTextSize,
  resolveBlockRadius,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * ToastStyleProps — тип, представляющий пропсы стилизации компонента и layout-пропы.
 *
 * @property sizePreset — размер компонента из канона `SizePreset`
 * @property tone — семантический тон (акцентная полоса слева, не заливка)
 */
export type ToastStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/** TOAST_PROP_NAMES — множество всех имён пропсов для фильтрации в `shouldForwardProp` корня `StyledToast`. */
const TOAST_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset', 'tone']);

/**
 * getToastTextSize — возвращает значение для оси `textSize` по `sizePreset`.
 *
 * @param sizePreset — размер компонента
 * @returns значение для оси `textSize` по `sizePreset`
 */
export function getToastTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
* getToastStyles — возвращает строку CSS-стилей компонента: размер, отступы, фон, цвет, границу, акцентную полосу, тень.
 *
 * @param props — пропсы стилизации компонента и тема
 * @returns строка CSS-стилей, каждая декларация с новой строкой
 */
export function getToastStyles(props: ToastStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, tone = DEFAULT_TONE } = props;
  const toastColor = getToneColor(theme, tone, theme.colors.border);
  const minBlockSize = getMinBlockSize(sizePreset);
  const padding = getPadding(sizePreset);

  return [
    `min-block-size: ${minBlockSize};`,
    `padding-block: ${padding.block};`,
    `padding-inline: ${padding.inline};`,
    `background-color: ${theme.colors.surface};`,
    `color: ${theme.colors.default};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-inline-start: ${getSpacingValue(4)} solid ${toastColor};`,
    `border-radius: ${resolveBlockRadius(DEFAULT_SHAPE_PRESET, minBlockSize)};`,
    `box-shadow: ${theme.shadow.surface};`,
  ].join('\n');
}

/**
 * StyledToast — компонент Toast.
 * Раскладка — на шаблоне. Вид — `getToastStyles`, layout — `getLayoutStyles`.
 *
 * Поведение по высоте: `min-block-size`, без фиксированного `block-size` — контент растягивает Toast,
 * если текст длиннее минимальной высоты. `ellipsis` не используется, потому что
 * Toast часто показывает сообщения об ошибках/запросах неизвестной длины,
 * и обрезание текста недопустимо.
 */
export const StyledToast = styled.div.withConfig({
  shouldForwardProp: (prop) => !TOAST_PROP_NAMES.has(prop),
})<ToastStyleProps>`
  display: grid;
  align-content: center;
  ${(props) => getToastStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

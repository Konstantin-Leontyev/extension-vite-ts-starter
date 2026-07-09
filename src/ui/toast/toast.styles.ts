/**
 * Файл: toast.styles.ts
 * Стилизованные компоненты Toast и утилиты их вида.
 * Определяет размерный ряд (из канона `@ui/presets`) и семантический тон (акцентная полоса).
 *
 * Основные задачи:
 * 1. Предоставить тип ToastStyleProps (layout + оси вида)
 * 2. Предоставить функции getToastStyles и getToastTextSize
 * 3. Предоставить стилизованный компонент StyledToast
 *
 * Особенности:
 * - `tone` — акцентная полоса слева (`border-inline-start`), а не заливка
 * - Отступы 12/16 — фиксированные для Toast, не через `getPaddingInline` (не control row)
 * - Высота — по канону `SizePreset` через `getBlockSize` (min, не fixed)
 *
 * Потребители: `./index.tsx`.
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SIZE_PRESET,
  getBlockSize,
  getTextSize,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * ToastViewStyleProps — оси вида тоста.
 * `tone` — акцентная полоса слева (не заливка), размер — по канону `SizePreset`.
 */
export type ToastViewStyleProps = {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

export type ToastStyleProps = LayoutProps & ToastViewStyleProps;

/** Оси вида для `shouldForwardProp` корня `StyledToast`. */
const TOAST_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset', 'tone']);

/**
 * getToastTextSize — размер текста (`TextSizePreset`) для `sizePreset` тоста.
 * Дефолт — `DEFAULT_SIZE_PRESET`, как в `getToastStyles`.
 *
 * @param sizePreset — размер тоста (`SizePreset`)
 * @returns `TextSizePreset` для внутреннего `Text`
 */
export function getToastTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * getToastStyles — CSS-стили поверхности тоста.
 * Генерирует: размер, отступы, фон, цвет, границу, акцентную полосу, тень.
 *
 * @param props — оси вида и тема
 * @returns строка CSS-стилей
 */
export function getToastStyles(
  props: ToastViewStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, tone = DEFAULT_TONE } = props;
  const accentColor = getToneColor(theme, tone, theme.colors.border);

  return [
    `min-block-size: ${getBlockSize(sizePreset)};`,
    `padding: ${getSpacingValue(12)} ${getSpacingValue(16)};`,
    `background-color: ${theme.colors.surface};`,
    `color: ${theme.colors.default};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-inline-start: ${getSpacingValue(4)} solid ${accentColor};`,
    `border-radius: ${getSpacingValue(8)};`,
    `box-shadow: ${theme.shadow.surface};`,
  ].join('\n');
}

/**
 * StyledToast — корень тоста.
 * Раскладка — на шаблоне; вид — `getToastStyles`, layout — `getLayoutStyles`.
 *
 * Поведение по высоте: `min-block-size`, не fixed — контент растягивает Toast,
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

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
 * - min-block-size, padding и текст — по канону `SizePreset` (`getMinBlockSize`, `getPadding`, `getTextSize`)
 * - Радиус — `resolveBlockRadius(DEFAULT_SHAPE_PRESET, …)` (8 px при default)
 *
 * Потребители: `./index.tsx`.
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
 * ToastStyleProps — оси вида тоста и layout-пропы.
 * `tone` — акцентная полоса слева (не заливка), размер — по канону `SizePreset`.
 */
export type ToastStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/** TOAST_PROP_NAMES — имена пропсов для фильтрации в `shouldForwardProp` корня `StyledToast`. */
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
 * @returns строка CSS-стилей, каждая декларация с новой строки
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

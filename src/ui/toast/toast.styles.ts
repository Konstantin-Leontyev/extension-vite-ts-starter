/**
 * Файл: `src/ui/toast/toast.styles.ts`
 * Определяет внешний вид компонента Toast.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ToastStyleProps`
 * 2. Предоставить функцию `getToastTextSize`
 * 3. Предоставить styled-узел `StyledToast`
 *
 * Потребители:
 *  - `src/ui/toast/index.tsx` — собирает компонент Toast и реэкспортирует публичное API
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
 * getToastTextSize — возвращает размер текста сообщения по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер уведомления
 * @returns метка размера текста из `TextSizePreset` для текста сообщения
 */
export function getToastTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * ToastStyleProps — представляет пропсы стилизации Toast и layout-пропсы.
 *
 * @property sizePreset — размер компонента
 * @property tone — семантический тон. Задаёт акцентную полосу слева
 *   через `border-inline-start`, а не заливку
 */
export type ToastStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * TOAST_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Toast.
 */
const TOAST_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset', 'tone']);

/**
 * getToastStyles — возвращает CSS-правила для корня `StyledToast`:
 * размер, отступы, фон, цвет, границу, акцентную полосу и тень.
 *
 * @param props пропсы стилизации Toast и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getToastStyles(props: ToastStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, tone = DEFAULT_TONE } = props;
  const minBlockSize = getMinBlockSize(sizePreset);
  const padding = getPadding(sizePreset);

  const styles = [
    `min-block-size: ${minBlockSize};`,
    `padding-block: ${padding.block};`,
    `padding-inline: ${padding.inline};`,
    `background-color: ${theme.colors.surface};`,
    `color: ${theme.colors.default};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-inline-start: ${getSpacingValue(4)} solid ${getToneColor(theme, tone, theme.colors.border)};`,
    `border-radius: ${resolveBlockRadius(DEFAULT_SHAPE_PRESET, minBlockSize)};`,
    `box-shadow: ${theme.shadow.surface};`,
  ];

  return styles.join('\n');
}

/**
 * StyledToast — задаёт корневой узел компонента Toast.
 * Базируется на `<div>` и поддерживает все пропсы из `ToastStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` и `align-content: center` — центрируют текст по вертикали
 *
 * Генерация стилей:
 *  - `getToastStyles` — размер, отступы, фон, цвет, граница, акцентная полоса, тень
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Высота задана через `min-block-size` без фиксированного `block-size`:
 * контент растягивает Toast, если текст длиннее минимальной высоты.
 * `showEllipsis` не используется, так как Toast показывает сообщения неизвестной длины,
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

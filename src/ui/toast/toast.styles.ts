/**
 * Файл: `src/ui/toast/toast.styles.ts`
 * Определяет внешний вид компонента Toast.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ToastStyleProps`
 * 2. Предоставить styled-узел `StyledToast`
 *
 * Потребители:
 *  - `src/ui/toast/index.tsx` — собирает компонент Toast и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPadding,
  resolveBlockRadius,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * ToastStyleProps — представляет пропсы стилизации Toast и layout-пропсы.
 *
 * @property size — размер компонента
 * @property tone — семантический тон. Задаёт акцентную полосу слева
 *   через `border-inline-start`, а не заливку
 */
export type ToastStyleProps = LayoutProps & {
  size?: SizePreset;
  tone?: TonePreset;
};

/**
 * TOAST_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Toast.
 */
const TOAST_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'size', 'tone']);

/**
 * getToastStyles — возвращает CSS-правила для корня `StyledToast`:
 * размер, отступы, фон, цвет, рамку с тенью и акцентную полосу.
 * Рамка — `box-shadow` вне layout-box: блочные стороны не входят в пол
 * `min-block-size`, однострочный Toast держит инвариант §7.3. Реальный `border`
 * остаётся только у акцентной полосы — инлайновая сторона высоту не растит.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `size` и `tone`
 * 2. Собирает габариты, отступы, заливку `surface` и цвет текста
 * 3. Кладёт рамку с тенью через `getBorderStyles` без флагов — рамка с тенью
 *    по дефолтам
 * 4. Красит акцентную полосу слева через `border-inline-start` цветом тона
 *    и задаёт `border-radius` через `resolveBlockRadius`
 *
 * @param props пропсы стилизации Toast и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getToastStyles(props: ToastStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const { size = DEFAULT_SIZE_PRESET, tone = DEFAULT_TONE } = props;
  const minBlockSize = getMinBlockSize(size);
  const padding = getPadding(size);

  return `
    min-block-size: ${minBlockSize};
    padding-block: ${padding.block};
    padding-inline: ${padding.inline};
    background-color: ${theme.colors.surface};
    color: ${theme.colors.default};
    ${getBorderStyles(theme)}
    border-inline-start: ${getSpacingValue(4)} solid ${getToneColor(theme, tone, theme.colors.border)};
    border-radius: ${resolveBlockRadius(DEFAULT_SHAPE_PRESET, minBlockSize)};
  `;
}

/**
 * StyledToast — задаёт корневой узел компонента Toast.
 * Базируется на `<div>` и поддерживает все пропсы из `ToastStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — задаёт сетку для выравнивания содержимого
 *  - `align-content: center` — центрирует текст по вертикали
 *
 * Генерация стилей:
 *  - `getToastStyles` — размер, отступы, фон, цвет, рамка с тенью, акцентная полоса
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Высота задана через `min-block-size` без фиксированного `block-size`:
 * контент растягивает Toast, если текст длиннее минимальной высоты.
 * `ellipsis` не используется, так как Toast показывает сообщения неизвестной длины,
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

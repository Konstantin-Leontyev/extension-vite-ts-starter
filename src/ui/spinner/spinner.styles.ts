/**
 * Файл: `src/ui/spinner/spinner.styles.ts`
 * Определяет внешний вид компонента Spinner.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SpinnerStyleProps`
 * 2. Хранить размер и толщину рамки в `spinnerBlockSize` и `spinnerBorderWidth`
 * 3. Предоставить функцию `getSpinnerStyles`
 * 4. Предоставить styled-узел `StyledSpinner`
 *
 * Потребители:
 *  - `src/ui/spinner/index.tsx` — собирает компонент Spinner
 */

import { css, keyframes, styled } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * spinnerBlockSize — хранит размер спиннера для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Ряд компактнее контролов: для `small` — `16px`, для `medium` — `24px`, для `large` — `32px`.
 */
const spinnerBlockSize = Object.freeze({
  small: 16,
  medium: 24,
  large: 32,
} as const satisfies Record<SizePreset, SpacingValue>);

/**
 * spinnerBorderWidth — хранит толщину рамки спиннера для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — толщина в px.
 * Толщина штриха не привязана к шкале spacing: это не отступ.
 */
const spinnerBorderWidth = Object.freeze({
  small: 2,
  medium: 2,
  large: 4,
} as const satisfies Record<SizePreset, number>);

/**
 * SpinnerStyleProps — представляет пропсы стилизации спиннера и layout-пропсы.
 *
 * @property sizePreset — размер спиннера
 * @property tone — семантический тон
 */
export type SpinnerStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * SPINNER_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Spinner.
 */
const SPINNER_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset', 'tone']);

/**
 * spinnerRotate — задаёт ключевые кадры анимации вращения спиннера.
 */
const spinnerRotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/**
 * getSpinnerStyles — возвращает CSS-правила для корня `StyledSpinner`:
 * размер, рамку и анимацию.
 *
 * @param props — пропсы стилизации спиннера и тема
 * @returns CSS-правила с анимацией
 */
export function getSpinnerStyles(props: SpinnerStyleProps & { theme: AppTheme }) {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;
  const tone = props.tone ?? DEFAULT_TONE;
  const blockSize = getSpacingValue(spinnerBlockSize[sizePreset]);
  const borderWidth = `${spinnerBorderWidth[sizePreset]}px`;
  const spinnerColor = getToneColor(theme, tone, theme.colors.primary);

  return css`
    inline-size: ${blockSize};
    block-size: ${blockSize};
    border: ${borderWidth} solid ${theme.colors.border};
    border-block-start-color: ${spinnerColor};
    border-radius: 50%;
    animation: ${spinnerRotate} 0.8s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation-duration: 1.6s;
    }
  `;
}

/**
 * StyledSpinner — задаёт корневой узел компонента Spinner.
 * Базируется на `<div>` и поддерживает все пропсы из `SpinnerStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `flex-shrink: 0` — спиннер не сжимается при нехватке места
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getSpinnerStyles` — размер, рамка, цвет, анимация
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSpinner = styled.div.withConfig({
  shouldForwardProp: (prop) => !SPINNER_PROP_NAMES.has(prop),
})<SpinnerStyleProps>`
  display: grid;
  flex-shrink: 0;
  min-inline-size: 0;
  ${(props) => getSpinnerStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

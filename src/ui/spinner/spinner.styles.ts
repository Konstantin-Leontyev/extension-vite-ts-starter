/**
 * Файл: spinner.styles.ts
 * Стилизованные компоненты Spinner и утилиты их вида.
 * Определяет локальный размерный ряд по оси `SizePreset` и семантический тон.
 *
 * Основные задачи:
 * 1. Локальные карты размера и толщины рамки по `SizePreset`
 * 2. Предоставить тип SpinnerStyleProps (layout + оси вида)
 * 3. Предоставить функцию getSpinnerStyles для генерации CSS-стилей
 * 4. Предоставить стилизованный компонент StyledSpinner
 *
 * Потребители: `./index.tsx`.
 */

import { css, keyframes, styled } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * spinnerBlockSize — размер спиннера по `sizePreset` (px → rem через getSpacingValue).
 * Ряд компактнее контролов: small — 16, medium — 24, large — 32.
 */
const spinnerBlockSize = {
  small: 16,
  medium: 24,
  large: 32,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * spinnerBorderWidth — толщина рамки спиннера в px (вне шкалы spacing).
 * Штрих 2/3 px не выражается токенами spacing — отдельная px-карта по `SizePreset`.
 */
const spinnerBorderWidth = {
  small: 2,
  medium: 2,
  large: 3,
} as const satisfies Record<SizePreset, number>;

/**
 * SpinnerStyleProps — оси вида спиннера и layout-пропы.
 */
export type SpinnerStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  /** Семантический тон — `default` разрешается в `theme.colors.primary` (fallback). */
  tone?: TonePreset;
};

/** SPINNER_PROP_NAMES — имена пропсов для фильтрации в `shouldForwardProp` корня `StyledSpinner`. */
const SPINNER_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset', 'tone']);

/** spinnerRotate — ключевые кадры для анимации вращения спиннера. */
const spinnerRotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/**
 * getSpinnerStyles — CSS-стили спиннера.
 * Генерирует размер, толщину и цвет рамки, анимацию вращения.
 *
 * @param props — оси вида и тема
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
 * StyledSpinner — корень спиннера.
 * Раскладка — grid (дефолт проекта), защита от сжатия.
 * Вид — `getSpinnerStyles`, layout — `getLayoutStyles`.
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

/**
 * Файл: progress-bar.styles.ts
 * Стилизованные компоненты ProgressBar и утилиты их вида.
 * Локальная карта высоты полосы по оси `SizePreset`, семантический тон и значение.
 *
 * Основные задачи:
 * 1. Локальная карта высоты полосы по `SizePreset`
 * 2. Предоставить тип ProgressBarStyleProps (layout + оси вида)
 * 3. Предоставить функции getProgressBarStyles и getProgressBarFillStyles
 * 4. Предоставить стилизованные компоненты: корень, полоса, заливка
 *
 * Потребители: `./index.tsx`.
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * progressBarBlockSize — высота полосы прогресса по `sizePreset` (px → rem через getSpacingValue).
 * Ряд компактнее контролов: small — 4px, medium — 8px, large — 12px.
 * Все значения есть в шкале spacing.
 */
const progressBarBlockSize = {
  small: 4,
  medium: 8,
  large: 12,
} as const satisfies Record<SizePreset, SpacingValue>;

export type ProgressBarStyleProps = LayoutProps & {
  /** Доля заполнения в диапазоне 0–1. */
  value: number;
  sizePreset?: SizePreset;
  /** Семантический тон — `default` разрешается в `theme.colors.primary` (fallback). */
  tone?: TonePreset;
};

/** Оси вида для `shouldForwardProp` корня, полосы и заливки ProgressBar. */
const PROGRESS_BAR_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'value',
  'sizePreset',
  'tone',
]);

/**
 * clampProgressValue — ограничивает значение диапазоном 0–1.
 * Используется для защиты от некорректных входных данных.
 *
 * @param value — число для ограничения
 * @returns число в диапазоне [0, 1]
 */
export function clampProgressValue(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

/**
 * getProgressBarStyles — CSS-стили полосы прогресса.
 * Задаёт высоту и скругление полосы.
 *
 * @param props — оси вида
 * @returns строка CSS-стилей
 */
export function getProgressBarStyles(props: ProgressBarStyleProps): string {
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;
  const blockSize = getSpacingValue(progressBarBlockSize[sizePreset]);

  return `
    block-size: ${blockSize};
    border-radius: ${blockSize};
  `;
}

/**
 * getProgressBarFillStyles — CSS-стили заливки полосы прогресса.
 * Ширина = процент заполнения, цвет = тон (или primary для default).
 *
 * @param props — оси вида и тема
 * @returns строка CSS-стилей
 */
export function getProgressBarFillStyles(
  props: ProgressBarStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const tone = props.tone ?? DEFAULT_TONE;
  const progressColor = getToneColor(theme, tone, theme.colors.primary);
  const value = clampProgressValue(props.value);

  return `
    inline-size: ${value * 100}%;
    background-color: ${progressColor};
  `;
}

/**
 * StyledProgressBarRoot — корень компонента ProgressBar.
 * Flex-контейнер: полоса + лейбл в ряд.
 * Лейбл отсутствует при showLabel={false} — места не занимает (flex с gap).
 * Оправданное исключение из «grid по умолчанию»: лейбл должен идти в потоке
 * и отсутствовать без резерва места.
 */
export const StyledProgressBarRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_BAR_PROP_NAMES.has(prop),
})<ProgressBarStyleProps>`
  display: flex;
  gap: ${getSpacingValue(12)};
  align-items: center;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledProgressBar — полоса прогресса.
 * Серая дорожка, внутри которой движется заливка.
 * Растягивается на всё доступное место (flex-grow: 1).
 * ARIA-атрибуты (role, aria-valuenow) висят на этом узле.
 */
export const StyledProgressBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_BAR_PROP_NAMES.has(prop),
})<ProgressBarStyleProps>`
  display: grid;
  flex-grow: 1;
  min-inline-size: 0;
  overflow: hidden;
  background-color: ${(props) => getTheme(props).colors.border};
  ${(props) => getProgressBarStyles(props)}
`;

/**
 * StyledProgressBarFill — заливка полосы прогресса.
 * Цветная часть, ширина зависит от значения.
 * Наследует скругление от родителя (border-radius: inherit).
 * Анимация изменения ширины — 120ms ease-out.
 */
export const StyledProgressBarFill = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_BAR_PROP_NAMES.has(prop),
})<ProgressBarStyleProps>`
  block-size: 100%;
  border-radius: inherit;
  transition: inline-size 120ms ease-out;
  ${(props) => getProgressBarFillStyles(props)}
`;

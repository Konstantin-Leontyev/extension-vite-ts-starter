/**
 * Файл: `src/ui/progress-bar/index.tsx`
 * Предоставляет компонент ProgressBar для отображения индикатора выполнения
 * с определённым прогрессом.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - семантический тон через проп `tone`
 *  - долю заполнения через проп `value`
 *  - подпись с процентом через проп `showText`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ProgressBar
 * 2. Типизировать пропсы через `ProgressBarProps`
 * 3. Выставлять `role="progressbar"` и `aria-valuenow` для скринридеров
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают ход выполнения операций
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { getTextSize } from '@ui/presets';
import { Text } from '@ui/text';

import {
  StyledProgressBar,
  StyledProgressBarFill,
  StyledProgressBarRoot,
  clampProgressValue,
  type ProgressBarStyleProps,
} from './progress-bar.styles';

/**
 * DEFAULT_PROGRESS_BAR_SHOW_TEXT — задаёт видимость подписи с процентом по умолчанию.
 * Используется, когда вызывающий код не передал проп `showText`.
 */
const DEFAULT_PROGRESS_BAR_SHOW_TEXT = true;

/**
 * ProgressBarProps — представляет пропсы компонента ProgressBar.
 *
 * @property showText — включает подпись с процентом выполнения рядом с полосой
 */
type ProgressBarProps = ProgressBarStyleProps & {
  showText?: boolean;
} & Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'style' | keyof ProgressBarStyleProps
  >;

/**
 * ProgressBar — отображает полосу прогресса с определённым значением заполнения.
 *
 * @example
 * <ProgressBar value={0.75} />
 * <ProgressBar value={0.5} tone="success" />
 */
function ProgressBar({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  showText = DEFAULT_PROGRESS_BAR_SHOW_TEXT,
  size,
  tone,
  value,
  ...rest
}: ProgressBarProps) {
  const clampedValue = clampProgressValue(value);
  const percent = Math.round(clampedValue * 100);

  return (
    <StyledProgressBarRoot {...rest}>
      <StyledProgressBar
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        role="progressbar"
        size={size}
      >
        <StyledProgressBarFill tone={tone} value={clampedValue} />
      </StyledProgressBar>
      {showText && (
        <Text aria-hidden={true} size={getTextSize(size)} whiteSpace="nowrap">
          {percent}%
        </Text>
      )}
    </StyledProgressBarRoot>
  );
}

export { ProgressBar };

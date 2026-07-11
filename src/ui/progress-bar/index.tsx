/**
 * Файл: `src/ui/progress-bar/index.tsx`
 * Предоставляет компонент ProgressBar для отображения индикатора выполнения
 * с определённым прогрессом.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - долю заполнения через проп `value`
 *  - подпись с процентом через проп `showLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ProgressBar
 * 2. Типизировать пропсы через `ProgressBarProps`
 * 3. Выставлять `role="progressbar"` и `aria-valuenow` для скринридеров
 *
 * Потребители:
 *  - `src/components/model-download-gate/index.tsx` — показывает прогресс загрузки модели
 *  - страницы и виджеты приложения — показывают ход выполнения операций
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { Text } from '@ui/text';

import {
  StyledProgressBar,
  StyledProgressBarFill,
  StyledProgressBarRoot,
  clampProgressValue,
  type ProgressBarStyleProps,
} from './progress-bar.styles';

/**
 * ProgressBarProps — представляет пропсы компонента ProgressBar.
 *
 * @property showLabel — включает подпись с процентом выполнения рядом с полосой
 */
type ProgressBarProps = ProgressBarStyleProps & {
  showLabel?: boolean;
} & Omit<
    ComponentPropsWithRef<'div'>,
    keyof ProgressBarStyleProps | 'className' | 'style'
  >;

/**
 * ProgressBar — отображает полосу прогресса с определённым значением заполнения.
 *
 * @example
 * <ProgressBar value={0.75} />
 * <ProgressBar value={0.5} showLabel tone="success" />
 */
export function ProgressBar({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  showLabel = false,
  value,
  sizePreset,
  tone,
  ...layoutProps
}: ProgressBarProps) {
  const clampedValue = clampProgressValue(value);
  const percent = Math.round(clampedValue * 100);

  return (
    <StyledProgressBarRoot
      sizePreset={sizePreset}
      tone={tone}
      value={clampedValue}
      {...layoutProps}
    >
      <StyledProgressBar
        sizePreset={sizePreset}
        tone={tone}
        value={clampedValue}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        role="progressbar"
      >
        <StyledProgressBarFill
          sizePreset={sizePreset}
          tone={tone}
          value={clampedValue}
        />
      </StyledProgressBar>
      {showLabel && (
        <Text aria-hidden={true} sizePreset="medium" tone="muted" whiteSpace="nowrap">
          {percent}%
        </Text>
      )}
    </StyledProgressBarRoot>
  );
}

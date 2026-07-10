/**
 * Файл: index.tsx
 * Точка входа для компонента ProgressBar и его публичного API.
 * Предоставляет компонент индикатора выполнения (determinate).
 *
 * Основные задачи:
 * 1. Экспортировать компонент ProgressBar для использования в приложении
 * 2. Обеспечить типизацию пропсов
 * 3. Предоставить ARIA-семантику для скринридеров (role="progressbar")
 * 4. Отображать процент выполнения (опционально)
 *
 * Потребители: страницы и виджеты приложения, витрина design-system.
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
 * ProgressBarProps — пропсы компонента ProgressBar.
 *
 * @property showLabel — показывает процент выполнения (целое число 0–100) рядом с полосой
 *
 * Остальные оси — из `ProgressBarStyleProps` и нативных атрибутов `div`.
 */
type ProgressBarProps = ProgressBarStyleProps & {
  showLabel?: boolean;
} & Omit<
    ComponentPropsWithRef<'div'>,
    keyof ProgressBarStyleProps | 'className' | 'style'
  >;

/**
 * ProgressBar — компонент индикатора выполнения.
 * Определённый прогресс (determinate): значение 0–1 отображается заполнением полосы.
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

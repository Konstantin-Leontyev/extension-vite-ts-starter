import { type ComponentPropsWithRef } from 'react';
import { useTheme } from 'styled-components';

import { Text } from '@ui/text';

import {
  StyledProgressFill,
  StyledProgressRoot,
  StyledProgressTrack,
  clampProgressValue,
  type ProgressStyleProps,
} from './progress.styles';

type ProgressProps = ProgressStyleProps & {
  /** Рисует целочисленный процент (0–100) рядом с треком. */
  showLabel?: boolean;
} & Omit<ComponentPropsWithRef<'div'>, keyof ProgressStyleProps | 'className' | 'style'>;

export function Progress({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  showLabel = false,
  value,
  sizePreset,
  tone,
  ...layoutProps
}: ProgressProps) {
  const theme = useTheme();
  const clampedValue = clampProgressValue(value);
  const percent = Math.round(clampedValue * 100);
  const axisProps = { sizePreset, tone, value: clampedValue };

  return (
    <StyledProgressRoot {...axisProps} {...layoutProps}>
      <StyledProgressTrack
        {...axisProps}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        role="progressbar"
      >
        <StyledProgressFill {...axisProps} />
      </StyledProgressTrack>
      {showLabel && (
        <Text
          aria-hidden={true}
          color={theme.colors.muted}
          sizePreset="medium"
          whiteSpace="nowrap"
        >
          {percent}%
        </Text>
      )}
    </StyledProgressRoot>
  );
}

export type { ProgressStyleProps };

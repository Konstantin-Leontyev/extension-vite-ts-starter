import { type ComponentPropsWithRef } from 'react';

import { textSizePreset } from '@ui/presets';
import { Text } from '@ui/text';

import { StyledToast, type ToastStyleProps } from './toast.styles';

export type ToastProps = ToastStyleProps & {
  message: string;
} & Omit<
    ComponentPropsWithRef<'div'>,
    keyof ToastStyleProps | 'children' | 'className' | 'style'
  >;

export function Toast({ message, sizePreset, tone, ...rest }: ToastProps) {
  // layout + прочие пропы идут на один и тот же корень — StyledToast сам потребляет
  // layout (getLayoutStyles) и фильтрует их из DOM (shouldForwardProp); сплит не нужен.
  const isDanger = tone === 'danger';
  const role = isDanger ? 'alert' : 'status';
  const ariaLive = isDanger ? 'assertive' : 'polite';

  return (
    <StyledToast
      role={role}
      aria-live={ariaLive}
      sizePreset={sizePreset}
      tone={tone}
      {...rest}
    >
      {/* Размер текста — по канону ряда (textSizePreset), как у Button/Input. */}
      <Text sizePreset={textSizePreset(sizePreset)}>{message}</Text>
    </StyledToast>
  );
}

export type { ToastStyleProps } from './toast.styles';

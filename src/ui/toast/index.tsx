import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { StyledToast, type ToastStyleProps } from './toast.styles';

export type ToastProps = ToastStyleProps & {
  children: ReactNode;
} & Omit<ComponentPropsWithRef<'div'>, keyof ToastStyleProps | 'className' | 'style'>;

export function Toast({ children, tone, ...rest }: ToastProps) {
  // layout + прочие пропы идут на один и тот же корень — StyledToast сам потребляет
  // layout (getLayoutStyles) и фильтрует их из DOM (shouldForwardProp); сплит не нужен.
  const isDanger = tone === 'danger';
  const role = isDanger ? 'alert' : 'status';
  const ariaLive = isDanger ? 'assertive' : 'polite';

  return (
    <StyledToast role={role} aria-live={ariaLive} tone={tone} {...rest}>
      {children}
    </StyledToast>
  );
}

export type { ToastStyleProps } from './toast.styles';

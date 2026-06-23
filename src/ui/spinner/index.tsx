import { type ComponentPropsWithRef } from 'react';

import { StyledSpinner, type SpinnerStyleProps } from './spinner.styles';

const DEFAULT_SPINNER_LABEL = 'Loading';

type SpinnerProps = SpinnerStyleProps & {
  /** Accessible name for the indeterminate loading indicator. */
  label?: string;
} & Omit<ComponentPropsWithRef<'div'>, keyof SpinnerStyleProps | 'className' | 'style'>;

export function Spinner({ label = DEFAULT_SPINNER_LABEL, ...props }: SpinnerProps) {
  return <StyledSpinner aria-label={label} role="status" {...props} />;
}

export type { SpinnerStyleProps };

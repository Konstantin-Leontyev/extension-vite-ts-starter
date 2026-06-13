import { useId, type CSSProperties, type ComponentPropsWithRef } from 'react';
import { useTheme } from 'styled-components';

import { Text } from '@ui/text';

import {
  StyledInputControl,
  StyledInputRoot,
  splitLayoutProps,
  type InputStyleProps,
} from './input.styles';

type InputProps = InputStyleProps & {
  error?: string;
  errorAlign?: CSSProperties['textAlign'];
  label?: string;
  /** Резерв высоты под строку ошибки, чтобы появление ошибки не сдвигало соседей. */
  reserveErrorSpace?: boolean;
} & Omit<ComponentPropsWithRef<'input'>, keyof InputStyleProps | 'className' | 'style'>;

export function Input({
  align,
  error,
  errorAlign = 'center',
  label,
  reserveErrorSpace = true,
  shape,
  sizePreset,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const { layout, rest: control } = splitLayoutProps(rest);
  const fallbackId = useId();
  const id = control.id ?? fallbackId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error?.trim());
  const showError = hasError || reserveErrorSpace;

  return (
    <StyledInputRoot {...layout}>
      {Boolean(label) && (
        <Text as="label" color={theme.colors.muted} htmlFor={id} sizePreset="medium">
          {label}
        </Text>
      )}
      <StyledInputControl
        type="text"
        {...control}
        align={align}
        aria-describedby={hasError ? errorId : undefined}
        aria-invalid={hasError || undefined}
        id={id}
        shape={shape}
        sizePreset={sizePreset}
      />
      {showError && (
        <Text
          align={errorAlign}
          aria-live="polite"
          as="p"
          color={theme.colors.danger}
          id={errorId}
          minBlockSize={reserveErrorSpace ? '1.25rem' : undefined}
          sizePreset="thin"
        >
          {hasError ? error : null}
        </Text>
      )}
    </StyledInputRoot>
  );
}

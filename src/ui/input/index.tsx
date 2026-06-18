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
  /** invalidRing без текста ошибки — когда сообщение снаружи (RangeInput и т.п.). */
  invalid?: boolean;
  label?: string;
  /** Резерв высоты под строку ошибки, чтобы появление ошибки не сдвигало соседей. */
  reserveErrorSpace?: boolean;
} & Omit<ComponentPropsWithRef<'input'>, keyof InputStyleProps | 'className' | 'style'>;

export function Input({
  align,
  error,
  errorAlign = 'center',
  invalid = false,
  label,
  reserveErrorSpace = true,
  shape,
  sizePreset,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const { layout, rest: control } = splitLayoutProps(rest);
  const { 'aria-describedby': ariaDescribedBy, ...inputControl } = control;
  const fallbackId = useId();
  const id = inputControl.id ?? fallbackId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error?.trim());
  const isInvalid = hasError || invalid;
  const showError = hasError || reserveErrorSpace;
  const describedBy =
    [hasError ? errorId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <StyledInputRoot {...layout}>
      {Boolean(label) && (
        <Text as="label" color={theme.colors.muted} htmlFor={id} sizePreset="medium">
          {label}
        </Text>
      )}
      <StyledInputControl
        type="text"
        {...inputControl}
        align={align}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
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

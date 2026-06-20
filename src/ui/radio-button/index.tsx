import { type ComponentPropsWithRef } from 'react';
import { useTheme } from 'styled-components';

import { Text } from '@ui/text';

import {
  StyledRadioButtonControl,
  StyledRadioButtonRoot,
  splitLayoutProps,
  type RadioButtonStyleProps,
} from './radio-button.styles';

export type RadioButtonProps = RadioButtonStyleProps & {
  /** Один кружок без обёртки-label и подписи (для встраивания в строку списка). */
  bare?: boolean;
  label?: string;
} & Omit<
    ComponentPropsWithRef<'input'>,
    keyof RadioButtonStyleProps | 'className' | 'style' | 'type'
  >;

export function RadioButton({ bare = false, label, ...rest }: RadioButtonProps) {
  const theme = useTheme();

  if (bare) {
    return <StyledRadioButtonControl type="radio" {...rest} />;
  }

  const { layout, rest: control } = splitLayoutProps(rest);

  return (
    <StyledRadioButtonRoot {...layout}>
      <StyledRadioButtonControl type="radio" {...control} />
      {Boolean(label) && (
        <Text color={theme.colors.muted} sizePreset="thin">
          {label}
        </Text>
      )}
    </StyledRadioButtonRoot>
  );
}

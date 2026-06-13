import { createElement, type ComponentPropsWithRef } from 'react';

import { StyledRoundButton, type RoundButtonStyleProps } from './round-button.styles';

type RoundButtonProps = RoundButtonStyleProps &
  Omit<
    ComponentPropsWithRef<'button'>,
    keyof RoundButtonStyleProps | 'className' | 'style' | 'type'
  >;

export function RoundButton(props: RoundButtonProps) {
  return createElement(StyledRoundButton, { type: 'button', ...props });
}

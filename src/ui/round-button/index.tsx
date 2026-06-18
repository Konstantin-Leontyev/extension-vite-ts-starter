import { createElement, type ComponentPropsWithRef } from 'react';

import {
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  StyledRoundButton,
  roundButtonSizePresets,
  type RoundButtonSizePreset,
  type RoundButtonStyleProps,
} from './round-button.styles';

type RoundButtonProps = RoundButtonStyleProps &
  Omit<
    ComponentPropsWithRef<'button'>,
    keyof RoundButtonStyleProps | 'className' | 'style' | 'type'
  >;

export function RoundButton(props: RoundButtonProps) {
  return createElement(StyledRoundButton, { type: 'button', ...props });
}

/* eslint-disable react-refresh/only-export-components -- публичные типы и пресеты */
export {
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  roundButtonSizePresets,
  type RoundButtonSizePreset,
  type RoundButtonStyleProps,
};
/* eslint-enable react-refresh/only-export-components */

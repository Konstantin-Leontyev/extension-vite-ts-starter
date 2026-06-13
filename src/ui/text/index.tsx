import { createElement, type ComponentPropsWithRef, type ElementType } from 'react';

import { StyledText, type TextStyleProps } from './text.styles';

type TextProps<T extends ElementType = 'span'> = {
  as?: T;
} & TextStyleProps &
  Omit<ComponentPropsWithRef<T>, keyof TextStyleProps | 'className' | 'style'>;

export function Text<T extends ElementType = 'span'>(props: TextProps<T>) {
  return createElement(StyledText, props);
}

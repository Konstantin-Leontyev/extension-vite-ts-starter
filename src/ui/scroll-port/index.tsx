import { type ComponentPropsWithRef, type ReactNode } from 'react';

import {
  StyledScrollPort,
  StyledScrollPortContainer,
  StyledScrollPortViewport,
  type ScrollPortStyleProps,
} from './scroll-port.styles';

type ScrollPortProps = ScrollPortStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    keyof ScrollPortStyleProps | 'children' | 'className' | 'style'
  > & {
    children: ReactNode;
  };

export function ScrollPort({
  children,
  paddingInlineEnd,
  ref,
  scrollbarInsetBlockEnd,
  scrollbarInsetBlockStart,
  veil,
  ...rest
}: ScrollPortProps) {
  return (
    <StyledScrollPort paddingInlineEnd={paddingInlineEnd} veil={veil} {...rest}>
      <StyledScrollPortContainer>
        <StyledScrollPortViewport
          ref={ref}
          paddingInlineEnd={paddingInlineEnd}
          scrollbarInsetBlockEnd={scrollbarInsetBlockEnd}
          scrollbarInsetBlockStart={scrollbarInsetBlockStart}
        >
          {children}
        </StyledScrollPortViewport>
      </StyledScrollPortContainer>
    </StyledScrollPort>
  );
}

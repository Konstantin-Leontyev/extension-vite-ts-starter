import {
  createElement,
  type CSSProperties,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useTheme } from 'styled-components';

import { type InsetValue } from '@ui/positioning';
import {
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  RoundButton,
  type RoundButtonSizePreset,
} from '@ui/round-button';
import { Text, type TextSizePreset } from '@ui/text';

import {
  StyledCard,
  StyledCardBody,
  StyledCardHeader,
  StyledCardHeaderFirstLine,
  type CardStyleProps,
} from './card.styles';

type CardHtmlTag = 'article' | 'div' | 'section';

type CardProps<T extends CardHtmlTag = 'div'> = {
  as?: T;
  children?: ReactNode;
  closeIconBottom?: InsetValue;
  closeIconLeft?: InsetValue;
  closeIconRight?: InsetValue;
  closeIconSizePreset?: RoundButtonSizePreset;
  closeIconTop?: InsetValue;
  icon?: ReactNode;
  iconAriaControls?: string;
  iconAriaExpanded?: boolean;
  iconAriaLabel?: string;
  onIconClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  subtitle?: string;
  subtitleAlign?: CSSProperties['textAlign'];
  subtitleColor?: string;
  subtitleSizePreset?: TextSizePreset;
  title?: string;
  titleAlign?: CSSProperties['textAlign'];
  titleColor?: string;
  titleId?: string;
  titleSizePreset?: TextSizePreset;
} & Omit<CardStyleProps, 'hasHeader'> &
  Omit<ComponentPropsWithRef<T>, keyof CardStyleProps | 'className' | 'style' | 'title'>;

export function Card<T extends CardHtmlTag = 'div'>({
  as,
  children,
  closeIconBottom,
  closeIconLeft,
  closeIconRight,
  closeIconSizePreset = DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  closeIconTop,
  icon,
  iconAriaControls,
  iconAriaExpanded,
  iconAriaLabel,
  onIconClick,
  subtitle,
  subtitleAlign,
  subtitleColor,
  subtitleSizePreset,
  title,
  titleAlign,
  titleColor,
  titleId,
  titleSizePreset,
  ...rest
}: CardProps<T>) {
  const theme = useTheme();
  const hasHeader = Boolean(title || subtitle);
  const hasCloseIcon = Boolean(icon);

  const closeIcon = hasCloseIcon && (
    <RoundButton
      aria-controls={iconAriaControls}
      aria-expanded={iconAriaExpanded}
      aria-hidden={iconAriaLabel ? undefined : true}
      aria-label={iconAriaLabel}
      bottom={closeIconBottom}
      elevated={false}
      left={closeIconLeft}
      position="absolute"
      right={closeIconRight ?? 16}
      sizePreset={closeIconSizePreset}
      tabIndex={iconAriaLabel ? undefined : -1}
      top={closeIconTop ?? 16}
      zIndex="1"
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onIconClick?.(event);
      }}
    >
      {icon}
    </RoundButton>
  );

  const subtitleNode = Boolean(subtitle) && (
    <Text
      align={subtitleAlign}
      as="p"
      color={subtitleColor ?? theme.colors.muted}
      sizePreset={subtitleSizePreset ?? 'medium'}
    >
      {subtitle}
    </Text>
  );

  const header = hasHeader && (
    <StyledCardHeader>
      <StyledCardHeaderFirstLine
        closeIconSizePreset={closeIconSizePreset}
        hasCloseIcon={hasCloseIcon}
      >
        {Boolean(title) && (
          <Text
            align={titleAlign}
            as="h2"
            color={titleColor}
            id={titleId}
            sizePreset={titleSizePreset ?? 'bold'}
          >
            {title}
          </Text>
        )}
        {!title && subtitleNode}
      </StyledCardHeaderFirstLine>
      {Boolean(title) && subtitleNode}
    </StyledCardHeader>
  );

  return createElement(
    StyledCard,
    { as: as ?? 'div', hasHeader, ...rest },
    closeIcon,
    header,
    <StyledCardBody>{children}</StyledCardBody>
  );
}

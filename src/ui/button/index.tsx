import { type ComponentPropsWithRef, type ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { Text } from '@ui/text';

import {
  StyledButton,
  StyledButtonIcon,
  StyledButtonText,
  buttonTextColor,
  buttonTextSizePreset,
  type ButtonStyleProps,
  type ButtonTone,
} from './button.styles';

type ButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  textColor?: ButtonTone;
} & ButtonStyleProps &
  Omit<ComponentPropsWithRef<'button'>, keyof ButtonStyleProps | 'className' | 'style'>;

export function Button({
  children,
  icon,
  iconPosition,
  textColor,
  sizePreset,
  tone,
  type = 'button',
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const hasIcon = Boolean(icon);

  const iconNode = hasIcon && <StyledButtonIcon>{icon}</StyledButtonIcon>;

  return (
    <StyledButton
      hasIcon={hasIcon}
      iconPosition={iconPosition}
      sizePreset={sizePreset}
      tone={tone}
      type={type}
      {...rest}
    >
      {iconPosition === 'start' && iconNode}
      <StyledButtonText>
        <Text
          color={buttonTextColor(theme, textColor, tone)}
          ellipsis
          sizePreset={buttonTextSizePreset(sizePreset)}
        >
          {children}
        </Text>
      </StyledButtonText>
      {iconPosition !== 'start' && iconNode}
    </StyledButton>
  );
}

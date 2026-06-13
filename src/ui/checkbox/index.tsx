import { type ComponentPropsWithRef } from 'react';
import { useTheme } from 'styled-components';

import { Text } from '@ui/text';

import {
  StyledCheckboxControl,
  StyledCheckboxLabel,
  StyledCheckboxRoot,
  splitLayoutProps,
  type CheckboxStyleProps,
} from './checkbox.styles';

export type CheckboxProps = CheckboxStyleProps & {
  /** Один бокс без обёртки-label и подписи (для встраивания в строку списка). */
  bare?: boolean;
  label?: string;
} & Omit<
    ComponentPropsWithRef<'input'>,
    keyof CheckboxStyleProps | 'className' | 'style' | 'type'
  >;

export function Checkbox({
  bare = false,
  inverted,
  label,
  sizePreset,
  ...rest
}: CheckboxProps) {
  const theme = useTheme();

  if (bare) {
    return (
      <StyledCheckboxControl
        type="checkbox"
        inverted={inverted}
        sizePreset={sizePreset}
        {...rest}
      />
    );
  }

  const { layout, rest: control } = splitLayoutProps(rest);

  return (
    <StyledCheckboxRoot {...layout}>
      <StyledCheckboxControl
        type="checkbox"
        inverted={inverted}
        sizePreset={sizePreset}
        {...control}
      />
      {Boolean(label) && (
        <StyledCheckboxLabel sizePreset={sizePreset}>
          <Text color={theme.colors.muted} sizePreset="thin">
            {label}
          </Text>
        </StyledCheckboxLabel>
      )}
    </StyledCheckboxRoot>
  );
}

import { type ComponentPropsWithRef, type ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { Text, type TextSizePreset } from '@ui/text';

import {
  FIELDSET_BORDER_TONE_OPTIONS,
  StyledFieldset,
  type FieldsetBorderTone,
  type FieldsetStyleProps,
} from './fieldset.styles';

type FieldsetProps = {
  children?: ReactNode;
  label: string;
  legendColor?: string;
  legendSizePreset?: TextSizePreset;
} & FieldsetStyleProps &
  Omit<ComponentPropsWithRef<'fieldset'>, keyof FieldsetStyleProps | 'className' | 'style'>;

export function Fieldset({
  borderTone,
  children,
  label,
  legendColor,
  legendSizePreset = 'thin',
  ...rest
}: FieldsetProps) {
  const theme = useTheme();

  return (
    <StyledFieldset borderTone={borderTone} {...rest}>
      <legend>
        <Text color={legendColor ?? theme.colors.muted} sizePreset={legendSizePreset}>
          {label}
        </Text>
      </legend>
      {children}
    </StyledFieldset>
  );
}

export { FIELDSET_BORDER_TONE_OPTIONS, type FieldsetBorderTone };

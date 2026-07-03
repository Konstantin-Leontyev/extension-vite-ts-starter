import { type ComponentPropsWithRef } from 'react';

import { Text } from '@ui/text';

import {
  StyledSwitchInput,
  StyledSwitchRoot,
  StyledSwitchTrack,
  splitLayoutProps,
  type SwitchStyleProps,
} from './switch.styles';

export type SwitchProps = SwitchStyleProps & {
  /** Видимая подпись. Без неё доступное имя задаётся через `aria-label`. */
  label?: string;
} & Omit<
    ComponentPropsWithRef<'input'>,
    keyof SwitchStyleProps | 'className' | 'style' | 'type'
  >;

export function Switch({ label, sizePreset, tone, ...rest }: SwitchProps) {
  const { layout, rest: control } = splitLayoutProps(rest);

  return (
    <StyledSwitchRoot {...layout}>
      <StyledSwitchInput role="switch" type="checkbox" {...control} />
      <StyledSwitchTrack aria-hidden="true" sizePreset={sizePreset} tone={tone} />
      {Boolean(label) && <Text sizePreset="medium">{label}</Text>}
    </StyledSwitchRoot>
  );
}

export type { SwitchStyleProps } from './switch.styles';

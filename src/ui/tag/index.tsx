import { type ComponentPropsWithRef, type ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { Text } from '@ui/text';

import {
  DEFAULT_TAG_SIZE_PRESET,
  StyledTag,
  StyledTagDot,
  resolveTagTextColor,
  tagTextSizePreset,
  type TagSizePreset,
  type TagStyleProps,
} from './tag.styles';

type TagProps = {
  children: ReactNode;
} & TagStyleProps &
  Omit<ComponentPropsWithRef<'span'>, keyof TagStyleProps | 'className' | 'style'>;

export function Tag({
  children,
  dot,
  dotColor,
  sizePreset = DEFAULT_TAG_SIZE_PRESET,
  textColor,
  tone,
  ...rest
}: TagProps) {
  const theme = useTheme();

  return (
    <StyledTag sizePreset={sizePreset} tone={tone} {...rest}>
      {dot && <StyledTagDot dotColor={dotColor} tone={tone} />}
      <Text
        color={resolveTagTextColor(theme, textColor, tone)}
        ellipsis
        sizePreset={tagTextSizePreset[sizePreset]}
      >
        {children}
      </Text>
    </StyledTag>
  );
}

export type { TagSizePreset, TagStyleProps };

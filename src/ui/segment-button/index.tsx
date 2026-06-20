import { Fragment, type ComponentPropsWithRef, type ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { useLongPress } from '@hooks/use-long-press';
import { textSizePreset, type ShapePreset, type SizePreset } from '@ui/presets';
import { Text } from '@ui/text';

import {
  StyledSegmentButton,
  StyledSegmentButtonDivider,
  StyledSegmentButtonPart,
  type SegmentButtonStyleProps,
} from './segment-button.styles';

type SegmentButtonAction = {
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  text: string;
  textColor?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onLongPress?: () => void;
  title?: string;
};

type SegmentButtonSegments =
  | { center: SegmentButtonAction; right: SegmentButtonAction }
  | { center: SegmentButtonAction; right?: undefined }
  | { center?: undefined; right: SegmentButtonAction };

type SegmentButtonProps = {
  left: SegmentButtonAction;
} & Omit<SegmentButtonStyleProps, 'left' | 'right'> &
  SegmentButtonSegments &
  Omit<
    ComponentPropsWithRef<'div'>,
    keyof SegmentButtonStyleProps | 'center' | 'className' | 'left' | 'right' | 'style'
  >;

function SegmentButtonPart({
  action,
  shape,
  sizePreset,
}: {
  action: SegmentButtonAction;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
}) {
  const theme = useTheme();
  const {
    active,
    disabled,
    icon,
    text,
    textColor,
    onClick,
    onDoubleClick,
    onLongPress,
    title,
  } = action;

  const { pointerProps, suppressNextClick } = useLongPress({ disabled, onLongPress });

  function handleClick(): void {
    if (suppressNextClick()) {
      return;
    }

    onClick?.();
  }

  const color = textColor ?? (active ? theme.colors.primary : undefined);

  return (
    <StyledSegmentButtonPart
      aria-current={active ? 'true' : undefined}
      disabled={disabled}
      shape={shape}
      sizePreset={sizePreset}
      title={title}
      type="button"
      onClick={onClick || onLongPress ? handleClick : undefined}
      onDoubleClick={onDoubleClick}
      {...(pointerProps ?? {})}
    >
      {icon}
      <Text color={color} ellipsis sizePreset={textSizePreset(sizePreset)}>
        {text}
      </Text>
    </StyledSegmentButtonPart>
  );
}

export function SegmentButton({
  center,
  left,
  ref,
  right,
  shape,
  sizePreset,
  ...rest
}: SegmentButtonProps) {
  const segments = [left, center, right].filter(
    (segment): segment is SegmentButtonAction => segment != null
  );

  if (segments.length < 2) {
    throw new Error(
      'SegmentButton requires at least two segments. Use a button for a single action.'
    );
  }

  return (
    <StyledSegmentButton
      ref={ref}
      data-segments={segments.length}
      shape={shape}
      sizePreset={sizePreset}
      {...rest}
    >
      {segments.map((segment, index) => (
        <Fragment key={segment.text}>
          {index > 0 && (
            <StyledSegmentButtonDivider aria-hidden="true" sizePreset={sizePreset} />
          )}
          <SegmentButtonPart action={segment} shape={shape} sizePreset={sizePreset} />
        </Fragment>
      ))}
    </StyledSegmentButton>
  );
}

export type { SegmentButtonStyleProps } from './segment-button.styles';

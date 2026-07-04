import {
  Fragment,
  type ComponentPropsWithRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { useTheme } from 'styled-components';

import { useLongPress } from '@hooks/use-long-press';
import { textSizePreset, type ShapePreset, type SizePreset } from '@ui/presets';
import { Text } from '@ui/text';

import {
  StyledSegmentButton,
  StyledSegmentButtonDivider,
  StyledSegmentButtonPart,
  resolveSegmentTextColor,
  type SegmentButtonStyleProps,
  type SegmentTextColor,
} from './segment-button.styles';

type SegmentButtonAction = {
  active?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'dialog' | 'listbox';
  disabled?: boolean;
  icon?: ReactNode;
  ref?: RefObject<HTMLButtonElement | null>;
  text: string;
  textColor?: SegmentTextColor;
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
  embedded?: boolean;
  left: SegmentButtonAction;
} & Omit<SegmentButtonStyleProps, 'embedded' | 'left' | 'right'> &
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
    ariaControls,
    ariaExpanded,
    ariaHaspopup,
    disabled,
    icon,
    ref,
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

  const color = resolveSegmentTextColor(theme, textColor, active);

  return (
    <StyledSegmentButtonPart
      ref={ref}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
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
      <Text
        color={color}
        ellipsis
        minInlineSize="0"
        sizePreset={textSizePreset(sizePreset)}
      >
        {text}
      </Text>
    </StyledSegmentButtonPart>
  );
}

export function SegmentButton({
  center,
  embedded = false,
  left,
  ref,
  right,
  shape,
  sizePreset,
  ...rest
}: SegmentButtonProps) {
  const segmentSlots: Array<{ key: string; action: SegmentButtonAction }> = [
    { key: 'left', action: left },
    ...(center != null ? [{ key: 'center', action: center }] : []),
    ...(right != null ? [{ key: 'right', action: right }] : []),
  ];

  if (segmentSlots.length < 2) {
    throw new Error(
      'SegmentButton requires at least two segments. Use a button for a single action.'
    );
  }

  return (
    <StyledSegmentButton
      ref={ref}
      data-segments={segmentSlots.length}
      embedded={embedded}
      shape={shape}
      sizePreset={sizePreset}
      {...rest}
    >
      {segmentSlots.map((slot, index) => (
        <Fragment key={slot.key}>
          {index > 0 && (
            <StyledSegmentButtonDivider aria-hidden="true" sizePreset={sizePreset} />
          )}
          <SegmentButtonPart
            action={slot.action}
            shape={shape}
            sizePreset={sizePreset}
          />
        </Fragment>
      ))}
    </StyledSegmentButton>
  );
}

export type { SegmentButtonStyleProps, SegmentTextColor } from './segment-button.styles';
export { SEGMENT_TEXT_COLOR_OPTIONS } from './segment-button.styles';

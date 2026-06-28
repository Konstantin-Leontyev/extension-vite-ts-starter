import {
  createElement,
  type CSSProperties,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useTheme } from 'styled-components';

import {
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  RoundButton,
  roundButtonSizePresets,
  type RoundButtonSizePreset,
} from '@ui/round-button';
import { Text, type TextSizePreset } from '@ui/text';

import {
  StyledCard,
  StyledCardBody,
  StyledCardHeader,
  StyledCardHeaderActions,
  StyledCardHeaderFirstLine,
  type CardStyleProps,
} from './card.styles';

type CardHtmlTag = 'article' | 'div' | 'section';

/** Кнопка-действие в шапке карточки (copy, settings, close, …) — со своим хендлером. */
export type CardHeaderAction = {
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  icon: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  sizePreset?: RoundButtonSizePreset;
};

type CardProps<T extends CardHtmlTag = 'div'> = {
  as?: T;
  children?: ReactNode;
  headerActions?: CardHeaderAction[];
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

/** Наибольший пресет в ряду действий — под него резервируется высота первой строки шапки. */
function largestActionSizePreset(actions: CardHeaderAction[]): RoundButtonSizePreset {
  return actions.reduce<RoundButtonSizePreset>((largest, action) => {
    const preset = action.sizePreset ?? DEFAULT_ROUND_BUTTON_SIZE_PRESET;

    return roundButtonSizePresets[preset] > roundButtonSizePresets[largest]
      ? preset
      : largest;
  }, DEFAULT_ROUND_BUTTON_SIZE_PRESET);
}

export function Card<T extends CardHtmlTag = 'div'>({
  as,
  children,
  headerActions = [],
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
  const hasActions = headerActions.length > 0;
  const actionsSizePreset = largestActionSizePreset(headerActions);

  const actionsRow = hasActions && (
    <StyledCardHeaderActions>
      {headerActions.map((action, index) => (
        <RoundButton
          key={index}
          aria-controls={action.ariaControls}
          aria-expanded={action.ariaExpanded}
          aria-hidden={action.ariaLabel ? undefined : true}
          aria-label={action.ariaLabel}
          disabled={action.disabled}
          elevated={false}
          sizePreset={action.sizePreset ?? DEFAULT_ROUND_BUTTON_SIZE_PRESET}
          tabIndex={action.ariaLabel ? undefined : -1}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            action.onClick?.(event);
          }}
        >
          {action.icon}
        </RoundButton>
      ))}
    </StyledCardHeaderActions>
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
        actionsSizePreset={actionsSizePreset}
        hasActions={hasActions}
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
    actionsRow,
    header,
    <StyledCardBody>{children}</StyledCardBody>
  );
}

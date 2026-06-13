import {
  useLayoutEffect,
  useState,
  type ComponentProps,
  type ReactNode,
  type Ref,
  type TransitionEvent,
} from 'react';

import { SidebarIcon } from '@icons/sidebar';
import { Card } from '@ui/card';

import {
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarSlot,
  StyledSidebarTrack,
  type SidebarStyleProps,
} from './sidebar.styles';

/** Card-пропы панели прокидываются россыпью; своё у сайдбара — управление выездом и иконка. */
type CardForwardProps = Omit<
  ComponentProps<typeof Card>,
  | keyof SidebarStyleProps
  | 'children'
  | 'icon'
  | 'iconAriaControls'
  | 'iconAriaExpanded'
  | 'id'
  | 'onIconClick'
  | 'titleId'
>;

type SidebarProps = SidebarStyleProps &
  CardForwardProps & {
    children: ReactNode;
    contentRef?: Ref<HTMLDivElement>;
    icon?: ReactNode;
    id?: string;
    onClose: () => void;
    open: boolean;
    sidebarContent: ReactNode;
  };

export function Sidebar({
  children,
  contentRef,
  icon,
  iconAriaLabel = 'Close panel',
  id,
  offset,
  onClose,
  open,
  paddingBlockEnd,
  paddingBlockStart,
  paddingInlineEnd,
  paddingInlineStart,
  sidebarContent,
  title,
  ...cardProps
}: SidebarProps) {
  const titleId = title && id ? `${id}-title` : undefined;

  /* rendered — слот в DOM (открыт или доигрывает закрытие); expanded — визуально раскрыт. */
  const [prevOpen, setPrevOpen] = useState(open);
  const [rendered, setRendered] = useState(open);
  const [expanded, setExpanded] = useState(false);

  /* Синхронизация во время рендера: при открытии монтируем, при закрытии сворачиваем. */
  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setRendered(true);
    } else {
      setExpanded(false);
    }
  }

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    /* Кадр задержки: смонтировать закрытым, затем раскрыть — иначе enter-анимация не играет. */
    const frameId = requestAnimationFrame(() => {
      setExpanded(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [open]);

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>): void {
    /* Размонтируем слот только после завершения сворачивания. */
    if (event.propertyName === 'transform' && !open) {
      setRendered(false);
    }
  }

  return (
    <StyledSidebar
      offset={offset}
      paddingBlockEnd={paddingBlockEnd}
      paddingBlockStart={paddingBlockStart}
      paddingInlineEnd={paddingInlineEnd}
      paddingInlineStart={paddingInlineStart}
    >
      <StyledSidebarContent ref={contentRef}>{children}</StyledSidebarContent>

      <StyledSidebarSlot
        aria-hidden={!rendered}
        aria-labelledby={titleId}
        data-expanded={expanded}
        data-open={rendered}
        id={id}
      >
        <StyledSidebarTrack data-open={expanded} onTransitionEnd={handleTransitionEnd}>
          <Card
            icon={icon ?? <SidebarIcon />}
            iconAriaControls={id}
            iconAriaExpanded={open}
            iconAriaLabel={iconAriaLabel}
            title={title}
            titleId={titleId}
            onIconClick={onClose}
            {...cardProps}
          >
            {sidebarContent}
          </Card>
        </StyledSidebarTrack>
      </StyledSidebarSlot>
    </StyledSidebar>
  );
}

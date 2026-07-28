/**
 * Файл: `src/ui/sidebar/index.tsx`
 * Предоставляет компонент Sidebar для отображения страницы с выезжающей панелью.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - область страницы через `children`
 *  - ref области контента через проп `contentRef`
 *  - дополнительные кнопки в шапке панели через проп `headerActions`. Рендерятся перед
 *    кнопкой сворачивания
 *  - иконку кнопки сворачивания через проп `icon`
 *  - доступное имя кнопки сворачивания через проп `iconAriaLabel`
 *  - id панели через проп `id`
 *  - обработчик закрытия через проп `onClose`
 *  - открытое состояние панели через проп `open`
 *  - содержимое панели через проп `sidebarContent`
 *  - заливку панели через проп `background`
 *  - заголовок панели через проп `title`
 *  - подзаголовок панели через проп `subtitle`
 *  - размер заголовка через проп `titleSizePreset`
 *  - выравнивание заголовка через проп `titleAlign`
 *  - тон заголовка через проп `titleTone`
 *  - размер подзаголовка через проп `subtitleSizePreset`
 *  - выравнивание подзаголовка через проп `subtitleAlign`
 *  - тон подзаголовка через проп `subtitleTone`
 *  - переопределение корневого элемента панели через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Sidebar
 * 2. Типизировать пропсы через `SidebarProps`
 * 3. Выставлять `aria-controls`, `aria-expanded` и `aria-label` на кнопке сворачивания
 *    и `aria-labelledby` на слоте панели
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают страницу с выезжающей панелью
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useLayoutEffect,
  useState,
  type ComponentProps,
  type ReactNode,
  type Ref,
  type TransitionEvent,
} from 'react';

import { SidebarIcon } from '@icons';
import { Card, type CardHeaderAction } from '@ui/card';
import { splitLayoutProps } from '@ui/layout';

import {
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarSlot,
  StyledSidebarTrack,
  type SidebarStyleProps,
} from './sidebar.styles';

/**
 * DEFAULT_SIDEBAR_HEADER_ACTIONS — задаёт ряд действий шапки по умолчанию.
 * Используется, когда вызывающий код не передал проп `headerActions`.
 */
const DEFAULT_SIDEBAR_HEADER_ACTIONS: CardHeaderAction[] = [];

/**
 * DEFAULT_SIDEBAR_ICON — задаёт иконку кнопки сворачивания по умолчанию.
 * Используется, когда вызывающий код не передал проп `icon`.
 */
const DEFAULT_SIDEBAR_ICON = <SidebarIcon />;

/**
 * DEFAULT_SIDEBAR_ICON_ARIA_LABEL — задаёт доступное имя кнопки сворачивания по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconAriaLabel`.
 */
const DEFAULT_SIDEBAR_ICON_ARIA_LABEL = 'Close panel';

/**
 * CardForwardProps — представляет пропсы Card, доступные панели Sidebar.
 * Layout-пропсы зарезервированы за оболочкой Sidebar через `SidebarStyleProps`.
 */
type CardForwardProps = Omit<
  ComponentProps<typeof Card>,
  'children' | 'headerActions' | 'id' | 'titleId' | keyof SidebarStyleProps
>;

/**
 * SidebarProps — представляет пропсы компонента Sidebar.
 *
 * @property children — содержимое области страницы слева от панели
 * @property contentRef — ref области контента
 * @property headerActions — дополнительные кнопки в шапке панели
 * @property icon — иконка кнопки сворачивания
 * @property iconAriaLabel — доступное имя кнопки сворачивания
 * @property id — id панели для связки с кнопкой сворачивания
 * @property onClose — обработчик закрытия панели
 * @property open — включает открытое состояние панели
 * @property sidebarContent — содержимое выезжающей панели
 */
type SidebarProps = SidebarStyleProps &
  CardForwardProps & {
    children: ReactNode;
    contentRef?: Ref<HTMLDivElement>;
    headerActions?: CardHeaderAction[];
    icon?: ReactNode;
    iconAriaLabel?: string;
    id?: string;
    onClose: () => void;
    open: boolean;
    sidebarContent: ReactNode;
  };

/**
 * Sidebar — отображает страницу с выезжающей панелью.
 *
 * @example
 * <Sidebar open={open} onClose={closePanel} sidebarContent={<Settings />}>
 *   <PageContent />
 * </Sidebar>
 * <Sidebar
 *   id="panel"
 *   open={open}
 *   onClose={closePanel}
 *   gap={16}
 *   title="Settings"
 *   sidebarContent={<Settings />}
 * >
 *   <PageContent />
 * </Sidebar>
 */
export function Sidebar({
  children,
  contentRef,
  headerActions = DEFAULT_SIDEBAR_HEADER_ACTIONS,
  icon = DEFAULT_SIDEBAR_ICON,
  iconAriaLabel = DEFAULT_SIDEBAR_ICON_ARIA_LABEL,
  id,
  onClose,
  open,
  sidebarContent,
  title,
  ...rest
}: SidebarProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const titleId = title && id ? `${id}-title` : undefined;

  // Пользовательские действия первыми, кнопка сворачивания — последней, крайняя справа.
  const cardHeaderActions: CardHeaderAction[] = [
    ...headerActions,
    {
      ariaControls: id,
      ariaExpanded: open,
      ariaLabel: iconAriaLabel,
      icon,
      onClick: onClose,
    },
  ];

  // isRendered — слот в DOM, открыт или доигрывает закрытие. isExpanded — визуально раскрыт.
  const [prevOpen, setPrevOpen] = useState(open);
  const [isRendered, setIsRendered] = useState(open);
  const [isExpanded, setIsExpanded] = useState(false);

  // Синхронизирует состояние во время рендера: при открытии добавляет слот в DOM, при закрытии сворачивает.
  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setIsRendered(true);
    } else {
      setIsExpanded(false);
    }
  }

  /**
   * После появления слота в DOM при `open` раскрывает панель на следующем кадре,
   * чтобы сыграла enter-анимация.
   */
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    // Кадр задержки: сначала слот в DOM закрыт, затем раскрывает — иначе enter-анимация не играет.
    const frameId = requestAnimationFrame(() => {
      setIsExpanded(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [open]);

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>): void {
    // Убирает слот из DOM только после завершения сворачивания.
    if (event.propertyName === 'transform' && !open) {
      setIsRendered(false);
    }
  }

  return (
    <StyledSidebar {...layoutProps}>
      <StyledSidebarContent ref={contentRef}>{children}</StyledSidebarContent>

      <StyledSidebarSlot
        aria-hidden={!isRendered}
        aria-labelledby={titleId}
        data-expanded={isExpanded}
        data-open={isRendered}
        id={id}
      >
        <StyledSidebarTrack data-open={isExpanded} onTransitionEnd={handleTransitionEnd}>
          {/*
            Нижний padding Card = 0: тень контента панели уходит в
            paddingBlockEnd ScrollPort у вызывающего кода.
          */}
          <Card
            headerActions={cardHeaderActions}
            paddingBlockEnd={0}
            title={title}
            titleId={titleId}
            {...restProps}
          >
            {sidebarContent}
          </Card>
        </StyledSidebarTrack>
      </StyledSidebarSlot>
    </StyledSidebar>
  );
}

/**
 * Файл: `src/ui/scroll-port/index.tsx`
 * Предоставляет компонент ScrollPort для отображения прокручиваемой области с кросс-системным
 * скроллбаром и градиентными вуалями на краях.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - градиентные вуали на краях через проп `showVeil`
 *  - выступ вуали за inline-край через проп `veilInsetInline`
 *  - прокручиваемое содержимое через `children`
 *  - ссылку на DOM-узел вьюпорта прокрутки через проп `ref`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ScrollPort
 * 2. Типизировать пропсы через `ScrollPortProps`
 *
 * Потребители:
 *  - `@ui/table` — оборачивает таблицу в прокручиваемый контейнер
 *  - `@ui/combobox` — прокручивает список опций
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */
import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from 'react';

import {
  DEFAULT_SCROLL_PORT_SHOW_VEIL,
  StyledScrollPortContainer,
  StyledScrollPortRoot,
  StyledScrollPortViewport,
  omitScrollPortRoutedPaddingProps,
  resolveScrollPortPaddingEdge,
  splitLayoutProps,
  type ScrollPortStyleProps,
} from './scroll-port.styles';

/**
 * SCROLL_PORT_VEIL_EDGE_THRESHOLD_PX — задаёт порог в px у края прокрутки.
 * Ниже порога край считается открытым, соответствующая вуаль выключается.
 */
const SCROLL_PORT_VEIL_EDGE_THRESHOLD_PX = 1;

/**
 * ScrollPortProps — представляет пропсы компонента ScrollPort.
 *
 * @property children — прокручиваемое содержимое
 */
type ScrollPortProps = ScrollPortStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'className' | 'style' | keyof ScrollPortStyleProps
  > & {
    children: ReactNode;
  };

/**
 * assignRef — записывает значение в callback-ref или object-ref.
 *
 * @param ref ссылка вызывающего кода
 * @param value DOM-узел или `null`
 */
function assignRef<T>(ref: Ref<T> | undefined, value: null | T): void {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

/**
 * resolveScrollPortVeilEdges — решает, какие вуали показывать по позиции скролла.
 * Верхняя вуаль — когда контент уехал вверх. Нижняя — когда есть ещё прокрутка вниз.
 *
 * @param viewport DOM-узел вьюпорта прокрутки
 * @returns флаги видимости верхней и нижней вуали
 */
function resolveScrollPortVeilEdges(viewport: HTMLElement): {
  showVeilBlockEnd: boolean;
  showVeilBlockStart: boolean;
} {
  const { clientHeight, scrollHeight, scrollTop } = viewport;
  const maxScrollTop = Math.max(0, scrollHeight - clientHeight);

  return {
    showVeilBlockEnd: scrollTop < maxScrollTop - SCROLL_PORT_VEIL_EDGE_THRESHOLD_PX,
    showVeilBlockStart: scrollTop > SCROLL_PORT_VEIL_EDGE_THRESHOLD_PX,
  };
}

/**
 * applyScrollPortVeilEdges — выставляет `data-veil-block-*` на корне по позиции скролла.
 * Пишет в DOM напрямую: без React-state, чтобы не плодить ререндеры на `scroll`.
 *
 * @param root корневой узел ScrollPort
 * @param viewport вьюпорт прокрутки или `null`
 * @param isVeilEnabled включает расчёт краёв вуали
 */
function applyScrollPortVeilEdges(
  root: HTMLElement,
  viewport: HTMLElement | null,
  isVeilEnabled: boolean
): void {
  if (!viewport || !isVeilEnabled) {
    delete root.dataset.veilBlockEnd;
    delete root.dataset.veilBlockStart;
    return;
  }

  const nextEdges = resolveScrollPortVeilEdges(viewport);

  if (nextEdges.showVeilBlockEnd) {
    root.dataset.veilBlockEnd = 'true';
  } else {
    delete root.dataset.veilBlockEnd;
  }

  if (nextEdges.showVeilBlockStart) {
    root.dataset.veilBlockStart = 'true';
  } else {
    delete root.dataset.veilBlockStart;
  }
}

/**
 * ScrollPort — отображает прокручиваемую область с кросс-системным скроллбаром.
 *
 * @example
 * <ScrollPort>
 *   <LongContent />
 * </ScrollPort>
 * <ScrollPort paddingInlineEnd={8} showVeil={false}>
 *   <OptionsList />
 * </ScrollPort>
 * <ScrollPort paddingBlockEnd={16} ref={viewportRef} {...layout}>
 *   <StyledTableClip>{table}</StyledTableClip>
 * </ScrollPort>
 */
export function ScrollPort({
  children,
  ref,
  showVeil,
  veilInsetInline,
  ...rest
}: ScrollPortProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const paddingBlockStart = resolveScrollPortPaddingEdge(layoutProps, 'blockStart');
  const paddingBlockEnd = resolveScrollPortPaddingEdge(layoutProps, 'blockEnd');
  const paddingInlineStart = resolveScrollPortPaddingEdge(layoutProps, 'inlineStart');
  const paddingInlineEnd = resolveScrollPortPaddingEdge(layoutProps, 'inlineEnd');
  const rootLayoutProps = omitScrollPortRoutedPaddingProps(layoutProps);
  const isVeilEnabled = showVeil ?? DEFAULT_SCROLL_PORT_SHOW_VEIL;
  const rootNodeRef = useRef<HTMLDivElement | null>(null);
  const viewportNodeRef = useRef<HTMLDivElement | null>(null);

  const syncVeilEdges = useCallback(() => {
    const root = rootNodeRef.current;

    if (!root) {
      return;
    }

    applyScrollPortVeilEdges(root, viewportNodeRef.current, isVeilEnabled);
  }, [isVeilEnabled]);

  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportNodeRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );

  useLayoutEffect(() => {
    const viewport = viewportNodeRef.current;

    if (!viewport || !isVeilEnabled) {
      syncVeilEdges();
      return;
    }

    syncVeilEdges();
    viewport.addEventListener('scroll', syncVeilEdges, { passive: true });

    const resizeObserver = new ResizeObserver(syncVeilEdges);
    resizeObserver.observe(viewport);

    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild);
    }

    return () => {
      viewport.removeEventListener('scroll', syncVeilEdges);
      resizeObserver.disconnect();
    };
  }, [children, isVeilEnabled, syncVeilEdges]);

  return (
    <StyledScrollPortRoot
      gutterInlineEnd={paddingInlineEnd}
      ref={rootNodeRef}
      showVeil={showVeil}
      veilInsetInline={veilInsetInline}
      {...rootLayoutProps}
    >
      <StyledScrollPortContainer>
        <StyledScrollPortViewport
          paddingBlockEnd={paddingBlockEnd}
          paddingBlockStart={paddingBlockStart}
          paddingInlineEnd={paddingInlineEnd}
          paddingInlineStart={paddingInlineStart}
          ref={setViewportRef}
          {...restProps}
        >
          {children}
        </StyledScrollPortViewport>
      </StyledScrollPortContainer>
    </StyledScrollPortRoot>
  );
}

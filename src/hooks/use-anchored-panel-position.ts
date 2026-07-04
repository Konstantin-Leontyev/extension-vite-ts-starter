import { useLayoutEffect, type RefObject } from 'react';

/** Внешний зазор панели: outline 2px + outline-offset 2px. */
export const ANCHORED_PANEL_OUTER_INSET = 4;

/** Панель по ширине триггера; вписывается во вьюпорт, при нехватке места снизу — над триггером. */
export function applyAnchoredPanelPosition(
  trigger: HTMLElement,
  panel: HTMLElement
): void {
  const triggerRect = trigger.getBoundingClientRect();
  const panelWidth = triggerRect.width;
  const maxLeft = Math.max(
    ANCHORED_PANEL_OUTER_INSET,
    window.innerWidth - panelWidth - ANCHORED_PANEL_OUTER_INSET
  );
  const left = Math.min(Math.max(ANCHORED_PANEL_OUTER_INSET, triggerRect.left), maxLeft);

  panel.style.insetInlineStart = `${left}px`;
  panel.style.inlineSize = `${panelWidth}px`;
  panel.style.maxInlineSize = `${panelWidth}px`;

  const panelHeight = panel.offsetHeight;
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - triggerRect.top - ANCHORED_PANEL_OUTER_INSET;
  const spaceAbove = triggerRect.top - ANCHORED_PANEL_OUTER_INSET;

  let top: number;
  let maxBlockSize: number | undefined;

  if (panelHeight <= spaceBelow) {
    top = triggerRect.top;
  } else if (panelHeight <= spaceAbove) {
    top = triggerRect.top - panelHeight;
  } else {
    top = ANCHORED_PANEL_OUTER_INSET;
    maxBlockSize = viewportHeight - ANCHORED_PANEL_OUTER_INSET * 2;
  }

  if (top < ANCHORED_PANEL_OUTER_INSET) {
    top = ANCHORED_PANEL_OUTER_INSET;
  }

  if (maxBlockSize === undefined) {
    const available = viewportHeight - top - ANCHORED_PANEL_OUTER_INSET;

    if (panelHeight > available) {
      maxBlockSize = available;
    }
  }

  panel.style.insetBlockStart = `${top}px`;

  if (maxBlockSize != null && maxBlockSize >= 0) {
    panel.style.maxBlockSize = `${maxBlockSize}px`;
    panel.style.overflowY = 'auto';
  } else {
    panel.style.maxBlockSize = '';
    panel.style.overflowY = '';
  }
}

export function useAnchoredPanelPosition(
  active: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  layoutDeps: readonly unknown[] = []
): void {
  useLayoutEffect(() => {
    if (!active) {
      return;
    }

    const triggerElement = triggerRef.current;
    const panelElement = panelRef.current;

    if (!triggerElement || !panelElement) {
      return;
    }

    function updatePosition(): void {
      const trigger = triggerRef.current;
      const panel = panelRef.current;

      if (!trigger || !panel) {
        return;
      }

      applyAnchoredPanelPosition(trigger, panel);
    }

    updatePosition();
    const frameId = window.requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updatePosition);
    };
    // layoutDeps — пересчёт при смене содержимого панели (месяц календаря и т.п.).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- layoutDeps задаёт call site
  }, [active, panelRef, triggerRef, ...layoutDeps]);
}

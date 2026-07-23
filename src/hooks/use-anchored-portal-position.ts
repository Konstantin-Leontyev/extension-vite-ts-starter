/**
 * Файл: `src/hooks/use-anchored-portal-position.ts`
 * Предоставляет позиционирование панели AnchoredPortal относительно якоря.
 *
 * Основные задачи:
 * 1. Типизировать стратегию позиционирования через `AnchoredPortalPositionStrategy`
 * 2. Предоставить хук `useAnchoredPortalPosition`
 *
 * Потребители:
 *  - `@ui/anchored-portal` — ставит панель у якоря при открытии и при `resize`
 */

import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * AnchoredPortalPositionStrategy — представляет стратегию позиционирования панели
 * относительно якоря.
 *
 * @property anchorRef — ссылка на DOM-узел якоря
 * @property apply — обработчик позиционирования для режима `custom`
 * @property layoutDeps — зависимости пересчёта позиции при смене содержимого панели
 * @property mode — режим позиционирования: `calendar`, `trigger-row` или `custom`
 */
export type AnchoredPortalPositionStrategy =
  | {
      anchorRef: RefObject<HTMLElement | null>;
      apply: (anchor: HTMLElement, panel: HTMLElement) => void;
      layoutDeps?: readonly unknown[];
      mode: 'custom';
    }
  | {
      anchorRef: RefObject<HTMLElement | null>;
      layoutDeps?: readonly unknown[];
      mode: 'calendar';
    }
  | {
      anchorRef: RefObject<HTMLElement | null>;
      layoutDeps?: readonly unknown[];
      mode: 'trigger-row';
    };

/**
 * ANCHORED_PANEL_OUTER_INSET_PX — задаёт внешний зазор панели от края вьюпорта.
 * Соответствует сумме `outline` 2px и `outline-offset` 2px.
 */
const ANCHORED_PANEL_OUTER_INSET_PX = 4;

/**
 * EMPTY_LAYOUT_DEPS — задаёт пустой перечень зависимостей пересчёта позиции.
 * Используется, когда стратегия не передала `layoutDeps`.
 */
const EMPTY_LAYOUT_DEPS: readonly unknown[] = [];

/**
 * applyCalendarPanelPosition — ставит панель по ширине триггера и вписывает во вьюпорт.
 * При нехватке места снизу поднимает панель над триггером.
 *
 * @param trigger DOM-узел якоря-триггера
 * @param panel DOM-узел панели
 */
function applyCalendarPanelPosition(trigger: HTMLElement, panel: HTMLElement): void {
  const triggerRect = trigger.getBoundingClientRect();
  const panelWidth = triggerRect.width;
  const maxLeft = Math.max(
    ANCHORED_PANEL_OUTER_INSET_PX,
    window.innerWidth - panelWidth - ANCHORED_PANEL_OUTER_INSET_PX
  );
  const left = Math.min(
    Math.max(ANCHORED_PANEL_OUTER_INSET_PX, triggerRect.left),
    maxLeft
  );

  panel.style.insetInlineStart = `${left}px`;
  panel.style.inlineSize = `${panelWidth}px`;
  panel.style.maxInlineSize = `${panelWidth}px`;

  const panelHeight = panel.offsetHeight;
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - triggerRect.top - ANCHORED_PANEL_OUTER_INSET_PX;
  const spaceAbove = triggerRect.top - ANCHORED_PANEL_OUTER_INSET_PX;

  let top: number;
  let maxBlockSize: number | undefined;

  if (panelHeight <= spaceBelow) {
    top = triggerRect.top;
  } else if (panelHeight <= spaceAbove) {
    top = triggerRect.top - panelHeight;
  } else {
    top = ANCHORED_PANEL_OUTER_INSET_PX;
    maxBlockSize = viewportHeight - ANCHORED_PANEL_OUTER_INSET_PX * 2;
  }

  if (top < ANCHORED_PANEL_OUTER_INSET_PX) {
    top = ANCHORED_PANEL_OUTER_INSET_PX;
  }

  if (maxBlockSize === undefined) {
    const available = viewportHeight - top - ANCHORED_PANEL_OUTER_INSET_PX;

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

/**
 * applyTriggerRowPanelPosition — ставит панель в прямоугольник триггера.
 *
 * @param trigger DOM-узел якоря-триггера
 * @param panel DOM-узел панели
 */
function applyTriggerRowPanelPosition(trigger: HTMLElement, panel: HTMLElement): void {
  const rect = trigger.getBoundingClientRect();

  panel.style.insetBlockStart = `${rect.top}px`;
  panel.style.insetInlineStart = `${rect.left}px`;
  panel.style.inlineSize = `${rect.width}px`;
}

/**
 * applyPositionStrategy — выбирает алгоритм позиционирования по `mode` стратегии.
 *
 * @param strategy стратегия позиционирования панели
 * @param panel DOM-узел панели
 */
function applyPositionStrategy(
  strategy: AnchoredPortalPositionStrategy,
  panel: HTMLElement
): void {
  const anchor = strategy.anchorRef.current;

  if (!anchor) {
    return;
  }

  if (strategy.mode === 'calendar') {
    applyCalendarPanelPosition(anchor, panel);
    return;
  }

  if (strategy.mode === 'trigger-row') {
    applyTriggerRowPanelPosition(anchor, panel);
    return;
  }

  strategy.apply(anchor, panel);
}

/**
 * useAnchoredPortalPosition — позиционирует панель относительно якоря при открытии и `resize`.
 *
 * Как работает:
 * 1. Зеркалит стратегию в ref, чтобы литерал на каждом рендере не перезапускал эффект
 * 2. При `active` и наличии стратегии считает позицию, повторяет в следующем кадре
 *    и слушает `resize`
 * 3. Пересчитывает позицию при смене `layoutDeps` из вызывающего кода
 *
 * @param active включает позиционирование открытой панели
 * @param panelRef ссылка на DOM-узел панели
 * @param strategy стратегия позиционирования относительно якоря
 */
export function useAnchoredPortalPosition(
  active: boolean,
  panelRef: RefObject<HTMLElement | null>,
  strategy: AnchoredPortalPositionStrategy | undefined
): void {
  const layoutDeps = strategy?.layoutDeps ?? EMPTY_LAYOUT_DEPS;
  const hasStrategy = strategy !== undefined;
  const strategyRef = useRef(strategy);

  // Зеркало стратегии: вызывающий код собирает объект литералом на каждом рендере,
  // и identity в deps перезапускала бы эффект каждый рендер открытой панели.
  // Синхронизация в layout-эффекте, объявленном первым: он выполняется до эффекта
  // позиционирования, поэтому кадр открытия читает актуальную стратегию.
  useLayoutEffect(() => {
    strategyRef.current = strategy;
  });

  useLayoutEffect(() => {
    if (!active || !hasStrategy) {
      return;
    }

    function updatePosition(): void {
      const panel = panelRef.current;
      const positionStrategy = strategyRef.current;

      if (!panel || !positionStrategy) {
        return;
      }

      applyPositionStrategy(positionStrategy, panel);
    }

    updatePosition();
    const frameId = window.requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updatePosition);
    };
    // layoutDeps — пересчёт при смене содержимого панели, например месяца календаря.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- layoutDeps задаёт вызывающий код
  }, [active, hasStrategy, panelRef, ...layoutDeps]);
}

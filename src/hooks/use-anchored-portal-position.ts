/**
 * Файл: `src/hooks/use-anchored-portal-position.ts`
 * Предоставляет позиционирование панели AnchoredPortal относительно якоря
 * и готовые хелперы размещения.
 *
 * Основные задачи:
 * 1. Типизировать стратегию позиционирования через `AnchoredPortalPositionStrategy`
 * 2. Предоставить хелперы `placeCalendarPanel` и `matchTriggerRect`
 * 3. Предоставить хук `useAnchoredPortalPosition`
 *
 * Потребители:
 *  - `@ui/anchored-portal` — ставит панель у якоря при открытии и при `resize`
 *  - `@ui/date-range-input` — передаёт `placeCalendarPanel`
 *  - `@ui/range-input` — передаёт `matchTriggerRect`
 */

import { useLayoutEffect, useRef, type RefObject } from 'react';

import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

/**
 * AnchoredPortalPositionStrategy — представляет стратегию позиционирования панели
 * относительно якоря.
 *
 * @property anchorRef — ссылка на DOM-узел якоря
 * @property apply — обработчик позиционирования панели
 * @property layoutDeps — зависимости пересчёта позиции при смене содержимого панели
 */
export type AnchoredPortalPositionStrategy = {
  anchorRef: RefObject<HTMLElement | null>;
  apply: (anchor: HTMLElement, panel: HTMLElement) => void;
  layoutDeps?: readonly unknown[];
};

/**
 * UseAnchoredPortalPositionOptions — представляет опции хука `useAnchoredPortalPosition`.
 *
 * @property active — включает позиционирование открытой панели
 * @property panelRef — ссылка на DOM-узел панели
 * @property strategy — стратегия позиционирования относительно якоря
 */
type UseAnchoredPortalPositionOptions = {
  active: boolean;
  panelRef: RefObject<HTMLElement | null>;
  strategy: AnchoredPortalPositionStrategy | undefined;
};

/**
 * EMPTY_LAYOUT_DEPS — задаёт пустой перечень зависимостей пересчёта позиции.
 * Используется, когда стратегия не передала `layoutDeps`.
 */
const EMPTY_LAYOUT_DEPS: readonly unknown[] = [];

/**
 * clampPanelToViewport — прижимает `inset-inline-start` и `inset-block-start` панели
 * к краям вьюпорта с `PORTAL_VIEWPORT_EDGE_INSET` и при переполнении по высоте задаёт
 * `max-block-size` с `overflow-y: auto`.
 * Используется внутри `placeCalendarPanel`.
 *
 * @param panel DOM-узел панели
 * @param left предпочтительный `inset-inline-start` в px
 * @param top предпочтительный `inset-block-start` в px
 */
function clampPanelToViewport(panel: HTMLElement, left: number, top: number): void {
  const panelHeight = panel.offsetHeight;
  const maxLeft = Math.max(
    PORTAL_VIEWPORT_EDGE_INSET,
    window.innerWidth - panel.offsetWidth - PORTAL_VIEWPORT_EDGE_INSET
  );
  const clampedLeft = Math.min(Math.max(PORTAL_VIEWPORT_EDGE_INSET, left), maxLeft);
  let clampedTop = Math.max(PORTAL_VIEWPORT_EDGE_INSET, top);
  const availableBelow = window.innerHeight - clampedTop - PORTAL_VIEWPORT_EDGE_INSET;

  panel.style.insetInlineStart = `${clampedLeft}px`;
  panel.style.insetBlockStart = `${clampedTop}px`;

  if (panelHeight <= availableBelow) {
    panel.style.maxBlockSize = '';
    panel.style.overflowY = '';

    return;
  }

  const maxTop = Math.max(
    PORTAL_VIEWPORT_EDGE_INSET,
    window.innerHeight - panelHeight - PORTAL_VIEWPORT_EDGE_INSET
  );

  clampedTop = Math.min(clampedTop, maxTop);
  clampedTop = Math.max(PORTAL_VIEWPORT_EDGE_INSET, clampedTop);
  panel.style.insetBlockStart = `${clampedTop}px`;

  const available = window.innerHeight - clampedTop - PORTAL_VIEWPORT_EDGE_INSET;

  if (panelHeight > available) {
    panel.style.maxBlockSize = `${Math.max(0, available)}px`;
    panel.style.overflowY = 'auto';

    return;
  }

  panel.style.maxBlockSize = '';
  panel.style.overflowY = '';
}

/**
 * placeCalendarPanel — ставит панель по ширине триггера относительно якоря.
 *
 * Как работает:
 * 1. Задаёт `inline-size` и `max-inline-size` панели равными ширине триггера
 * 2. Выбирает `inset-block-start`: совпадая с верхом триггера, если панель
 *    помещается вниз от него, над триггером, если помещается вверх от него,
 *    иначе у верхнего края с `PORTAL_VIEWPORT_EDGE_INSET`
 * 3. Прижимает `inset-inline-start` и `inset-block-start` к краям вьюпорта
 *    с `PORTAL_VIEWPORT_EDGE_INSET` и при переполнении по высоте задаёт
 *    `max-block-size` с `overflow-y: auto`
 *
 * @param trigger DOM-узел якоря-триггера
 * @param panel DOM-узел панели
 */
export function placeCalendarPanel(trigger: HTMLElement, panel: HTMLElement): void {
  const triggerRect = trigger.getBoundingClientRect();
  const panelWidth = triggerRect.width;

  panel.style.inlineSize = `${panelWidth}px`;
  panel.style.maxInlineSize = `${panelWidth}px`;

  const panelHeight = panel.offsetHeight;
  const spaceBelow = window.innerHeight - triggerRect.top - PORTAL_VIEWPORT_EDGE_INSET;
  const spaceAbove = triggerRect.top - PORTAL_VIEWPORT_EDGE_INSET;

  let top: number;

  if (panelHeight <= spaceBelow) {
    top = triggerRect.top;
  } else if (panelHeight <= spaceAbove) {
    top = triggerRect.top - panelHeight;
  } else {
    top = PORTAL_VIEWPORT_EDGE_INSET;
  }

  clampPanelToViewport(panel, triggerRect.left, top);
}

/**
 * matchTriggerRect — ставит панель в позицию и ширину триггера.
 *
 * @param trigger DOM-узел якоря-триггера
 * @param panel DOM-узел панели
 */
export function matchTriggerRect(trigger: HTMLElement, panel: HTMLElement): void {
  const rect = trigger.getBoundingClientRect();

  panel.style.insetBlockStart = `${rect.top}px`;
  panel.style.insetInlineStart = `${rect.left}px`;
  panel.style.inlineSize = `${rect.width}px`;
}

/**
 * applyPositionStrategy — вызывает `apply` стратегии для якоря и панели.
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

  strategy.apply(anchor, panel);
}

/**
 * useAnchoredPortalPosition — позиционирует панель относительно якоря при открытии и `resize`.
 *
 * Как работает:
 * 1. Зеркалит стратегию в ref, чтобы литерал на каждом рендере не перезапускал эффект
 * 2. При `active` и наличии стратегии читает якорь из `anchorRef` стратегии и
 *    вызывает её `apply` для якоря и панели, повторяет в следующем кадре и
 *    слушает `resize`
 * 3. Пересчитывает позицию при смене `layoutDeps` из вызывающего кода
 *
 * @param options опции активации, ссылки на панель и стратегии позиционирования
 */
export function useAnchoredPortalPosition({
  active,
  panelRef,
  strategy,
}: UseAnchoredPortalPositionOptions): void {
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

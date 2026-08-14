/**
 * Файл: `src/hooks/use-anchored-portal-position.ts`
 * Предоставляет позиционирование панели AnchoredPortal относительно якоря.
 *
 * Основные задачи:
 * 1. Типизировать стратегию позиционирования через `AnchoredPortalPositionStrategy`
 * 2. Предоставить хук `useAnchoredPortalPosition`
 *
 * Потребители:
 *  - `@ui/anchored-portal` — ставит панель у якоря: CSS-привязкой или JS-стратегией
 */

import { useLayoutEffect, useRef, type RefObject } from 'react';

import { showPopover } from '@ui/popover';

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
 * @property anchorRef — ссылка на DOM-узел якоря для неявной CSS-привязки
 * @property panelRef — ссылка на DOM-узел панели
 * @property strategy — стратегия позиционирования относительно якоря
 */
type UseAnchoredPortalPositionOptions = {
  active: boolean;
  anchorRef?: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  strategy: AnchoredPortalPositionStrategy | undefined;
};

/**
 * EMPTY_LAYOUT_DEPS — задаёт пустой перечень зависимостей пересчёта позиции.
 * Используется, когда стратегия не передала `layoutDeps`.
 */
const EMPTY_LAYOUT_DEPS: readonly unknown[] = [];

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
 * useAnchoredPortalPosition — позиционирует панель относительно якоря при открытии.
 *
 * Как работает:
 * 1. Зеркалит стратегию в ref, чтобы литерал на каждом рендере не перезапускал эффект
 * 2. При `active` показывает панель через `showPopover` из `@ui/popover`.
 *    Без стратегии передаёт `anchorRef` как `source` неявного якоря и не считает
 *    позицию в JS. При наличии стратегии показывает без `source`, вызывает `apply`
 *    стратегии, повторяет в следующем кадре и слушает `resize`
 * 3. Пересчитывает позицию при смене `layoutDeps` из вызывающего кода
 *
 * @param options опции активации, якоря, панели и стратегии позиционирования
 */
export function useAnchoredPortalPosition({
  active,
  anchorRef,
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
    if (!active) {
      return;
    }

    function updatePosition(): void {
      const panel = panelRef.current;

      if (!panel) {
        return;
      }

      const positionStrategy = strategyRef.current;
      const source = positionStrategy ? undefined : (anchorRef?.current ?? undefined);

      showPopover(panel, source);

      if (!positionStrategy) {
        return;
      }

      applyPositionStrategy(positionStrategy, panel);
    }

    updatePosition();

    if (!hasStrategy) {
      return;
    }

    const frameId = window.requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updatePosition);
    };
    // layoutDeps — пересчёт при смене содержимого панели, например длины списка Combobox.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- layoutDeps задаёт вызывающий код
  }, [active, anchorRef, hasStrategy, panelRef, ...layoutDeps]);
}

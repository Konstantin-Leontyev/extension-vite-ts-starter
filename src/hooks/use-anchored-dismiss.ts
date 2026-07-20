/**
 * Файл: `src/hooks/use-anchored-dismiss.ts`
 * Предоставляет закрытие раскрытого слоя по `Escape`, клику вне зон и прокрутке страницы.
 *
 * Основные задачи:
 * 1. Типизировать опции хука через `UseAnchoredDismissOptions`
 * 2. Предоставить хук `useAnchoredDismiss`
 *
 * Потребители:
 *  - `@ui/anchored-portal` — закрывает панель без перепозиционирования
 */

import { useEffect, useEffectEvent, useRef, type RefObject } from 'react';

/**
 * UseAnchoredDismissOptions — представляет опции хука `useAnchoredDismiss`.
 *
 * @property active — включает слушатели закрытия
 * @property onDismiss — обработчик закрытия слоя
 * @property zoneRefs — ссылки на DOM-узлы, клик и прокрутка внутри которых не закрывают слой
 */
export type UseAnchoredDismissOptions = {
  active: boolean;
  onDismiss: () => void;
  zoneRefs: readonly RefObject<HTMLElement | null>[];
};

/**
 * nodeInZones — возвращает, лежит ли узел внутри одной из зон закрытия.
 *
 * @param target проверяемый DOM-узел
 * @param zoneRefs ссылки на зоны, клик внутри которых не закрывает слой
 * @returns `true`, если узел принадлежит хотя бы одной зоне
 */
function nodeInZones(
  target: Node,
  zoneRefs: readonly RefObject<HTMLElement | null>[]
): boolean {
  return zoneRefs.some((zoneRef) => zoneRef.current?.contains(target) ?? false);
}

/**
 * useAnchoredDismiss — закрывает раскрытый слой по `Escape`, клику вне зон и прокрутке.
 * Прокрутка слушается в capture, чтобы закрыть слой до перепозиционирования панели.
 *
 * @param options опции активации, обработчика и зон
 */
export function useAnchoredDismiss({
  active,
  onDismiss,
  zoneRefs,
}: UseAnchoredDismissOptions): void {
  const zoneRefsRef = useRef(zoneRefs);

  useEffect(() => {
    zoneRefsRef.current = zoneRefs;
  });

  const onDismissEvent = useEffectEvent(onDismiss);

  useEffect(() => {
    if (!active) {
      return;
    }

    function isInside(target: Node): boolean {
      return nodeInZones(target, zoneRefsRef.current);
    }

    function handlePointerDown(event: PointerEvent): void {
      const target = event.target as Node;

      if (!isInside(target)) {
        onDismissEvent();
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent): void {
      if (event.key === 'Escape') {
        onDismissEvent();
      }
    }

    function handleScroll(event: Event): void {
      const activeElement = document.activeElement;

      if (activeElement instanceof Node && isInside(activeElement)) {
        return;
      }

      const target = event.target;

      if (target instanceof Node && isInside(target)) {
        return;
      }

      onDismissEvent();
    }

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [active]);
}

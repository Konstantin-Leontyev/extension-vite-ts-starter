/**
 * Файл: `src/hooks/use-anchored-dismiss.ts`
 * Предоставляет закрытие раскрытого слоя по `Escape`, клику вне зон и уходу
 * якоря из полной видимости.
 *
 * Основные задачи:
 * 1. Предоставить хук `useAnchoredDismiss`
 *
 * Потребители:
 *  - `@ui/anchored-panel` — закрывает открытую панель
 */

import { useEffect, useEffectEvent, useRef, type RefObject } from 'react';

/**
 * UseAnchoredDismissOptions — представляет опции хука `useAnchoredDismiss`.
 *
 * @property active — включает слушатели закрытия
 * @property anchorRef — ссылка на DOM-узел якоря. Уход якоря из полной
 *   видимости вызывает `onDismiss`
 * @property onDismiss — обработчик закрытия слоя
 * @property zoneRefs — ссылки на DOM-узлы, клик внутри которых не закрывает слой
 */
type UseAnchoredDismissOptions = {
  active: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  zoneRefs: readonly RefObject<HTMLElement | null>[];
};

/**
 * isNodeInZones — возвращает, лежит ли узел внутри одной из зон.
 *
 * @param target проверяемый DOM-узел
 * @param zoneRefs ссылки на зоны для проверки принадлежности узла
 * @returns `true`, если узел принадлежит хотя бы одной зоне
 */
function isNodeInZones(
  target: Node,
  zoneRefs: readonly RefObject<HTMLElement | null>[]
): boolean {
  return zoneRefs.some((zoneRef) => zoneRef.current?.contains(target) ?? false);
}

/**
 * useAnchoredDismiss — закрывает раскрытый слой по `Escape`, клику вне зон
 * и уходу якоря из полной видимости.
 * `IntersectionObserver` с `threshold: 1` считает якорь полностью видимым
 * только при `entry.intersectionRatio === 1`, а не при `isIntersecting`.
 * После первого полного пересечения хук вооружает закрытие и вызывает
 * `onDismiss`, когда доля пересечения падает. `root` не задан: пересечение
 * считается относительно вьюпорта.
 *
 * @param options опции активации, якоря, обработчика и зон
 */
export function useAnchoredDismiss({
  active,
  anchorRef,
  onDismiss,
  zoneRefs,
}: UseAnchoredDismissOptions): void {
  const zoneRefsRef = useRef(zoneRefs);

  useEffect(() => {
    zoneRefsRef.current = zoneRefs;
  }, [zoneRefs]);

  const onDismissEvent = useEffectEvent(onDismiss);

  useEffect(() => {
    if (!active) {
      return;
    }

    function isInside(target: Node): boolean {
      return isNodeInZones(target, zoneRefsRef.current);
    }

    function handlePointerDown(event: PointerEvent): void {
      if (!isInside(event.target as Node)) {
        onDismissEvent();
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent): void {
      if (event.key === 'Escape') {
        onDismissEvent();
      }
    }

    const anchor = anchorRef.current;
    let intersectionObserver: IntersectionObserver | undefined;

    if (anchor !== null) {
      let isArmed = false;

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;

          if (entry === undefined) {
            return;
          }

          if (entry.intersectionRatio === 1) {
            isArmed = true;
            return;
          }

          if (isArmed) {
            onDismissEvent();
          }
        },
        { threshold: 1 }
      );
      intersectionObserver.observe(anchor);
    }

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      intersectionObserver?.disconnect();
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [active, anchorRef]);
}

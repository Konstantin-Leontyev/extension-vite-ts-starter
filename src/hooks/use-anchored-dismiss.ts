import { useEffect } from 'react';

export type AnchoredDismissOptions = {
  active: boolean;
  isInside: (target: Node) => boolean;
  onDismiss: () => void;
};

/** Esc + клик-вне + scroll (capture) → закрытие раскрытого слоя без перепозиционирования. */
export function useAnchoredDismiss({
  active,
  isInside,
  onDismiss,
}: AnchoredDismissOptions): void {
  useEffect(() => {
    if (!active) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      const target = event.target as Node;

      if (!isInside(target)) {
        onDismiss();
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent): void {
      if (event.key === 'Escape') {
        onDismiss();
      }
    }

    function handleScroll(): void {
      onDismiss();
    }

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [active, isInside, onDismiss]);
}

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export type FocusTrapOptions = {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/** Удержание Tab внутри контейнера; при размонтировании — возврат фокуса. */
export function useFocusTrap({
  active,
  containerRef,
  returnFocusRef,
}: FocusTrapOptions): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const trapContainer = containerRef.current;

    if (!trapContainer) {
      return;
    }

    return mountFocusTrap(trapContainer, returnFocusRef, previousFocusRef);
  }, [active, containerRef, returnFocusRef]);
}

function mountFocusTrap(
  trapContainer: HTMLElement,
  returnFocusRef: RefObject<HTMLElement | null> | undefined,
  previousFocusRef: RefObject<HTMLElement | null>
): () => void {
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const focusables = getFocusables(trapContainer);

    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === first || !trapContainer.contains(activeElement)) {
        event.preventDefault();
        last.focus();
      }

      return;
    }

    if (activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  trapContainer.addEventListener('keydown', handleKeyDown);

  return () => {
    trapContainer.removeEventListener('keydown', handleKeyDown);
    const returnTarget = returnFocusRef?.current ?? previousFocusRef.current;

    returnTarget?.focus();
  };
}

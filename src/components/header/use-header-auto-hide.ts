import { useLayoutEffect, useState } from 'react';

/** Состояние autoHide: guarded setState в рендере + rAF для enter-анимации при включении. */
export function useHeaderAutoHide(autoHide: boolean) {
  const [prevAutoHide, setPrevAutoHide] = useState(autoHide);
  const [revealed, setRevealed] = useState(false);

  if (autoHide !== prevAutoHide) {
    setPrevAutoHide(autoHide);

    if (autoHide) {
      setRevealed(true);
    } else {
      setRevealed(false);
    }
  }

  useLayoutEffect(() => {
    if (!autoHide) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setRevealed(false);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [autoHide]);

  return {
    dataRevealed: autoHide ? revealed : undefined,
    onMouseEnter: autoHide ? () => setRevealed(true) : undefined,
    onMouseLeave: autoHide ? () => setRevealed(false) : undefined,
  };
}

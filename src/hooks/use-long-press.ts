import { useCallback, useRef, type PointerEventHandler } from 'react';

export const DEFAULT_LONG_PRESS_MS = 500;

type UseLongPressOptions = {
  delayMs?: number;
  disabled?: boolean;
  onLongPress?: () => void;
};

type LongPressPointerProps = {
  onPointerCancel: PointerEventHandler;
  onPointerDown: PointerEventHandler;
  onPointerLeave: PointerEventHandler;
  onPointerUp: PointerEventHandler;
};

export function useLongPress({
  delayMs = DEFAULT_LONG_PRESS_MS,
  disabled = false,
  onLongPress,
}: UseLongPressOptions): {
  pointerProps: LongPressPointerProps | null;
  suppressNextClick: () => boolean;
} {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePointerDown = useCallback<PointerEventHandler>(() => {
    if (disabled || !onLongPress) {
      return;
    }

    triggeredRef.current = false;
    clearTimer();
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      onLongPress();
    }, delayMs);
  }, [clearTimer, delayMs, disabled, onLongPress]);

  const handlePointerEnd = useCallback<PointerEventHandler>(() => {
    clearTimer();
  }, [clearTimer]);

  const suppressNextClick = useCallback(() => {
    if (triggeredRef.current) {
      triggeredRef.current = false;
      return true;
    }

    return false;
  }, []);

  if (!onLongPress || disabled) {
    return { pointerProps: null, suppressNextClick };
  }

  return {
    pointerProps: {
      onPointerCancel: handlePointerEnd,
      onPointerDown: handlePointerDown,
      onPointerLeave: handlePointerEnd,
      onPointerUp: handlePointerEnd,
    },
    suppressNextClick,
  };
}

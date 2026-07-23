/**
 * Файл: `src/hooks/use-long-press.ts`
 * Предоставляет распознавание долгого нажатия указателем для контролов.
 *
 * Основные задачи:
 * 1. Предоставить хук `useLongPress`
 *
 * Потребители:
 *  - контролы, например SegmentButton и Table — запускают действие по удержанию
 */

import { useEffect, useRef, type PointerEventHandler } from 'react';

/**
 * DEFAULT_LONG_PRESS_MS — задаёт задержку долгого нажатия по умолчанию.
 * Используется, когда вызывающий код не передал опцию `delayMs`.
 */
const DEFAULT_LONG_PRESS_MS = 500;

/**
 * DEFAULT_LONG_PRESS_DISABLED — задаёт недоступность распознавания по умолчанию.
 * Используется, когда вызывающий код не передал опцию `disabled`.
 */
const DEFAULT_LONG_PRESS_DISABLED = false;

/**
 * UseLongPressOptions — представляет опции хука `useLongPress`.
 *
 * @property delayMs — задержка до срабатывания долгого нажатия
 * @property disabled — включает недоступность распознавания
 * @property onLongPress — обработчик срабатывания долгого нажатия
 */
type UseLongPressOptions = {
  delayMs?: number;
  disabled?: boolean;
  onLongPress?: () => void;
};

/**
 * LongPressPointerProps — представляет обработчики указателя для узла-источника нажатия.
 *
 * @property onPointerCancel — обработчик отмены указателя
 * @property onPointerDown — обработчик начала нажатия
 * @property onPointerLeave — обработчик ухода указателя с узла
 * @property onPointerUp — обработчик отпускания указателя
 */
type LongPressPointerProps = {
  onPointerCancel: PointerEventHandler;
  onPointerDown: PointerEventHandler;
  onPointerLeave: PointerEventHandler;
  onPointerUp: PointerEventHandler;
};

/**
 * useLongPress — возвращает пропсы указателя и подавление клика после долгого нажатия.
 * Без `onLongPress` или при `disabled` возвращает `pointerProps` со значением `null`.
 *
 * @param options опции задержки, недоступности и обработчика
 * @returns пропсы указателя и функцию `suppressNextClick`
 */
export function useLongPress({
  delayMs = DEFAULT_LONG_PRESS_MS,
  disabled = DEFAULT_LONG_PRESS_DISABLED,
  onLongPress,
}: UseLongPressOptions): {
  pointerProps: LongPressPointerProps | null;
  suppressNextClick: () => boolean;
} {
  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const triggeredRef = useRef(false);
  const delayMsRef = useRef(delayMs);
  const disabledRef = useRef(disabled);
  const onLongPressRef = useRef(onLongPress);

  function clearTimer(): void {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    delayMsRef.current = delayMs;
    disabledRef.current = disabled;
    onLongPressRef.current = onLongPress;

    if (disabled || !onLongPress) {
      clearTimer();
    }
  });

  useEffect(() => () => clearTimer(), []);

  function handlePointerDown(): void {
    if (disabledRef.current || !onLongPressRef.current) {
      return;
    }

    triggeredRef.current = false;
    clearTimer();
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      onLongPressRef.current?.();
    }, delayMsRef.current);
  }

  function handlePointerEnd(): void {
    clearTimer();
  }

  function suppressNextClick(): boolean {
    if (triggeredRef.current) {
      triggeredRef.current = false;
      return true;
    }

    return false;
  }

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

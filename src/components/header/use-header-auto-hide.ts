/**
 * Файл: `src/components/header/use-header-auto-hide.ts`
 * Содержит хук управления видимостью шапки в режиме `autoHide`.
 *
 * Основные задачи:
 * 1. Предоставить хук `useHeaderAutoHide`
 *
 * Потребители:
 *  - `src/components/header/index.tsx` — связывает хук с корневым узлом Header
 */

import { useLayoutEffect, useState } from 'react';

/**
 * useHeaderAutoHide — возвращает состояние и обработчики видимости шапки для режима `autoHide`.
 *
 * Как работает:
 * 1. При смене `autoHide` синхронизирует внутреннее состояние: включение сначала показывает
 *    шапку, выключение сразу скрывает её
 * 2. После включения в следующем кадре анимации скрывает шапку через `requestAnimationFrame`
 * 3. Отдаёт `dataRevealed` и обработчики наведения только когда `autoHide` включён
 *
 * @param autoHide включает режим скрытия шапки
 * @returns объект с `dataRevealed`, `handleMouseEnter` и `handleMouseLeave`
 */
export function useHeaderAutoHide(autoHide: boolean) {
  const [prevAutoHide, setPrevAutoHide] = useState(autoHide);
  const [isRevealed, setIsRevealed] = useState(false);

  if (autoHide !== prevAutoHide) {
    setPrevAutoHide(autoHide);

    if (autoHide) {
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }
  }

  useLayoutEffect(() => {
    if (!autoHide) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setIsRevealed(false);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [autoHide]);

  return {
    dataRevealed: autoHide ? isRevealed : undefined,
    handleMouseEnter: autoHide ? () => setIsRevealed(true) : undefined,
    handleMouseLeave: autoHide ? () => setIsRevealed(false) : undefined,
  };
}

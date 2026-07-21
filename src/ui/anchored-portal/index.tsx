/**
 * Файл: `src/ui/anchored-portal/index.tsx`
 * Предоставляет компонент AnchoredPortal для отображения привязанной панели через портал.
 *
 * Поддерживает:
 *  - открытие и закрытие панели через проп `open`
 *  - содержимое панели через проп `children`
 *  - позиционирование относительно якоря через проп `positioning`
 *  - зоны, клик вне которых закрывает панель, через проп `dismissZoneRefs`
 *  - обработчик закрытия панели через проп `onDismiss`
 *  - независимое управление закрытием через проп `dismissActive`
 *  - ловушку фокуса и возврат фокуса через проп `returnFocusRef`
 *  - начальный фокус при открытии через проп `onOpenFocus`
 *  - перефокус при смене содержимого через проп `openFocusDeps`
 *  - ссылку на DOM-узел панели через проп `panelRef`
 *
 * Основные задачи:
 * 1. Экспортировать компонент AnchoredPortal
 * 2. Типизировать пропсы через `AnchoredPortalProps`
 *
 * Потребители:
 *  - контролы, например Combobox, Listbox, DateInput, DateRangeInput и RangeInput —
 *    рендерят выпадающие панели
 *  - Table — рендерит панели compose и другие overlay-панели
 *  - `src/components/profile-menu/index.tsx` — рендерит меню профиля
 */

import { useEffectEvent, useLayoutEffect, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import {
  useAnchoredPortalPosition,
  type AnchoredPortalPositionStrategy,
} from '@hooks/use-anchored-portal-position';
import { useFocus } from '@hooks/use-focus';

/**
 * DEFAULT_ANCHORED_PORTAL_OPEN_FOCUS_DEPS — задаёт зависимости перефокуса по умолчанию.
 * Используется, когда вызывающий код не передал проп `openFocusDeps`.
 */
const DEFAULT_ANCHORED_PORTAL_OPEN_FOCUS_DEPS: readonly unknown[] = [];

/**
 * AnchoredPortalProps — представляет пропсы компонента AnchoredPortal.
 *
 * @property children — содержимое панели
 * @property dismissActive — включает закрытие по клику вне зон. Без значения
 *   совпадает с `open`. Table compose отключает закрытие, пока не передан
 *   обработчик отмены
 * @property dismissZoneRefs — ссылки на зоны, клик вне которых вызывает `onDismiss`
 * @property onDismiss — обработчик закрытия панели
 * @property onOpenFocus — обработчик начального фокуса при открытии
 * @property open — включает видимость панели
 * @property openFocusDeps — зависимости для перефокуса при смене содержимого панели
 * @property panelRef — ссылка на DOM-узел панели
 * @property positioning — стратегия позиционирования относительно якоря
 * @property returnFocusRef — ссылка на элемент для возврата фокуса при закрытии
 */
type AnchoredPortalProps = {
  children: ReactNode;
  dismissActive?: boolean;
  dismissZoneRefs: RefObject<HTMLElement | null>[];
  onDismiss: () => void;
  onOpenFocus?: (panel: HTMLElement) => void;
  open: boolean;
  openFocusDeps?: readonly unknown[];
  panelRef: RefObject<HTMLElement | null>;
  positioning?: AnchoredPortalPositionStrategy;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * AnchoredPortal — отображает привязанную панель через портал в `document.body`.
 *
 * @example
 * <AnchoredPortal
 *   dismissZoneRefs={[triggerRef, panelRef]}
 *   open={open}
 *   panelRef={panelRef}
 *   positioning={{
 *     anchorRef: triggerRef,
 *     mode: 'trigger-row',
 *   }}
 *   returnFocusRef={triggerRef}
 *   onDismiss={close}
 * >
 *   <StyledPanel ref={panelRef}>...</StyledPanel>
 * </AnchoredPortal>
 */
export function AnchoredPortal({
  children,
  dismissActive,
  dismissZoneRefs,
  onDismiss,
  onOpenFocus,
  open,
  openFocusDeps = DEFAULT_ANCHORED_PORTAL_OPEN_FOCUS_DEPS,
  panelRef,
  positioning,
  returnFocusRef,
}: AnchoredPortalProps) {
  const dismissEnabled = dismissActive ?? open;

  useAnchoredDismiss({
    active: dismissEnabled,
    onDismiss,
    zoneRefs: dismissZoneRefs,
  });

  useFocus({
    active: open,
    containerRef: panelRef,
    returnFocusRef,
  });

  useAnchoredPortalPosition(open, panelRef, positioning);

  const onOpenFocusEvent = useEffectEvent((panel: HTMLElement) => {
    onOpenFocus?.(panel);
  });

  /**
   * Начальный фокус при открытии: вызывает `onOpenFocus` после кадра отрисовки,
   * когда DOM-узел панели уже доступен.
   *
   * Как работает:
   * 1. Пропускает планирование, если панель закрыта
   * 2. Планирует вызов `onOpenFocus` на следующий кадр отрисовки
   * 3. Передаёт в обработчик DOM-узел панели из `panelRef`, если узел есть
   * 4. `openFocusDeps` задаёт перезапуск при смене содержимого панели
   */
  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const panel = panelRef.current;

      if (panel) {
        onOpenFocusEvent(panel);
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
    // onOpenFocus — через useEffectEvent: нестабильная identity колбэка не перезапускает эффект.
    // openFocusDeps — перефокус при смене содержимого панели.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- зависимости задаёт вызывающий код через openFocusDeps
  }, [open, panelRef, ...openFocusDeps]);

  if (!open) {
    return null;
  }

  return createPortal(children, document.body);
}

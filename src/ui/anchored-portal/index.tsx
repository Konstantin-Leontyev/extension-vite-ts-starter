/**
 * Файл: `src/ui/anchored-portal/index.tsx`
 * Предоставляет компонент AnchoredPortal для отображения привязанной панели через портал.
 *
 * Поддерживает:
 *  - открытие и закрытие панели через проп `open`
 *  - содержимое панели через проп `children`
 *  - позиционирование относительно якоря через проп `positionStrategy`
 *  - зоны, клик вне которых закрывает панель, через проп `dismissZoneRefs`
 *  - обработчик закрытия панели через проп `onDismiss`
 *  - независимое управление закрытием через проп `dismissActive`
 *  - возврат фокуса при закрытии через проп `returnFocusRef`
 *  - начальный фокус при открытии через проп `onOpenFocus`
 *  - перефокус при смене содержимого через проп `openFocusDeps`
 *  - ссылку на DOM-узел панели через проп `panelRef`
 *
 * Основные задачи:
 * 1. Экспортировать компонент AnchoredPortal
 * 2. Типизировать пропсы через `AnchoredPortalProps`
 * 3. Удерживать обход `Tab` внутри открытой панели — ловушка фокуса встроена
 *    и пропом не управляется
 * 4. Реэкспортировать `getPortalPanelStyles` — хром панели из
 *    `src/ui/anchored-portal/anchored-portal.styles.ts`
 *
 * Потребители:
 *  - контролы, например Combobox, Listbox, DateRangeInput и RangeInput —
 *    рендерят выпадающие панели
 *  - `@ui/table` — рендерит панели add и другие overlay-панели
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
 *   совпадает с `open`
 * @property dismissZoneRefs — ссылки на зоны, клик вне которых вызывает `onDismiss`
 * @property onDismiss — обработчик закрытия панели
 * @property onOpenFocus — обработчик начального фокуса при открытии
 * @property open — включает видимость панели
 * @property openFocusDeps — зависимости для перефокуса при смене содержимого панели
 * @property panelRef — ссылка на DOM-узел панели
 * @property positionStrategy — стратегия позиционирования относительно якоря
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
  positionStrategy?: AnchoredPortalPositionStrategy;
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
 *   positionStrategy={{
 *     anchorRef: triggerRef,
 *     apply: matchTriggerRect,
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
  positionStrategy,
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

  useAnchoredPortalPosition({
    active: open,
    panelRef,
    strategy: positionStrategy,
  });

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
    // onOpenFocus — через useEffectEvent: смена ссылки на колбэк не перезапускает эффект.
    // openFocusDeps — перефокус при смене содержимого панели.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- зависимости задаёт вызывающий код через openFocusDeps
  }, [open, panelRef, ...openFocusDeps]);

  if (!open) {
    return null;
  }

  return createPortal(children, document.body);
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт генератора хрома панели */
export { getPortalPanelStyles } from './anchored-portal.styles';

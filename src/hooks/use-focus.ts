/**
 * Файл: `src/hooks/use-focus.ts`
 * Предоставляет удержание фокуса клавишей `Tab` внутри контейнера и выбор фокусируемых узлов.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getFocusables`
 * 2. Предоставить хук `useFocus`
 *
 * Потребители:
 *  - `@ui/anchored-portal` — удерживает фокус внутри открытой панели
 *  - `@ui/listbox` — находит фокусируемые кнопки в панели через `getFocusables`
 */

import { useEffect, useRef, type RefObject } from 'react';

/**
 * FOCUSABLE_SELECTOR — задаёт CSS-селектор фокусируемых элементов внутри контейнера.
 * Используется в `getFocusables` для обхода узлов ловушки фокуса.
 */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * getFocusables — возвращает фокусируемые элементы внутри контейнера.
 *
 * @param container корневой DOM-узел поиска
 * @returns перечень фокусируемых элементов в порядке обхода DOM
 */
export function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * UseFocusOptions — представляет опции хука `useFocus`.
 *
 * @property active — включает удержание фокуса внутри контейнера
 * @property containerRef — ссылка на DOM-узел контейнера ловушки
 * @property returnFocusRef — ссылка на узел, куда вернуть фокус после отключения.
 *   Без значения фокус возвращается на элемент, активный до включения
 */
type UseFocusOptions = {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * mountFocus — подписывает контейнер на `Tab` и возвращает функцию снятия подписки.
 * При снятии возвращает фокус на `returnFocusRef` или на элемент до включения ловушки.
 *
 * @param focusContainer DOM-узел контейнера ловушки
 * @param returnFocusRef ссылка на узел возврата фокуса
 * @param previousFocusRef ссылка на элемент, активный до включения
 * @returns функция очистки подписки и возврата фокуса
 */
function mountFocus(
  focusContainer: HTMLElement,
  returnFocusRef: RefObject<HTMLElement | null> | undefined,
  previousFocusRef: RefObject<HTMLElement | null>
): () => void {
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const focusables = getFocusables(focusContainer);

    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === first || !focusContainer.contains(activeElement)) {
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

  focusContainer.addEventListener('keydown', handleKeyDown);

  return () => {
    focusContainer.removeEventListener('keydown', handleKeyDown);
    const returnTarget = returnFocusRef?.current ?? previousFocusRef.current;

    returnTarget?.focus();
  };
}

/**
 * useFocus — удерживает обход `Tab` внутри контейнера и возвращает фокус при отключении.
 *
 * @param options опции активации и ссылок на контейнер и возврат фокуса
 */
export function useFocus({
  active,
  containerRef,
  returnFocusRef,
}: UseFocusOptions): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const focusContainer = containerRef.current;

    if (!focusContainer) {
      return;
    }

    return mountFocus(focusContainer, returnFocusRef, previousFocusRef);
  }, [active, containerRef, returnFocusRef]);
}

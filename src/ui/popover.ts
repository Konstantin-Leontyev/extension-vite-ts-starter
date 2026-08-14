/**
 * Файл: `src/ui/popover.ts`
 * Определяет режим нативного popover без автозакрытия UA и идемпотентный показ
 * элемента.
 *
 * Основные задачи:
 * 1. Задать режим `POPOVER_MANUAL`
 * 2. Предоставить показ через `showPopover`
 *
 * Потребители:
 *  - `@ui/anchored-portal` и `src/context/toast/index.tsx` — ставят
 *    `POPOVER_MANUAL` атрибутом `popover`
 *  - `@ui/anchored-portal` и `src/context/toast/index.tsx` —
 *    показывают элемент через `showPopover`
 */

/**
 * POPOVER_MANUAL — задаёт режим нативного popover без автозакрытия UA.
 * Показ ведёт `showPopover`.
 * Используется в `@ui/anchored-portal` и `src/context/toast/index.tsx`.
 */
export const POPOVER_MANUAL = 'manual';

/**
 * showPopover — показывает элемент через нативный `showPopover`.
 * Пропускает вызов, если узел ещё не в дереве или уже открыт.
 * Перехватывает исключение, если UA отклоняет показ.
 * Используется в `@ui/anchored-portal` и `src/context/toast/index.tsx`.
 *
 * @param element DOM-узел с атрибутом `popover`
 * @param source DOM-узел якоря. Задаёт неявный якорь CSS Anchor Positioning
 */
export function showPopover(element: HTMLElement, source?: HTMLElement | null): void {
  if (!element.isConnected || element.matches(':popover-open')) {
    return;
  }

  try {
    if (source) {
      element.showPopover({ source });
    } else {
      element.showPopover();
    }
  } catch {
    return;
  }
}

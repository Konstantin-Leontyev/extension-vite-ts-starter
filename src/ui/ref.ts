/**
 * Файл: `src/ui/ref.ts`
 * Содержит общий хелпер записи узла в React-ref.
 *
 * Основные задачи:
 * 1. Предоставить функцию `assignRef`
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — пишет ссылки на выбранный
 *    и первый доступный день
 *  - `src/ui/search-field/index.tsx` — пишет проп `ref` вызывающего кода на поле ввода
 *  - `src/ui/scroll-port/index.tsx` — пишет проп `ref` вызывающего кода на вьюпорт прокрутки
 *  - `src/ui/stepper/index.tsx` — пишет проп `ref` вызывающего кода на поле ввода
 */

import { type Ref } from 'react';

/**
 * assignRef — записывает узел в функцию-ref или объектный ref.
 *
 * @param ref функция-ref или объектный ref
 * @param node DOM-узел или `null` при снятии узла
 */
export function assignRef<T>(ref: Ref<T> | undefined, node: null | T): void {
  if (typeof ref === 'function') {
    ref(node);
    return;
  }

  if (ref != null) {
    ref.current = node;
  }
}

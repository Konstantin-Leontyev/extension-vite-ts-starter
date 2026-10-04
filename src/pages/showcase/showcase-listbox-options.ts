/**
 * Файл: `src/pages/showcase/showcase-listbox-options.ts`
 * Предоставляет функцию `getListboxOptions` для сборки опций Listbox в витрине дизайн-системы.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getListboxOptions`
 *
 * Потребители:
 *  - сателлиты-списки витрины — собирают опции Listbox:
 *     - `src/pages/showcase/align-listbox/index.tsx`
 *     - `src/pages/showcase/background-listbox/index.tsx`
 *     - `src/pages/showcase/position-listbox/index.tsx`
 *     - `src/pages/showcase/shape-listbox/index.tsx`
 *     - `src/pages/showcase/size-listbox/index.tsx`
 *     - `src/pages/showcase/tone-listbox/index.tsx`
 */

import { type ListboxOption } from '@ui/listbox';

/**
 * getListboxOptions — преобразует перечень строк в опции Listbox.
 *
 * @param keys перечень значений опций
 * @returns опции для Listbox
 */
export function getListboxOptions(keys: readonly string[]): ListboxOption[] {
  return keys.map((key) => ({
    label: key,
    value: key,
  }));
}

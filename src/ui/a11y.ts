/**
 * Файл: `src/ui/a11y.ts`
 * Содержит общие хелперы доступности для контролов со сбросом значения
 * и составным именем триггера.
 * Определяет обязательное доступное имя чекбокса, переключателя и тумблера
 * через `ChildrenAccessibleName`.
 *
 * Основные задачи:
 * 1. Задать текст `aria-label` кнопки сброса по умолчанию через `DEFAULT_CLEAR_ARIA_LABEL`
 * 2. Предоставить функцию `resolveClearAriaLabel`
 * 3. Предоставить функцию `resolveAriaLabelledBy`
 * 4. Предоставить функцию `resolveTriggerAccessibleName`
 * 5. Типизировать обязательное доступное имя через `ChildrenAccessibleName`
 *
 * Потребители:
 *  - `@ui/input`, `@ui/listbox`, `@ui/range-input` — собирают `aria-label`
 *    кнопки сброса через `resolveClearAriaLabel`
 *  - `@ui/listbox`, `@ui/range-input` — собирают `aria-labelledby` триггера
 *    через `resolveAriaLabelledBy`
 *  - `@ui/listbox` вида `icon` — собирает `aria-label` триггера через
 *    `resolveTriggerAccessibleName`
 *  - `@ui/search-field`, `@ui/date-range-input` — собирают `aria-label` кнопки
 *    сброса через `resolveClearAriaLabel` с запасным текстом
 *  - Checkbox, RadioButton и Switch — требуют доступное имя через
 *    `ChildrenAccessibleName`:
 *     - `src/ui/checkbox/index.tsx`
 *     - `src/ui/radio-button/index.tsx`
 *     - `src/ui/switch/index.tsx`
 */

import { type ReactNode } from 'react';

/**
 * DEFAULT_CLEAR_ARIA_LABEL — задаёт текст `aria-label` кнопки сброса по умолчанию.
 * Используется, когда вызывающий код не передал `fallback`.
 */
const DEFAULT_CLEAR_ARIA_LABEL = 'Clear';

/**
 * resolveClearAriaLabel — возвращает `aria-label` кнопки сброса.
 *
 * Как работает:
 * 1. Обрезает краевые пробелы у `label`
 * 2. Без текста возвращает `fallback`
 * 3. Иначе собирает `DEFAULT_CLEAR_ARIA_LABEL` и текст без завершающего `:`
 *
 * @param label подпись контрола или фрагмент для `aria-label`
 * @param fallback запасной текст, когда подпись пустая
 * @returns текст для `aria-label`
 */
export function resolveClearAriaLabel(
  label: string | undefined,
  fallback: string = DEFAULT_CLEAR_ARIA_LABEL
): string {
  const trimmed = label?.trim();

  if (!trimmed) {
    return fallback;
  }

  return `${DEFAULT_CLEAR_ARIA_LABEL} ${trimmed.replace(/:$/, '')}`;
}

/**
 * resolveAriaLabelledBy — возвращает значение `aria-labelledby` из переданных id.
 *
 * Как работает:
 * 1. Отбрасывает пустые id
 * 2. Без оставшихся id возвращает `undefined`
 * 3. Иначе склеивает id через пробел
 *
 * @param ids идентификаторы узлов имени
 * @returns значение `aria-labelledby` или `undefined`
 */
export function resolveAriaLabelledBy(
  ...ids: Array<string | undefined>
): string | undefined {
  const labelledBy = ids.filter((id): id is string => Boolean(id)).join(' ');

  return labelledBy || undefined;
}

/**
 * resolveTriggerAccessibleName — возвращает составной `aria-label` триггера
 * без видимой подписи: подпись и текст значения через пробел.
 *
 * Как работает:
 * 1. Без подписи возвращает текст значения
 * 2. Иначе склеивает подпись и значение через пробел
 *
 * @param label подпись контрола
 * @param valueText текст выбранного значения или плейсхолдера
 * @returns текст для `aria-label`
 */
export function resolveTriggerAccessibleName(
  label: string | undefined,
  valueText: string
): string {
  const trimmed = label?.trim();

  if (!trimmed) {
    return valueText;
  }

  return `${trimmed} ${valueText}`;
}

/**
 * ChildrenAccessibleName — представляет обязательное доступное имя чекбокса,
 * переключателя и тумблера.
 * Требует один из пропов: `children`, `aria-label` или `aria-labelledby`.
 * Используется в пропсах Checkbox, RadioButton и Switch.
 *
 * @property aria-label — текстовая метка
 * @property aria-labelledby — id элемента с меткой
 * @property children — подпись
 */
export type ChildrenAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never; children?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string; children?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; children: ReactNode };

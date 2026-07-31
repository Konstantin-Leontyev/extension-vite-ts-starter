/**
 * Файл: `src/ui/a11y.ts`
 * Содержит общие хелперы доступности для контролов со сбросом значения.
 *
 * Основные задачи:
 * 1. Задать текст `aria-label` кнопки сброса по умолчанию через `DEFAULT_CLEAR_ARIA_LABEL`
 * 2. Предоставить функцию `resolveClearAriaLabel`
 *
 * Потребители:
 *  - `@ui/listbox`, `@ui/combobox`, `@ui/range-input` — собирают `aria-label`
 *    кнопки сброса через `resolveClearAriaLabel`
 *  - `@ui/date-range-input` — собирает `aria-label` кнопки сброса через
 *    `resolveClearAriaLabel` с запасным текстом
 */

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
 * 3. Иначе собирает `Clear` и текст без завершающего `:`
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

  return `Clear ${trimmed.replace(/:$/, '')}`;
}

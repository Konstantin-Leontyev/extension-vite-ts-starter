/**
 * Файл: `src/ui/border.ts`
 * Содержит рамку поверхности: статичную пару «рамка 1px + тень» для карточек
 * и панелей и переключаемое кольцо контролов вне layout-box.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getBorderStyles` — рамка и тень поверхности
 * 2. Предоставить функцию `getControlBorderStyles` — переключаемое кольцо контрола
 * 3. Задать дефолт пропа `showBorder` через `DEFAULT_SHOW_BORDER`
 *
 * Потребители:
 *  - `src/ui/card/card.styles.ts`, `src/ui/toast/toast.styles.ts`,
 *    `src/ui/anchored-portal/anchored-portal.styles.ts` — рамка и тень поверхности
 *  - styles-файлы контролов с режимом рамки, например Input, RoundButton,
 *    SegmentButton и DateRangeInput
 */

import { type AppTheme } from '@ui/theme';

/**
 * DEFAULT_SHOW_BORDER — задаёт показ кольца поверхности по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
export const DEFAULT_SHOW_BORDER = true;

/**
 * getBorderStyles — возвращает CSS-правила рамки поверхности: `border` 1px
 * цвета `border` и тень `shadow.surface`. Для статичных поверхностей —
 * карточки, тоста, панели портала; акцентные стороны, например тональная
 * полоса Toast, переопределяются декларацией после вызова.
 * Переключаемая рамка контрола — `getControlBorderStyles`.
 *
 * @param theme текущая тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getBorderStyles(theme: AppTheme): string {
  const styles = [
    `border: 1px solid ${theme.colors.border};`,
    `box-shadow: ${theme.shadow.surface};`,
  ];

  return styles.join('\n');
}

/**
 * getControlBorderStyles — возвращает CSS-правило рамки контрола вне layout-box:
 * кольцо и тень поверхности одним `box-shadow`. Рамочный и безрамочный режимы
 * дают один content-box и одно окно `Icon`, без резерва
 * `border: 1px solid transparent`.
 * Проп `showBorder` подключается контролу осознанно: эталоны RoundButton и Input.
 * Составные триггеры, например Listbox, Combobox, Stepper и RangeInput, проп не
 * получают без отдельного кейса. Оболочка композита без пропа вызывает функцию
 * без второго аргумента.
 * При `showBorder` — кольцо `0 0 0 1px` цвета `border` и тень `shadow.surface`.
 * Без рамки — `box-shadow: none`. `border: none` вызывающий код пишет только там,
 * где layout-рамку даёт UA-стиль тега, например `input` и `dialog`: у `button` её
 * снял reset, у `div` рамки нет — повтор запрещён.
 *
 * @param theme текущая тема
 * @param showBorder включает рамку контрола
 * @returns CSS-правило `box-shadow`, с завершающей `;`
 */
export function getControlBorderStyles(
  theme: AppTheme,
  showBorder: boolean = DEFAULT_SHOW_BORDER
): string {
  if (!showBorder) {
    return 'box-shadow: none;';
  }

  return `box-shadow: 0 0 0 1px ${theme.colors.border}, ${theme.shadow.surface};`;
}

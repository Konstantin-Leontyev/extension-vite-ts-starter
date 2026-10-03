/**
 * Файл: `src/ui/choice-control.ts`
 * Содержит генератор ряда контрола и подписи.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getChoiceControlRootStyles`
 *
 * Потребители:
 *  - styles-файлы Checkbox, RadioButton и Switch —
 *    подключают `getChoiceControlRootStyles`:
 *     - `src/ui/checkbox/checkbox.styles.ts`
 *     - `src/ui/radio-button/radio-button.styles.ts`
 *     - `src/ui/switch/switch.styles.ts`
 */

import { getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getSpacingValue } from '@ui/spacing';

/**
 * getChoiceControlRootStyles — возвращает CSS-правила ряда контрола и подписи.
 * Строка `inline-grid`, зазор `8`, выравнивание по центру к старту, `cursor: pointer`
 * и layout-пропсы через `getLayoutStyles`.
 *
 * @param props layout-пропсы корня
 * @returns CSS-правила, каждое с новой строки
 */
export function getChoiceControlRootStyles(props: LayoutProps): string {
  return `
    display: inline-grid;
    grid-auto-flow: column;
    gap: ${getSpacingValue(8)};
    align-items: center;
    justify-content: start;
    cursor: pointer;
    ${getLayoutStyles(props)}
  `;
}

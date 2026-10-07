/**
 * Файл: `src/ui/control-root.ts`
 * Содержит генератор корня подписи над контролом.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getControlRootStyles`
 *
 * Потребители:
 *  - styles-файлы Button, Input, SearchField, SegmentButton и Stepper —
 *    подключают `getControlRootStyles`:
 *     - `src/ui/button/button.styles.ts`
 *     - `src/ui/input/input.styles.ts`
 *     - `src/ui/search-field/search-field.styles.ts`
 *     - `src/ui/segment-button/segment-button.styles.ts`
 *     - `src/ui/stepper/stepper.styles.ts`
 */

import { getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getSpacingValue } from '@ui/spacing';

/**
 * getControlRootStyles — возвращает CSS-правила корня подписи над контролом.
 * Колонка `grid`, зазор `8`, `inline-size: 100%`, `min-inline-size: 0`
 * и layout-пропсы через `getLayoutStyles`.
 *
 * @param props layout-пропсы корня
 * @returns CSS-правила, каждое с новой строки
 */
export function getControlRootStyles(props: LayoutProps): string {
  return `
    display: grid;
    gap: ${getSpacingValue(8)};
    inline-size: 100%;
    min-inline-size: 0;
    ${getLayoutStyles(props)}
  `;
}

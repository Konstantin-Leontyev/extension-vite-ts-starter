/**
 * Файл: `src/ui/field-label/field-label.styles.ts`
 * Содержит генератор корня «подпись над контролом».
 *
 * Основные задачи:
 * 1. Предоставить функции `getFieldLabelRootStyles`
 *
 * Потребители:
 *  - `src/ui/field-label/index.tsx` — реэкспортирует генератор
 *  - styles-файлы Button, Input, SearchField, SegmentButton и Stepper —
 *    подключают `getFieldLabelRootStyles`
 */

import { getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getSpacingValue } from '@ui/spacing';

/**
 * getFieldLabelRootStyles — возвращает CSS-правила корня «подпись над контролом».
 * Колонка `grid` с зазором `8`, ширина родителя, `min-inline-size: 0`
 * и layout-пропсы через `getLayoutStyles`.
 *
 * @param props layout-пропсы корня
 * @returns CSS-правила, каждое с новой строки
 */
export function getFieldLabelRootStyles(props: LayoutProps): string {
  return `
    display: grid;
    gap: ${getSpacingValue(8)};
    inline-size: 100%;
    min-inline-size: 0;
    ${getLayoutStyles(props)}
  `;
}

/**
 * Файл: `src/ui/table/table-inline-field/table-inline-field.styles.ts`
 * Определяет внешний вид компонента TableInlineField.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledTableInlineField`
 *
 * Потребители:
 *  - `src/ui/table/table-inline-field/index.tsx` — собирает компонент TableInlineField
 */

import styled from 'styled-components';

import { getTextSize } from '@ui/presets';
import { getTextProperties } from '@ui/text';

/**
 * getTableInlineFieldStyles — возвращает CSS-правила для узла `StyledTableInlineField`:
 * типографику нативного поля и сброс оформления `<input>`.
 * Поле живёт внутри строки таблицы и не рисует собственную поверхность.
 * Форсирует `text-align: inherit`: стиль UA у `<input>` перебивает наследование
 * выравнивания ячейки.
 * Гасит `outline` на фокусе и `aria-invalid`: нет рамки — нет контура.
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getTableInlineFieldStyles(): string {
  return `
    ${getTextProperties(getTextSize())}
    text-align: inherit;
    padding: 0;
    appearance: none;
    background: transparent;
    border: none;
    &:focus,
    &:focus-visible,
    &[aria-invalid='true'],
    &[aria-invalid='true']:focus,
    &[aria-invalid='true']:focus-visible {
      outline: none;
    }
  `;
}

/**
 * StyledTableInlineField — задаёт нативное поле ввода компонента TableInlineField.
 * Базируется на `<input>`.
 *
 * Встроенные стили:
 *  - `flex: 1 1 auto` — поле забирает остаток ширины в лид-слоте или ячейке
 *  - `inline-size: 100%` — занимает доступную ширину
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getTableInlineFieldStyles` — типографика нативного поля, сброс оформления
 */
export const StyledTableInlineField = styled.input`
  flex: 1 1 auto;
  inline-size: 100%;
  min-inline-size: 0;
  ${getTableInlineFieldStyles}
`;

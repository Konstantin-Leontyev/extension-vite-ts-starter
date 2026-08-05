/**
 * Файл: `src/ui/table/table-inline-field/table-inline-field.styles.ts`
 * Определяет внешний вид компонента TableInlineField.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TableInlineFieldStyleProps`
 * 2. Предоставить styled-узел `StyledTableInlineField`
 *
 * Потребители:
 *  - `src/ui/table/table-inline-field/index.tsx` — собирает компонент TableInlineField
 */

import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { getTextProperties, type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * TableInlineFieldStyleProps — представляет пропсы стилизации TableInlineField.
 *
 * @property textAlign — горизонтальное выравнивание текста
 * @property textSizePreset — размер текста поля
 */
export type TableInlineFieldStyleProps = {
  textAlign?: CSSProperties['textAlign'];
  textSizePreset?: TextSizePreset;
};

/**
 * TABLE_INLINE_FIELD_PROP_NAMES — хранит имена пропсов стилизации TableInlineField.
 */
const TABLE_INLINE_FIELD_PROP_NAMES = new Set<string>([
  'textAlign',
  'textSizePreset',
]);

/**
 * getTableInlineFieldStyles — возвращает CSS-правила для узла `StyledTableInlineField`:
 * типографику строки, сброс оформления `<input>` и снятие обводки фокуса и invalid.
 * Поле живёт внутри строки таблицы и не рисует собственную поверхность.
 *
 * @param props пропсы стилизации поля и тема styled-components
 * @returns CSS-правила, каждое с новой строки
 */
function getTableInlineFieldStyles(
  props: TableInlineFieldStyleProps & { theme: AppTheme }
): string {
  const { textAlign, textSizePreset = 'normal' } = props;
  const theme = getTheme(props);

  const styles = [
    getTextProperties(textSizePreset),
    'padding: 0;',
    'appearance: none;',
    'background: transparent;',
    'border: none;',
    `&:focus,`,
    `&:focus-visible,`,
    `&[aria-invalid='true'],`,
    `&[aria-invalid='true']:focus,`,
    `&[aria-invalid='true']:focus-visible {`,
    'outline: none;',
    '}',
    `&::placeholder { color: ${theme.colors.muted}; }`,
  ];

  if (textAlign !== undefined) {
    styles.push(`text-align: ${textAlign};`);
  }

  return styles.join('\n');
}

/**
 * StyledTableInlineField — задаёт нативное поле ввода компонента TableInlineField.
 * Базируется на `<input>` и поддерживает все пропсы из `TableInlineFieldStyleProps`.
 *
 * Встроенные стили:
 *  - `flex: 1 1 auto` — поле забирает остаток ширины в лид-слоте или ячейке
 *  - `inline-size: 100%` — занимает доступную ширину
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getTableInlineFieldStyles` — типографика, сброс оформления, выравнивание текста
 */
export const StyledTableInlineField = styled.input.withConfig({
  shouldForwardProp: (prop) => !TABLE_INLINE_FIELD_PROP_NAMES.has(prop),
})<TableInlineFieldStyleProps>`
  flex: 1 1 auto;
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getTableInlineFieldStyles(props)}
`;

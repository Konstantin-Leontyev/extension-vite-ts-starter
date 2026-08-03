// TODO: ручное ревью — ui/table/table-inline-field/table-inline-field.styles.ts
import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { getTextProperties, type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export type TableInlineFieldStyleProps = {
  textAlign?: CSSProperties['textAlign'];
  textSizePreset?: TextSizePreset;
};

const TABLE_INLINE_FIELD_AXIS_PROP_NAMES = new Set<string>([
  'textAlign',
  'textSizePreset',
]);

export const TABLE_INLINE_FIELD_PROP_NAMES = TABLE_INLINE_FIELD_AXIS_PROP_NAMES;

/**
 * getTableInlineFieldStyles — возвращает CSS-правила поля compose/edit в ячейке:
 * типографику строки, сброс UA-chrome input и отсутствие обводки поверхности.
 * Фокус-контур и invalid-обводка reset снимаются — поле живёт внутри строки таблицы.
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

/** Поле compose/edit в ячейке таблицы: типографика строки, без обводки поверхности. */
export const StyledTableInlineField = styled.input.withConfig({
  shouldForwardProp: (prop) => !TABLE_INLINE_FIELD_AXIS_PROP_NAMES.has(prop),
})<TableInlineFieldStyleProps>`
  flex: 1 1 auto;
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getTableInlineFieldStyles(props)}
`;

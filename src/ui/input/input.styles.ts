/**
 * Файл: `src/ui/input/input.styles.ts`
 * Определяет внешний вид компонента Input.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `InputControlStyleProps` и `InputStyleProps`
 * 2. Предоставить функцию `getInputControlStyles`
 * 3. Предоставить styled-узлы `StyledInputRoot` и `StyledInputControl`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/input/index.tsx` — собирает компонент Input
 */

import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getControlBoxStyles,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * InputControlStyleProps — представляет пропсы стилизации нативного поля ввода.
 *
 * @property shape — форма строки-поля
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 */
type InputControlStyleProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
  textAlign?: CSSProperties['textAlign'];
};

/**
 * InputStyleProps — представляет пропсы стилизации Input и layout-пропсы.
 */
export type InputStyleProps = LayoutProps & InputControlStyleProps;

/**
 * INPUT_CONTROL_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const INPUT_CONTROL_PROP_NAMES = new Set<string>(['shape', 'sizePreset', 'textAlign']);

/**
 * getInputControlStyles — возвращает CSS-правила для узла `StyledInputControl`:
 * стандартный бокс однострочного контрола, рамку, фон, тень, плейсхолдер
 * и условное выравнивание значения.
 *
 * @param props пропсы стилизации нативного поля ввода и тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getInputControlStyles(
  props: InputControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    textAlign,
  } = props;

  const styles = [
    getControlBoxStyles(sizePreset, shape),
    `border: 1px solid ${theme.colors.border};`,
    `background-color: ${theme.colors.surface};`,
    `box-shadow: ${theme.shadow.surface};`,
    `&::placeholder { color: ${theme.colors.muted}; }`,
  ];

  if (textAlign !== undefined) {
    styles.push(`text-align: ${textAlign};`);
  }

  return styles.join('\n');
}

/**
 * StyledInputRoot — задаёт корневой узел компонента Input.
 * Базируется на `<div>` и поддерживает все пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный поток подписи, поля и строки ошибки
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledInputControl — задаёт нативное поле ввода компонента Input.
 * Базируется на `<input>` и поддерживает все пропсы из `InputControlStyleProps`.
 *
 * Генерация стилей:
 *  - `getInputControlStyles` — бокс, рамка, фон, тень, плейсхолдер, выравнивание
 */
export const StyledInputControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !INPUT_CONTROL_PROP_NAMES.has(prop),
})<InputControlStyleProps>`
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getInputControlStyles(props)}
`;

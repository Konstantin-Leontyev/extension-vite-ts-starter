/**
 * Файл: `src/ui/input/input.styles.ts`
 * Определяет внешний вид компонента Input.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `InputStyleProps`
 * 2. Предоставить styled-узлы `StyledInputRoot` и `StyledInputControl`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/input/index.tsx` — собирает компонент Input
 */

import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SHOW_BORDER,
  DEFAULT_SIZE_PRESET,
  getControlBorder,
  getControlBoxStyles,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * InputStyleProps — представляет пропсы стилизации Input и layout-пропсы.
 *
 * @property shape — форма строки-поля
 * @property showBorder — включает рамку контрола вне layout-box
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 */
export type InputStyleProps = LayoutProps & {
  shape?: ShapePreset;
  showBorder?: boolean;
  sizePreset?: SizePreset;
  textAlign?: CSSProperties['textAlign'];
};

/**
 * INPUT_ROOT_PROP_NAMES — хранит имена layout-пропсов корня Input.
 */
const INPUT_ROOT_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES]);

/**
 * StyledInputRoot — задаёт корневой узел компонента Input.
 * Базируется на `<div>` и поддерживает все пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный поток подписи, поля и строки ошибки
 *  - `gap` — отступ между подписью, полем и строкой ошибки
 *  - `inline-size: 100%` — поле занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !INPUT_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * InputControlStyleProps — представляет пропсы стилизации нативного поля ввода.
 */
type InputControlStyleProps = Pick<
  InputStyleProps,
  'shape' | 'showBorder' | 'sizePreset' | 'textAlign'
>;

/**
 * INPUT_CONTROL_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const INPUT_CONTROL_PROP_NAMES = new Set<string>([
  'shape',
  'showBorder',
  'sizePreset',
  'textAlign',
]);

/**
 * getInputControlStyles — возвращает CSS-правила для узла `StyledInputControl`:
 * стандартный бокс однострочного контрола, рамку, фон, плейсхолдер
 * и условное выравнивание значения.
 *
 * Как работает:
 * 1. Подставляет дефолты `shape`, `showBorder` и `sizePreset`
 * 2. Собирает бокс через `getControlBoxStyles`, сбрасывает layout-рамку и красит
 *    фон: при рамке — `surface`, без рамки — прозрачный
 * 3. Кладёт рамку через `getControlBorder` и цвет плейсхолдера
 * 4. При переданном `textAlign` добавляет выравнивание значения
 *
 * @param props пропсы стилизации нативного поля ввода и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getInputControlStyles(
  props: InputControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    sizePreset = DEFAULT_SIZE_PRESET,
    textAlign,
  } = props;

  const styles = [
    getControlBoxStyles(sizePreset, shape),
    'border: none;',
    `background-color: ${showBorder ? theme.colors.surface : 'transparent'};`,
    getControlBorder(theme, showBorder),
    `&::placeholder { color: ${theme.colors.muted}; }`,
  ];

  if (textAlign !== undefined) {
    styles.push(`text-align: ${textAlign};`);
  }

  return styles.join('\n');
}

/**
 * StyledInputControl — задаёт нативное поле ввода компонента Input.
 * Базируется на `<input>` и поддерживает пропсы из `InputControlStyleProps`.
 *
 * Встроенные стили:
 *  - `inline-size: 100%` — поле занимает ширину корня
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getInputControlStyles` — бокс, рамка, фон, плейсхолдер, выравнивание
 */
export const StyledInputControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !INPUT_CONTROL_PROP_NAMES.has(prop),
})<InputControlStyleProps>`
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getInputControlStyles(props)}
`;

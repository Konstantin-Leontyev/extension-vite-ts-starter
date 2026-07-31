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

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_BORDER,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type BorderProps,
} from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  getTextSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTextProperties } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * InputStyleProps — представляет пропсы стилизации Input и layout-пропсы.
 *
 * @property shape — форма строки-поля
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 * @property textItalic — включает курсив значения
 */
export type InputStyleProps = LayoutProps &
  BorderProps & {
    shape?: ShapePreset;
    sizePreset?: SizePreset;
    textAlign?: CSSProperties['textAlign'];
    textItalic?: boolean;
  };

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
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
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
  | 'borderTone'
  | 'shape'
  | 'showBorder'
  | 'showShadow'
  | 'sizePreset'
  | 'textAlign'
  | 'textItalic'
>;

/**
 * INPUT_CONTROL_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const INPUT_CONTROL_PROP_NAMES = new Set<string>([
  ...BORDER_PROP_NAMES,
  'shape',
  'sizePreset',
  'textAlign',
  'textItalic',
]);

/**
 * getInputControlStyles — возвращает CSS-правила для узла `StyledInputControl`:
 * стандартный бокс однострочного контрола, рамку с тенью, фон, плейсхолдер
 * и условное выравнивание и курсив значения.
 *
 * Как работает:
 * 1. Подставляет дефолты `shape`, `showBorder`, `showShadow` и `sizePreset`
 * 2. Собирает бокс из геттеров пресетов: `min-block-size`, `padding-inline`,
 *    типографика через `getTextProperties(getTextSize(…))` — `font-size`,
 *    `font-weight` и `line-height` — и `border-radius` через `resolveBlockRadius`.
 *    `padding-block` не пишется: UA-отступ сбросил `GlobalResetStyle`, высоту
 *    держит `min-block-size`
 * 3. Сбрасывает layout-рамку через `border: none` и красит фон: при рамке —
 *    `surface`, без рамки — `transparent`. Кладёт рамку с тенью через
 *    `getBorderStyles`. Без рамки хелпер пишет `box-shadow: none`; на
 *    `:focus-visible` снимает `outline` глобального фокуса из `@ui/reset`. Красит
 *    плейсхолдер тоном `muted`
 * 4. При переданном `textAlign` добавляет выравнивание значения
 * 5. При `textItalic` добавляет курсив значения
 *
 * @param props пропсы стилизации нативного поля ввода и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getInputControlStyles(
  props: InputControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    borderTone,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
    sizePreset = DEFAULT_SIZE_PRESET,
    textAlign,
    textItalic,
  } = props;

  const minBlockSize = getMinBlockSize(sizePreset);

  const styles = [
    `min-block-size: ${minBlockSize};`,
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    getTextProperties(getTextSize(sizePreset)),
    `border-radius: ${resolveBlockRadius(shape, minBlockSize)};`,
    'border: none;',
    `background-color: ${showBorder ? theme.colors.surface : 'transparent'};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
    `&::placeholder { color: ${theme.colors.muted}; }`,
  ];

  if (!showBorder) {
    styles.push('&:focus-visible {', 'outline: none;', '}');
  }

  if (textAlign !== undefined) {
    styles.push(`text-align: ${textAlign};`);
  }

  if (textItalic === true) {
    styles.push('font-style: italic;');
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
 *  - `getInputControlStyles` — бокс, рамка с тенью, фон, плейсхолдер, выравнивание, курсив
 */
export const StyledInputControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !INPUT_CONTROL_PROP_NAMES.has(prop),
})<InputControlStyleProps>`
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getInputControlStyles(props)}
`;

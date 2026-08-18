/**
 * Файл: `src/ui/input/input.styles.ts`
 * Определяет внешний вид компонента Input.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `InputStyleProps`
 * 2. Предоставить styled-узлы `StyledInputRoot`, `StyledInputRow`
 *    и `StyledInputControl`
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
import { getOutlineStyles } from '@ui/outline';
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
import { getSurfaceBackgroundColor } from '@ui/surface';
import { getNativeFieldTextStyles, type TextSizePreset, type TextTonePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * InputStyleProps — представляет пропсы стилизации Input и layout-пропсы.
 *
 * @property shape — форма строки-поля
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 * @property textItalic — включает курсив значения
 * @property textSize — размер значения
 * @property textTone — тон значения
 */
export type InputStyleProps = LayoutProps &
  BorderProps & {
    shape?: ShapePreset;
    sizePreset?: SizePreset;
    textAlign?: CSSProperties['textAlign'];
    textItalic?: boolean;
    textSize?: TextSizePreset;
    textTone?: TextTonePreset;
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
 * InputRowStyleProps — представляет пропсы стилизации ряда поля ввода.
 */
type InputRowStyleProps = Pick<
  InputStyleProps,
  'borderTone' | 'shape' | 'showBorder' | 'showShadow' | 'sizePreset'
>;

/**
 * INPUT_ROW_PROP_NAMES — объединяет имена пропсов рамки и пропсов стилизации ряда Input.
 */
const INPUT_ROW_PROP_NAMES = new Set<string>([
  ...BORDER_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * getInputRowStyles — возвращает CSS-правила для узла `StyledInputRow`:
 * сетку поля и сброса, высоту ряда, рамку с тенью, фон и фокус.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape`, `showBorder`, `showShadow` и
 *    `sizePreset`
 * 2. Собирает бокс ряда: `display: grid`, колонки `minmax(0, 1fr)`, при
 *    `data-has-clear` — `minmax(0, 1fr) auto`, `align-items: center`, ширину,
 *    `min-block-size` через `getMinBlockSize`, `overflow: hidden` и
 *    `border-radius` через `resolveBlockRadius`
 * 3. Красит фон через `getSurfaceBackgroundColor`: при рамке — `surface`, без
 *    рамки — `transparent`. Кладёт рамку с тенью через `getBorderStyles`
 * 4. При рамке на `&:has(:focus-visible)` кладёт `outline` через `getOutlineStyles`
 *
 * @param props пропсы стилизации ряда и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getInputRowStyles(props: InputRowStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    borderTone,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const minBlockSize = getMinBlockSize(sizePreset);
  const styles = [
    'display: grid;',
    'grid-template-columns: minmax(0, 1fr);',
    '&[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }',
    'align-items: center;',
    'inline-size: 100%;',
    'min-inline-size: 0;',
    `min-block-size: ${minBlockSize};`,
    'overflow: hidden;',
    `border-radius: ${resolveBlockRadius(shape, minBlockSize)};`,
    `background-color: ${getSurfaceBackgroundColor(theme, showBorder ? 'surface' : 'transparent')};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
  ];

  if (showBorder) {
    styles.push(
      `&:has(:focus-visible) { ${getOutlineStyles(theme.colors.focusOutline)} }`
    );
  }

  return styles.join('\n');
}

/**
 * StyledInputRow — задаёт ряд поля ввода компонента Input.
 * Базируется на `<div>` и принимает пропсы из `InputRowStyleProps`.
 *
 * Генерация стилей:
 *  - `getInputRowStyles` — сетка, высота, рамка с тенью, фон и фокус
 */
export const StyledInputRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !INPUT_ROW_PROP_NAMES.has(prop),
})<InputRowStyleProps>`
  ${(props) => getInputRowStyles(props)}
`;

/**
 * InputControlStyleProps — представляет пропсы стилизации нативного поля ввода.
 */
type InputControlStyleProps = Pick<
  InputStyleProps,
  'sizePreset' | 'textAlign' | 'textItalic' | 'textSize' | 'textTone'
>;

/**
 * INPUT_CONTROL_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const INPUT_CONTROL_PROP_NAMES = new Set<string>([
  'sizePreset',
  'textAlign',
  'textItalic',
  'textSize',
  'textTone',
]);

/**
 * getInputControlStyles — возвращает CSS-правила для узла `StyledInputControl`:
 * заполнение ряда, горизонтальный отступ, текстовый блок нативного поля.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `sizePreset`
 * 2. Собирает поле: ширину, `block-size: 100%` по высоте ряда, `padding-inline`
 *    через `getPaddingInline` и текстовый блок через `getNativeFieldTextStyles`.
 *    `padding-block` не пишется: высоту держит ряд через `min-block-size`
 * 3. Сбрасывает рамку и фон: `border: none`, `background-color: transparent`.
 *    Гасит `outline` на `:focus-visible`: при рамке контур композита рисует ряд,
 *    без рамки контура нет
 *
 * @param props пропсы стилизации нативного поля ввода и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getInputControlStyles(
  props: InputControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    sizePreset = DEFAULT_SIZE_PRESET,
    textAlign,
    textItalic,
    textSize,
    textTone,
  } = props;

  return `
    inline-size: 100%;
    min-inline-size: 0;
    block-size: 100%;
    min-block-size: 0;
    padding-inline: ${getPaddingInline(sizePreset)};
    ${getNativeFieldTextStyles({
      textAlign,
      textItalic,
      textSize: textSize ?? getTextSize(sizePreset),
      textTone,
      theme,
    })}
    border: none;
    background-color: transparent;
    &:focus-visible { outline: none; }
  `;
}

/**
 * StyledInputControl — задаёт нативное поле ввода компонента Input.
 * Базируется на `<input>` и поддерживает пропсы из `InputControlStyleProps`.
 *
 * Генерация стилей:
 *  - `getInputControlStyles` — заполнение ряда, отступ, текстовый блок нативного
 *    поля, сброс рамки и фона, гашение контура
 */
export const StyledInputControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !INPUT_CONTROL_PROP_NAMES.has(prop),
})<InputControlStyleProps>`
  ${(props) => getInputControlStyles(props)}
`;

/**
 * Файл: `src/ui/search-field/search-field.styles.ts`
 * Определяет внешний вид компонента SearchField.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SearchFieldStyleProps`, `SearchFieldRowStyleProps`
 *    и `SearchFieldControlStyleProps`
 * 2. Предоставить styled-узлы `StyledSearchFieldRoot`, `StyledSearchFieldRow`
 *    и `StyledSearchFieldControl`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/search-field/index.tsx` — собирает компонент SearchField
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
import { getIconPositionStyles, resolveIconStateBackground } from '@ui/icon';
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
import { getTextProperties } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * SearchFieldStyleProps — представляет пропсы стилизации SearchField и layout-пропсы.
 *
 * @property shape — форма строки-поля
 * @property sizePreset — размер контрола
 * @property textAlign — горизонтальное выравнивание значения
 * @property textItalic — включает курсив значения
 */
export type SearchFieldStyleProps = LayoutProps &
  BorderProps & {
    shape?: ShapePreset;
    sizePreset?: SizePreset;
    textAlign?: CSSProperties['textAlign'];
    textItalic?: boolean;
  };

/**
 * SEARCH_FIELD_ROOT_PROP_NAMES — хранит имена layout-пропсов корня SearchField.
 */
const SEARCH_FIELD_ROOT_PROP_NAMES = LAYOUT_PROP_NAMES;

/**
 * StyledSearchFieldRoot — задаёт корневой узел компонента SearchField.
 * Базируется на `<div>` и поддерживает все пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный поток подписи и ряда поля
 *  - `gap` — отступ между подписью и рядом поля
 *  - `inline-size: 100%` — поле занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSearchFieldRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEARCH_FIELD_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * SearchFieldRowStyleProps — представляет пропсы стилизации ряда поля поиска.
 *
 * @property iconTone — тон секции иконки
 */
type SearchFieldRowStyleProps = Pick<
  SearchFieldStyleProps,
  'borderTone' | 'shape' | 'showBorder' | 'showShadow' | 'sizePreset'
> & {
  iconTone?: TonePreset;
};

/**
 * SEARCH_FIELD_ROW_PROP_NAMES — объединяет имена пропсов рамки и пропсов стилизации
 * ряда SearchField.
 */
const SEARCH_FIELD_ROW_PROP_NAMES = new Set<string>([
  ...BORDER_PROP_NAMES,
  'iconTone',
  'shape',
  'sizePreset',
]);

/**
 * getSearchFieldRowStyles — возвращает CSS-правила для узла `StyledSearchFieldRow`:
 * сетку секции иконки, поля и сброса, высоту ряда, рамку с тенью, фон, фокус
 * и канал состояний секции иконки. Статику секции красит внутренний Icon своими
 * пропсами с `showBorder={false}`. Собственную запись канала выключает через
 * `showHover={false}` и через `interactive` читает `--icon-state-background`.
 * Кнопка сброса с `showHover={false}` не пишет канал наведения. Подсветку
 * клавиатурного фокуса clear рисует Icon декларацией `background-color` на
 * `:focus-visible`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape`, `showBorder`, `showShadow`,
 *    `sizePreset` и `iconTone`
 * 2. Собирает бокс ряда: `display: grid`, раскладку позиции через
 *    `getIconPositionStyles`, `align-items: center`, ширину, `min-block-size`
 *    через `getMinBlockSize`, `overflow: hidden` и `border-radius` через
 *    `resolveBlockRadius`. `padding-block` не пишется: высоту ряда держит
 *    `min-block-size`
 * 3. Красит фон через `getSurfaceBackgroundColor`: при рамке — `surface`, без
 *    рамки — `transparent`. Кладёт рамку с тенью через `getBorderStyles`
 * 4. При `data-has-clear` и секции иконки переключает колонки на три трека
 *    в двух вариантах по позиции иконки: поле растягивается, секции — `auto`.
 *    Базу без крестика и без иконки оставляет `getIconPositionStyles`.
 *    `block-size: 100%` по высоте ряда держат секция иконки из хелпера и поле
 *    из `getSearchFieldControlStyles`. Кнопка сброса не растягивается
 * 5. На `:hover` ряда при отсутствии `data-disabled` на корне объявляет
 *    `--icon-state-background` через `resolveIconStateBackground` по
 *    `iconTone`. До Icon значение доходит наследованием
 * 6. При рамке на `&:has(:focus-visible)` кладёт `outline` через `getOutlineStyles`
 *
 * @param props пропсы стилизации ряда и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSearchFieldRowStyles(
  props: SearchFieldRowStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    borderTone,
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const minBlockSize = getMinBlockSize(sizePreset);
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  const styles = [
    'display: grid;',
    getIconPositionStyles(),
    'align-items: center;',
    'inline-size: 100%;',
    'min-inline-size: 0;',
    `min-block-size: ${minBlockSize};`,
    'overflow: hidden;',
    `border-radius: ${resolveBlockRadius(shape, minBlockSize)};`,
    `background-color: ${getSurfaceBackgroundColor(theme, showBorder ? 'surface' : 'transparent')};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
    "&[data-has-clear]:has(> [data-slot='icon']) { grid-template-columns: minmax(0, 1fr) auto auto; }",
    "&[data-has-clear]:has(> [data-slot='icon']:first-child) { grid-template-columns: auto minmax(0, 1fr) auto; }",
    `:not([data-disabled]) > &:hover { --icon-state-background: ${stateBackground}; }`,
  ];

  if (showBorder) {
    styles.push(`&:has(:focus-visible) { ${getOutlineStyles(theme.colors.focusOutline)} }`);
  }

  return styles.join('\n');
}

/**
 * StyledSearchFieldRow — задаёт ряд поля поиска компонента SearchField.
 * Базируется на `<div>` и принимает пропсы из `SearchFieldRowStyleProps`.
 *
 * Генерация стилей:
 *  - `getSearchFieldRowStyles` — сетка, высота, рамка с тенью, фон, фокус и
 *    канал состояний секции иконки
 */
export const StyledSearchFieldRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEARCH_FIELD_ROW_PROP_NAMES.has(prop),
})<SearchFieldRowStyleProps>`
  ${(props) => getSearchFieldRowStyles(props)}
`;

/**
 * SearchFieldControlStyleProps — представляет пропсы стилизации нативного поля ввода.
 */
type SearchFieldControlStyleProps = Pick<
  SearchFieldStyleProps,
  'sizePreset' | 'textAlign' | 'textItalic'
>;

/**
 * SEARCH_FIELD_CONTROL_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const SEARCH_FIELD_CONTROL_PROP_NAMES = new Set<string>([
  'sizePreset',
  'textAlign',
  'textItalic',
]);

/**
 * getSearchFieldControlStyles — возвращает CSS-правила для узла `StyledSearchFieldControl`:
 * заполнение ряда, горизонтальный отступ, типографику, плейсхолдер, гашение
 * UA-крестика WebKit и условное выравнивание и курсив значения.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `sizePreset`
 * 2. Собирает поле: ширину, `block-size: 100%` по высоте ряда, `padding-inline`
 *    через `getPaddingInline` и типографику через `getTextProperties(getTextSize(…))`.
 *    `padding-block` не пишется: высоту держит ряд через `min-block-size`
 * 3. Сбрасывает рамку и фон: `border: none`, `background-color: transparent`.
 *    Гасит `outline` на `:focus-visible`: при рамке контур композита рисует ряд,
 *    без рамки контура нет.
 *    Красит плейсхолдер тоном `muted`. Скрывает нативную кнопку очистки WebKit
 * 4. При переданном `textAlign` добавляет выравнивание значения
 * 5. При `textItalic` добавляет курсив значения
 *
 * @param props пропсы стилизации нативного поля ввода и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSearchFieldControlStyles(
  props: SearchFieldControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, textAlign, textItalic } = props;

  const styles = [
    'inline-size: 100%;',
    'min-inline-size: 0;',
    'block-size: 100%;',
    'min-block-size: 0;',
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    getTextProperties(getTextSize(sizePreset)),
    'border: none;',
    'background-color: transparent;',
    '&:focus-visible { outline: none; }',
    `&::placeholder { color: ${theme.colors.muted}; }`,
    '&::-webkit-search-cancel-button { appearance: none; }',
    '&::-webkit-search-decoration { appearance: none; }',
  ];

  if (textAlign !== undefined) {
    styles.push(`text-align: ${textAlign};`);
  }

  if (textItalic === true) {
    styles.push('font-style: italic;');
  }

  return styles.join('\n');
}

/**
 * StyledSearchFieldControl — задаёт нативное поле ввода компонента SearchField.
 * Базируется на `<input>` и поддерживает пропсы из `SearchFieldControlStyleProps`.
 *
 * Генерация стилей:
 *  - `getSearchFieldControlStyles` — заполнение ряда, отступ, типографика,
 *    плейсхолдер, гашение UA-крестика WebKit, выравнивание, курсив
 */
export const StyledSearchFieldControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !SEARCH_FIELD_CONTROL_PROP_NAMES.has(prop),
})<SearchFieldControlStyleProps>`
  ${(props) => getSearchFieldControlStyles(props)}
`;

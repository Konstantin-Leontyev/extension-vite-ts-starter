/**
 * Файл: `src/ui/checkbox/checkbox.styles.ts`
 * Определяет внешний вид компонента Checkbox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `CheckboxStyleProps`, `CheckboxControlStyleProps`,
 *    `CheckboxCheckedMark` и `CheckboxUncheckedMark`
 * 2. Хранить габариты бокса и размер иконки в `checkboxSizePresets`
 * 3. Предоставить функции `getCheckboxTextSize`, `getCheckboxControlStyles`
 *    и вспомогательные генераторы марок
 * 4. Предоставить styled-узлы `StyledCheckboxRoot` и `StyledCheckboxControl`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/checkbox/index.tsx` — собирает компонент Checkbox
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getTextSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * checkboxSizePresets — хранит габарит бокса и размер иконки для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `blockSize` → габарит бокса
 *  - `iconSize` → размер иконки марки
 * Ряд компактнее контролов.
 */
export const checkboxSizePresets = Object.freeze({
  small: Object.freeze({ blockSize: 12, iconSize: 8 } as const),
  medium: Object.freeze({ blockSize: 16, iconSize: 8 } as const),
  large: Object.freeze({ blockSize: 20, iconSize: 12 } as const),
} as const satisfies Record<
  SizePreset,
  { blockSize: SpacingValue; iconSize: SpacingValue }
>);

/** DEFAULT_CHECKED_MARK — задаёт иконку по умолчанию для checked-состояния. */
const DEFAULT_CHECKED_MARK: CheckboxCheckedMark = 'check';

/** DEFAULT_UNCHECKED_MARK — задаёт иконку по умолчанию для unchecked-состояния. */
const DEFAULT_UNCHECKED_MARK: CheckboxUncheckedMark = 'none';

/**
 * CheckboxCheckedMark — представляет иконку в checked-состоянии.
 */
export type CheckboxCheckedMark = 'check' | 'minus';

/**
 * CheckboxUncheckedMark — представляет иконку в unchecked-состоянии.
 */
export type CheckboxUncheckedMark = 'none' | 'plus';

/**
 * CheckboxControlStyleProps — представляет пропсы стилизации бокса Checkbox.
 *
 * @property checkedMark — иконка в checked-состоянии
 * @property inverted — инвертирует палитру бокса и марки
 * @property sizePreset — размер бокса
 * @property uncheckedMark — иконка в unchecked-состоянии
 */
export type CheckboxControlStyleProps = {
  checkedMark?: CheckboxCheckedMark;
  inverted?: boolean;
  sizePreset?: SizePreset;
  uncheckedMark?: CheckboxUncheckedMark;
};

/**
 * CheckboxStyleProps — представляет пропсы стилизации Checkbox и layout-пропсы.
 */
export type CheckboxStyleProps = LayoutProps & CheckboxControlStyleProps;

/**
 * CHECKBOX_CONTROL_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации бокса Checkbox.
 */
const CHECKBOX_CONTROL_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'checkedMark',
  'inverted',
  'sizePreset',
  'uncheckedMark',
]);

/**
 * getCheckboxBlockSize — возвращает ключ шкалы отступов для габарита бокса.
 *
 * @param sizePreset — размер из ряда контролов
 * @returns ключ шкалы отступов для `blockSize`
 */
function getCheckboxBlockSize(sizePreset: SizePreset): SpacingValue {
  return checkboxSizePresets[sizePreset].blockSize;
}

/**
 * getCheckboxIconSize — возвращает ключ шкалы отступов для размера иконки марки.
 *
 * @param sizePreset — размер из ряда контролов
 * @returns ключ шкалы отступов для `iconSize`
 */
function getCheckboxIconSize(sizePreset: SizePreset): SpacingValue {
  return checkboxSizePresets[sizePreset].iconSize;
}

/**
 * getCheckboxTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset — размер бокса
 * @returns метка размера текста из `TextSizePreset` для подписи справа от бокса
 */
export function getCheckboxTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * markIcon — преобразует SVG-путь и цвет обводки в data-URI для `background-image`.
 * Марка рисуется CSS-фоном, потому что бокс — нативный `<input>`: это пустой элемент,
 * SVG-компонент внутрь не вкладывается. Разметка SVG закодирована для URL:
 * `%3C` → `<`, `%23` → `#`. Символ `#` в цвете обводки кодируется здесь же.
 *
 * @param pathD — атрибут `d` SVG-пути
 * @param strokeColor — цвет обводки марки
 * @returns значение для CSS-свойства `background-image`
 */
function markIcon(pathD: string, strokeColor: string): string {
  const stroke = strokeColor.replace('#', '%23');

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath stroke='${stroke}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='${pathD}'/%3E%3C/svg%3E")`;
}

/**
 * checkIcon — возвращает data-URI галки для checked-состояния.
 *
 * @param strokeColor — цвет обводки
 * @returns значение для CSS-свойства `background-image`
 */
function checkIcon(strokeColor: string): string {
  return markIcon('M2.5 6 5 8.5 9.5 3.5', strokeColor);
}

/**
 * plusIcon — возвращает data-URI плюса для unchecked-состояния.
 *
 * @param strokeColor — цвет обводки
 * @returns значение для CSS-свойства `background-image`
 */
function plusIcon(strokeColor: string): string {
  return markIcon('M3 6h6M6 3v6', strokeColor);
}

/**
 * minusIcon — возвращает data-URI минуса для checked-состояния.
 *
 * @param strokeColor — цвет обводки
 * @returns значение для CSS-свойства `background-image`
 */
function minusIcon(strokeColor: string): string {
  return markIcon('M3 6h6', strokeColor);
}

/**
 * markBackground — возвращает CSS-правила фоновой иконки марки.
 *
 * @param mark — data-URI иконки
 * @param dimension — размер марки в rem
 * @returns CSS-правила для `background-image`, позиции и размера
 */
function markBackground(mark: string, dimension: string): string {
  const styles = [
    `background-image: ${mark};`,
    'background-repeat: no-repeat;',
    'background-position: center;',
    `background-size: ${dimension} ${dimension};`,
  ];

  return styles.join('\n');
}

/**
 * getCheckboxControlStyles — возвращает CSS-правила для бокса `StyledCheckboxControl`:
 * габариты, рамку, марки unchecked и checked.
 *
 * @param props — пропсы стилизации бокса и тема
 * @returns CSS-правила для нативного `input[type="checkbox"]`
 */
export function getCheckboxControlStyles(
  props: CheckboxControlStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    checkedMark = DEFAULT_CHECKED_MARK,
    inverted = false,
    sizePreset = DEFAULT_SIZE_PRESET,
    uncheckedMark = DEFAULT_UNCHECKED_MARK,
  } = props;
  const dimension = getSpacingValue(getCheckboxBlockSize(sizePreset));
  const markDimension = getSpacingValue(getCheckboxIconSize(sizePreset));

  // При inverted — белое поле и primary-иконка для подсветки строки, иначе primary-поле и inverse-иконка
  const checkedBackground = inverted ? theme.colors.inverse : theme.colors.primary;
  const uncheckedStroke = inverted ? theme.colors.primary : theme.colors.default;
  const checkedStroke = inverted ? theme.colors.primary : theme.colors.inverse;
  const checkedMarkIcon =
    checkedMark === 'minus' ? minusIcon(checkedStroke) : checkIcon(checkedStroke);

  const styles = [
    'flex-shrink: 0;',
    `inline-size: ${dimension};`,
    `block-size: ${dimension};`,
    'appearance: none;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${getSpacingValue(4)};`,
    `box-shadow: ${theme.shadow.surface};`,
  ];

  if (uncheckedMark === 'plus') {
    styles.push(
      `&:not(:checked) {
        ${markBackground(plusIcon(uncheckedStroke), markDimension)}
      }`
    );
  }

  styles.push(
    `&:checked {
      background-color: ${checkedBackground};
      ${markBackground(checkedMarkIcon, markDimension)}
      border-color: ${theme.colors.primary};
    }`
  );

  return styles.join('\n');
}

/**
 * StyledCheckboxRoot — задаёт корневой узел компонента Checkbox.
 * Базируется на `<label>` и поддерживает пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: inline-grid` — раскладка по дефолту проекта
 *  - `grid-auto-flow: column` — бокс и подпись в одной строке
 *  - `justify-content: start` — при растяжении родителем подпись остаётся у бокса
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledCheckboxRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: inline-grid;
  grid-auto-flow: column;
  gap: ${getSpacingValue(8)};
  align-items: center;
  justify-content: start;
  cursor: pointer;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledCheckboxControl — задаёт нативный бокс Checkbox.
 * Базируется на `<input type="checkbox">` и поддерживает пропсы из `CheckboxStyleProps`.
 *
 * Генерация стилей:
 *  - `getCheckboxControlStyles` — габариты, рамка, марки состояний
 *  - `getLayoutStyles` — отступы, позиционирование, размеры при рендере без обёртки
 */
export const StyledCheckboxControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !CHECKBOX_CONTROL_PROP_NAMES.has(prop),
})<CheckboxStyleProps>`
  ${(props) => getCheckboxControlStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * Файл: `src/ui/checkbox/checkbox.styles.ts`
 * Определяет внешний вид компонента Checkbox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `CheckboxStyleProps`, `CheckboxCheckedMark` и `CheckboxUncheckedMark`
 * 2. Хранить габариты бокса и размер иконки в `checkboxSizePresets`
 * 3. Предоставить функцию `getCheckboxTextSize` и перечни `CHECKBOX_CHECKED_MARK_KEYS`
 *    и `CHECKBOX_UNCHECKED_MARK_KEYS`
 * 4. Предоставить styled-узлы `StyledCheckboxRoot` и `StyledCheckboxControl`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/checkbox/index.tsx` — собирает компонент Checkbox и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getTextSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * checkboxSizePresets — хранит габарит бокса и размер иконки для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `iconSize` → размер иконки марки
 *  - `size` → габарит бокса
 * Ряд компактнее контролов.
 */
export const checkboxSizePresets = Object.freeze({
  small: Object.freeze({ iconSize: 8, size: 12 } as const),
  normal: Object.freeze({ iconSize: 8, size: 16 } as const),
  large: Object.freeze({ iconSize: 12, size: 20 } as const),
} as const satisfies Record<SizePreset, { iconSize: SpacingValue; size: SpacingValue }>);

/**
 * getCheckboxSize — возвращает CSS-размер стороны бокса.
 *
 * @param sizePreset размер из ряда контролов
 * @returns длина стороны в rem
 */
function getCheckboxSize(sizePreset: SizePreset): string {
  return getSpacingValue(checkboxSizePresets[sizePreset].size);
}

/**
 * getCheckboxIconSize — возвращает CSS-размер иконки марки.
 *
 * @param sizePreset размер из ряда контролов
 * @returns размер марки в rem
 */
function getCheckboxIconSize(sizePreset: SizePreset): string {
  return getSpacingValue(checkboxSizePresets[sizePreset].iconSize);
}

/**
 * getCheckboxTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер бокса
 * @returns метка размера текста из `TextSizePreset` для подписи справа от бокса
 */
export function getCheckboxTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * CheckboxCheckedMark — представляет иконку в checked-состоянии.
 */
export type CheckboxCheckedMark = 'check' | 'minus';

/**
 * CHECKBOX_CHECKED_MARK_KEYS — задаёт перечень иконок checked-состояния.
 * Используется в панелях настроек витрины дизайн-системы: `CheckboxSettings`
 * собирает из него опции для `Listbox`.
 */
export const CHECKBOX_CHECKED_MARK_KEYS = Object.freeze([
  'check',
  'minus',
] as const satisfies readonly CheckboxCheckedMark[]);

/**
 * CheckboxUncheckedMark — представляет иконку в unchecked-состоянии.
 */
export type CheckboxUncheckedMark = 'none' | 'plus';

/**
 * CHECKBOX_UNCHECKED_MARK_KEYS — задаёт перечень иконок unchecked-состояния.
 * Используется в панелях настроек витрины дизайн-системы: `CheckboxSettings`
 * собирает из него опции для `Listbox`.
 */
export const CHECKBOX_UNCHECKED_MARK_KEYS = Object.freeze([
  'none',
  'plus',
] as const satisfies readonly CheckboxUncheckedMark[]);

/**
 * CheckboxStyleProps — представляет пропсы стилизации Checkbox и layout-пропсы.
 *
 * @property checkedMark — иконка в checked-состоянии
 * @property inverted — включает инверсию палитры бокса и марки
 * @property sizePreset — размер бокса
 * @property uncheckedMark — иконка в unchecked-состоянии
 */
export type CheckboxStyleProps = LayoutProps & {
  checkedMark?: CheckboxCheckedMark;
  inverted?: boolean;
  sizePreset?: SizePreset;
  uncheckedMark?: CheckboxUncheckedMark;
};

/**
 * StyledCheckboxRoot — задаёт корневой узел компонента Checkbox.
 * Базируется на `<label>` и поддерживает пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: inline-grid` — раскладка по дефолту проекта
 *  - `grid-auto-flow: column` — бокс и подпись в одной строке
 *  - `gap` — отступ между боксом и подписью
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
 * DEFAULT_CHECKBOX_CHECKED_MARK — задаёт иконку checked-состояния по умолчанию.
 * Используется, когда вызывающий код не передал проп `checkedMark`.
 */
const DEFAULT_CHECKBOX_CHECKED_MARK: CheckboxCheckedMark = 'check';

/**
 * DEFAULT_CHECKBOX_UNCHECKED_MARK — задаёт иконку unchecked-состояния по умолчанию.
 * Используется, когда вызывающий код не передал проп `uncheckedMark`.
 */
const DEFAULT_CHECKBOX_UNCHECKED_MARK: CheckboxUncheckedMark = 'none';

/**
 * DEFAULT_CHECKBOX_INVERTED — задаёт инверсию палитры по умолчанию.
 * Используется, когда вызывающий код не передал проп `inverted`.
 */
const DEFAULT_CHECKBOX_INVERTED = false;

/**
 * markIcon — преобразует SVG-путь и цвет обводки в data-URI для `background-image`.
 * Марка рисуется CSS-фоном, потому что бокс — нативный `<input>`: это пустой элемент,
 * SVG-компонент внутрь не вкладывается. Разметка SVG закодирована для URL:
 * `%3C` → `<`, `%23` → `#`. Символ `#` в цвете обводки кодируется здесь же.
 *
 * @param pathD атрибут `d` SVG-пути
 * @param strokeColor цвет обводки марки
 * @returns значение для CSS-свойства `background-image`
 */
function markIcon(pathD: string, strokeColor: string): string {
  const stroke = strokeColor.replace('#', '%23');

  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath stroke='${stroke}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='${pathD}'/%3E%3C/svg%3E")`;
}

/**
 * checkIcon — возвращает data-URI галки для checked-состояния.
 *
 * @param strokeColor цвет обводки
 * @returns значение для CSS-свойства `background-image`
 */
function checkIcon(strokeColor: string): string {
  return markIcon('M2.5 6 5 8.5 9.5 3.5', strokeColor);
}

/**
 * plusIcon — возвращает data-URI плюса для unchecked-состояния.
 *
 * @param strokeColor цвет обводки
 * @returns значение для CSS-свойства `background-image`
 */
function plusIcon(strokeColor: string): string {
  return markIcon('M3 6h6M6 3v6', strokeColor);
}

/**
 * minusIcon — возвращает data-URI минуса для checked-состояния.
 *
 * @param strokeColor цвет обводки
 * @returns значение для CSS-свойства `background-image`
 */
function minusIcon(strokeColor: string): string {
  return markIcon('M3 6h6', strokeColor);
}

/**
 * markBackground — возвращает CSS-правила фоновой иконки марки.
 *
 * @param mark data-URI иконки
 * @param iconSize размер марки в rem
 * @returns CSS-правила, каждое с новой строки
 */
function markBackground(mark: string, iconSize: string): string {
  const styles = [
    `background-image: ${mark};`,
    'background-repeat: no-repeat;',
    'background-position: center;',
    `background-size: ${iconSize} ${iconSize};`,
  ];

  return styles.join('\n');
}

/**
 * getCheckboxControlStyles — возвращает CSS-правила для узла `StyledCheckboxControl`:
 * габариты, рамку с тенью, марки unchecked и checked.
 *
 * Как работает:
 * 1. Берёт тему, размер и марки, подставляет дефолт `inverted`
 * 2. При `inverted` красит checked-поле в `inverse` и марки в `primary` для
 *    подсветки строки, иначе — поле в `primary` и checked-марку в `inverse`
 * 3. Собирает габариты, рамку с тенью и фоновые марки unchecked и checked
 *
 * @param props пропсы стилизации бокса и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getCheckboxControlStyles(
  props: CheckboxStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    checkedMark = DEFAULT_CHECKBOX_CHECKED_MARK,
    inverted = DEFAULT_CHECKBOX_INVERTED,
    sizePreset = DEFAULT_SIZE_PRESET,
    uncheckedMark = DEFAULT_CHECKBOX_UNCHECKED_MARK,
  } = props;
  const size = getCheckboxSize(sizePreset);
  const iconSize = getCheckboxIconSize(sizePreset);

  const checkedBackground = inverted ? theme.colors.inverse : theme.colors.primary;
  const uncheckedStroke = inverted ? theme.colors.primary : theme.colors.default;
  const checkedStroke = inverted ? theme.colors.primary : theme.colors.inverse;
  const checkedMarkIcon =
    checkedMark === 'minus' ? minusIcon(checkedStroke) : checkIcon(checkedStroke);

  const styles = [
    'flex-shrink: 0;',
    `inline-size: ${size};`,
    `block-size: ${size};`,
    'appearance: none;',
    `background-color: ${theme.colors.surface};`,
    getBorderStyles(theme),
    `border-radius: ${getSpacingValue(4)};`,
  ];

  if (uncheckedMark === 'plus') {
    styles.push(
      `&:not(:checked) {
        ${markBackground(plusIcon(uncheckedStroke), iconSize)}
      }`
    );
  }

  styles.push(
    `&:checked {
      background-color: ${checkedBackground};
      ${markBackground(checkedMarkIcon, iconSize)}
      border-color: ${theme.colors.primary};
    }`
  );

  return styles.join('\n');
}

/**
 * StyledCheckboxControl — задаёт нативный бокс Checkbox.
 * Базируется на `<input type="checkbox">` и поддерживает пропсы из `CheckboxStyleProps`.
 *
 * Генерация стилей:
 *  - `getCheckboxControlStyles` — габариты, рамка с тенью, марки состояний
 *  - `getLayoutStyles` — отступы, позиционирование, размеры при рендере без обёртки
 */
export const StyledCheckboxControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !CHECKBOX_CONTROL_PROP_NAMES.has(prop),
})<CheckboxStyleProps>`
  ${(props) => getCheckboxControlStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

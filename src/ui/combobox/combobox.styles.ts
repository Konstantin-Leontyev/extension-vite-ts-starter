/**
 * Файл: `src/ui/combobox/combobox.styles.ts`
 * Определяет внешний вид компонента Combobox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ComboboxStyleProps` и `ComboboxSurfaceStyleProps`
 * 2. Предоставить функцию `getComboboxTextSize`
 * 3. Предоставить styled-узлы `StyledComboboxRoot`, `StyledComboboxTriggerRow`,
 *    `StyledComboboxTrigger`, `StyledComboboxValue`, `StyledComboboxPanel`,
 *    `StyledComboboxList` и `StyledComboboxOption`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/combobox/index.tsx` — собирает компонент Combobox
 */

import styled from 'styled-components';

import { getPortalPanelStyles } from '@ui/anchored-portal';
import { ICON_SETTING_PROP_NAMES } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  OPEN_CONTROL_PANEL_MAX_OPTION_ROWS,
  OPEN_CONTROL_ROW_GAP,
  OPEN_CONTROL_SELECTABLE_INSET,
  getOpenControlRootStyles,
  getOpenControlSelectableRowSurfaceStyles,
  getOpenControlTriggerRowStyles,
  getOpenControlTriggerStyles,
  resolveOpenControlBlockRadius,
  type OpenControlSurfaceStyleProps,
} from '@ui/open-control';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  getTextSize,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * getComboboxTextSize — возвращает размер текста триггера и опций по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер Combobox
 * @returns метка размера текста из `TextSizePreset` для текста триггера и опций
 */
export function getComboboxTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * ComboboxSurfaceStyleProps — представляет пропсы стилизации поверхности Combobox.
 *
 * @property iconTone — тон секции шеврона
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type ComboboxSurfaceStyleProps = OpenControlSurfaceStyleProps & {
  iconTone?: TonePreset;
};

/**
 * ComboboxStyleProps — представляет пропсы стилизации Combobox и layout-пропсы.
 */
export type ComboboxStyleProps = LayoutProps & ComboboxSurfaceStyleProps;

/**
 * StyledComboboxRoot — задаёт корневой узел компонента Combobox.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledComboboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getOpenControlRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * COMBOBOX_SURFACE_PROP_NAMES — объединяет имена настроек иконки и пропсов
 * стилизации поверхности Combobox.
 */
const COMBOBOX_SURFACE_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * StyledComboboxTriggerRow — задаёт ряд триггера компонента Combobox.
 * Базируется на `<div>` и принимает пропсы из `ComboboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и `outline` фокуса
 */
export const StyledComboboxTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_SURFACE_PROP_NAMES.has(prop),
})<ComboboxSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerRowStyles(props, resolveOpenControlBlockRadius)}
`;

/**
 * StyledComboboxTrigger — задаёт кнопку-триггер компонента Combobox.
 * Базируется на `<button>` и принимает пропсы из `ComboboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerStyles` — раскладка позиции иконки и канал
 *    `--icon-state-background`
 */
export const StyledComboboxTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_SURFACE_PROP_NAMES.has(prop),
})<ComboboxSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerStyles(props)}
`;

/**
 * COMBOBOX_BOX_PROP_NAMES — хранит имена пропсов стилизации строки и панели Combobox.
 */
const COMBOBOX_BOX_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * getComboboxValueStyles — возвращает CSS-правила для узла `StyledComboboxValue`:
 * раскладку значения и горизонтальный отступ. `display: flex` — оправданное
 * исключение: отсутствующая иконка опции не резервирует трек.
 *
 * Как работает:
 * 1. Подставляет дефолт `sizePreset`
 * 2. Собирает flex-ряд значения с `gap` и горизонтальным отступом
 *
 * @param props пропсы поверхности
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxValueStyles(props: ComboboxSurfaceStyleProps): string {
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;

  return `
    display: flex;
    gap: ${getSpacingValue(8)};
    align-items: center;
    min-inline-size: 0;
    padding-inline: ${getPaddingInline(sizePreset)};
  `;
}

/**
 * StyledComboboxValue — задаёт ячейку значения триггера компонента Combobox.
 * Базируется на `<span>` и принимает проп `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxValueStyles` — раскладка значения и отступ
 */
export const StyledComboboxValue = styled.span.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ComboboxSurfaceStyleProps, 'sizePreset'>>`
  ${(props) => getComboboxValueStyles(props)}
`;

/**
 * getComboboxPanelStyles — возвращает CSS-правила для узла `StyledComboboxPanel`:
 * сетку поиска и списка, обрезку и хром портала через `getPortalPanelStyles`.
 *
 * Как работает:
 * 1. Берёт тему, подставляет дефолты `shape` и `sizePreset`
 * 2. Собирает сетку панели: ряд поиска и список
 * 3. Подставляет хром панели через `getPortalPanelStyles`: fixed-позицию, слой
 *    `STACKING_PORTAL`, заливку `surface`, рамку с тенью через `getBorderStyles`,
 *    радиус через `resolveOpenControlBlockRadius` и постоянный `outline` через
 *    `getOutlineStyles`
 * 4. Обрезает содержимое через `overflow: hidden`
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxPanelStyles(
  props: Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
    ${getPortalPanelStyles({
      theme,
      borderRadius: resolveOpenControlBlockRadius(shape, sizePreset),
    })}
  `;
}

/**
 * StyledComboboxPanel — задаёт панель поиска и списка опций компонента Combobox.
 * Базируется на `<div>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxPanelStyles` — сетка поиска и списка, хром портала через
 *    `getPortalPanelStyles`
 */
export const StyledComboboxPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getComboboxPanelStyles(props)}
`;

/**
 * getComboboxListStyles — возвращает CSS-правила для узла `StyledComboboxList`:
 * столбик опций, отступы, ограничение высоты и прокрутку по модели Listbox.
 *
 * Как работает:
 * 1. Подставляет дефолт `sizePreset`
 * 2. Собирает столбик опций с отступами
 * 3. Ограничивает высоту через `OPEN_CONTROL_PANEL_MAX_OPTION_ROWS` и включает
 *    прокрутку `overflow: hidden auto`
 *
 * @param props пропсы размера
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxListStyles(
  props: Pick<ComboboxSurfaceStyleProps, 'sizePreset'>
): string {
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;

  return `
    display: grid;
    min-block-size: 0;
    padding-block: ${getSpacingValue(OPEN_CONTROL_SELECTABLE_INSET)};
    padding-inline-end: ${getSpacingValue(8)};
    max-block-size: calc(${getMinBlockSize(sizePreset)} * ${OPEN_CONTROL_PANEL_MAX_OPTION_ROWS});
    overflow: hidden auto;
  `;
}

/**
 * StyledComboboxList — задаёт список опций компонента Combobox.
 * Базируется на `<ul>` и принимает проп `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxListStyles` — столбик, отступы, max-высота и прокрутка
 */
export const StyledComboboxList = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== 'sizePreset',
})<Pick<ComboboxSurfaceStyleProps, 'sizePreset'>>`
  ${(props) => getComboboxListStyles(props)}
`;

/**
 * getComboboxOptionStyles — возвращает CSS-правила для узла `StyledComboboxOption`:
 * поверхность опции, отступы и синюю подсветку наведения. `display: flex` —
 * оправданное исключение: иконка опции, текст и check в одном потоке с `gap`,
 * отсутствующие слоты не резервируют трек.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `sizePreset`
 * 2. Подставляет поверхность через `getOpenControlSelectableRowSurfaceStyles`:
 *    flex-раскладку, габариты, заливку и подложку наведения через `::before`
 * 3. Задаёт `padding-inline` по размеру
 * 4. На `data-active`, `:not(:disabled):hover` и `:focus-visible` красит
 *    текст в `inverse`, включая слот галочки
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxOptionStyles(
  props: Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getOpenControlSelectableRowSurfaceStyles(props, {
      display: 'flex',
      gap: OPEN_CONTROL_ROW_GAP,
      highlight: 'primary',
      highlightWhen: `&[data-active='true']::before,
    &:not(:disabled):hover::before,
    &:focus-visible::before`,
    })}
    padding-inline: ${getPaddingInline(sizePreset)};
    &[data-active='true'],
    &:not(:disabled):hover,
    &:focus-visible {
      color: ${theme.colors.inverse};
    }
    &[data-active='true'] [data-slot='check'],
    &:not(:disabled):hover [data-slot='check'],
    &:focus-visible [data-slot='check'] {
      color: inherit;
    }
  `;
}

/**
 * StyledComboboxOption — задаёт кнопку опции компонента Combobox.
 * Базируется на `<button>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxOptionStyles` — поверхность, отступы и подсветка
 */
export const StyledComboboxOption = styled.button.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getComboboxOptionStyles(props)}
`;

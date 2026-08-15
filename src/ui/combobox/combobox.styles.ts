/**
 * Файл: `src/ui/combobox/combobox.styles.ts`
 * Определяет внешний вид компонента Combobox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ComboboxStyleProps` и `ComboboxSurfaceStyleProps`
 * 2. Предоставить styled-узлы `StyledComboboxRoot`, `StyledComboboxTriggerRow`,
 *    `StyledComboboxTrigger`, `StyledComboboxValue`, `StyledComboboxPanel`,
 *    `StyledComboboxList` и `StyledComboboxOption`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/combobox/index.tsx` — собирает компонент Combobox
 */

import styled from 'styled-components';

import { getCssAnchorPlacementStyles } from '@ui/anchored-portal';
import { ICON_SETTING_PROP_NAMES } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  OPEN_CONTROL_ROW_GAP,
  OPEN_CONTROL_SELECTABLE_INSET,
  getOpenControlActiveRowHighlightStyles,
  getOpenControlOptionsListScrollStyles,
  getOpenControlPortalPanelStyles,
  getOpenControlRootStyles,
  getOpenControlSelectableRowSurfaceStyles,
  getOpenControlTriggerRowStyles,
  getOpenControlTriggerStyles,
  type OpenControlSurfaceStyleProps,
} from '@ui/open-control';
import { DEFAULT_SIZE_PRESET, getPaddingInline } from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

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
 *  - `getOpenControlRootStyles` — раскладка, зазор и ширина
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
  'borderTone',
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
  ${(props) => getOpenControlTriggerRowStyles(props)}
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
 * сетку поиска и списка, обрезку, хром портала через
 * `getOpenControlPortalPanelStyles`, CSS-привязку к триггеру,
 * ограничение у края вьюпорта и запасные позиции `@position-try`.
 *
 * Как работает:
 * 1. Собирает сетку панели: ряд поиска и список
 * 2. Подставляет хром панели через `getOpenControlPortalPanelStyles`
 * 3. Привязывает панель к триггеру через `getCssAnchorPlacementStyles` с
 *    `viewport-edge`
 * 4. Обрезает содержимое через `overflow: hidden` поверх `overflow: visible`
 *    сброса UA `[popover]`
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxPanelStyles(
  props: Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  return `
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    ${getOpenControlPortalPanelStyles(props)}
    ${getCssAnchorPlacementStyles('viewport-edge')}
    overflow: hidden;
  `;
}

/**
 * StyledComboboxPanel — задаёт панель поиска и списка опций компонента Combobox.
 * Базируется на `<div>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxPanelStyles` — сетка поиска и списка, хром портала через
 *    `getOpenControlPortalPanelStyles`, CSS-привязка к триггеру,
 *    ограничение у края вьюпорта и запасные позиции `@position-try`
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
 * 3. Ограничивает высоту и включает прокрутку через
 *    `getOpenControlOptionsListScrollStyles`
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
    ${getOpenControlOptionsListScrollStyles(sizePreset)}
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
 * поверхность опции, отступы и синюю подсветку активной строки. `display: flex` —
 * оправданное исключение: иконка опции, текст и check в одном потоке с `gap`,
 * отсутствующие слоты не резервируют трек.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `sizePreset`
 * 2. Подставляет поверхность через `getOpenControlSelectableRowSurfaceStyles`:
 *    flex-раскладку, габариты, заливку и подложку активной строки через `::before`
 * 3. Задаёт `padding-inline` по размеру
 * 4. На `data-active` красит текст в `inverse` через
 *    `getOpenControlActiveRowHighlightStyles`
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
      highlightWhen: `&[data-active='true']::before`,
    })}
    padding-inline: ${getPaddingInline(sizePreset)};
    ${getOpenControlActiveRowHighlightStyles(theme)}
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

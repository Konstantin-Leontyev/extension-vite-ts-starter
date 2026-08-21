/**
 * Файл: `src/ui/listbox/listbox.styles.ts`
 * Определяет внешний вид компонента Listbox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ListboxStyleProps` и `ListboxAppearance`
 * 2. Предоставить styled-узлы `StyledListboxRoot`, `StyledListboxTriggerRow`,
 *    `StyledListboxTrigger`, `StyledListboxValue`, `StyledListboxPanel`,
 *    `StyledListboxSearchPanel`, `StyledListboxList` и `StyledListboxOption`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/listbox/index.tsx` — собирает компонент Listbox
 */

import styled from 'styled-components';

import { getCssAnchorPlacementStyles } from '@ui/anchored-panel';
import { ICON_SETTING_PROP_NAMES } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  OPEN_CONTROL_ROW_GAP,
  OPEN_CONTROL_SELECTABLE_INSET,
  getOpenControlActiveRowHighlightStyles,
  getOpenControlOptionsListScrollStyles,
  getOpenControlPanelStyles,
  getOpenControlRootStyles,
  getOpenControlSelectableRowSurfaceStyles,
  getOpenControlTriggerRowStyles,
  getOpenControlTriggerStyles,
  type OpenControlSurfaceStyleProps,
} from '@ui/open-control';
import { DEFAULT_SIZE_PRESET, getPaddingInline } from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { DISABLED_OPACITY, getTheme, type AppTheme } from '@ui/theme';
import { type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * ListboxAppearance — представляет вид триггера Listbox.
 */
export type ListboxAppearance = 'field' | 'icon';

/**
 * ListboxSurfaceStyleProps — представляет пропсы стилизации поверхности Listbox.
 *
 * @property iconTone — тон секции шеврона
 */
type ListboxSurfaceStyleProps = OpenControlSurfaceStyleProps & {
  iconTone?: TonePreset;
};

/**
 * ListboxStyleProps — представляет пропсы стилизации Listbox и layout-пропсы.
 */
export type ListboxStyleProps = LayoutProps & ListboxSurfaceStyleProps;

/**
 * getListboxRootStyles — возвращает CSS-правила для корня `StyledListboxRoot`:
 * раскладку и ширину вида `icon`.
 *
 * Как работает:
 * 1. Подставляет раскладку корня через `getOpenControlRootStyles`
 * 2. Вид `icon` передаёт ширину `max-content`, поле — дефолт `100%`
 *
 * @param props вид триггера
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxRootStyles(props: { appearance?: ListboxAppearance }): string {
  return getOpenControlRootStyles(props.appearance === 'icon' ? 'max-content' : '100%');
}

/**
 * StyledListboxRoot — задаёт корневой узел компонента Listbox.
 * Базируется на `<div>` и принимает layout-пропсы и проп `appearance`.
 *
 * Генерация стилей:
 *  - `getListboxRootStyles` — раскладка и ширина вида `icon`
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledListboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'appearance' && !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps & { appearance?: ListboxAppearance }>`
  ${(props) => getListboxRootStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * LISTBOX_SURFACE_PROP_NAMES — объединяет имена настроек иконки и пропсов
 * стилизации поверхности Listbox.
 */
const LISTBOX_SURFACE_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'borderTone',
  'shape',
  'size',
]);

/**
 * StyledListboxTriggerRow — задаёт ряд триггера компонента Listbox.
 * Базируется на `<div>` и принимает пропсы из `ListboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и `outline` фокуса
 */
export const StyledListboxTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_SURFACE_PROP_NAMES.has(prop),
})<ListboxSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerRowStyles(props)}
`;

/**
 * StyledListboxTrigger — задаёт кнопку-триггер компонента Listbox.
 * Базируется на `<button>` и принимает пропсы из `ListboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerStyles` — хром кнопки-триггера
 */
export const StyledListboxTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_SURFACE_PROP_NAMES.has(prop),
})<ListboxSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerStyles(props)}
`;

/**
 * LISTBOX_BOX_PROP_NAMES — хранит имена пропсов стилизации строки и панели Listbox.
 */
const LISTBOX_BOX_PROP_NAMES = new Set<string>(['appearance', 'shape', 'size']);

/**
 * getListboxValueStyles — возвращает CSS-правила для узла `StyledListboxValue`:
 * раскладку значения, `min-inline-size: 0` и горизонтальный отступ. `display: flex` —
 * оправданное исключение: отсутствующая иконка опции не резервирует трек.
 *
 * Как работает:
 * 1. Подставляет дефолт `size`
 * 2. Собирает flex-ряд значения с `gap`, `min-inline-size: 0` и горизонтальным отступом
 *
 * @param props пропсы поверхности
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxValueStyles(props: ListboxSurfaceStyleProps): string {
  const size = props.size ?? DEFAULT_SIZE_PRESET;

  return `
    display: flex;
    gap: ${getSpacingValue(8)};
    align-items: center;
    min-inline-size: 0;
    padding-inline: ${getPaddingInline(size)};
  `;
}

/**
 * StyledListboxValue — задаёт ячейку значения триггера компонента Listbox.
 * Базируется на `<span>` и принимает проп `size`.
 *
 * Генерация стилей:
 *  - `getListboxValueStyles` — раскладка значения, `min-inline-size: 0` и отступ
 */
export const StyledListboxValue = styled.span.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'size'>>`
  ${(props) => getListboxValueStyles(props)}
`;

/**
 * ListboxPanelStyleProps — представляет пропсы стилизации выпадающей панели опций Listbox.
 *
 * @property appearance — вид триггера. Задаёт режим ширины панели
 */
type ListboxPanelStyleProps = Pick<ListboxSurfaceStyleProps, 'shape' | 'size'> & {
  appearance?: ListboxAppearance;
};

/**
 * getListboxPanelChromeStyles — возвращает общий хром выпадающей панели Listbox:
 * поверхность через `getOpenControlPanelStyles` и привязку к якорю.
 * Вид `field` берёт ширину якоря через `viewport-edge`. Вид `icon` берёт ширину
 * содержимого через `content`: якорь — кнопка-иконка.
 *
 * @param props пропсы формы, размера, вида и темы
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxPanelChromeStyles(
  props: ListboxPanelStyleProps & { theme: AppTheme }
): string {
  return `
    ${getOpenControlPanelStyles(props)}
    ${getCssAnchorPlacementStyles(
      props.appearance === 'icon' ? 'content' : 'viewport-edge'
    )}
  `;
}

/**
 * getListboxPanelStyles — возвращает CSS-правила для узла `StyledListboxPanel`:
 * хром панели через `getListboxPanelChromeStyles`
 * и прокрутку списка через `getOpenControlOptionsListScrollStyles`.
 *
 * Как работает:
 * 1. Подставляет дефолт `size`
 * 2. Подставляет хром панели через `getListboxPanelChromeStyles`
 * 3. Ограничивает высоту и включает прокрутку через
 *    `getOpenControlOptionsListScrollStyles`
 * 4. Прячет указатель над панелью при `data-keyboard-navigating`
 *
 * @param props пропсы формы, размера, вида и темы
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxPanelStyles(
  props: ListboxPanelStyleProps & { theme: AppTheme }
): string {
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getListboxPanelChromeStyles(props)}
    ${getOpenControlOptionsListScrollStyles(size)}
    &[data-keyboard-navigating] {
      cursor: none;
    }
    &[data-keyboard-navigating] * {
      cursor: none;
    }
  `;
}

/**
 * StyledListboxPanel — задаёт выпадающую панель опций компонента Listbox без поиска.
 * Базируется на `<ul>` и принимает пропсы `shape`, `size` и `appearance`.
 *
 * Генерация стилей:
 *  - `getListboxPanelStyles` — хром панели через `getListboxPanelChromeStyles`,
 *    высота и прокрутка
 */
export const StyledListboxPanel = styled.ul.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<ListboxPanelStyleProps>`
  ${(props) => getListboxPanelStyles(props)}
`;

/**
 * getListboxSearchPanelStyles — возвращает CSS-правила для узла
 * `StyledListboxSearchPanel`: сетку поиска и списка, хром панели
 * через `getListboxPanelChromeStyles` и обрезку.
 *
 * Как работает:
 * 1. Собирает сетку панели: ряд поиска и список
 * 2. Подставляет хром панели через `getListboxPanelChromeStyles`
 * 3. Обрезает содержимое через `overflow: hidden` поверх `overflow: visible`
 *    сброса UA `[popover]`
 *
 * @param props пропсы формы, размера, вида и темы
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxSearchPanelStyles(
  props: ListboxPanelStyleProps & { theme: AppTheme }
): string {
  return `
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    ${getListboxPanelChromeStyles(props)}
    overflow: hidden;
  `;
}

/**
 * StyledListboxSearchPanel — задаёт панель поиска и списка опций компонента Listbox.
 * Базируется на `<div>` и принимает пропсы `shape`, `size` и `appearance`.
 *
 * Генерация стилей:
 *  - `getListboxSearchPanelStyles` — сетка поиска и списка, хром через
 *    `getListboxPanelChromeStyles` и обрезка
 */
export const StyledListboxSearchPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<ListboxPanelStyleProps>`
  ${(props) => getListboxSearchPanelStyles(props)}
`;

/**
 * getListboxListStyles — возвращает CSS-правила для узла `StyledListboxList`:
 * столбик опций, отступы, ограничение высоты и прокрутку.
 *
 * Как работает:
 * 1. Подставляет дефолт `size`
 * 2. Собирает столбик опций с отступами
 * 3. Ограничивает высоту и включает прокрутку через
 *    `getOpenControlOptionsListScrollStyles`
 *
 * @param props пропсы размера
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxListStyles(props: Pick<ListboxSurfaceStyleProps, 'size'>): string {
  const size = props.size ?? DEFAULT_SIZE_PRESET;

  return `
    display: grid;
    min-block-size: 0;
    padding-block: ${getSpacingValue(OPEN_CONTROL_SELECTABLE_INSET)};
    padding-inline-end: ${getSpacingValue(8)};
    ${getOpenControlOptionsListScrollStyles(size)}
  `;
}

/**
 * StyledListboxList — задаёт список опций в панели с поиском компонента Listbox.
 * Базируется на `<ul>` и принимает проп `size`.
 *
 * Генерация стилей:
 *  - `getListboxListStyles` — столбик, отступы, max-высота и прокрутка
 */
export const StyledListboxList = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== 'size',
})<Pick<ListboxSurfaceStyleProps, 'size'>>`
  ${(props) => getListboxListStyles(props)}
`;

/**
 * getListboxOptionStyles — возвращает CSS-правила для узла `StyledListboxOption`:
 * поверхность, отступы и акцентную подсветку активной строки.
 *
 * Как работает:
 * 1. Подставляет поверхность через `getOpenControlSelectableRowSurfaceStyles`:
 *    раскладку, габариты, заливку и подложку активной строки через `::before`
 * 2. Задаёт колонки подписи и галочки, в режиме чекбокса — чекбокса и подписи
 * 3. В режиме иконки опции переключает строку на flex: иконка не резервирует
 *    трек, когда её нет
 * 4. Гасит события на input в режиме чекбокса через `pointer-events: none`:
 *    жест принимает строка
 * 5. Задаёт `cursor: pointer` на строке: сброс даёт `pointer` только button
 * 6. На `[data-active]` красит текст в `inverse` через
 *    `getOpenControlActiveRowHighlightStyles`
 * 7. На `[aria-disabled]` гасит строку и ставит `not-allowed`
 *
 * @param props пропсы формы, размера и темы
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'size'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getOpenControlSelectableRowSurfaceStyles(props, {
      display: 'grid',
      gap: OPEN_CONTROL_ROW_GAP,
      highlight: 'primary',
      highlightWhen: `&[data-active='true']::before`,
    })}
    grid-template-columns: minmax(0, 1fr) auto;
    cursor: pointer;
    padding-inline: ${getPaddingInline(size)};
    &[data-checkbox] {
      grid-template-columns: auto minmax(0, 1fr);
    }
    &[data-checkbox] input {
      pointer-events: none;
    }
    &[data-icon] {
      display: flex;
    }
    ${getOpenControlActiveRowHighlightStyles(theme)}
    &[aria-disabled] {
      cursor: not-allowed;
      opacity: ${DISABLED_OPACITY};
    }
  `;
}

/**
 * StyledListboxOption — задаёт строку опции компонента Listbox.
 * Базируется на `<li>` и принимает пропсы `shape` и `size`.
 *
 * Генерация стилей:
 *  - `getListboxOptionStyles` — поверхность, отступы и подсветка
 */
export const StyledListboxOption = styled.li.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'shape' | 'size'>>`
  ${(props) => getListboxOptionStyles(props)}
`;

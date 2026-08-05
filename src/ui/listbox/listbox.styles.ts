/**
 * Файл: `src/ui/listbox/listbox.styles.ts`
 * Определяет внешний вид компонента Listbox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ListboxStyleProps` и `ListboxSurfaceStyleProps`
 * 2. Хранить максимум видимых строк панели в `LISTBOX_PANEL_MAX_OPTION_ROWS`
 * 3. Предоставить функцию `getListboxTextSize`
 * 4. Предоставить styled-узлы `StyledListboxRoot`, `StyledListboxTriggerRow`,
 *    `StyledListboxTrigger`, `StyledListboxPanel`, `StyledListboxOptionButton`
 *    и `StyledListboxOptionRow`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/listbox/index.tsx` — собирает компонент Listbox
 */

import styled from 'styled-components';

import { getPortalPanelStyles } from '@ui/anchored-portal';
import {
  ICON_SETTING_PROP_NAMES,
  getIconPositionStyles,
  resolveIconStateBackground,
} from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { MOTION_CONTROL_DURATION, getTransitionStyles } from '@ui/motion';
import {
  getOpenControlRootStyles,
  getOpenControlTriggerRowStyles,
} from '@ui/open-control';
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
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * getListboxTextSize — возвращает размер текста триггера и опций по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер Listbox
 * @returns метка размера текста из `TextSizePreset` для текста триггера и опций
 */
export function getListboxTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * resolveListboxBlockRadius — возвращает скругление поверхности по `shape` и `sizePreset`.
 *
 * @param shape форма поверхности
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveListboxBlockRadius(shape: ShapePreset, sizePreset: SizePreset): string {
  return resolveBlockRadius(shape, getMinBlockSize(sizePreset));
}

/**
 * ListboxSurfaceStyleProps — представляет пропсы стилизации поверхности Listbox.
 *
 * @property iconTone — тон секции шеврона
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type ListboxSurfaceStyleProps = {
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * ListboxStyleProps — представляет пропсы стилизации Listbox и layout-пропсы.
 */
export type ListboxStyleProps = LayoutProps & ListboxSurfaceStyleProps;

/**
 * StyledListboxRoot — задаёт корневой узел компонента Listbox.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledListboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getOpenControlRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * LISTBOX_SURFACE_PROP_NAMES — объединяет имена настроек иконки и пропсов
 * стилизации поверхности Listbox.
 */
const LISTBOX_SURFACE_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'shape',
  'sizePreset',
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
  ${(props) => getOpenControlTriggerRowStyles(props, resolveListboxBlockRadius)}
`;

/**
 * getListboxTriggerStyles — возвращает CSS-правила для узла `StyledListboxTrigger`:
 * раскладку лейбла, шов и канал состояний секции шеврона. Статику секции красит
 * внутренний Icon своими пропсами; собственную запись канала выключает через
 * `showHover={false}`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты пропсов
 * 2. Собирает сетку триггера: высоту ряда держит `min-block-size` родителя
 * 3. Кладёт раскладку позиции через `getIconPositionStyles`: колонки под позицию
 *    `[data-slot='icon']` и `block-size: 100%` на слоте. Цвет канала состояний — через
 *    `resolveIconStateBackground`
 * 4. На `:not(:disabled):hover` и `:focus-visible` выставляет
 *    `--icon-state-background` — подсвечивается только индикатор, шеврон не
 *    самостоятельное действие
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxTriggerStyles(
  props: ListboxSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { iconTone = DEFAULT_TONE, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  return `
    display: grid;
    ${getIconPositionStyles()}
    align-items: center;
    min-inline-size: 0;
    text-align: start;
    [data-slot='label'] {
      min-inline-size: 0;
      padding-inline: ${getPaddingInline(sizePreset)};
    }
    &:not(:disabled):hover {
      --icon-state-background: ${stateBackground};
    }
    &:focus-visible {
      outline: none;
      --icon-state-background: ${stateBackground};
    }
  `;
}

/**
 * StyledListboxTrigger — задаёт кнопку-триггер компонента Listbox.
 * Базируется на `<button>` и принимает пропсы из `ListboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getListboxTriggerStyles` — раскладка лейбла и секция шеврона
 */
export const StyledListboxTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_SURFACE_PROP_NAMES.has(prop),
})<ListboxSurfaceStyleProps>`
  ${(props) => getListboxTriggerStyles(props)}
`;

/**
 * LISTBOX_BOX_PROP_NAMES — хранит имена пропсов стилизации строки и панели Listbox.
 */
const LISTBOX_BOX_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * LISTBOX_PANEL_MAX_OPTION_ROWS — задаёт максимум видимых строк опций в панели.
 * Используется в `getListboxPanelStyles` для `max-block-size`.
 */
const LISTBOX_PANEL_MAX_OPTION_ROWS = 6;

/**
 * getListboxPanelStyles — возвращает CSS-правила для узла `StyledListboxPanel`:
 * хром портала через `getPortalPanelStyles`, ограничение высоты через
 * `LISTBOX_PANEL_MAX_OPTION_ROWS` и прокрутку.
 *
 * Как работает:
 * 1. Берёт тему, подставляет дефолты `shape` и `sizePreset`
 * 2. Подставляет хром панели через `getPortalPanelStyles`: fixed-позицию, слой
 *    `STACKING_PORTAL`, заливку `surface`, рамку с тенью через `getBorderStyles`,
 *    радиус через `resolveListboxBlockRadius` и постоянный `outline` через
 *    `getOutlineStyles`
 * 3. Ограничивает высоту через `LISTBOX_PANEL_MAX_OPTION_ROWS` и включает
 *    прокрутку `overflow: hidden auto`
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxPanelStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getPortalPanelStyles({
      theme,
      borderRadius: resolveListboxBlockRadius(shape, sizePreset),
    })}
    max-block-size: calc(${getMinBlockSize(sizePreset)} * ${LISTBOX_PANEL_MAX_OPTION_ROWS});
    overflow: hidden auto;
  `;
}

/**
 * StyledListboxPanel — задаёт выпадающую панель опций компонента Listbox.
 * Базируется на `<ul>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getListboxPanelStyles` — хром портала через `getPortalPanelStyles`, высота
 *    и прокрутка
 */
export const StyledListboxPanel = styled.ul.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getListboxPanelStyles(props)}
`;

/**
 * getListboxOptionSurfaceBaseStyles — возвращает CSS-правила общей поверхности
 * строки опции: раскладку, габариты, заливку и подложку наведения через `::before`.
 *
 * Как работает:
 * 1. Собирает раскладку строки, габариты по `sizePreset` и заливку `surface`
 * 2. Готовит слот лейбла: `min-inline-size: 0` и слой над подложкой
 * 3. Кладёт абсолютный `::before` с отступом от края, скруглением и переходом
 *    `background-color` — подложку наведения красят вызывающие генераторы
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionSurfaceBaseStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    position: relative;
    z-index: 0;
    display: grid;
    gap: ${getSpacingValue(12)};
    align-items: center;
    inline-size: 100%;
    min-block-size: ${getMinBlockSize(sizePreset)};
    text-align: start;
    background-color: ${theme.colors.surface};
    [data-slot='label'] {
      min-inline-size: 0;
      z-index: 1;
    }
    &::before {
      position: absolute;
      inset: ${getSpacingValue(4)};
      z-index: -1;
      pointer-events: none;
      content: '';
      border-radius: calc(${resolveListboxBlockRadius(shape, sizePreset)} - ${getSpacingValue(4)});
      ${getTransitionStyles('background-color', MOTION_CONTROL_DURATION)}
    }
  `;
}

/**
 * getListboxOptionButtonStyles — возвращает CSS-правила для узла
 * `StyledListboxOptionButton`: базовую поверхность, отступы и синюю подсветку.
 *
 * Как работает:
 * 1. Берёт базовую поверхность через `getListboxOptionSurfaceBaseStyles`: раскладку,
 *    габариты, заливку и подложку наведения через `::before`
 * 2. Задаёт колонки лейбла и галочки, отступы лейбла
 * 3. На `:not(:disabled):hover` и `:focus-visible` красит подложку и текст в
 *    `primary` / `inverse`, включая слот галочки
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionButtonStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getListboxOptionSurfaceBaseStyles(props)}
    grid-template-columns: minmax(0, 1fr) auto;
    padding-inline: ${getPaddingInline(sizePreset)};
    &:focus { outline: none; }
    &:not(:disabled):hover::before,
    &:focus-visible::before {
      background-color: ${theme.colors.primary};
    }
    &:not(:disabled):hover,
    &:focus-visible {
      color: ${theme.colors.inverse};
    }
    &:not(:disabled):hover [data-slot='check'],
    &:focus-visible [data-slot='check'] {
      color: ${theme.colors.inverse};
    }
  `;
}

/**
 * StyledListboxOptionButton — задаёт кнопку опции компонента Listbox.
 * Базируется на `<button>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getListboxOptionButtonStyles` — поверхность, отступы и подсветка
 */
export const StyledListboxOptionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getListboxOptionButtonStyles(props)}
`;

/**
 * getListboxOptionRowStyles — возвращает CSS-правила для узла `StyledListboxOptionRow`:
 * базовую поверхность опции, курсор и синюю подсветку наведения.
 *
 * Как работает:
 * 1. Берёт базовую поверхность через `getListboxOptionSurfaceBaseStyles`: раскладку,
 *    габариты, заливку и подложку наведения через `::before`
 * 2. Задаёт `cursor: pointer` на строке-метке: сброс даёт `pointer` только button
 * 3. Добавляет отступы и синюю подсветку при наведении и фокусе внутри
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionRowStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getListboxOptionSurfaceBaseStyles(props)}
    grid-template-columns: auto minmax(0, 1fr);
    cursor: pointer;
    padding-inline: ${getPaddingInline(sizePreset)};
    &:not(:has(input:disabled)):hover::before,
    &:focus-within::before {
      background-color: ${theme.colors.primary};
    }
    &:not(:has(input:disabled)):hover,
    &:focus-within {
      color: ${theme.colors.inverse};
    }
  `;
}

/**
 * StyledListboxOptionRow — задаёт строку опции с чекбоксом компонента Listbox.
 * Базируется на `<label>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getListboxOptionRowStyles` — поверхность, курсор и подсветка
 */
export const StyledListboxOptionRow = styled.label.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getListboxOptionRowStyles(props)}
`;

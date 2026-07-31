/**
 * Файл: `src/ui/combobox/combobox.styles.ts`
 * Определяет внешний вид компонента Combobox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ComboboxStyleProps` и `ComboboxSurfaceStyleProps`
 * 2. Хранить максимум видимых строк опций в `COMBOBOX_PANEL_MAX_OPTION_ROWS`
 * 3. Предоставить функцию `getComboboxTextSize`
 * 4. Предоставить styled-узлы `StyledComboboxRoot`, `StyledComboboxTriggerRow`,
 *    `StyledComboboxTrigger`, `StyledComboboxValue`, `StyledComboboxPanel`,
 *    `StyledComboboxSearchRow`, `StyledComboboxList` и `StyledComboboxOption`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/combobox/index.tsx` — собирает компонент Combobox
 */

import styled from 'styled-components';

import { getPortalPanelStyles } from '@ui/anchored-portal';
import { getBorderStyles } from '@ui/border';
import {
  ICON_SETTING_PROP_NAMES,
  getIconPositionStyles,
  resolveIconStateBackground,
} from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { MOTION_CONTROL_DURATION, getTransitionStyles } from '@ui/motion';
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
import { STACKING_OPEN_CONTROL } from '@ui/stacking';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

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
 * resolveComboboxBlockRadius — возвращает скругление поверхности по `shape` и `sizePreset`.
 *
 * @param shape форма поверхности
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveComboboxBlockRadius(shape: ShapePreset, sizePreset: SizePreset): string {
  return resolveBlockRadius(shape, getMinBlockSize(sizePreset));
}

/**
 * ComboboxSurfaceStyleProps — представляет пропсы стилизации поверхности Combobox.
 *
 * @property iconTone — тон секции шеврона
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type ComboboxSurfaceStyleProps = {
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * ComboboxStyleProps — представляет пропсы стилизации Combobox и layout-пропсы.
 */
export type ComboboxStyleProps = LayoutProps & ComboboxSurfaceStyleProps;

/**
 * getComboboxRootStyles — возвращает CSS-правила для корня `StyledComboboxRoot`:
 * раскладку, зазор, ширину и подъём слоя при открытой панели.
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxRootStyles(): string {
  return `
    position: relative;
    display: grid;
    gap: ${getSpacingValue(8)};
    inline-size: 100%;
    min-inline-size: 0;
    &[data-open='true'] { z-index: ${STACKING_OPEN_CONTROL}; }
  `;
}

/**
 * StyledComboboxRoot — задаёт корневой узел компонента Combobox.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getComboboxRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledComboboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getComboboxRootStyles()}
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
 * getComboboxTriggerRowStyles — возвращает CSS-правила для узла
 * `StyledComboboxTriggerRow`: габариты, заливку, рамку с тенью и `outline` фокуса.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты пропсов
 * 2. Собирает габариты ряда и заливку `surface`, затем рамку с тенью через
 *    `getBorderStyles` без второго аргумента — постоянная рамка
 * 3. Без clear оставляет одну колонку. При `data-has-clear` — две колонки.
 *    Позиция сброса читается из DOM по `[data-slot='clear']:first-child`, не из пропа
 * 4. Акцент фокуса даёт `outline` на ряде при `:focus-within`, потому что
 *    `overflow` обрезает `outline` детей
 * 5. При `data-open='true'` скрывает ряд через `visibility: hidden`, чтобы
 *    панель наследовала ширину якоря без двойного отображения триггера
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxTriggerRowStyles(
  props: ComboboxSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    &[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }
    &[data-has-clear]:has(> [data-slot='clear']:first-child) {
      grid-template-columns: auto minmax(0, 1fr);
    }
    inline-size: 100%;
    min-block-size: ${getMinBlockSize(sizePreset)};
    overflow: hidden;
    background-color: ${theme.colors.surface};
    border-radius: ${resolveComboboxBlockRadius(shape, sizePreset)};
    ${getBorderStyles(theme)}
    &[data-open='true'] { visibility: hidden; }
    &:focus-within {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }
  `;
}

/**
 * StyledComboboxTriggerRow — задаёт ряд триггера компонента Combobox.
 * Базируется на `<div>` и принимает пропсы из `ComboboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getComboboxTriggerRowStyles` — габариты, заливка, рамка с тенью и `outline` фокуса
 */
export const StyledComboboxTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_SURFACE_PROP_NAMES.has(prop),
})<ComboboxSurfaceStyleProps>`
  ${(props) => getComboboxTriggerRowStyles(props)}
`;

/**
 * getComboboxTriggerStyles — возвращает CSS-правила для узла `StyledComboboxTrigger`:
 * раскладку значения, шов и канал состояний секции шеврона. Статику секции красит
 * внутренний Icon своими пропсами.
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
function getComboboxTriggerStyles(
  props: ComboboxSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { iconTone = DEFAULT_TONE } = props;
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  return `
    display: grid;
    ${getIconPositionStyles()}
    align-items: center;
    min-inline-size: 0;
    text-align: start;
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
 * StyledComboboxTrigger — задаёт кнопку-триггер компонента Combobox.
 * Базируется на `<button>` и принимает пропсы из `ComboboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getComboboxTriggerStyles` — раскладка значения и секция шеврона
 */
export const StyledComboboxTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_SURFACE_PROP_NAMES.has(prop),
})<ComboboxSurfaceStyleProps>`
  ${(props) => getComboboxTriggerStyles(props)}
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
 * COMBOBOX_PANEL_MAX_OPTION_ROWS — задаёт максимум видимых строк опций в списке панели.
 * Используется в `getComboboxListStyles` для `max-block-size`.
 */
const COMBOBOX_PANEL_MAX_OPTION_ROWS = 6;

/**
 * getComboboxPanelStyles — возвращает CSS-правила для узла `StyledComboboxPanel`:
 * сетку поиска и списка, обрезку и хром портала через `getPortalPanelStyles`.
 *
 * Как работает:
 * 1. Берёт тему, подставляет дефолты `shape` и `sizePreset`
 * 2. Собирает сетку панели: ряд поиска и список
 * 3. Подставляет хром панели через `getPortalPanelStyles`: fixed-позицию, слой
 *    `STACKING_PORTAL`, заливку `surface`, рамку с тенью через `getBorderStyles`,
 *    радиус через `resolveComboboxBlockRadius` и постоянный `outline` через
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
      borderRadius: resolveComboboxBlockRadius(shape, sizePreset),
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
 * StyledComboboxSearchRow — задаёт ряд поля поиска и кнопки сброса в панели Combobox.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — поле поиска и кнопка сброса в одной строке
 *  - `grid-template-columns` при `data-has-clear` — вторая колонка под кнопку сброса
 *  - `appearance: none` на `::-webkit-search-cancel-button` и `::-webkit-search-decoration` —
 *    скрывает UA-кнопку сброса у `input[type='search']`, чтобы оставался только Icon
 */
export const StyledComboboxSearchRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  min-inline-size: 0;

  &[data-has-clear] {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  & input[type='search']::-webkit-search-cancel-button {
    appearance: none;
  }

  & input[type='search']::-webkit-search-decoration {
    appearance: none;
  }
`;

/**
 * getComboboxListStyles — возвращает CSS-правила для узла `StyledComboboxList`:
 * столбик опций, отступы, ограничение высоты и прокрутку по модели Listbox.
 *
 * Как работает:
 * 1. Подставляет дефолт `sizePreset`
 * 2. Собирает столбик опций с отступами
 * 3. Ограничивает высоту через `COMBOBOX_PANEL_MAX_OPTION_ROWS` и включает
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
    padding-block: ${getSpacingValue(4)};
    padding-inline-end: ${getSpacingValue(8)};
    max-block-size: calc(${getMinBlockSize(sizePreset)} * ${COMBOBOX_PANEL_MAX_OPTION_ROWS});
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
 * 1. Берёт тему и подставляет дефолты `shape` и `sizePreset`
 * 2. Собирает flex-раскладку опции, габариты и заливку `surface`
 * 3. Кладёт абсолютный `::before` с отступом от края, скруглением и переходом
 *    `background-color` — подложку наведения
 * 4. На `data-active`, `:hover:not(:disabled)` и `:focus-visible` красит
 *    подложку и текст в `primary` / `inverse`, включая слот галочки
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxOptionStyles(
  props: Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    position: relative;
    z-index: 0;
    display: flex;
    gap: ${getSpacingValue(12)};
    align-items: center;
    inline-size: 100%;
    min-block-size: ${getMinBlockSize(sizePreset)};
    padding-inline: ${getPaddingInline(sizePreset)};
    text-align: start;
    background-color: ${theme.colors.surface};
    &::before {
      position: absolute;
      inset: ${getSpacingValue(4)};
      z-index: -1;
      pointer-events: none;
      content: '';
      border-radius: calc(${resolveComboboxBlockRadius(shape, sizePreset)} - ${getSpacingValue(4)});
      ${getTransitionStyles('background-color', MOTION_CONTROL_DURATION)}
    }
    &:focus { outline: none; }
    &[data-active='true']::before,
    &:hover:not(:disabled)::before,
    &:focus-visible::before {
      background-color: ${theme.colors.primary};
    }
    &[data-active='true'],
    &:hover:not(:disabled),
    &:focus-visible {
      color: ${theme.colors.inverse};
    }
    &[data-active='true'] [data-slot='check'],
    &:hover:not(:disabled) [data-slot='check'],
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

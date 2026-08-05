/**
 * Файл: `src/ui/range-input/range-input.styles.ts`
 * Определяет внешний вид компонента RangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RangeInputStyleProps` и `RangeInputSurfaceStyleProps`
 * 2. Предоставить функцию `getRangeInputTextSize`
 * 3. Предоставить styled-узлы `StyledRangeInputRoot`, `StyledRangeInputTriggerRow`,
 *    `StyledRangeInputTrigger`, `StyledRangeInputValue`,
 *    `StyledRangeInputPanel`, `StyledRangeInputPresetList`, `StyledRangeInputPresetButton`,
 *    `StyledRangeInputCustomSection`, `StyledRangeInputFields` и `StyledRangeInputButtonRow`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/range-input/index.tsx` — собирает компонент RangeInput
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
 * getRangeInputTextSize — возвращает размер текста триггера и пресетов по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер RangeInput
 * @returns метка размера текста из `TextSizePreset` для текста триггера и пресетов
 */
export function getRangeInputTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * resolveRangeInputBlockRadius — возвращает скругление поверхности по `shape` и `sizePreset`.
 *
 * @param shape форма поверхности
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveRangeInputBlockRadius(
  shape: ShapePreset,
  sizePreset: SizePreset
): string {
  return resolveBlockRadius(shape, getMinBlockSize(sizePreset));
}

/**
 * RangeInputSurfaceStyleProps — представляет пропсы стилизации поверхности RangeInput.
 *
 * @property iconTone — тон секции шеврона и кнопки сброса
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type RangeInputSurfaceStyleProps = {
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * RangeInputStyleProps — представляет пропсы стилизации RangeInput и layout-пропсы.
 */
export type RangeInputStyleProps = LayoutProps & RangeInputSurfaceStyleProps;

/**
 * StyledRangeInputRoot — задаёт корневой узел компонента RangeInput.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getOpenControlRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * RANGE_INPUT_SURFACE_PROP_NAMES — объединяет имена настроек иконки и пропсов
 * стилизации поверхности RangeInput.
 */
const RANGE_INPUT_SURFACE_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * StyledRangeInputTriggerRow — задаёт ряд триггера компонента RangeInput.
 * Базируется на `<div>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и `outline` фокуса
 */
export const StyledRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerRowStyles(props, resolveRangeInputBlockRadius)}
`;

/**
 * getRangeInputTriggerStyles — возвращает CSS-правила для узла `StyledRangeInputTrigger`:
 * раскладку значения, шов и канал состояний секции шеврона. Статику секции красит
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
function getRangeInputTriggerStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { iconTone = DEFAULT_TONE } = props;
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  return `
    display: grid;
    ${getIconPositionStyles()}
    align-items: center;
    min-inline-size: 0;
    text-align: center;
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
 * StyledRangeInputTrigger — задаёт кнопку-триггер компонента RangeInput.
 * Базируется на `<button>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputTriggerStyles` — раскладка значения и секция шеврона
 */
export const StyledRangeInputTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputTriggerStyles(props)}
`;

/**
 * getRangeInputValueStyles — возвращает CSS-правила для узла `StyledRangeInputValue`:
 * сжатие текста и внутренние отступы по размеру.
 *
 * @param props пропсы поверхности
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputValueStyles(props: RangeInputSurfaceStyleProps): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    display: block;
    min-inline-size: 0;
    padding-inline: ${getPaddingInline(sizePreset)};
  `;
}

/**
 * StyledRangeInputValue — задаёт ячейку текста триггера и пресета компонента RangeInput.
 * Базируется на `<span>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputValueStyles` — сжатие текста и отступы по размеру
 */
export const StyledRangeInputValue = styled.span.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputValueStyles(props)}
`;

/**
 * getRangeInputPanelStyles — возвращает CSS-правила для узла `StyledRangeInputPanel`:
 * хром портала через `getPortalPanelStyles` и прокрутку.
 *
 * Как работает:
 * 1. Берёт тему, подставляет дефолты `shape` и `sizePreset`
 * 2. Подставляет хром панели через `getPortalPanelStyles`: fixed-позицию, слой
 *    `STACKING_PORTAL`, заливку `surface`, рамку с тенью через `getBorderStyles`,
 *    радиус через `resolveRangeInputBlockRadius` и постоянный `outline` через
 *    `getOutlineStyles`
 * 3. Включает прокрутку `overflow: hidden auto`
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputPanelStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getPortalPanelStyles({
      theme,
      borderRadius: resolveRangeInputBlockRadius(shape, sizePreset),
    })}
    overflow: hidden auto;
  `;
}

/**
 * StyledRangeInputPanel — задаёт панель выбора диапазона компонента RangeInput.
 * Базируется на `<div>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` и `gap` — вертикальный стек пресетов и кастомной секции
 *  - `padding` — внутренний отступ панели
 *
 * Генерация стилей:
 *  - `getRangeInputPanelStyles` — хром портала через `getPortalPanelStyles` и прокрутка
 */
export const StyledRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  display: grid;
  gap: ${getSpacingValue(12)};
  padding: ${getSpacingValue(16)};
  ${(props) => getRangeInputPanelStyles(props)}
`;

/**
 * StyledRangeInputPresetList — задаёт список пресетов компонента RangeInput.
 * Базируется на `<ul>`.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный перечень пресетов
 */
export const StyledRangeInputPresetList = styled.ul`
  display: grid;
`;

/**
 * getRangeInputPresetButtonStyles — возвращает CSS-правила для узла
 * `StyledRangeInputPresetButton`: габарит строки и вуаль наведения через `::before`.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputPresetButtonStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const borderRadius = resolveRangeInputBlockRadius(shape, sizePreset);

  return `
    position: relative;
    z-index: 0;
    display: grid;
    align-items: center;
    inline-size: 100%;
    min-block-size: ${getMinBlockSize(sizePreset)};
    text-align: start;
    background-color: ${theme.colors.surface};
    &::before {
      position: absolute;
      inset: ${getSpacingValue(4)};
      z-index: -1;
      pointer-events: none;
      content: '';
      border-radius: calc(${borderRadius} - ${getSpacingValue(4)});
      ${getTransitionStyles('background-color', MOTION_CONTROL_DURATION)}
    }
    &:focus { outline: none; }
    &:not(:disabled):hover::before,
    &:focus-visible::before {
      background-color: ${theme.colors.veil};
    }
  `;
}

/**
 * StyledRangeInputPresetButton — задаёт кнопку пресета компонента RangeInput.
 * Базируется на `<button>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputPresetButtonStyles` — габарит строки и вуаль наведения
 */
export const StyledRangeInputPresetButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputPresetButtonStyles(props)}
`;

/**
 * StyledRangeInputCustomSection — задаёт секцию ручного ввода границ компонента RangeInput.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `gap` — стек заголовка, полей, ошибки и кнопки
 */
export const StyledRangeInputCustomSection = styled.div`
  display: grid;
  gap: ${getSpacingValue(12)};
`;

/**
 * StyledRangeInputFields — задаёт ряд полей `from` и `to` компонента RangeInput.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)` — две равные колонки полей
 *  - `gap` — зазор между полями
 *  - `outline: none` на валидном `input:focus-visible` — фокус-контур несёт панель, как у Combobox
 */
export const StyledRangeInputFields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: ${getSpacingValue(12)};

  & input:focus-visible:not([aria-invalid='true']) {
    outline: none;
  }
`;

/**
 * StyledRangeInputButtonRow — задаёт ряд кнопки применения компонента RangeInput.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `justify-items: center` — центрирует кнопку применения
 */
export const StyledRangeInputButtonRow = styled.div`
  display: grid;
  justify-items: center;
`;

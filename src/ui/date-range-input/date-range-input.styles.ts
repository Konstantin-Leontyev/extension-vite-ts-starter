/**
 * Файл: `src/ui/date-range-input/date-range-input.styles.ts`
 * Определяет внешний вид компонента DateRangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `DateRangeInputStyleProps` и `DateRangeInputSurfaceStyleProps`
 * 2. Предоставить дефолты `DEFAULT_DATE_RANGE_INPUT_SHAPE` и
 *    `DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET`
 * 3. Предоставить styled-узлы `StyledDateRangeInputRoot`,
 *    `StyledDateRangeInputTriggerRow`, `StyledDateRangeInputClearButton` и
 *    `StyledDateRangeInputPanel`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/date-range-input/index.tsx` — собирает компонент DateRangeInput
 */

import styled from 'styled-components';

import { getPortalPanelStyles } from '@ui/anchored-portal';
import { getControlBorderStyles } from '@ui/border';
import { getIconSectionSeamStyles, resolveIconStateBackground } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getOutlineStyles } from '@ui/outline';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { STACKING_OPEN_CONTROL } from '@ui/stacking';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * DateRangeInputSurfaceStyleProps — представляет пропсы стилизации поверхности DateRangeInput.
 *
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type DateRangeInputSurfaceStyleProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * DateRangeInputStyleProps — представляет пропсы стилизации DateRangeInput и layout-пропсы.
 */
export type DateRangeInputStyleProps = LayoutProps & DateRangeInputSurfaceStyleProps;

/**
 * DATE_RANGE_INPUT_ROOT_PROP_NAMES — хранит имена layout-пропсов корня DateRangeInput.
 */
const DATE_RANGE_INPUT_ROOT_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES]);

/**
 * DATE_RANGE_INPUT_SURFACE_PROP_NAMES — хранит имена пропсов стилизации поверхности DateRangeInput.
 */
const DATE_RANGE_INPUT_SURFACE_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET — задаёт размер DateRangeInput по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
export const DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET: SizePreset = DEFAULT_SIZE_PRESET;

/**
 * DEFAULT_DATE_RANGE_INPUT_SHAPE — задаёт форму DateRangeInput по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
export const DEFAULT_DATE_RANGE_INPUT_SHAPE: ShapePreset = DEFAULT_SHAPE_PRESET;

/**
 * resolveDateRangeInputBlockRadius — возвращает скругление поверхности по `shape` и `sizePreset`.
 *
 * @param props пропсы поверхности
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveDateRangeInputBlockRadius(
  props: DateRangeInputSurfaceStyleProps
): string {
  const sizePreset = props.sizePreset ?? DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET;

  return resolveBlockRadius(
    props.shape ?? DEFAULT_DATE_RANGE_INPUT_SHAPE,
    getMinBlockSize(sizePreset)
  );
}

/**
 * getDateRangeInputRootStyles — возвращает CSS-правила для корня `StyledDateRangeInputRoot`:
 * раскладку, ширину и подъём слоя при открытой панели.
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputRootStyles(): string {
  const styles = [
    'position: relative;',
    'display: grid;',
    'inline-size: 100%;',
    'min-inline-size: 0;',
    `&[data-open='true'] { z-index: ${STACKING_OPEN_CONTROL}; }`,
  ];

  return styles.join('\n');
}

/**
 * StyledDateRangeInputRoot — задаёт корневой узел компонента DateRangeInput.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getDateRangeInputRootStyles` — раскладка, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledDateRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getDateRangeInputRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * getDateRangeInputTriggerRowStyles — возвращает CSS-правила для узла
 * `StyledDateRangeInputTriggerRow`: габариты, рамку, заливку и кольцо фокуса.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputTriggerRowStyles(
  props: DateRangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET;

  const styles = [
    'display: grid;',
    'grid-template-columns: minmax(0, 1fr);',
    `&[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }`,
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    'overflow: hidden;',
    `background-color: ${theme.colors.surface};`,
    `border-radius: ${resolveDateRangeInputBlockRadius(props)};`,
    getControlBorderStyles(theme),
    `&[data-open='true'] { visibility: hidden; }`,
    getIconSectionSeamStyles({
      borderColor: theme.colors.border,
      slot: 'clear',
    }),
    '&:focus-within {',
    getOutlineStyles(theme.colors.focusOutline),
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledDateRangeInputTriggerRow — задаёт ряд триггера компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `DateRangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getDateRangeInputTriggerRowStyles` — габариты, рамка, заливка и кольцо фокуса
 *
 * При открытой панели ряд скрывается через `visibility: hidden`, чтобы панель
 * наследовала ширину якоря без двойного отображения триггера.
 */
export const StyledDateRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<DateRangeInputSurfaceStyleProps>`
  ${(props) => getDateRangeInputTriggerRowStyles(props)}
`;

/**
 * getDateRangeInputClearButtonStyles — возвращает CSS-правила для узла
 * `StyledDateRangeInputClearButton`: квадрат сброса и канал состояний.
 * Статику красит внутренний Icon своими пропсами. Кнопка сброса — самостоятельное
 * действие, поэтому выставляет канал на собственных `hover` и `focus-visible`.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputClearButtonStyles(
  props: DateRangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET;
  const size = getMinBlockSize(sizePreset);
  const stateBackground = resolveIconStateBackground(theme, DEFAULT_TONE);

  const styles = [
    `inline-size: ${size};`,
    `min-inline-size: ${size};`,
    `&:not(:disabled):hover { --icon-state-background: ${stateBackground}; }`,
    '&:focus-visible {',
    'outline: none;',
    `--icon-state-background: ${stateBackground};`,
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledDateRangeInputClearButton — задаёт кнопку сброса компонента DateRangeInput.
 * Базируется на `<button>` и принимает пропсы из `DateRangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getDateRangeInputClearButtonStyles` — квадрат сброса и канал состояний
 */
export const StyledDateRangeInputClearButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<DateRangeInputSurfaceStyleProps>`
  ${(props) => getDateRangeInputClearButtonStyles(props)}
`;

/**
 * getDateRangeInputPanelStyles — возвращает CSS-правила для узла
 * `StyledDateRangeInputPanel`: оформление портальной панели календаря.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputPanelStyles(
  props: DateRangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);

  const styles = [
    getPortalPanelStyles({
      theme,
      borderRadius: resolveDateRangeInputBlockRadius(props),
      padding: getSpacingValue(16),
    }),
  ];

  return styles.join('\n');
}

/**
 * StyledDateRangeInputPanel — задаёт портальную панель календаря компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `DateRangeInputSurfaceStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка содержимого панели
 *  - `min-inline-size: 0` — предотвращает переполнение
 *
 * Генерация стилей:
 *  - `getDateRangeInputPanelStyles` — оформление портальной панели
 */
export const StyledDateRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<DateRangeInputSurfaceStyleProps>`
  display: grid;
  min-inline-size: 0;
  ${(props) => getDateRangeInputPanelStyles(props)}
`;

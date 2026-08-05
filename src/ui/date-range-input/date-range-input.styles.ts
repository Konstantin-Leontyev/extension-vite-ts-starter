/**
 * Файл: `src/ui/date-range-input/date-range-input.styles.ts`
 * Определяет внешний вид компонента DateRangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `DateRangeInputStyleProps`
 * 2. Предоставить дефолт формы `DEFAULT_DATE_RANGE_INPUT_SHAPE`
 * 3. Предоставить styled-узлы `StyledDateRangeInputRoot`,
 *    `StyledDateRangeInputTriggerRow` и
 *    `StyledDateRangeInputPanel`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/date-range-input/index.tsx` — собирает компонент DateRangeInput
 */

import styled from 'styled-components';

import { getPortalPanelStyles } from '@ui/anchored-portal';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  getOpenControlRootStyles,
  getOpenControlTriggerRowStyles,
} from '@ui/open-control';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

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
const DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET: SizePreset = DEFAULT_SIZE_PRESET;

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
 * StyledDateRangeInputRoot — задаёт корневой узел компонента DateRangeInput.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledDateRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getOpenControlRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledDateRangeInputTriggerRow — задаёт ряд триггера компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `DateRangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и
 *    `outline` фокуса
 */
export const StyledDateRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<DateRangeInputSurfaceStyleProps>`
  ${(props) =>
    getOpenControlTriggerRowStyles(
      props,
      (shape, sizePreset) => resolveDateRangeInputBlockRadius({ shape, sizePreset }),
      'trailing-only'
    )}
`;

/**
 * getDateRangeInputPanelStyles — возвращает CSS-правила для узла
 * `StyledDateRangeInputPanel`: хром портальной панели через `getPortalPanelStyles` —
 * fixed-позицию, слой, отступ, поверхность, рамку с тенью, радиус и `outline`.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputPanelStyles(
  props: DateRangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);

  return getPortalPanelStyles({
    theme,
    borderRadius: resolveDateRangeInputBlockRadius(props),
    padding: getSpacingValue(16),
  });
}

/**
 * StyledDateRangeInputPanel — задаёт портальную панель календаря компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `DateRangeInputSurfaceStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка календаря и ряда действий
 *  - `gap` — отступ между сеткой дней и SegmentButtonParts действий
 *  - `min-inline-size: 0` — предотвращает переполнение
 *
 * Генерация стилей:
 *  - `getDateRangeInputPanelStyles` — хром портальной панели через `getPortalPanelStyles`
 */
export const StyledDateRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<DateRangeInputSurfaceStyleProps>`
  display: grid;
  gap: ${getSpacingValue(12)};
  min-inline-size: 0;
  ${(props) => getDateRangeInputPanelStyles(props)}
`;

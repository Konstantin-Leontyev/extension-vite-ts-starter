/**
 * Файл: `src/ui/date-range-input/date-range-input.styles.ts`
 * Определяет внешний вид компонента DateRangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `DateRangeInputStyleProps` и `DateRangeInputSurfaceStyleProps`
 * 2. Предоставить дефолты `DEFAULT_DATE_RANGE_INPUT_SHAPE` и
 *    `DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET`
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
import { getBorderStyles } from '@ui/border';
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
 * `StyledDateRangeInputTriggerRow`: габариты, рамку с тенью через `getBorderStyles`,
 * заливку и кольцо фокуса.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getDateRangeInputTriggerRowStyles(
  props: DateRangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_DATE_RANGE_INPUT_SIZE_PRESET;

  return `
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    &[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }
    inline-size: 100%;
    min-block-size: ${getMinBlockSize(sizePreset)};
    overflow: hidden;
    background-color: ${theme.colors.surface};
    border-radius: ${resolveDateRangeInputBlockRadius(props)};
    ${getBorderStyles(theme)}
    &[data-open='true'] { visibility: hidden; }
    &:focus-within {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }
  `;
}

/**
 * StyledDateRangeInputTriggerRow — задаёт ряд триггера компонента DateRangeInput.
 * Базируется на `<div>` и принимает пропсы из `DateRangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getDateRangeInputTriggerRowStyles` — габариты, рамка с тенью, заливка и кольцо фокуса
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
 *  - `display: grid` — раскладка содержимого панели
 *  - `min-inline-size: 0` — предотвращает переполнение
 *
 * Генерация стилей:
 *  - `getDateRangeInputPanelStyles` — хром портальной панели через `getPortalPanelStyles`
 */
export const StyledDateRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !DATE_RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<DateRangeInputSurfaceStyleProps>`
  display: grid;
  min-inline-size: 0;
  ${(props) => getDateRangeInputPanelStyles(props)}
`;

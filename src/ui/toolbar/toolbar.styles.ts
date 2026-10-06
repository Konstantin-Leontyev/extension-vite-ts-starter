/**
 * Файл: `src/ui/toolbar/toolbar.styles.ts`
 * Определяет внешний вид компонента Toolbar.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ToolbarStyleProps`
 * 2. Хранить внутренний отступ поверхности в `TOOLBAR_PADDING`
 * 3. Предоставить styled-узел `StyledToolbar`
 *
 * Потребители:
 *  - `src/ui/toolbar/index.tsx` — собирает компонент Toolbar
 */

import styled from 'styled-components';

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_BORDER,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type BorderProps,
} from '@ui/border';
import { getIconSize, type IconSizePreset } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  resolveBlockRadius,
  type ShapePreset,
} from '@ui/presets';
import {
  getSpacingValue,
  resolvePaddingEdge,
  type SpacingProps,
  type SpacingValue,
} from '@ui/spacing';
import {
  DEFAULT_SURFACE_BACKGROUND,
  getSurfaceBackgroundColor,
  type SurfaceBackgroundPreset,
} from '@ui/surface';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * ToolbarStyleProps — представляет пропсы стилизации Toolbar и layout-пропсы.
 *
 * @property background — заливка панели инструментов
 * @property shape — форма панели
 * @property size — размер окна действия
 */
export type ToolbarStyleProps = LayoutProps &
  BorderProps & {
    background?: SurfaceBackgroundPreset;
    shape?: ShapePreset;
    size?: IconSizePreset;
  };

/**
 * TOOLBAR_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Toolbar.
 */
const TOOLBAR_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'background',
  'shape',
  'size',
]);

/**
 * TOOLBAR_PADDING — задаёт внутренний отступ поверхности панели инструментов.
 */
const TOOLBAR_PADDING: SpacingValue = 8;

/**
 * resolveToolbarBlockRadius — возвращает скругление поверхности панели по `shape`
 * и `size`.
 * Для `pill` высота — размер иконки плюс отступы `blockStart` и `blockEnd`
 * из `resolvePaddingEdge`. Без `padding*` оба отступа равны `TOOLBAR_PADDING`.
 *
 * @param shape форма панели
 * @param size размер окна действия
 * @param props spacing-пропсы панели
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveToolbarBlockRadius(
  shape: ShapePreset,
  size: IconSizePreset,
  props: SpacingProps
): string {
  const surfaceBlockSize = `calc(${getSpacingValue(getIconSize(size))} + ${getSpacingValue(
    resolvePaddingEdge(props, 'blockStart', TOOLBAR_PADDING)
  )} + ${getSpacingValue(resolvePaddingEdge(props, 'blockEnd', TOOLBAR_PADDING))})`;

  return resolveBlockRadius(shape, surfaceBlockSize);
}

/**
 * getToolbarStyles — возвращает CSS-правила для корня `StyledToolbar`: заливку,
 * рамку с тенью и скругление поверхности.
 *
 * @param props пропсы стилизации Toolbar и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getToolbarStyles(props: ToolbarStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    background = DEFAULT_SURFACE_BACKGROUND,
    borderTone,
    shape = DEFAULT_SHAPE_PRESET,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
    size = DEFAULT_SIZE_PRESET,
  } = props;

  return `
    background-color: ${getSurfaceBackgroundColor(theme, background)};
    ${getBorderStyles(theme, showBorder, showShadow, borderTone)}
    border-radius: ${resolveToolbarBlockRadius(shape, size, props)};
  `;
}

/**
 * StyledToolbar — задаёт корневой узел компонента Toolbar.
 * Базируется на `<div>` и поддерживает все пропсы из `ToolbarStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: max-content` — ширина панели не меньше ряда действий
 *  - `justify-self: center` — выравнивает панель по центру родителя по горизонтали
 *  - `min-block-size: 0` — сжимается по высоте во flex/grid-родителе
 *  - `padding` — внутренний отступ поверхности
 *  - `overflow: hidden` — обрезает содержимое по скруглению
 *
 * Генерация стилей:
 *  - `getToolbarStyles` — заливка, рамка с тенью и скругление поверхности
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledToolbar = styled.div.withConfig({
  shouldForwardProp: (prop) => !TOOLBAR_PROP_NAMES.has(prop),
})<ToolbarStyleProps>`
  display: grid;
  justify-self: center;
  min-inline-size: max-content;
  min-block-size: 0;
  padding: ${getSpacingValue(TOOLBAR_PADDING)};
  overflow: hidden;
  ${(props) => getToolbarStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

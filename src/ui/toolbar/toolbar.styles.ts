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
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import {
  DEFAULT_SURFACE_BACKGROUND,
  getSurfaceBackgroundColor,
  type SurfaceBackground,
} from '@ui/surface';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * ToolbarStyleProps — представляет пропсы стилизации Toolbar и layout-пропсы.
 *
 * @property background — заливка панели инструментов
 */
export type ToolbarStyleProps = LayoutProps &
  BorderProps & {
    background?: SurfaceBackground;
  };

/**
 * TOOLBAR_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Toolbar.
 */
const TOOLBAR_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'background',
]);

/**
 * TOOLBAR_PADDING — задаёт внутренний отступ поверхности панели инструментов.
 */
const TOOLBAR_PADDING: SpacingValue = 8;

/**
 * getToolbarStyles — возвращает CSS-правила для корня `StyledToolbar`: заливку
 * и рамку с тенью.
 *
 * @param props пропсы стилизации Toolbar и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getToolbarStyles(props: ToolbarStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    background = DEFAULT_SURFACE_BACKGROUND,
    borderTone,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
  } = props;

  return `
    background-color: ${getSurfaceBackgroundColor(theme, background)};
    ${getBorderStyles(theme, showBorder, showShadow, borderTone)}
  `;
}

/**
 * StyledToolbar — задаёт корневой узел компонента Toolbar.
 * Базируется на `<div>` и поддерживает все пропсы из `ToolbarStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: 0` и `min-block-size: 0` — сжимается во flex/grid-родителе
 *  - `padding` — внутренний отступ поверхности
 *  - `overflow: hidden` — обрезает содержимое по скруглению
 *  - `border-radius` — скругление поверхности через `resolveBlockRadius`
 *
 * Генерация стилей:
 *  - `getToolbarStyles` — заливка и рамка с тенью
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledToolbar = styled.div.withConfig({
  shouldForwardProp: (prop) => !TOOLBAR_PROP_NAMES.has(prop),
})<ToolbarStyleProps>`
  display: grid;
  min-inline-size: 0;
  min-block-size: 0;
  padding: ${getSpacingValue(TOOLBAR_PADDING)};
  overflow: hidden;
  border-radius: ${resolveBlockRadius(
    DEFAULT_SHAPE_PRESET,
    getMinBlockSize(DEFAULT_SIZE_PRESET)
  )};
  ${(props) => getToolbarStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

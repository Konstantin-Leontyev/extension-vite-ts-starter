/**
 * Файл: `src/ui/icon-button-row/icon-button-row.styles.ts`
 * Определяет внешний вид компонента IconButtonRow.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `IconButtonRowStyleProps`
 * 2. Предоставить styled-узел `StyledIconButtonRow`
 *
 * Потребители:
 *  - `src/ui/icon-button-row/index.tsx` — собирает компонент IconButtonRow
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getSpacingValue } from '@ui/spacing';

/**
 * IconButtonRowStyleProps — представляет пропсы стилизации IconButtonRow и layout-пропсы.
 */
export type IconButtonRowStyleProps = LayoutProps;

/**
 * StyledIconButtonRow — задаёт корневой узел компонента IconButtonRow.
 * Базируется на `<div>` и поддерживает все пропсы из `IconButtonRowStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `grid-auto-flow: column` — кнопки в один ряд
 *  - `column-gap` — отступ между кнопками
 *  - `align-items: center` — выравнивает кнопки по поперечной оси ряда
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledIconButtonRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<IconButtonRowStyleProps>`
  display: grid;
  grid-auto-flow: column;
  column-gap: ${getSpacingValue(8)};
  align-items: center;
  ${(props) => getLayoutStyles(props)}
`;

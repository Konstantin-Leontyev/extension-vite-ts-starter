/**
 * Файл: `src/components/profile-menu/profile-menu.styles.ts`
 * Определяет внешний вид компонента ProfileMenu.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ProfileMenuStyleProps`
 * 2. Предоставить styled-узлы `StyledProfileMenu`, `StyledProfileMenuContent`,
 *    `StyledProfileMenuHeader`, `StyledProfileMenuActions`, `StyledProfileMenuLegal`
 *    и `StyledProfileMenuLegalLink`
 *
 * Потребители:
 *  - `src/components/profile-menu/index.tsx` — собирает компонент ProfileMenu
 */

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * ProfileMenuStyleProps — представляет пропсы стилизации ProfileMenu и layout-пропсы.
 */
export type ProfileMenuStyleProps = LayoutProps;

/**
 * StyledProfileMenu — задаёт корневой узел компонента ProfileMenu.
 * Базируется на `<div>` и поддерживает все пропсы из `ProfileMenuStyleProps`.
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledProfileMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<ProfileMenuStyleProps>`
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledProfileMenuContent — задаёт колонку регионов панели компонента ProfileMenu.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — шапка, действия и правовые ссылки друг под другом
 *  - `block-size: 100%` — колонка заполняет высоту панели
 *  - `min-block-size: 0` — позволяет колонке сжиматься внутри ограниченной панели
 */
export const StyledProfileMenuContent = styled.div`
  display: grid;
  block-size: 100%;
  min-block-size: 0;
`;

/**
 * StyledProfileMenuHeader — задаёт шапку панели компонента ProfileMenu.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `place-items: center` — аватар и приветствие по центру
 *  - `gap` — отступ между аватаром и приветствием
 */
export const StyledProfileMenuHeader = styled.div`
  display: grid;
  gap: ${getSpacingValue(12)};
  place-items: center;
`;

/**
 * StyledProfileMenuActions — задаёт ряд действий панели компонента ProfileMenu.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `padding-inline` — боковые отступы вокруг SegmentButton
 *  - `margin-block-start` — отступ ряда действий от шапки
 */
export const StyledProfileMenuActions = styled.div`
  padding-inline: ${getSpacingValue(4)};
  margin-block-start: ${getSpacingValue(12)};
`;

/**
 * StyledProfileMenuLegal — задаёт навигацию правовых ссылок компонента ProfileMenu.
 * Базируется на `<nav>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `grid-auto-flow: column` — ссылки в один ряд
 *  - `gap` — отступ между ссылками и разделителями
 *  - `justify-content: center` — ряд по центру панели
 *  - `padding-block-start` — отступ от ряда действий
 */
export const StyledProfileMenuLegal = styled.nav`
  display: grid;
  grid-auto-flow: column;
  gap: ${getSpacingValue(8)};
  align-items: center;
  justify-content: center;
  padding-block-start: ${getSpacingValue(16)};
`;

/**
 * getProfileMenuLegalLinkStyles — возвращает CSS-правила для узла `StyledProfileMenuLegalLink`: цвет ссылки.
 * Цвет задаётся на Link, а не на внутреннем Text: глобальный сброс красит `a:hover` и
 * `a:focus-visible`, а Text наследует через `color: inherit`.
 *
 * @param props объект с полем `theme` из styled-components
 * @returns CSS-правила, каждое с новой строки
 */
function getProfileMenuLegalLinkStyles(props: { theme: AppTheme }): string {
  return `color: ${getTheme(props).colors.muted};`;
}

/**
 * StyledProfileMenuLegalLink — задаёт ссылку правовой навигации компонента ProfileMenu.
 * Базируется на `Link` из react-router-dom.
 *
 * Встроенные стили:
 *  - `padding-inline` — расширяет кликабельную зону ссылки
 *
 * Генерация стилей:
 *  - `getProfileMenuLegalLinkStyles` — цвет `muted` в покое
 */
export const StyledProfileMenuLegalLink = styled(Link)`
  padding-inline: ${getSpacingValue(8)};
  ${(props) => getProfileMenuLegalLinkStyles(props)}
`;

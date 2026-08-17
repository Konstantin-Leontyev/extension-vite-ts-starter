/**
 * Файл: `src/components/profile-menu/profile-menu.styles.ts`
 * Определяет внешний вид компонента ProfileMenu.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ProfileMenuStyleProps`
 * 2. Предоставить styled-узлы `StyledProfileMenu`, `StyledProfileMenuPanel`,
 *    `StyledProfileMenuContent`, `StyledProfileMenuHeader`,
 *    `StyledProfileMenuLegal` и `StyledProfileMenuLegalLink`
 *
 * Потребители:
 *  - `src/components/profile-menu/index.tsx` — собирает компонент ProfileMenu
 */

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getCssAnchorBindingStyles } from '@ui/anchored-panel';
import { Card } from '@ui/card';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { PANEL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

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
 * StyledProfileMenuPanel — задаёт привязанную панель компонента ProfileMenu.
 * Базируется на `Card` из `@ui/card` и принимает пропсы Card.
 *
 * Встроенные стили:
 *  - `inset-block` — задаёт IMCB: старт от `anchor(end)` с зазором из
 *    `getSpacingValue(12)`, конец у края вьюпорта с отступом `PANEL_VIEWPORT_EDGE_INSET`
 *  - `inset-inline-end: anchor(end)` — совмещает край `end` панели с краем `end`
 *    триггера
 *  - `block-size: max-content` — оставляет панель естественной высоты. Без него
 *    два значения `inset-block` растянули бы панель на всю доступную область
 *  - `max-block-size: 100%` — ограничивает высоту размером IMCB
 *  - `overflow-y: auto` — прокручивает содержимое, когда оно выше панели
 *
 * Генерация стилей:
 *  - `getCssAnchorBindingStyles` — `position-anchor: auto` связывает панель с якорем, `position-visibility: always`
 */
export const StyledProfileMenuPanel = styled(Card)`
  ${getCssAnchorBindingStyles()}
  inset-block: calc(anchor(end) + ${getSpacingValue(12)}) ${PANEL_VIEWPORT_EDGE_INSET}px;
  inset-inline-end: anchor(end);
  block-size: max-content;
  max-block-size: 100%;
  overflow-y: auto;
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

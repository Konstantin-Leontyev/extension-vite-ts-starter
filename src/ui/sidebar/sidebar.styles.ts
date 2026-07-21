/**
 * Файл: `src/ui/sidebar/sidebar.styles.ts`
 * Определяет внешний вид компонента Sidebar.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SidebarStyleProps`
 * 2. Хранить ширину панели в `SIDEBAR_PANEL_WIDTH`
 * 3. Предоставить styled-узлы `StyledSidebar`, `StyledSidebarContent`, `StyledSidebarSlot`
 *    и `StyledSidebarTrack`
 *
 * Потребители:
 *  - `src/ui/sidebar/index.tsx` — собирает компонент Sidebar
 */

import styled from 'styled-components';

import { getShellTransitionStyles } from '@ui/motion';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';

/**
 * SIDEBAR_PANEL_WIDTH — задаёт ширину выезжающей панели.
 * Используется в `StyledSidebarTrack` и при расчёте ширины `StyledSidebarSlot`.
 */
const SIDEBAR_PANEL_WIDTH = '20rem';

/**
 * StyledSidebarContent — задаёт область контента компонента Sidebar.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: flex` и `flex-direction: column` — вертикальный скролл-контейнер
 *    произвольного содержимого. Flex вместо grid: поток произвольного контента,
 *    а не фиксированная раскладка
 *  - `min-inline-size: 0` и `min-block-size: 0` — позволяют сжиматься в grid-каркасе
 *  - `overflow-y: auto` — внутренний скролл области контента без утягивания панели.
 *    Работает только при заданной высоте у предков: без неё трек `minmax(0, 1fr)`
 *    раздувается под контент, и скроллится вся страница. Каркасный фикс задаётся
 *    в `@ui/reset` и на страницах с корневым `<main>`, либо локально через
 *    `max-block-size` в dvb, как на странице витрины дизайн-системы
 */
export const StyledSidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  min-block-size: 0;
  overflow-y: auto;
`;

/**
 * StyledSidebarSlot — задаёт слот-колонку выезжающей панели компонента Sidebar.
 * Базируется на `<aside>`.
 *
 * Встроенные стили:
 *  - `inline-size: 0` — колонка свёрнута, пока панель не раскрыта
 *  - `overflow: hidden` — обрезает трек при анимации ширины
 *  - `display: none` при `data-open='false'` — скрывает слот, пока панель не в DOM
 *
 * Генерация стилей:
 *  - `getShellTransitionStyles` — переход по `inline-size`
 */
export const StyledSidebarSlot = styled.aside`
  inline-size: 0;
  min-inline-size: 0;
  min-block-size: 0;
  overflow: hidden;
  ${getShellTransitionStyles('inline-size')}

  &[data-open='false'] {
    display: none;
  }
`;

/**
 * StyledSidebarTrack — задаёт трек выезжающей панели компонента Sidebar.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: flex` и `justify-content: flex-end` — прижимает панель к краю выезда.
 *    Flex вместо grid: иначе ломается выезд нижнего листа на узком экране
 *  - `inline-size` из `SIDEBAR_PANEL_WIDTH` — фиксированная ширина трека
 *  - `transform: translateX(100%)` — стартовое положение за правым краем
 *  - `transform: translateX(0)` при `data-open='true'` — панель на месте
 *  - `inline-size: 100%`, `min-inline-size: 0` и `min-block-size: 0` на первом
 *    ребёнке — Card заполняет трек и сжимается ниже min-content, не распирая трек
 *
 * Генерация стилей:
 *  - `getShellTransitionStyles` — переход по `transform`
 */
export const StyledSidebarTrack = styled.div`
  display: flex;
  justify-content: flex-end;
  inline-size: ${SIDEBAR_PANEL_WIDTH};
  block-size: 100%;
  min-block-size: 0;
  transform: translateX(100%);
  ${getShellTransitionStyles('transform')}

  &[data-open='true'] {
    transform: translateX(0);
  }

  > :first-child {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
  }
`;

/**
 * SidebarStyleProps — представляет пропсы стилизации Sidebar.
 *
 * @property offset — зазор между областью контента и панелью
 * @property padding — единый отступ всех зон каркаса
 */
export type SidebarStyleProps = {
  offset?: SpacingValue;
  padding?: SpacingValue;
};

/**
 * SIDEBAR_PROP_NAMES — хранит имена пропсов стилизации Sidebar.
 */
const SIDEBAR_PROP_NAMES = new Set<string>(['offset', 'padding']);

/**
 * DEFAULT_OFFSET — задаёт зазор между контентом и панелью по умолчанию.
 * Используется, когда вызывающий код не передал проп `offset`.
 */
const DEFAULT_OFFSET: SpacingValue = 8;

/**
 * SIDEBAR_CONTENT_INSET — зонный дефолт отступа области контента, когда проп `padding`
 * не передан. Не дефолт пропа: у `padding` две зонные подстановки.
 */
const SIDEBAR_CONTENT_INSET: SpacingValue = 0;

/**
 * SIDEBAR_EDGE_INSET — зонный дефолт отступа края панели и правого отступа контента,
 * когда проп `padding` не передан. Не дефолт пропа: у `padding` две зонные подстановки.
 */
const SIDEBAR_EDGE_INSET: SpacingValue = 8;

/**
 * getSidebarStyles — возвращает CSS-правила для корня `StyledSidebar`: отступы зон
 * каркаса, зазор при открытой панели, ширину слота и поведение на узком экране.
 *
 * @param props пропсы стилизации Sidebar
 * @returns CSS-правила, каждое с новой строки
 */
function getSidebarStyles(props: SidebarStyleProps): string {
  const { offset = DEFAULT_OFFSET, padding } = props;
  const paddingValue = getSpacingValue(padding ?? SIDEBAR_CONTENT_INSET);
  const paddingInlineEndValue = getSpacingValue(padding ?? SIDEBAR_EDGE_INSET);

  const styles = [
    `${StyledSidebarContent} {`,
    `padding-block: ${paddingValue};`,
    `padding-inline-start: ${paddingValue};`,
    `}`,
    `@media (width > 640px) {`,
    `&:not(:has(${StyledSidebarSlot}[data-open='true'])) ${StyledSidebarContent} {`,
    `padding-inline-end: ${paddingInlineEndValue};`,
    `}`,
    `&:has(${StyledSidebarSlot}[data-open='true']) {`,
    `gap: ${getSpacingValue(offset)};`,
    `}`,
    `${StyledSidebarSlot}[data-open='true'][data-expanded='true'] {`,
    `inline-size: calc(${SIDEBAR_PANEL_WIDTH} + ${paddingInlineEndValue});`,
    `padding-block-end: ${paddingInlineEndValue};`,
    `padding-inline-end: ${paddingInlineEndValue};`,
    `}`,
    `}`,
    `@media (width <= 640px) {`,
    `${StyledSidebarSlot} {`,
    `position: absolute;`,
    `inset-block-end: 0;`,
    `inset-inline: 0;`,
    `z-index: 50;`,
    `inline-size: auto;`,
    `padding-inline: ${paddingValue} ${paddingInlineEndValue};`,
    `}`,
    `${StyledSidebarTrack} {`,
    `inline-size: 100%;`,
    `block-size: 50dvb;`,
    `transform: translateY(100%);`,
    `}`,
    `${StyledSidebarTrack}[data-open='true'] {`,
    `transform: translateY(0);`,
    `}`,
    `${StyledSidebarTrack} > :first-child {`,
    `max-block-size: min(480px, 60dvb);`,
    `}`,
    `}`,
  ];

  return styles.join('\n');
}

/**
 * StyledSidebar — задаёт корневой узел компонента Sidebar.
 * Базируется на `<div>` и поддерживает все пропсы из `SidebarStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — каркас из области контента и слота панели
 *  - `block-size: 100%` — заполняет родителя. Заданную высоту обеспечивает обёртка
 *    вызывающего кода
 *  - `overflow: hidden` — обрезает выезд панели по границе каркаса
 *  - `grid-template-columns: 1fr auto` при ширине больше `640px` — панель
 *    в потоке справа, контент ужимается
 *
 * Генерация стилей:
 *  - `getSidebarStyles` — отступы зон, зазор, ширина слота, узкий экран
 */
export const StyledSidebar = styled.div.withConfig({
  shouldForwardProp: (prop) => !SIDEBAR_PROP_NAMES.has(prop),
})<SidebarStyleProps>`
  position: relative;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: 1fr;
  min-inline-size: 0;
  block-size: 100%;
  min-block-size: 0;
  overflow: hidden;

  ${(props) => getSidebarStyles(props)}

  @media (width > 640px) {
    grid-template-columns: 1fr auto;
  }
`;

/**
 * Файл: `src/ui/sidebar/sidebar.styles.ts`
 * Определяет внешний вид компонента Sidebar.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SidebarStyleProps`
 * 2. Хранить ширину панели в `SIDEBAR_PANEL_WIDTH`, порог раскладки в
 *    `SIDEBAR_PANEL_BREAKPOINT`, высоты узкого экрана в `SIDEBAR_PANEL_BLOCK_SIZE`
 *    и `SIDEBAR_PANEL_MAX_BLOCK_SIZE`
 * 3. Предоставить styled-узлы `StyledSidebar`, `StyledSidebarContent`, `StyledSidebarSlot`
 *    и `StyledSidebarTrack`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/sidebar/index.tsx` — собирает компонент Sidebar
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { MOTION_SHELL_DURATION, getTransitionStyles } from '@ui/motion';
import { POSITIONING_PROPERTY_NAMES } from '@ui/positioning';
import { SIZING_PROPERTY_NAMES } from '@ui/sizing';
import {
  PADDING_PROPERTY_NAMES,
  getSpacingValue,
  type SpacingProps,
  type SpacingValue,
} from '@ui/spacing';
import { STACKING_SIDEBAR } from '@ui/stacking';
import { VIEWPORT_EDGE_INSET } from '@ui/viewport';

export { splitLayoutProps } from '@ui/layout';

/**
 * SIDEBAR_PANEL_WIDTH — задаёт ширину выезжающей панели.
 * Используется в `StyledSidebarTrack` и при расчёте ширины `StyledSidebarSlot`.
 */
const SIDEBAR_PANEL_WIDTH = '20rem';

/**
 * SIDEBAR_PANEL_BREAKPOINT — задаёт порог широкого экрана для раскладки Sidebar.
 * Используется в `getSidebarStyles` и `StyledSidebar`.
 */
const SIDEBAR_PANEL_BREAKPOINT = '640px';

/**
 * SIDEBAR_PANEL_BLOCK_SIZE — задаёт высоту выезжающей панели на узком экране.
 * Используется в `getSidebarStyles`.
 */
const SIDEBAR_PANEL_BLOCK_SIZE = '50dvb';

/**
 * SIDEBAR_PANEL_MAX_BLOCK_SIZE — задаёт потолок высоты содержимого панели на узком экране.
 * Используется в `getSidebarStyles`.
 */
const SIDEBAR_PANEL_MAX_BLOCK_SIZE = 'min(480px, 60dvb)';

/**
 * StyledSidebarContent — задаёт область контента компонента Sidebar.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: flex` — вертикальный скролл-контейнер произвольного содержимого.
 *    Flex вместо grid: поток произвольного контента, а не фиксированная раскладка
 *  - `flex-direction: column` — колонка содержимого
 *  - `min-inline-size: 0` — позволяет сжиматься по строчной оси в grid-каркасе
 *  - `min-block-size: 0` — позволяет сжиматься по блочной оси в grid-каркасе
 *  - `overflow-y: auto` — внутренний скролл области контента без утягивания панели.
 *    Работает только при заданной высоте у предков: без неё трек `minmax(0, 1fr)`
 *    раздувается под контент, и скроллится вся страница. Каркасный фикс задаётся
 *    в `@ui/reset` и на страницах с корневым `<main>`, либо локально через
 *    `max-block-size` в dvb, как на странице витрины
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
 *  - `getTransitionStyles` — переход по `inline-size`
 */
export const StyledSidebarSlot = styled.aside`
  inline-size: 0;
  min-inline-size: 0;
  min-block-size: 0;
  overflow: hidden;
  ${getTransitionStyles('inline-size', MOTION_SHELL_DURATION)}

  &[data-open='false'] {
    display: none;
  }
`;

/**
 * StyledSidebarTrack — задаёт трек выезжающей панели компонента Sidebar.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: flex` — прижимает панель к краю выезда. Flex вместо grid: иначе
 *    ломается выезд нижнего листа на узком экране
 *  - `justify-content: flex-end` — панель у края выезда
 *  - `inline-size` из `SIDEBAR_PANEL_WIDTH` — фиксированная ширина трека
 *  - `transform: translateX(100%)` — стартовое положение за правым краем
 *  - `transform: translateX(0)` при `data-open='true'` — панель на месте
 *  - `inline-size: 100%` на первом ребёнке — Card заполняет трек
 *  - `min-inline-size: 0` на первом ребёнке — Card сжимается по строчной оси
 *    ниже min-content и не распирает трек
 *  - `min-block-size: 0` на первом ребёнке — Card сжимается по блочной оси
 *
 * Генерация стилей:
 *  - `getTransitionStyles` — переход по `transform`
 */
export const StyledSidebarTrack = styled.div`
  display: flex;
  justify-content: flex-end;
  inline-size: ${SIDEBAR_PANEL_WIDTH};
  block-size: 100%;
  min-block-size: 0;
  transform: translateX(100%);
  ${getTransitionStyles('transform', MOTION_SHELL_DURATION)}

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
 */
export type SidebarStyleProps = LayoutProps;

/**
 * omitSidebarShellLayoutProps — убирает маршрутизируемые `padding*` через
 * `PADDING_PROPERTY_NAMES`, а также sizing и positioning, включая `gap`: их каркас
 * Sidebar не применяет на корень по исключению оболочки, `gap` уходит в зоны через
 * `getSidebarStyles`.
 *
 * @param props layout-пропсы Sidebar
 * @returns layout-пропсы корня для `getLayoutStyles`: внешние отступы
 */
function omitSidebarShellLayoutProps(props: LayoutProps): LayoutProps {
  const rootLayoutProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (
      PADDING_PROPERTY_NAMES.has(key) ||
      POSITIONING_PROPERTY_NAMES.has(key) ||
      SIZING_PROPERTY_NAMES.has(key)
    ) {
      continue;
    }

    rootLayoutProps[key] = value;
  }

  return rootLayoutProps as LayoutProps;
}

/**
 * resolveSidebarPaddingEdge — вычисляет отступ края оболочки с каскадом
 * шорткатов layout: сторона → ось → `padding` → `VIEWPORT_EDGE_INSET`.
 *
 * @param props spacing-пропсы Sidebar
 * @param edge край оболочки
 * @returns значение шкалы отступов
 */
function resolveSidebarPaddingEdge(
  props: SpacingProps,
  edge: 'blockEnd' | 'blockStart' | 'inlineEnd' | 'inlineStart'
): SpacingValue {
  if (edge === 'blockStart') {
    return (
      props.paddingBlockStart ??
      props.paddingBlock ??
      props.padding ??
      VIEWPORT_EDGE_INSET
    );
  }

  if (edge === 'blockEnd') {
    return (
      props.paddingBlockEnd ?? props.paddingBlock ?? props.padding ?? VIEWPORT_EDGE_INSET
    );
  }

  if (edge === 'inlineStart') {
    return (
      props.paddingInlineStart ??
      props.paddingInline ??
      props.padding ??
      VIEWPORT_EDGE_INSET
    );
  }

  return (
    props.paddingInlineEnd ?? props.paddingInline ?? props.padding ?? VIEWPORT_EDGE_INSET
  );
}

/**
 * getSidebarStyles — возвращает CSS-правила для корня `StyledSidebar`: отступы зон
 * каркаса, зазор при открытой панели, ширину слота, слой `STACKING_SIDEBAR`
 * на узком экране и поведение выезда.
 *
 * Как работает:
 * 1. Для каждого края оболочки берёт отступ по каскаду сторона → ось → `padding` →
 *    `VIEWPORT_EDGE_INSET` и переводит метку шкалы в CSS-длину
 * 2. Пишет отступы в `StyledSidebarContent` и `StyledSidebarSlot` по состоянию
 *    панели и ширине вьюпорта
 * 3. На широком экране при открытой панели задаёт зазор между зонами и ширину
 *    слота как ширину панели плюс отступ inline-end
 * 4. На узком экране выносит слот из потока к нижнему краю, поднимает слой
 *    `STACKING_SIDEBAR`, выезжает трек снизу на высоту панели и ограничивает
 *    потолок содержимого
 *
 * @param props пропсы стилизации Sidebar
 * @returns CSS-правила, каждое с новой строки
 */
function getSidebarStyles(props: SidebarStyleProps): string {
  const paddingBlockStart = getSpacingValue(
    resolveSidebarPaddingEdge(props, 'blockStart')
  );
  const paddingBlockEnd = getSpacingValue(resolveSidebarPaddingEdge(props, 'blockEnd'));
  const paddingInlineStart = getSpacingValue(
    resolveSidebarPaddingEdge(props, 'inlineStart')
  );
  const paddingInlineEnd = getSpacingValue(
    resolveSidebarPaddingEdge(props, 'inlineEnd')
  );

  return `
    ${StyledSidebarContent} {
      padding-block-start: ${paddingBlockStart};
      padding-block-end: ${paddingBlockEnd};
      padding-inline-start: ${paddingInlineStart};
    }
    @media (width > ${SIDEBAR_PANEL_BREAKPOINT}) {
      &:not(:has(${StyledSidebarSlot}[data-open='true'])) ${StyledSidebarContent} {
        padding-inline-end: ${paddingInlineEnd};
      }
      &:has(${StyledSidebarSlot}[data-open='true']) {
        gap: ${getSpacingValue(props.gap ?? VIEWPORT_EDGE_INSET)};
      }
      ${StyledSidebarSlot}[data-open='true'][data-expanded='true'] {
        inline-size: calc(${SIDEBAR_PANEL_WIDTH} + ${paddingInlineEnd});
        padding-block-start: ${paddingBlockStart};
        padding-block-end: ${paddingBlockEnd};
        padding-inline-end: ${paddingInlineEnd};
      }
    }
    @media (width <= ${SIDEBAR_PANEL_BREAKPOINT}) {
      ${StyledSidebarContent} {
        padding-inline-end: ${paddingInlineEnd};
      }
      ${StyledSidebarSlot} {
        position: absolute;
        inset-block-end: 0;
        inset-inline: 0;
        z-index: ${STACKING_SIDEBAR};
        inline-size: auto;
        padding-block-start: ${paddingBlockStart};
        padding-block-end: ${paddingBlockEnd};
        padding-inline: ${paddingInlineStart} ${paddingInlineEnd};
      }
      ${StyledSidebarTrack} {
        inline-size: 100%;
        block-size: ${SIDEBAR_PANEL_BLOCK_SIZE};
        transform: translateY(100%);
      }
      ${StyledSidebarTrack}[data-open='true'] {
        transform: translateY(0);
      }
      ${StyledSidebarTrack} > :first-child {
        max-block-size: ${SIDEBAR_PANEL_MAX_BLOCK_SIZE};
      }
    }
  `;
}

/**
 * StyledSidebar — задаёт корневой узел компонента Sidebar.
 * Базируется на `<div>` и поддерживает layout-пропсы из `SidebarStyleProps`
 * без маршрутизируемых `padding*`, sizing и positioning.
 *
 * Встроенные стили:
 *  - `display: grid` — каркас из области контента и слота панели
 *  - `block-size: 100%` — заполняет родителя. Заданную высоту обеспечивает обёртка
 *    вызывающего кода
 *  - `overflow: hidden` — обрезает выезд панели по границе каркаса
 *  - `grid-template-columns: 1fr auto` при ширине больше `SIDEBAR_PANEL_BREAKPOINT` —
 *    панель в потоке справа, контент ужимается
 *
 * Генерация стилей:
 *  - `getSidebarStyles` — маршрутизация `padding*` и `gap` по зонам и состояниям
 *  - `getLayoutStyles` — внешние отступы корня
 */
export const StyledSidebar = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
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
  ${(props) => getLayoutStyles(omitSidebarShellLayoutProps(props))}

  ${`@media (width > ${SIDEBAR_PANEL_BREAKPOINT}) {
    grid-template-columns: 1fr auto;
  }`}
`;

import styled from 'styled-components';

import { spacingRem, type SpacingPx } from '@ui/spacing';

/** Ширина выезжающей панели — единый источник для трека и размеров Card. */
export const SIDEBAR_PANEL_WIDTH = '20rem';

/** Зазор между контентом и панелью + правый инсет страницы (панель садится в него). */
const DEFAULT_OFFSET: SpacingPx = 8;
const DEFAULT_INLINE_END: SpacingPx = 8;

/** Длительность выезда/сворачивания; transitionend по transform завершает размонтирование. */
const TRANSITION = '0.25s ease';

/** Инсеты области контента (children); правый — ещё и гаттер панели. */
export type SidebarStyleProps = {
  offset?: SpacingPx;
  paddingBlockEnd?: SpacingPx;
  paddingBlockStart?: SpacingPx;
  paddingInlineEnd?: SpacingPx;
  paddingInlineStart?: SpacingPx;
};

const SIDEBAR_PROP_NAMES = new Set<string>([
  'offset',
  'paddingBlockEnd',
  'paddingBlockStart',
  'paddingInlineEnd',
  'paddingInlineStart',
]);

/**
 * Левая область страницы: скроллит свой контент внутри себя, не утягивая сайдбар.
 *
 * Внутренний скролл активируется ТОЛЬКО когда у предков есть definite-высота.
 * Из-за `min-height` (без явной `height`) grid-каркас авторазмерен по контенту:
 * трек `minmax(0, 1fr)` раздувается под высокий контент, `overflow` не цепляется,
 * скролится вся страница и сайдбар уезжает вниз.
 *
 * Каркасный фикс (когда на этих примитивах строится приложение, напр. встроенный
 * ИИ-ассистент, где в `children` рендерится скроллимая страница) — в @ui/reset:
 *   body { block-size: 100dvb; overflow: hidden }   // app-shell = вьюпорт
 * и каждой странице-`main` (кроме хостящей Sidebar): { overflow-y: auto; min-block-size: 0 }
 * чтобы её контент скролился сам, а не через body.
 *
 * Без каркасного фикса высоту ограничивают локально (`max-block-size` в `dvb` на
 * контейнере контента) — так сделано на странице design-system.
 */
export const StyledSidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  min-block-size: 0;
  overflow-y: auto;
`;

/** Слот-колонка: анимирует ширину; скрыт, пока панель не смонтирована. */
export const StyledSidebarSlot = styled.aside`
  align-self: stretch;
  inline-size: 0;
  min-inline-size: 0;
  min-block-size: 0;
  overflow: hidden;
  transition: inline-size ${TRANSITION};

  &[data-open='false'] {
    display: none;
  }
`;

/** Трек панели: едет по transform; ширина фиксирована шириной панели. */
export const StyledSidebarTrack = styled.div`
  display: flex;
  justify-content: flex-end;
  inline-size: ${SIDEBAR_PANEL_WIDTH};
  block-size: 100%;
  min-block-size: 0;
  overflow: visible;
  transform: translateX(100%);
  transition: transform ${TRANSITION};

  &[data-open='true'] {
    transform: translateX(0);
  }
`;

const rem = (value: SpacingPx | undefined, fallback: SpacingPx): string =>
  spacingRem(value ?? fallback);

export const StyledSidebar = styled.div.withConfig({
  shouldForwardProp: (prop) => !SIDEBAR_PROP_NAMES.has(prop),
})<SidebarStyleProps>`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: minmax(0, 1fr);
  block-size: 100%;
  min-block-size: 0;
  min-inline-size: 0;
  overflow: hidden;

  ${StyledSidebarContent} {
    padding-block: ${(p) => rem(p.paddingBlockStart, 0)}
      ${(p) => rem(p.paddingBlockEnd, 0)};
    padding-inline-start: ${(p) => rem(p.paddingInlineStart, 0)};
  }

  /* Закрыт: контент занимает и правый инсет. */
  &:not(:has(${StyledSidebarSlot}[data-open='true'])) ${StyledSidebarContent} {
    padding-inline-end: ${(p) => rem(p.paddingInlineEnd, DEFAULT_INLINE_END)};
  }

  /* Открыт: зазор между контентом и панелью. */
  &:has(${StyledSidebarSlot}[data-open='true']) {
    gap: ${(p) => rem(p.offset, DEFAULT_OFFSET)};
  }

  /* Раскрытый слот: ширина = панель + правый инсет, инсет как падинги. */
  ${StyledSidebarSlot}[data-open='true'][data-expanded='true'] {
    inline-size: calc(
      ${SIDEBAR_PANEL_WIDTH} + ${(p) => rem(p.paddingInlineEnd, DEFAULT_INLINE_END)}
    );
    padding-inline-end: ${(p) => rem(p.paddingInlineEnd, DEFAULT_INLINE_END)};
    padding-block-end: ${(p) => rem(p.paddingInlineEnd, DEFAULT_INLINE_END)};
  }

  /* Узкий экран: панель — нижний лист на всю ширину. */
  @media (width <= 640px) {
    grid-template-rows: 1fr auto;
    grid-template-columns: 1fr;

    ${StyledSidebarSlot} {
      inline-size: 100%;
      max-block-size: 0;
      transition: max-block-size ${TRANSITION};
    }

    ${StyledSidebarSlot}[data-open='true'][data-expanded='true'] {
      inline-size: 100%;
      max-block-size: 50dvb;
      padding-inline: ${(p) => rem(p.paddingInlineStart, 0)}
        ${(p) => rem(p.paddingInlineEnd, DEFAULT_INLINE_END)};
    }

    ${StyledSidebarTrack} {
      inline-size: 100%;
      block-size: 50dvb;
      transform: translateY(100%);
    }

    ${StyledSidebarTrack}[data-open='true'] {
      transform: translateY(0);
    }
  }
`;

import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { spacingRem } from '@ui/spacing';
import { getTheme } from '@ui/theme';

/** Минимальная высота содержимого хедера — единый источник для полосы и развёрнутой высоты. */
const HEADER_CONTENT_BLOCK_SIZE = '3rem';

/** Высота развёрнутого хедера: контент + вертикальные паддинги по 0.75rem. */
export const HEADER_BLOCK_SIZE = `calc(${HEADER_CONTENT_BLOCK_SIZE} + ${spacingRem(12)} * 2)`;

/** Остаточная полоса при скрытом хедере = верхний инсет страницы (0.5rem, как прочие). */
const COLLAPSED_INSET = spacingRem(8);

/** autoHide — режим скрывающегося хедера: слот клипает полосу и анимирует высоту. */
type HeaderStyleProps = { $autoHide: boolean };

/** Видимая полоса хедера: фон/паддинги, фикс-высота. В autoHide уезжает вверх за слот. */
export const StyledHeaderBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  block-size: ${HEADER_BLOCK_SIZE};
  min-block-size: ${HEADER_CONTENT_BLOCK_SIZE};
  padding-block: ${spacingRem(12)};
  padding-inline: ${spacingRem(16)};
  background-color: ${(props) => getTheme(props).colors.background};
`;

/**
 * Каркасный слот хедера в строке 1 грид-body. В autoHide клипает полосу и анимирует высоту:
 * развёрнут — HEADER_BLOCK_SIZE; свёрнут — COLLAPSED_INSET (полоса фона = верхний инсет),
 * а сама полоса уезжает вверх (translateY) за клип, поэтому кнопки не видны и контент не
 * наезжает. Схлопывание высоты двигает строку 2 (сжимает рабочую область).
 */
export const StyledHeader = styled.header<HeaderStyleProps>`
  position: sticky;
  inset-block-start: 0;
  z-index: 30;

  ${(props) =>
    props.$autoHide &&
    css`
      overflow: hidden;
      block-size: ${HEADER_BLOCK_SIZE};
      transition: block-size 0.25s ease;

      ${StyledHeaderBar} {
        transition: transform 0.25s ease;
      }

      &:not([data-revealed='true']) {
        block-size: ${COLLAPSED_INSET};
      }

      &:not([data-revealed='true']) ${StyledHeaderBar} {
        transform: translateY(-100%);
      }

      /* Клавиатура: Tab внутри полосы разворачивает слот и снимает сдвиг (после свёрнутых правил). */
      &:focus-within {
        block-size: ${HEADER_BLOCK_SIZE};
      }

      &:focus-within ${StyledHeaderBar} {
        transform: none;
      }
    `}
`;

export const StyledHeaderBrand = styled(NavLink)`
  justify-self: start;
  color: inherit;
  text-decoration: none;
`;

export const StyledHeaderActions = styled.div`
  /* Третья колонка грида 1fr auto 1fr (центр — резерв под название проекта). */
  grid-column: 3;
  display: grid;
  grid-auto-flow: column;
  gap: ${spacingRem(12)};
  align-items: center;
  justify-self: end;
`;

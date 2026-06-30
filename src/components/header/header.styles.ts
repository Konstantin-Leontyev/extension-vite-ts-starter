import { NavLink } from 'react-router-dom';
import styled, { createGlobalStyle, css } from 'styled-components';

import { blockSizeRem } from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { getTheme } from '@ui/theme';

/** Вертикальный паддинг шапки (сверху и снизу). */
const HEADER_PADDING_BLOCK = 12;

/** Единый размер контролов шапки: ряд действий и поле названия — medium. */
const HEADER_CONTROL_SIZE_PRESET = 'medium';

/**
 * Высота шапки = высота её контролов (`HEADER_CONTROL_SIZE_PRESET`) + вертикальные
 * паддинги. Единый источник: задаёт высоту самой шапки и полосу оверлеев, центрируемых
 * по ней (тост крупнее ряда и намеренно перекрывает кнопки с нависанием).
 */
export const HEADER_BLOCK_SIZE = `calc(${blockSizeRem(HEADER_CONTROL_SIZE_PRESET)} + ${spacingRem(HEADER_PADDING_BLOCK)} * 2)`;

/** Остаточная полоса при скрытом хедере = верхний инсет страницы (как прочие отступы). */
export const COLLAPSED_INSET = spacingRem(8);

/** autoHide — режим скрывающегося хедера: слот прячет полосу за своей границей и анимирует высоту. */
type HeaderStyleProps = { $autoHide: boolean };

/** Видимая полоса хедера: грид-каркас, фон, паддинги, фикс-высота. В autoHide уезжает вверх за слот. */
export const StyledHeaderBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  block-size: ${HEADER_BLOCK_SIZE};
  padding-block: ${spacingRem(HEADER_PADDING_BLOCK)};
  padding-inline: ${spacingRem(16)};
  background-color: ${(props) => getTheme(props).colors.background};
`;

/**
 * Слот хедера в первой строке грид-каркаса body. В режиме autoHide слот обрезает свою полосу
 * по высоте и анимирует её: развёрнутый = HEADER_BLOCK_SIZE, свёрнутый = COLLAPSED_INSET (тонкая
 * полоса фона как верхний отступ страницы), сама полоса уезжает вверх за границу слота (translateY),
 * поэтому кнопки скрыты и не перекрывают контент. Потребитель по умолчанию работает sticky (autoHide=false) —
 * блок autoHide-правил дремлет. Логика оставлена ради паритета DS со стартерами.
 */
export const StyledHeader = styled.header<HeaderStyleProps>`
  position: sticky;
  inset-block-start: 0;
  z-index: 10;

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

/**
 * Канал «высота шапки → контент»: публикует живую высоту слота шапки в CSS-переменную
 * `--shell-header-block-size` на body, чтобы соседний контент (напр. плейграунд DS) считал
 * свою высоту реактивно к autoHide. Переменная зарегистрирована через @property как `<length>`,
 * поэтому смена значения плавно интерполируется (как выезд панели сайдбара), а не скачет.
 * По умолчанию = HEADER_BLOCK_SIZE; свёрнутая шапка (autoHide, не в фокусе) = COLLAPSED_INSET.
 */
export const HeaderShellStyle = createGlobalStyle`
  @property --shell-header-block-size {
    syntax: '<length>';
    inherits: true;
    initial-value: 0px;
  }

  body {
    --shell-header-block-size: ${HEADER_BLOCK_SIZE};
    transition: --shell-header-block-size 0.25s ease;
  }

  body:has(> header[data-revealed='false']):not(:has(> header:focus-within)) {
    --shell-header-block-size: ${COLLAPSED_INSET};
  }
`;

export const StyledHeaderBrand = styled(NavLink)`
  justify-self: start;
  color: inherit;
  text-decoration: none;
`;

export const StyledHeaderProject = styled.div`
  grid-column: 2;
  display: grid;
  place-items: center;
  justify-self: center;
  min-block-size: ${blockSizeRem(HEADER_CONTROL_SIZE_PRESET)};
  padding-inline: ${spacingRem(4)};
`;

export const StyledHeaderActions = styled.div`
  /* Третья колонка грида 1fr auto 1fr (центр — название проекта). */
  grid-column: 3;
  display: grid;
  grid-auto-flow: column;
  gap: ${spacingRem(12)};
  align-items: center;
  justify-self: end;
`;

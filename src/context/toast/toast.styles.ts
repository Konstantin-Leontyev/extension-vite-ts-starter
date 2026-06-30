import styled from 'styled-components';

import { HEADER_BLOCK_SIZE } from '@components/header/header.styles';
import { spacingRem } from '@ui/spacing';

/**
 * Слой тостов: фиксирован справа поверх портальных слоёв, по вертикали отцентрован
 * в полосе высотой шапки (`HEADER_BLOCK_SIZE`) — тост ложится ровно на ряд действий
 * шапки (перекрывает локаль-свитчер и кнопки), а не висит над ними. `pointer-events:
 * none` на контейнере — стопка не перехватывает клики страницы; сами тосты возвращают
 * `auto`, чтобы клик по тосту закрывал его.
 */
export const StyledToastViewport = styled.div`
  position: fixed;
  inset-block-start: 0;
  inset-inline-end: ${spacingRem(16)};
  block-size: ${HEADER_BLOCK_SIZE};
  z-index: 2100;
  display: grid;
  align-content: center;
  justify-items: end;
  gap: ${spacingRem(8)};
  pointer-events: none;

  /*
   * Ширину тоста задаёт родитель (примитив её не диктует): в углу — фиксированная
   * комфортная ширина. Тосты кликабельны (клик закрывает) — курсор/интерактивность тоже на хосте.
   */
  > * {
    inline-size: min(24rem, calc(100vw - ${spacingRem(32)}));
    pointer-events: auto;
    cursor: pointer;
  }
`;

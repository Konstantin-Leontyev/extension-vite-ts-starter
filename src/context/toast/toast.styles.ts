import styled from 'styled-components';

import { spacingRem } from '@ui/spacing';

/**
 * Слой тостов: фиксирован в верхнем правом углу поверх портальных слоёв (2000).
 * `pointer-events: none` на контейнере — стопка не перехватывает клики страницы;
 * сами тосты возвращают `auto`, чтобы клик по тосту закрывал его.
 */
export const StyledToastViewport = styled.div`
  position: fixed;
  inset-block-start: ${spacingRem(16)};
  inset-inline-end: ${spacingRem(16)};
  z-index: 2100;
  display: grid;
  justify-items: end;
  gap: ${spacingRem(8)};
  pointer-events: none;

  /* Тосты в стопке кликабельны (клик закрывает) — курсор и интерактивность на хосте. */
  > * {
    pointer-events: auto;
    cursor: pointer;
  }
`;

/**
 * Файл: `src/context/toast/toast.styles.ts`
 * Определяет внешний вид контейнера уведомлений.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledToastViewport`
 *
 * Потребители:
 *  - `src/context/toast/index.tsx` — рендерит уведомления в портале внутри `StyledToastViewport`
 */

import styled from 'styled-components';

import { HEADER_BLOCK_SIZE } from '@components/header';
import { getSpacingValue } from '@ui/spacing';
import { STACKING_TOAST } from '@ui/stacking';
import { VIEWPORT_EDGE_INSET } from '@ui/viewport';

/**
 * TOAST_MAX_INLINE_SIZE — задаёт максимальную ширину карточки уведомления.
 * Используется в `StyledToastViewport`.
 */
const TOAST_MAX_INLINE_SIZE = '24rem';

/**
 * StyledToastViewport — задаёт контейнер уведомлений.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `position: fixed` в правом верхнем углу — уведомления поверх страницы
 *  - `z-index` из `STACKING_TOAST` — поверх порталов и оболочки
 *  - `gap` — отступ между уведомлениями
 *  - `block-size` из `HEADER_BLOCK_SIZE` — уведомление перекрывает кнопки шапки
 *  - `pointer-events: none` — контейнер не перехватывает клики по странице
 *  - `inline-size` дочерних уведомлений ограничена — для комфортного чтения
 *  - `pointer-events: auto` на дочерних — снова включает клики, отключённые
 *    на контейнере, чтобы клик по уведомлению закрывал его
 */
export const StyledToastViewport = styled.div`
  position: fixed;
  inset-block-start: 0;
  inset-inline-end: ${getSpacingValue(VIEWPORT_EDGE_INSET)};
  z-index: ${STACKING_TOAST};
  display: grid;
  gap: ${getSpacingValue(8)};
  align-content: center;
  justify-items: end;
  block-size: ${HEADER_BLOCK_SIZE};
  pointer-events: none;

  > * {
    inline-size: min(
      ${TOAST_MAX_INLINE_SIZE},
      calc(100vw - ${getSpacingValue(VIEWPORT_EDGE_INSET)} * 2)
    );
    pointer-events: auto;
    cursor: pointer;
  }
`;

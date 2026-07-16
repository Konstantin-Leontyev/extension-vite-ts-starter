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

/**
 * StyledToastViewport — задаёт контейнер уведомлений.
 *
 * Встроенные стили:
 *  - `position: fixed` в правом верхнем углу — уведомления поверх страницы
 *  - `z-index: 2100` — поверх всех слоёв приложения
 *  - `block-size` из `HEADER_BLOCK_SIZE` — уведомление перекрывает кнопки шапки
 *  - `pointer-events: none` — контейнер не перехватывает клики по странице
 *  - `inline-size` дочерних уведомлений ограничена — для комфортного чтения
 *  - `pointer-events: auto` на дочерних — снова включает клики, отключённые
 *    на контейнере, чтобы клик по уведомлению закрывал его
 */
export const StyledToastViewport = styled.div`
  position: fixed;
  inset-block-start: 0;
  inset-inline-end: ${getSpacingValue(16)};
  z-index: 2100;
  display: grid;
  gap: ${getSpacingValue(8)};
  align-content: center;
  justify-items: end;
  block-size: ${HEADER_BLOCK_SIZE};
  pointer-events: none;

  > * {
    inline-size: min(24rem, calc(100vw - ${getSpacingValue(32)}));
    pointer-events: auto;
    cursor: pointer;
  }
`;

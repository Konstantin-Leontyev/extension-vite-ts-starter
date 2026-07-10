/**
 * Файл: context/toast/toast.styles.ts
 * Стили для вьюпорта тостов — контейнера, в котором отображаются уведомления.
 *
 * Основные задачи:
 * 1. Закрепить вьюпорт в правом верхнем углу поверх всех слоёв (z-index: 2100)
 * 2. Выровнять тосты по вертикали на уровне шапки (HEADER_BLOCK_SIZE)
 * 3. Обеспечить кликабельность тостов при отключенных событиях контейнера
 * 4. Ограничить ширину тостов для комфортного чтения
 *
 * Потребители: `ToastProvider` для портала тостов.
 */

import styled from 'styled-components';

import { HEADER_BLOCK_SIZE } from '@components/header/header.styles';
import { getSpacingValue } from '@ui/spacing';

/**
 * StyledToastViewport — контейнер для тостов, закреплён в правом верхнем углу.
 * Высота совпадает с шапкой (`HEADER_BLOCK_SIZE`), чтобы тост перекрывал кнопки шапки.
 * `pointer-events: none` на контейнере не мешает кликам по странице. Сами тосты
 * возвращают `pointer-events: auto`, чтобы клик по тосту закрывал его.
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

  /*
   * Ширина тоста задаётся родителем. Фиксированная комфортная ширина в углу.
   * Клик по тосту закрывает его.
   */
  > * {
    inline-size: min(24rem, calc(100vw - ${getSpacingValue(32)}));
    pointer-events: auto;
    cursor: pointer;
  }
`;

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
 * Слой тостов: фиксирован справа поверх портальных слоёв, по вертикали отцентрован
 * в полосе высотой шапки (`HEADER_BLOCK_SIZE`) — тост ложится ровно на ряд действий
 * шапки (перекрывает локаль-свитчер и кнопки), а не висит над ними. `pointer-events:
 * none` на контейнере — стопка не перехватывает клики страницы; сами тосты возвращают
 * `auto`, чтобы клик по тосту закрывал его.
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
   * Ширину тоста задаёт родитель (примитив её не диктует): в углу — фиксированная
   * комфортная ширина. Тосты кликабельны (клик закрывает) — курсор/интерактивность тоже на хосте.
   */

  > * {
    inline-size: min(24rem, calc(100vw - ${getSpacingValue(32)}));
    pointer-events: auto;
    cursor: pointer;
  }
`;

/**
 * Файл: `src/components/model-download-gate/model-download-gate.styles.ts`
 * Определяет внешний вид компонента ModelDownloadGate.
 *
 * Основные задачи:
 * 1. Предоставить styled-узлы `StyledModelDownloadGate`, `StyledModelDownloadGateContent`
 *    и `StyledModelDownloadGateCopy`
 *
 * Потребители:
 *  - `src/components/model-download-gate/index.tsx` — собирает компонент ModelDownloadGate
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledModelDownloadGate — задаёт корневой узел компонента ModelDownloadGate.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `place-items: center` — центрирует карточку гейта в области страницы
 *  - `grid-row: 1 / -1` — единственный потоковый ребёнок `body` занимает обе строки
 *    сетки. Строка `auto` высоты не задаёт, и карточка без этого не центрируется во вьюпорте
 *  - `padding` — отступ содержимого от краёв области гейта
 */
export const StyledModelDownloadGate = styled.main`
  display: grid;
  grid-row: 1 / -1;
  place-items: center;
  padding: ${getSpacingValue(24)};
`;

/**
 * StyledModelDownloadGateContent — задаёт внутренний узел содержимого компонента ModelDownloadGate.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `gap` — отступ между текстом, индикатором прогресса и кнопкой
 *  - `min-inline-size: 0` — предотвращает переполнение во flex- и grid-контейнерах
 */
export const StyledModelDownloadGateContent = styled.div`
  display: grid;
  gap: ${getSpacingValue(16)};
  min-inline-size: 0;
`;

/**
 * StyledModelDownloadGateCopy — задаёт внутренний узел текстовых абзацев компонента ModelDownloadGate.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `gap` — отступ между абзацами подсказки
 */
export const StyledModelDownloadGateCopy = styled.div`
  display: grid;
  gap: ${getSpacingValue(8)};
`;

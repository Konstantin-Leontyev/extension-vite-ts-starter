/**
 * Файл: `src/pages/home/home.styles.ts`
 * Определяет внешний вид компонента HomePage.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledMain`
 *
 * Потребители:
 *  - `src/pages/home/index.tsx` — собирает компонент HomePage
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledMain — задаёт корневой узел компонента HomePage.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `padding` — отступ содержимого страницы
 */
export const StyledMain = styled.main`
  padding: ${getSpacingValue(16)};
`;

/**
 * Файл: `src/pages/home/home.styles.ts`
 * Определяет внешний вид компонента HomePage.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledHomePage`
 *
 * Потребители:
 *  - `src/pages/home/index.tsx` — собирает компонент HomePage
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledHomePage — задаёт корневой узел компонента HomePage.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `padding` — отступ содержимого страницы
 */
export const StyledHomePage = styled.main`
  display: grid;
  padding: ${getSpacingValue(16)};
`;

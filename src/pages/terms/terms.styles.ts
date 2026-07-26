/**
 * Файл: `src/pages/terms/terms.styles.ts`
 * Определяет внешний вид компонента TermsPage.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledTermsPage`
 *
 * Потребители:
 *  - `src/pages/terms/index.tsx` — собирает компонент TermsPage
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledTermsPage — задаёт корневой узел компонента TermsPage.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `padding` — отступ содержимого страницы
 */
export const StyledTermsPage = styled.main`
  display: grid;
  padding: ${getSpacingValue(16)};
`;

/**
 * Файл: `src/pages/terms/terms.styles.ts`
 * Определяет внешний вид компонента TermsPage.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledMain`
 *
 * Потребители:
 *  - `src/pages/terms/index.tsx` — собирает компонент TermsPage
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledMain — задаёт корневой узел компонента TermsPage.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `padding` — отступ содержимого страницы
 */
export const StyledMain = styled.main`
  padding: ${getSpacingValue(16)};
`;

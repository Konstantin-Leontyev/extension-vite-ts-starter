/**
 * Файл: `src/pages/privacy/privacy.styles.ts`
 * Определяет внешний вид компонента PrivacyPage.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledMain`
 *
 * Потребители:
 *  - `src/pages/privacy/index.tsx` — собирает компонент PrivacyPage
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledMain — задаёт корневой узел компонента PrivacyPage.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `padding` — отступ содержимого страницы
 */
export const StyledMain = styled.main`
  padding: ${getSpacingValue(16)};
`;

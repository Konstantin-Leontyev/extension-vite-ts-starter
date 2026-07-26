/**
 * Файл: `src/pages/privacy/privacy.styles.ts`
 * Определяет внешний вид компонента PrivacyPage.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledPrivacyPage`
 *
 * Потребители:
 *  - `src/pages/privacy/index.tsx` — собирает компонент PrivacyPage
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledPrivacyPage — задаёт корневой узел компонента PrivacyPage.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `padding` — отступ содержимого страницы
 */
export const StyledPrivacyPage = styled.main`
  display: grid;
  padding: ${getSpacingValue(16)};
`;

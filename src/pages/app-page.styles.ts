/**
 * Файл: `src/pages/app-page.styles.ts`
 * Определяет общий корневой узел `<main>` страниц HomePage, PrivacyPage и TermsPage.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledAppPage`
 *
 * Потребители:
 *  - страницы HomePage, PrivacyPage и TermsPage — рендерят содержимое в общем `main`:
 *     - `src/pages/home/index.tsx`
 *     - `src/pages/privacy/index.tsx`
 *     - `src/pages/terms/index.tsx`
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';

/**
 * StyledAppPage — задаёт общий корневой узел страниц HomePage, PrivacyPage и TermsPage.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка страницы по умолчанию
 *  - `padding` — отступ содержимого от краёв страницы
 */
export const StyledAppPage = styled.main`
  display: grid;
  padding: ${getSpacingValue(16)};
`;

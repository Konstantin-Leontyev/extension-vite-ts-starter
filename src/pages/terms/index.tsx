/**
 * Файл: `src/pages/terms/index.tsx`
 * Предоставляет компонент TermsPage для отображения страницы условий использования.
 *
 * Основные задачи:
 * 1. Экспортировать компонент TermsPage
 *
 * Потребители:
 *  - `src/components/router/router.tsx` — рендерит TermsPage по маршруту `terms`
 */

import { Text } from '@ui/text';

import { StyledAppPage } from '../app-page.styles';

/**
 * TermsPage — отображает страницу условий использования.
 *
 * @example
 * <TermsPage />
 */
export function TermsPage() {
  return (
    <StyledAppPage>
      <Text as="h1" size="extraBold">
        Terms of Service
      </Text>
    </StyledAppPage>
  );
}

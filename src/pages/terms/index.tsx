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

import { StyledMain } from './terms.styles';

/**
 * TermsPage — отображает страницу условий использования.
 *
 * @example
 * <TermsPage />
 */
export function TermsPage() {
  return (
    <StyledMain>
      <Text as="h1" sizePreset="extraBold">
        Terms of Service
      </Text>
    </StyledMain>
  );
}

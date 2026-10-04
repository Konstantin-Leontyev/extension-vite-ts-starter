/**
 * Файл: `src/pages/privacy/index.tsx`
 * Предоставляет компонент PrivacyPage для отображения страницы политики конфиденциальности.
 *
 * Основные задачи:
 * 1. Экспортировать компонент PrivacyPage
 *
 * Потребители:
 *  - `src/components/router/router.tsx` — рендерит PrivacyPage по маршруту `privacy`
 */

import { Text } from '@ui/text';

import { StyledAppPage } from '../app-page.styles';

/**
 * PrivacyPage — отображает страницу политики конфиденциальности.
 *
 * @example
 * <PrivacyPage />
 */
export function PrivacyPage() {
  return (
    <StyledAppPage>
      <Text as="h1" size="extraBold">
        Privacy Policy
      </Text>
    </StyledAppPage>
  );
}

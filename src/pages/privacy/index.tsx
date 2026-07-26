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

import { StyledPrivacyPage } from './privacy.styles';

/**
 * PrivacyPage — отображает страницу политики конфиденциальности.
 *
 * @example
 * <PrivacyPage />
 */
export function PrivacyPage() {
  return (
    <StyledPrivacyPage>
      <Text as="h1" sizePreset="extraBold">
        Privacy Policy
      </Text>
    </StyledPrivacyPage>
  );
}

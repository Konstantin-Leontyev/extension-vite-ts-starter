/**
 * Файл: `src/pages/home/index.tsx`
 * Предоставляет компонент HomePage для отображения домашней страницы.
 *
 * Основные задачи:
 * 1. Экспортировать компонент HomePage
 *
 * Потребители:
 *  - `src/components/router/router.tsx` — рендерит HomePage как index-маршрут
 */

import { Text } from '@ui/text';

import { StyledHomePage } from './home.styles';

/**
 * HomePage — отображает домашнюю страницу.
 *
 * @example
 * <HomePage />
 */
export function HomePage() {
  return (
    <StyledHomePage>
      <Text>Home</Text>
    </StyledHomePage>
  );
}

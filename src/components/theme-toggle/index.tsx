/**
 * Файл: `src/components/theme-toggle/index.tsx`
 * Предоставляет компонент ThemeToggle для отображения кнопки переключения светлой и тёмной темы.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ThemeToggle
 * 2. Выставлять `aria-label` по текущей теме
 * 3. Связать `RoundButton` с `useThemeMode`
 *
 * Потребители:
 *  - `src/components/header/index.tsx` — показывает кнопку переключения темы в блоке действий шапки
 */

import { useThemeMode } from '@hooks/use-theme-mode';
import { ContrastIcon } from '@icons/contrast';
import { Icon } from '@ui/icon';
import { RoundButton } from '@ui/round-button';

/**
 * SWITCH_TO_DARK_ARIA_LABEL — задаёт EN-текст `aria-label` для перехода на тёмную тему.
 * Используется как доступное имя кнопки, когда активна светлая тема.
 */
const SWITCH_TO_DARK_ARIA_LABEL = 'Switch to dark theme';

/**
 * SWITCH_TO_LIGHT_ARIA_LABEL — задаёт EN-текст `aria-label` для перехода на светлую тему.
 * Используется как доступное имя кнопки, когда активна тёмная тема.
 */
const SWITCH_TO_LIGHT_ARIA_LABEL = 'Switch to light theme';

/**
 * ThemeToggle — отображает круглую кнопку переключения темы приложения.
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle() {
  const { mode, onThemeChange } = useThemeMode();

  return (
    <RoundButton
      aria-label={
        mode === 'dark' ? SWITCH_TO_LIGHT_ARIA_LABEL : SWITCH_TO_DARK_ARIA_LABEL
      }
      onClick={onThemeChange}
    >
      <Icon blockSize="100%" inlineSize="100%" padding={4}>
        <ContrastIcon />
      </Icon>
    </RoundButton>
  );
}

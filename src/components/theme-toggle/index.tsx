import { useThemeMode } from '@hooks/use-theme-mode';
import { ContrastIcon } from '@icons/contrast';
import { RoundButton } from '@ui/round-button';

export function ThemeToggle() {
  const { mode, onThemeChange } = useThemeMode();

  const isDark = mode === 'dark';

  return (
    <RoundButton
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={onThemeChange}
    >
      <ContrastIcon />
    </RoundButton>
  );
}

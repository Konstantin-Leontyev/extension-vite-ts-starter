import { useContext } from 'react';

import { ThemeContext, type ThemeContextValue } from '@context/theme/context';

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }

  return context;
}

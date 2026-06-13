import { useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { GlobalResetStyle } from '@ui/reset';
import {
  GlobalThemeStyle,
  styledDarkTheme,
  styledLightTheme,
  type AppTheme,
} from '@ui/theme';

import { ThemeContext, type ThemeContextValue, type ThemeMode } from './context';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const theme: AppTheme = mode === 'light' ? styledLightTheme : styledDarkTheme;

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      mode,
      onThemeChange: () => {
        setMode((current) => (current === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        <GlobalResetStyle />
        <GlobalThemeStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

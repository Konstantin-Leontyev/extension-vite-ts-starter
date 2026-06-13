import { createGlobalStyle } from 'styled-components';

import './fonts/inter.css';

/**
 * Палитра: Seolizer hex + роли без путаницы с брендом.
 * - background / surface — фон страницы и заливка компонента (карточка)
 * - default / muted — текст на нейтральном фоне
 * - inverse — контрастный текст на цветной заливке (кнопка, плашка)
 * - primary — бренд-заливка; danger, success, warning — статусы
 */
export type ThemeColors = {
  background: string;
  border: string;
  danger: string;
  default: string;
  focusRing: string;
  invalidRing: string;
  inverse: string;
  muted: string;
  primary: string;
  success: string;
  surface: string;
  warning: string;
};

export type AppTheme = {
  colors: ThemeColors;
  shadow: {
    surface: string;
  };
};

const lightColors: ThemeColors = {
  background: '#f3f4f6',
  border: '#e4e7ec',
  danger: '#d93025',
  default: '#111827',
  focusRing: 'color-mix(in srgb, #1a73e8 35%, transparent)',
  invalidRing: 'color-mix(in srgb, #d93025 35%, transparent)',
  inverse: '#ffffff',
  muted: '#667085',
  primary: '#1a73e8',
  success: '#188038',
  surface: '#ffffff',
  warning: '#e37400',
};

const darkColors: ThemeColors = {
  background: '#0f1115',
  border: '#2d333b',
  danger: '#ea4335',
  default: '#f9fafb',
  focusRing: 'color-mix(in srgb, #1a73e8 42%, transparent)',
  invalidRing: 'color-mix(in srgb, #ea4335 42%, transparent)',
  inverse: '#ffffff',
  muted: '#a8b0bf',
  primary: '#1a73e8',
  success: '#34a853',
  surface: '#171a21',
  warning: '#f9ab00',
};

export const styledLightTheme: AppTheme = {
  colors: { ...lightColors },
  shadow: {
    surface:
      '0 1px 2px rgb(15 23 42 / 10%), 0 2px 4px rgb(15 23 42 / 12%), 0 4px 12px -4px rgb(15 23 42 / 10%)',
  },
};

export const styledDarkTheme: AppTheme = {
  colors: { ...darkColors },
  shadow: {
    surface: 'none',
  },
};

export function getTheme(props: { theme: AppTheme }): AppTheme {
  return props.theme;
}

export const GlobalThemeStyle = createGlobalStyle`
  body {
    background-color: ${(props) => getTheme(props).colors.background};
    color: ${(props) => getTheme(props).colors.default};
    font-family:
      'Inter',
      -apple-system,
      system-ui,
      blinkmacsystemfont,
      'Helvetica Neue',
      sans-serif;
  }
`;

declare module 'styled-components' {
  // Module augmentation for ThemeProvider typing.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}

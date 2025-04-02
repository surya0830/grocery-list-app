import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { theme } from './index';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: typeof theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme: customTheme }) => {
  return (
    <StyledThemeProvider theme={customTheme || theme}>
      {children}
    </StyledThemeProvider>
  );
}; 
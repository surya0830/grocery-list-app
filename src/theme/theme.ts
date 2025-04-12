import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components/native' {
  export interface Theme {
    colors: ThemeColors;
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    typography: {
      fontSize: {
        small: number;
        medium: number;
        large: number;
      };
      fontWeight: {
        regular: string;
        bold: string;
      };
    };
  }
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  white: string;
  error: string;
  success: string;
  warning: string;
}

export const theme: DefaultTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    text: '#000000',
    white: '#FFFFFF',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    fontSize: {
      small: 12,
      medium: 16,
      large: 20
    },
    fontWeight: {
      regular: '400',
      bold: '700'
    }
  }
}; 
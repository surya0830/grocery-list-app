import { useColorScheme } from 'react-native';

interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

interface Theme {
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  primary: '#007AFF',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
};

const darkColors: ThemeColors = {
  primary: '#0A84FF',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FFD60A',
};

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();

  return {
    colors: colorScheme === 'dark' ? darkColors : lightColors,
  };
}; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

const THEME_KEY = '@province_game/theme';

const LIGHT_COLORS = {
  background: '#f2f4f8',
  card: '#ffffff',
  text: '#1c1f26',
  textMuted: '#6b7280',
  textSubtle: '#374151',
  primary: '#3457d5',
  primaryDark: '#22398f',
  border: '#e1e5ee',
  correctBg: '#dcf5e0',
  correctBorder: '#2f9e44',
  wrongBg: '#fbdcdc',
  wrongBorder: '#d64545',
  modeActiveBg: '#e4eaff',
  buttonText: '#ffffff',
};

const DARK_COLORS = {
  background: '#12141c',
  card: '#1b1f2b',
  text: '#eef0f6',
  textMuted: '#8b93a7',
  textSubtle: '#c7cddb',
  primary: '#5c7cfa',
  primaryDark: '#8fa5ff',
  border: '#2a2f3d',
  correctBg: '#1f4a35',
  correctBorder: '#35c99b',
  wrongBg: '#4a2420',
  wrongBorder: '#ef7b6f',
  modeActiveBg: '#242c44',
  buttonText: '#0c0f16',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [scheme, setScheme] = useState(() => (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'));

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setScheme(saved);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setScheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const colors = scheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const value = useMemo(() => ({ scheme, colors, toggleTheme }), [scheme, colors, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme deve essere usato dentro un ThemeProvider');
  }
  return ctx;
}

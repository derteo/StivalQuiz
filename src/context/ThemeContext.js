import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

const THEME_KEY = '@province_game/theme';

const LIGHT_COLORS = {
  background: '#eef6f2',
  card: '#ffffff',
  text: '#1f2a24',
  textMuted: '#6b8077',
  textSubtle: '#39514a',
  primary: '#12896f',
  primaryDark: '#0b5f4d',
  border: '#dbe9e2',
  correctBg: '#d4f0df',
  correctBorder: '#1f9d5c',
  wrongBg: '#fbdfdc',
  wrongBorder: '#d64545',
  modeActiveBg: '#e2f5ec',
  buttonText: '#ffffff',
};

const DARK_COLORS = {
  background: '#0d1613',
  card: '#152420',
  text: '#e6f2ec',
  textMuted: '#8fac9f',
  textSubtle: '#c3ddd0',
  primary: '#35c99b',
  primaryDark: '#7fe0bd',
  border: '#25392f',
  correctBg: '#1f4a35',
  correctBorder: '#35c99b',
  wrongBg: '#4a2420',
  wrongBorder: '#ef7b6f',
  modeActiveBg: '#1c3129',
  buttonText: '#08130f',
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

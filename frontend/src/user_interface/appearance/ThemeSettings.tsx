import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { readPreference, savePreference } from '../screen_state/saved_preferences';

type Theme = 'light' | 'dark';
interface ThemeState { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeSettings({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readPreference('project-hub-theme', 'light') === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    savePreference('project-hub-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(current => current === 'light' ? 'dark' : 'light');
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const state = useContext(ThemeContext);
  if (!state) throw new Error('Theme settings are not connected');
  return state;
}

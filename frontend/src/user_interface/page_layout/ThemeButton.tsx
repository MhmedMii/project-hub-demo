import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '../languages/LanguageSettings';
import { useTheme } from '../appearance/ThemeSettings';
import { Button } from '../shared_components/Button';
import './ThemeButton.css';

export function ThemeButton() {
  const { translate } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'light' ? Moon : Sun;
  const label = translate(theme === 'light' ? 'darkMode' : 'lightMode');
  return <Button className="theme-button" onClick={toggleTheme} aria-label={label}>
    <Icon size={17} aria-hidden="true" /><span>{label}</span>
  </Button>;
}

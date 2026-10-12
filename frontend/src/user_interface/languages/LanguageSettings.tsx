import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Language } from '../../data_models/localized_text';
import { readPreference, savePreference } from '../screen_state/saved_preferences';
import english from './english.json';
import arabic from './arabic.json';

interface LanguageState { language: Language; setLanguage: (language: Language) => void; translate: (key: string) => string }
const LanguageContext = createContext<LanguageState | null>(null);

export function LanguageSettings({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => readPreference('project-hub-language', 'en') === 'ar' ? 'ar' : 'en');
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    savePreference('project-hub-language', language);
  }, [language]);
  const dictionary: Record<string, string> = language === 'ar' ? arabic : english;
  const translate = (key: string) => dictionary[key] ?? dictionary.SERVER_ERROR ?? key;
  return <LanguageContext.Provider value={{ language, setLanguage, translate }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageState {
  const state = useContext(LanguageContext);
  if (!state) throw new Error('Language settings are not connected');
  return state;
}

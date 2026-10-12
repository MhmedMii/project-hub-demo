import { Languages } from 'lucide-react';
import { useLanguage } from '../languages/LanguageSettings';
import { Button } from '../shared_components/Button';
import './LanguageButton.css';

export function LanguageButton() {
  const { language, setLanguage } = useLanguage();
  return <Button className="language-button" lang={language === 'en' ? 'ar' : 'en'}
    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}><Languages size={17} aria-hidden="true" />
    {language === 'en' ? 'العربية' : 'English'}
  </Button>;
}

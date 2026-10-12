import { LoaderCircle } from 'lucide-react';
import { useLanguage } from '../languages/LanguageSettings';
import './LoadingMessage.css';

export function LoadingMessage() {
  const { translate } = useLanguage();
  return <div className="screen-message loading-message" role="status"><LoaderCircle aria-hidden="true" size={24} /><p>{translate('loading')}</p></div>;
}

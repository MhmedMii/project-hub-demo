import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../languages/LanguageSettings';
import { Button } from './Button';
import './ErrorMessage.css';

export function ErrorMessage({ code, onRetry, compact = false }: { code: string; onRetry?: () => void; compact?: boolean }) {
  const { translate } = useLanguage();
  return <div className={`error-message ${compact ? 'error-message--compact' : 'screen-message'}`} role="alert">
    <AlertCircle size={20} aria-hidden="true" /><p>{translate(code)}</p>
    {onRetry && <Button onClick={onRetry}>{translate('retry')}</Button>}
  </div>;
}

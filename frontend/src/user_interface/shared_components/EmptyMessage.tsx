import { SearchX } from 'lucide-react';
import { useLanguage } from '../languages/LanguageSettings';
import { Button } from './Button';
import './EmptyMessage.css';

export function EmptyMessage({ onClear }: { onClear?: () => void }) {
  const { translate } = useLanguage();
  return <div className="screen-message empty-message" role="status">
    <SearchX size={28} aria-hidden="true" /><h2>{translate('noProjects')}</h2><p>{translate('noProjectsDescription')}</p>
    {onClear && <Button onClick={onClear}>{translate('clearFilters')}</Button>}
  </div>;
}

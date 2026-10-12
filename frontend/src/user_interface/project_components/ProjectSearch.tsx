import { Search } from 'lucide-react';
import { useLanguage } from '../languages/LanguageSettings';
import './ProjectSearch.css';

export function ProjectSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { translate } = useLanguage();
  return <label className="project-search"><span className="sr-only">{translate('searchProjects')}</span>
    <Search size={18} aria-hidden="true" /><input type="search" value={value} placeholder={translate('searchProjects')}
      onChange={event => onChange(event.target.value)} />
  </label>;
}

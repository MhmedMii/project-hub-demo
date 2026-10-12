import type { KeyboardEvent } from 'react';
import { useLanguage } from '../languages/LanguageSettings';
import './AdminTabs.css';

export type AdminTab = 'projects' | 'people';

export function AdminTabs({ active, onChange }: { active: AdminTab; onChange: (tab: AdminTab) => void }) {
  const { translate } = useLanguage();
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'projects' : event.key === 'End' ? 'people' : active === 'projects' ? 'people' : 'projects';
    onChange(next);
    document.getElementById(`tab-${next}`)?.focus();
  };
  return <div className="admin-tabs" role="tablist" aria-label={translate('administration')}>
    {(['projects', 'people'] as const).map(tab => <button key={tab} type="button" role="tab" id={`tab-${tab}`}
      aria-controls={`panel-${tab}`} aria-selected={active === tab} tabIndex={active === tab ? 0 : -1}
      onClick={() => onChange(tab)} onKeyDown={onKey}>{translate(tab)}</button>)}
  </div>;
}

import { LayoutGrid, Settings2, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../languages/LanguageSettings';
import { useSession } from '../screen_state/SessionSettings';
import './Sidebar.css';

export function Sidebar() {
  const { translate } = useLanguage();
  const { session } = useSession();
  return <aside className="sidebar"><nav aria-label={translate('appName')}>
    <NavLink to="/projects"><LayoutGrid size={18} aria-hidden="true" />{translate('projects')}</NavLink>
    {session?.account.role === 'admin' && <NavLink to="/admin"><Settings2 size={18} aria-hidden="true" />{translate('administration')}</NavLink>}
  </nav><div className="sidebar-footer"><Sparkles size={16} aria-hidden="true" /><p>{translate('fictionalData')}</p></div></aside>;
}

import { Link } from 'react-router-dom';
import { useLanguage } from '../languages/LanguageSettings';
import { useSession } from '../screen_state/SessionSettings';
import { ErrorMessage } from '../shared_components/ErrorMessage';
import { LanguageButton } from './LanguageButton';
import { ThemeButton } from './ThemeButton';
import { AccountMenu } from './AccountMenu';
import './Header.css';

export function Header() {
  const { translate } = useLanguage();
  const { session, error, refresh } = useSession();
  return <header className="header">
    <Link to="/projects" className="brand"><strong>{translate('appName')}</strong><span>{translate('demoWorkspace')}</span></Link>
    <div className="header-controls"><LanguageButton /><ThemeButton /><AccountMenu /></div>
    {session && error && <div className="header-error"><ErrorMessage code={error} compact onRetry={() => { void refresh(); }} /></div>}
  </header>;
}

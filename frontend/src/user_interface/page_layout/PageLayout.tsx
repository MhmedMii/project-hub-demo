import { Outlet } from 'react-router-dom';
import { useLanguage } from '../languages/LanguageSettings';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './PageLayout.css';

export function PageLayout() {
  const { translate } = useLanguage();
  return <div className="application-layout"><a className="skip-link" href="#content">{translate('skipToContent')}</a>
    <Header /><div className="application-body"><Sidebar /><main className="page-content" id="content"><Outlet /></main></div>
  </div>;
}

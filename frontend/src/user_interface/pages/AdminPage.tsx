import { useState } from 'react';
import { useLanguage } from '../languages/LanguageSettings';
import { PageHeading } from '../page_layout/PageHeading';
import { AdminTabs, type AdminTab } from '../admin_components/AdminTabs';
import { ProjectManagement } from '../admin_components/ProjectManagement';
import { AccountManagement } from '../admin_components/AccountManagement';
import './AdminPage.css';

export function AdminPage() {
  const { translate } = useLanguage();
  const [tab, setTab] = useState<AdminTab>('projects');
  return <><PageHeading title={translate('manageHeading')} description={translate('manageDescription')} />
    <AdminTabs active={tab} onChange={setTab} />
    <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
      {tab === 'projects' ? <ProjectManagement /> : <AccountManagement />}
    </div><p className="admin-footer">{translate('restartHint')}</p>
  </>;
}

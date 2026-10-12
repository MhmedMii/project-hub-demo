import { ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../languages/LanguageSettings';
import { useSession } from '../screen_state/SessionSettings';
import { Button } from '../shared_components/Button';
import './AccountMenu.css';

export function AccountMenu() {
  const { translate } = useLanguage();
  const { session, signOut } = useSession();
  const [isLeaving, setLeaving] = useState(false);
  const leave = async () => {
    setLeaving(true);
    try { await signOut(); }
    catch { /* الخطأ يطلع بالهيدر من حالة الجلسة */ }
    finally { setLeaving(false); }
  };
  if (!session) return null;
  return <details className="account-menu"><summary>{translate(session.account.role)}<ChevronDown size={15} aria-hidden="true" /></summary>
    <div className="account-menu-panel"><strong>{session.account.name}</strong><span className="small muted" dir="ltr">{session.account.email}</span>
      <Button variant="quiet" disabled={isLeaving} onClick={() => { void leave(); }}>
        <LogOut size={16} aria-hidden="true" />{translate('switchRole')}
      </Button>
    </div>
  </details>;
}

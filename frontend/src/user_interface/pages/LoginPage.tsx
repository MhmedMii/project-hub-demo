import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { Role } from '../../data_models/account';
import { useLanguage } from '../languages/LanguageSettings';
import { Header } from '../page_layout/Header';
import { DemoRoleButton } from '../login_components/DemoRoleButton';
import { useSession } from '../screen_state/SessionSettings';
import { ErrorMessage } from '../shared_components/ErrorMessage';
import { LoadingMessage } from '../shared_components/LoadingMessage';
import './LoginPage.css';

export function LoginPage() {
  const { translate } = useLanguage();
  const { session, isLoading, error, signIn, refresh } = useSession();
  const [busyRole, setBusyRole] = useState<Role | null>(null);
  const chooseRole = async (role: Role) => {
    setBusyRole(role);
    try { await signIn(role); } catch { /* رسالة الخطأ تطلع من حالة تسجيل الدخول */ }
    finally { setBusyRole(null); }
  };
  if (session) return <Navigate to="/projects" replace />;
  return <><Header /><main className="login-page"><section className="login-story">
    <span className="login-accent" /><h1>{translate('loginHeading')}</h1><p>{translate('loginDescription')}</p>
    <span className="login-demo-label">{translate('fictionalData')}</span>
  </section><section className="login-choices"><h2>{translate('chooseRole')}</h2><p className="muted">{translate('chooseRoleDescription')}</p>
    {isLoading ? <LoadingMessage /> : <div className="login-role-list">
      <DemoRoleButton role="counselor" isBusy={Boolean(busyRole)} selected={busyRole === 'counselor'} onChoose={role => { void chooseRole(role); }} />
      <DemoRoleButton role="admin" isBusy={Boolean(busyRole)} selected={busyRole === 'admin'} onChoose={role => { void chooseRole(role); }} />
    </div>}
    {error && <ErrorMessage code={error} compact onRetry={() => { void refresh(); }} />}
    <p className="small muted">{translate('restartHint')}</p>
  </section></main></>;
}

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Account } from '../../data_models/account';
import { useLanguage } from '../languages/LanguageSettings';
import { useActions } from '../screen_state/ActionSettings';
import { useAccounts } from '../screen_state/use_accounts';
import { useSession } from '../screen_state/SessionSettings';
import { Button } from '../shared_components/Button';
import { ScreenFeedback } from '../shared_components/ScreenFeedback';
import { ConfirmRemoval } from '../shared_components/ConfirmRemoval';
import { AccountTable } from './AccountTable';
import { AccountForm } from './AccountForm';
import './AccountManagement.css';

export function AccountManagement() {
  const { translate } = useLanguage();
  const { data, isLoading, error, reload } = useAccounts();
  const { refresh } = useSession();
  const actions = useActions().accounts;
  const [editor, setEditor] = useState<{ account?: Account } | null>(null);
  const [removing, setRemoving] = useState<Account | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const finish = (message: string) => { setEditor(null); setRemoving(null); setNotice(message); void reload(); void refresh(); };
  return <section className="account-management"><div className="account-management-heading">
    <p className="small muted">{data.length} {translate('people')}</p>
    <Button variant="primary" onClick={() => setEditor({})}><UserPlus size={17} aria-hidden="true" />{translate('addPerson')}</Button>
  </div>{notice && <p className="notice" role="status">{translate(notice)}</p>}
    <ScreenFeedback isLoading={isLoading} error={error} isEmpty={data.length === 0} onRetry={() => { void reload(); }} />
    {!isLoading && !error && data.length > 0 && <AccountTable accounts={data} onEdit={account => setEditor({ account })} onRemove={setRemoving} />}
    {editor && <AccountForm account={editor.account} onClose={() => setEditor(null)} onSaved={() => finish('accountSaved')} />}
    {removing && <ConfirmRemoval title={translate('removePersonTitle')} name={removing.name}
      remove={() => actions.remove(removing.id)} onClose={() => setRemoving(null)} onRemoved={() => finish('accountRemoved')} />}
  </section>;
}

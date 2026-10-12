import { Pencil, Trash2 } from 'lucide-react';
import type { Account } from '../../data_models/account';
import { useLanguage } from '../languages/LanguageSettings';
import { useSession } from '../screen_state/SessionSettings';
import { Button } from '../shared_components/Button';
import { StatusLabel } from '../shared_components/StatusLabel';

export function AccountTableRow({ account, onEdit, onRemove }: { account: Account; onEdit: (account: Account) => void; onRemove: (account: Account) => void }) {
  const { translate } = useLanguage();
  const { session } = useSession();
  const ownAccount = account.id === session?.account.id;
  return <tr><td><strong>{account.name}</strong><small dir="ltr">{account.email}</small>
    {(account.isFixed || ownAccount) && <small>{translate(account.isFixed ? 'fixedAdmin' : 'yourAccount')}</small>}</td>
    <td>{translate(account.role)}</td><td><StatusLabel status={account.isActive ? 'active' : 'disabled'} /></td>
    <td><div className="table-actions"><Button onClick={() => onEdit(account)} aria-label={`${translate('edit')}: ${account.name}`}>
      <Pencil size={14} aria-hidden="true" />{translate('edit')}</Button>
      <Button variant="quiet" onClick={() => onRemove(account)} disabled={account.isFixed || ownAccount}
        aria-label={`${translate('remove')}: ${account.name}`}><Trash2 size={14} aria-hidden="true" />{translate('remove')}</Button></div></td>
  </tr>;
}

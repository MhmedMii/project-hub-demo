import type { Account } from '../../data_models/account';
import { useLanguage } from '../languages/LanguageSettings';
import { AccountTableRow } from './AccountTableRow';
import { DataTable } from '../shared_components/DataTable';

export function AccountTable({ accounts, onEdit, onRemove }: { accounts: Account[]; onEdit: (account: Account) => void; onRemove: (account: Account) => void }) {
  const { translate } = useLanguage();
  return <DataTable caption={translate('people')} headings={['name', 'role', 'access', 'actions'].map(translate)}>
    {accounts.map(account => <AccountTableRow key={account.id} account={account} onEdit={onEdit} onRemove={onRemove} />)}
  </DataTable>;
}

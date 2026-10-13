import type { Account } from '../../data_models/account';
import { useLanguage } from '../languages/LanguageSettings';
import { useAccountForm } from '../screen_state/use_account_form';
import { Button } from '../shared_components/Button';
import { Dialog } from '../shared_components/Dialog';
import { ErrorMessage } from '../shared_components/ErrorMessage';
import { AccountFormFields } from './AccountFormFields';
import './AccountForm.css';

export function AccountForm({ account, onSaved, onClose, onReload }: { account?: Account; onSaved: () => void; onClose: () => void; onReload: () => void }) {
  const { translate } = useLanguage();
  const form = useAccountForm(account, onSaved);
  return <Dialog title={translate(account ? 'editPerson' : 'addPerson')} onClose={onClose} isBusy={form.isSaving}>
    <form className="account-form" noValidate onSubmit={event => { void form.submit(event); }}>
      <AccountFormFields form={form} account={account} />
      {form.error && <ErrorMessage code={form.error} compact />}
      {form.error === 'CONCURRENT_CHANGE' && <Button onClick={onReload}>{translate('closeAndReload')}</Button>}
      <div className="form-actions"><Button onClick={onClose} disabled={form.isSaving}>{translate('cancel')}</Button>
        <Button type="submit" variant="primary" disabled={form.isSaving}>{translate(form.isSaving ? 'saving' : 'saveChanges')}</Button>
      </div>
    </form>
  </Dialog>;
}

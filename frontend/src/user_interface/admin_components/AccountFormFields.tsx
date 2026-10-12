import type { Account, Role } from '../../data_models/account';
import { useLanguage } from '../languages/LanguageSettings';
import { useSession } from '../screen_state/SessionSettings';
import type { useAccountForm } from '../screen_state/use_account_form';
import { TextInput } from '../shared_components/TextInput';
import { SelectInput } from '../shared_components/SelectInput';

export function AccountFormFields({ form, account }: { form: ReturnType<typeof useAccountForm>; account?: Account }) {
  const { translate } = useLanguage();
  const { session } = useSession();
  const protectedAccess = account?.isFixed || account?.id === session?.account.id;
  return <div className="form-fields">
    <TextInput label={translate('name')} value={form.value.name} disabled={form.isSaving}
      error={form.errors.name ? translate(form.errors.name) : undefined} onChange={event => form.setField('name', event.target.value)} />
    <TextInput label={translate('email')} value={form.value.email} disabled={form.isSaving} type="email" dir="ltr" hint={translate('demoEmailHint')}
      error={form.errors.email ? translate(form.errors.email) : undefined} onChange={event => form.setField('email', event.target.value)} />
    <div className="two-fields"><SelectInput label={translate('role')} value={form.value.role} disabled={form.isSaving || account?.isFixed}
      options={['counselor', 'admin'].map(role => ({ value: role, label: translate(role) }))}
      onChange={event => form.setField('role', event.target.value as Role)} />
      <SelectInput label={translate('access')} value={String(form.value.isActive)} disabled={form.isSaving || protectedAccess}
        options={[{ value: 'true', label: translate('active') }, { value: 'false', label: translate('disabled') }]}
        onChange={event => form.setField('isActive', event.target.value === 'true')} />
    </div>{account?.isFixed && <p className="form-hint">{translate('fixedHint')}</p>}
  </div>;
}

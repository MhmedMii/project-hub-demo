import type { Account } from '../../data_models/account';
import { createAccountInput } from '../../actions/display_helpers/create_account_input';
import { checkAccountForm } from '../../actions/display_helpers/check_account_form';
import { useActions } from './ActionSettings';
import { useForm } from './use_form';

export function useAccountForm(account: Account | undefined, onSaved: () => void) {
  const actions = useActions().accounts;
  return useForm({ initial: createAccountInput(account), validate: checkAccountForm,
    save: input => account ? actions.edit(account.id, input) : actions.add(input), onSaved });
}

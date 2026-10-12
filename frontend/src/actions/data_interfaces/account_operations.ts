import type { Account } from '../../data_models/account';
import type { AccountInput } from '../../data_models/account_input';

export interface AccountOperations {
  list: () => Promise<Account[]>;
  add: (input: AccountInput) => Promise<Account>;
  edit: (identifier: string, input: AccountInput) => Promise<Account>;
  remove: (identifier: string) => Promise<void>;
}

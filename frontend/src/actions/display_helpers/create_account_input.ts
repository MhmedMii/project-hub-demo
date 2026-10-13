import type { Account } from '../../data_models/account';
import type { AccountInput } from '../../data_models/account_input';

export function createAccountInput(account?: Account): AccountInput {
  return { name: account?.name ?? '', email: account?.email ?? '', role: account?.role ?? 'counselor',
    isActive: account?.isActive ?? true, ...(account ? { expectedRevision: account.revision } : {}) };
}

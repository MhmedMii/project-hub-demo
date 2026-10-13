import type { AccountInput } from '../../data_models/account_input';

export function writeAccountRequest(input: AccountInput) {
  return { name: input.name, email: input.email, role: input.role, is_active: input.isActive,
    ...(input.expectedRevision === undefined ? {} : { expected_revision: input.expectedRevision }) };
}

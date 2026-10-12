import type { AccountOperations } from './data_interfaces/account_operations';
import type { AccountInput } from '../data_models/account_input';

export function editAccount(operations: AccountOperations, identifier: string, input: AccountInput) {
  return operations.edit(identifier, input);
}

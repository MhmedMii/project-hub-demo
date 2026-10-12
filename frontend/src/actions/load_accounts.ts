import type { AccountOperations } from './data_interfaces/account_operations';

export function loadAccounts(operations: AccountOperations) { return operations.list(); }

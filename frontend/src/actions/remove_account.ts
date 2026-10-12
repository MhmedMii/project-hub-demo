import type { AccountOperations } from './data_interfaces/account_operations';

export function removeAccount(operations: AccountOperations, identifier: string) { return operations.remove(identifier); }

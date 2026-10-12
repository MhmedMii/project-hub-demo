import type { AccountOperations } from './data_interfaces/account_operations';
import type { AccountInput } from '../data_models/account_input';

export function addAccount(operations: AccountOperations, input: AccountInput) { return operations.add(input); }

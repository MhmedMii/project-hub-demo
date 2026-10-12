import type { Role } from '../data_models/account';
import type { SessionOperations } from './data_interfaces/session_operations';

export function signIn(operations: SessionOperations, role: Role) { return operations.signIn(role); }

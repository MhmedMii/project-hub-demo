import type { SessionOperations } from './data_interfaces/session_operations';

export function signOut(operations: SessionOperations) { return operations.signOut(); }

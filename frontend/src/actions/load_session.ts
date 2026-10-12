import type { SessionOperations } from './data_interfaces/session_operations';

export function loadSession(operations: SessionOperations) { return operations.get(); }

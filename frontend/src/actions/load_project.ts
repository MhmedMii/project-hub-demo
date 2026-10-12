import type { ProjectOperations } from './data_interfaces/project_operations';

export function loadProject(operations: ProjectOperations, identifier: string) { return operations.get(identifier); }

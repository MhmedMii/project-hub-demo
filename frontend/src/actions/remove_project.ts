import type { ProjectOperations } from './data_interfaces/project_operations';

export function removeProject(operations: ProjectOperations, identifier: string) { return operations.remove(identifier); }

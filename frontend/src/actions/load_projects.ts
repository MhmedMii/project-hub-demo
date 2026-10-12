import type { ProjectOperations } from './data_interfaces/project_operations';

export function loadProjects(operations: ProjectOperations) { return operations.list(); }

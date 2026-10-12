import type { ProjectOperations } from './data_interfaces/project_operations';
import type { ProjectInput } from '../data_models/project_input';

export function editProject(operations: ProjectOperations, identifier: string, input: ProjectInput) {
  return operations.edit(identifier, input);
}

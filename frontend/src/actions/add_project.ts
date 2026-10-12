import type { ProjectOperations } from './data_interfaces/project_operations';
import type { ProjectInput } from '../data_models/project_input';

export function addProject(operations: ProjectOperations, input: ProjectInput) { return operations.add(input); }

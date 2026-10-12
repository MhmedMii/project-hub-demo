import type { Project } from '../../data_models/project';
import type { ProjectInput } from '../../data_models/project_input';

export interface ProjectOperations {
  list: () => Promise<Project[]>;
  get: (identifier: string) => Promise<Project>;
  add: (input: ProjectInput) => Promise<Project>;
  edit: (identifier: string, input: ProjectInput) => Promise<Project>;
  remove: (identifier: string) => Promise<void>;
}

import type { Project } from '../../data_models/project';
import type { StatusFilter } from '../../data_models/project_status';

export function filterProjects(projects: Project[], status: StatusFilter): Project[] {
  return status === 'all' ? projects : projects.filter(project => project.status === status);
}

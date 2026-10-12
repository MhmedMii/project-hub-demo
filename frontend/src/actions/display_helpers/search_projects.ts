import type { Language } from '../../data_models/localized_text';
import type { Project } from '../../data_models/project';

export function searchProjects(projects: Project[], query: string, language: Language): Project[] {
  const search = query.trim().toLocaleLowerCase(language);
  return projects.filter(project => [project.title, project.description, project.category]
    .some(text => text[language].toLocaleLowerCase(language).includes(search)));
}

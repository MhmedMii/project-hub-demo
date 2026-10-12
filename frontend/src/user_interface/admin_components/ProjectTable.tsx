import type { Project } from '../../data_models/project';
import { useLanguage } from '../languages/LanguageSettings';
import { ProjectTableRow } from './ProjectTableRow';
import { DataTable } from '../shared_components/DataTable';

export function ProjectTable({ projects, onEdit, onRemove }: { projects: Project[]; onEdit: (project: Project) => void; onRemove: (project: Project) => void }) {
  const { translate } = useLanguage();
  return <DataTable caption={translate('projects')} headings={['projects', 'status', 'updated', 'actions'].map(translate)}>
    {projects.map(project => <ProjectTableRow key={project.id} project={project} onEdit={onEdit} onRemove={onRemove} />)}
  </DataTable>;
}

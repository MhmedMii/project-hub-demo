import type { Project } from '../../data_models/project';
import type { ProjectInput } from '../../data_models/project_input';

export function createProjectInput(project?: Project): ProjectInput {
  return {
    title: project?.title ?? { en: '', ar: '' }, description: project?.description ?? { en: '', ar: '' },
    category: project?.category ?? { en: 'General', ar: 'عام' }, status: project?.status ?? 'live',
    privateNotes: project?.privateNotes ?? '',
    ...(project ? { expectedRevision: project.revision } : {}),
  };
}

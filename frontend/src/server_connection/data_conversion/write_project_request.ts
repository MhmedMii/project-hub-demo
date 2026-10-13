import type { ProjectInput } from '../../data_models/project_input';

export function writeProjectRequest(input: ProjectInput) {
  return { title: input.title, description: input.description, category: input.category,
    status: input.status, private_notes: input.privateNotes,
    ...(input.expectedRevision === undefined ? {} : { expected_revision: input.expectedRevision }) };
}

import type { ProjectInput } from '../../data_models/project_input';
import { checkLocalizedField } from './check_localized_field';

export function checkProjectForm(input: ProjectInput): Record<string, string> {
  const errors = {
    ...checkLocalizedField(input.title, 'title', 120),
    ...checkLocalizedField(input.description, 'description', 1000),
    ...checkLocalizedField(input.category, 'category', 80),
  };
  if (input.privateNotes.trim().length > 2000) errors.privateNotes = 'tooLong';
  return errors;
}

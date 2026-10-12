import type { Project } from '../../data_models/project';
import { createProjectInput } from '../../actions/display_helpers/create_project_input';
import { checkProjectForm } from '../../actions/display_helpers/check_project_form';
import { useActions } from './ActionSettings';
import { useForm } from './use_form';

export function useProjectForm(project: Project | undefined, onSaved: () => void) {
  const actions = useActions().projects;
  return useForm({ initial: createProjectInput(project), validate: checkProjectForm,
    save: input => project ? actions.edit(project.id, input) : actions.add(input), onSaved });
}

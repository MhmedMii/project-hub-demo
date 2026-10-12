import type { Project } from '../../data_models/project';
import { projectStatuses, type ProjectStatus } from '../../data_models/project_status';
import { useLanguage } from '../languages/LanguageSettings';
import type { useProjectForm } from '../screen_state/use_project_form';
import { SelectInput } from '../shared_components/SelectInput';
import { TextArea } from '../shared_components/TextArea';
import { TextInput } from '../shared_components/TextInput';
import { LocalizedField } from './LocalizedField';

export function ProjectFormFields({ form, project }: { form: ReturnType<typeof useProjectForm>; project?: Project }) {
  const { translate } = useLanguage();
  return <div className="form-fields">
    {(['title', 'description', 'category'] as const).map(field => <LocalizedField key={field} field={field}
      value={form.value[field]} onChange={value => form.setField(field, value)} errors={form.errors} disabled={form.isSaving} />)}
    <SelectInput label={translate('status')} value={form.value.status} disabled={form.isSaving}
      options={projectStatuses.map(status => ({ value: status, label: translate(status) }))}
      onChange={event => form.setField('status', event.target.value as ProjectStatus)} />
    <TextArea label={translate('privateNotes')} value={form.value.privateNotes} hint={translate('notesHint')} disabled={form.isSaving}
      error={form.errors.privateNotes ? translate(form.errors.privateNotes) : undefined}
      onChange={event => form.setField('privateNotes', event.target.value)} />
    <TextInput label={translate('toolDestination')} value={project?.toolPath ?? ''} readOnly dir="ltr" hint={translate('destinationHint')} />
  </div>;
}

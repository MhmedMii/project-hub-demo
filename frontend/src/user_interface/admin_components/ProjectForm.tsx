import type { Project } from '../../data_models/project';
import { useLanguage } from '../languages/LanguageSettings';
import { useProjectForm } from '../screen_state/use_project_form';
import { Button } from '../shared_components/Button';
import { Dialog } from '../shared_components/Dialog';
import { ErrorMessage } from '../shared_components/ErrorMessage';
import { ProjectFormFields } from './ProjectFormFields';
import './ProjectForm.css';

export function ProjectForm({ project, onSaved, onClose, onReload }: { project?: Project; onSaved: () => void; onClose: () => void; onReload: () => void }) {
  const { translate } = useLanguage();
  const form = useProjectForm(project, onSaved);
  return <Dialog title={translate(project ? 'editProject' : 'addProject')} onClose={onClose} isBusy={form.isSaving}>
    <form className="project-form" noValidate onSubmit={event => { void form.submit(event); }}>
      <ProjectFormFields form={form} project={project} />
      {form.error && <ErrorMessage code={form.error} compact />}
      {form.error === 'CONCURRENT_CHANGE' && <Button onClick={onReload}>{translate('closeAndReload')}</Button>}
      <div className="form-actions"><Button onClick={onClose} disabled={form.isSaving}>{translate('cancel')}</Button>
        <Button type="submit" variant="primary" disabled={form.isSaving}>{translate(form.isSaving ? 'saving' : 'saveChanges')}</Button>
      </div>
    </form>
  </Dialog>;
}

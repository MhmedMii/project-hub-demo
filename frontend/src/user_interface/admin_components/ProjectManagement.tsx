import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Project } from '../../data_models/project';
import { useLanguage } from '../languages/LanguageSettings';
import { useActions } from '../screen_state/ActionSettings';
import { useProjects } from '../screen_state/use_projects';
import { Button } from '../shared_components/Button';
import { ScreenFeedback } from '../shared_components/ScreenFeedback';
import { ConfirmRemoval } from '../shared_components/ConfirmRemoval';
import { ProjectTable } from './ProjectTable';
import { ProjectForm } from './ProjectForm';
import './ProjectManagement.css';

export function ProjectManagement() {
  const { language, translate } = useLanguage();
  const { data, isLoading, error, reload } = useProjects();
  const actions = useActions().projects;
  const [editor, setEditor] = useState<{ project?: Project } | null>(null);
  const [removing, setRemoving] = useState<Project | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const finish = (message: string) => { setEditor(null); setRemoving(null); setNotice(message); void reload(); };
  return <section className="project-management"><div className="project-management-heading">
    <p className="small muted">{data.length} {translate('projects')}</p>
    <Button variant="primary" onClick={() => setEditor({})}><Plus size={17} aria-hidden="true" />{translate('addProject')}</Button>
  </div>{notice && <p className="notice" role="status">{translate(notice)}</p>}
    <ScreenFeedback isLoading={isLoading} error={error} isEmpty={data.length === 0} onRetry={() => { void reload(); }} />
    {!isLoading && !error && data.length > 0 && <ProjectTable projects={data} onEdit={project => setEditor({ project })} onRemove={setRemoving} />}
    {editor && <ProjectForm project={editor.project} onClose={() => setEditor(null)} onSaved={() => finish('projectSaved')} />}
    {removing && <ConfirmRemoval title={translate('removeProjectTitle')} name={removing.title[language]}
      remove={() => actions.remove(removing.id)} onClose={() => setRemoving(null)} onRemoved={() => finish('projectRemoved')} />}
  </section>;
}

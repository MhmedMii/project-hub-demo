import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchProjects } from '../../actions/display_helpers/search_projects';
import { filterProjects } from '../../actions/display_helpers/filter_projects';
import type { StatusFilter } from '../../data_models/project_status';
import { useLanguage } from '../languages/LanguageSettings';
import { PageHeading } from '../page_layout/PageHeading';
import { ProjectList } from '../project_components/ProjectList';
import { ProjectSearch } from '../project_components/ProjectSearch';
import { ProjectStatusFilter } from '../project_components/ProjectStatusFilter';
import { useProjects } from '../screen_state/use_projects';
import { useSession } from '../screen_state/SessionSettings';
import { ScreenFeedback } from '../shared_components/ScreenFeedback';
import './ProjectsPage.css';

export function ProjectsPage() {
  const { language, translate } = useLanguage();
  const { session } = useSession();
  const { data, isLoading, error, reload } = useProjects();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const projects = filterProjects(searchProjects(data, query, language), status);
  const clearFilters = () => { setQuery(''); setStatus('all'); };
  return <><PageHeading title={translate('toolbox')} description={translate('toolboxDescription')}>
    {session?.account.role === 'admin' && <Link className="manage-projects-link" to="/admin">{translate('manageProjects')}</Link>}
  </PageHeading><div className="project-filters"><ProjectSearch value={query} onChange={setQuery} />
    <ProjectStatusFilter value={status} onChange={setStatus} includeArchived={session?.account.role === 'admin'} />
  </div><p className="project-count" role="status">{projects.length} {translate('tools')}</p>
    <ScreenFeedback isLoading={isLoading} error={error} isEmpty={projects.length === 0} onRetry={() => { void reload(); }} onClear={clearFilters} />
    {!isLoading && !error && <ProjectList projects={projects} />}
    <p className="projects-footer">{translate('fictionalData')}</p>
  </>;
}

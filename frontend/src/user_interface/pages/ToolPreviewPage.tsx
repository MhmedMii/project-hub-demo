import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Project } from '../../data_models/project';
import { useLanguage } from '../languages/LanguageSettings';
import { PageHeading } from '../page_layout/PageHeading';
import { ProjectIcon } from '../project_components/ProjectIcon';
import { useActions } from '../screen_state/ActionSettings';
import { useScreenData } from '../screen_state/use_screen_data';
import { ScreenFeedback } from '../shared_components/ScreenFeedback';
import { StatusLabel } from '../shared_components/StatusLabel';
import './ToolPreviewPage.css';

export function ToolPreviewPage() {
  const { projectId = '' } = useParams();
  const { language, translate } = useLanguage();
  const operations = useActions().projects;
  const load = useCallback(() => operations.get(projectId), [operations, projectId]);
  const { data, isLoading, error, reload } = useScreenData<Project | null>(load, null);
  return <><PageHeading title={translate('toolPreview')} description={translate('previewDescription')} />
    <ScreenFeedback isLoading={isLoading} error={error} isEmpty={false} onRetry={() => { void reload(); }} />
    {data && <section className="tool-preview"><ProjectIcon category={data.category.en} status={data.status} /><StatusLabel status={data.status} />
      <h2>{data.title[language]}</h2><p>{data.description[language]}</p><span className="small muted">{translate('fictionalData')}</span>
    </section>}<Link className="tool-back-link" to="/projects">{translate('backToProjects')}</Link>
  </>;
}

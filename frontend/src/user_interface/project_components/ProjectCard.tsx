import { Link } from 'react-router-dom';
import type { Project } from '../../data_models/project';
import { useLanguage } from '../languages/LanguageSettings';
import { StatusLabel } from '../shared_components/StatusLabel';
import { ProjectIcon } from './ProjectIcon';
import './ProjectCard.css';

export function ProjectCard({ project }: { project: Project }) {
  const { language, translate } = useLanguage();
  return <article className="project-card"><div className="project-card-heading">
    <ProjectIcon category={project.category.en} status={project.status} /><StatusLabel status={project.status} />
  </div><h3>{project.title[language]}</h3><p>{project.description[language]}</p>
    <div className="project-card-footer"><span>{project.category[language]}</span>
      <Link className="project-open" to={project.toolPath} aria-label={`${translate('openTool')}: ${project.title[language]}`}>{translate('openTool')}</Link>
    </div>
  </article>;
}

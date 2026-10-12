import type { Project } from '../../data_models/project';
import { ProjectCard } from './ProjectCard';
import './ProjectList.css';

export function ProjectList({ projects }: { projects: Project[] }) {
  return <div className="project-list">{projects.map(project => <ProjectCard key={project.id} project={project} />)}</div>;
}

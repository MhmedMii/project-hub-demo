import { Pencil, Trash2 } from 'lucide-react';
import type { Project } from '../../data_models/project';
import { useLanguage } from '../languages/LanguageSettings';
import { Button } from '../shared_components/Button';
import { StatusLabel } from '../shared_components/StatusLabel';
import { formatDate } from '../../actions/display_helpers/format_date';

export function ProjectTableRow({ project, onEdit, onRemove }: { project: Project; onEdit: (project: Project) => void; onRemove: (project: Project) => void }) {
  const { language, translate } = useLanguage();
  return <tr><td><strong>{project.title[language]}</strong><small>{project.category[language]}</small></td>
    <td><StatusLabel status={project.status} /></td><td>{formatDate(project.updatedAt, language)}</td>
    <td><div className="table-actions"><Button onClick={() => onEdit(project)} aria-label={`${translate('edit')}: ${project.title[language]}`}>
      <Pencil size={14} aria-hidden="true" />{translate('edit')}</Button>
      <Button variant="quiet" onClick={() => onRemove(project)} aria-label={`${translate('remove')}: ${project.title[language]}`}>
        <Trash2 size={14} aria-hidden="true" />{translate('remove')}</Button></div></td>
  </tr>;
}

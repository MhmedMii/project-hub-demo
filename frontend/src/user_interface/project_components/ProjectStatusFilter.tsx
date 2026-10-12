import { projectStatuses, type StatusFilter } from '../../data_models/project_status';
import { useLanguage } from '../languages/LanguageSettings';
import './ProjectStatusFilter.css';

export function ProjectStatusFilter({ value, onChange, includeArchived }: {
  value: StatusFilter; onChange: (value: StatusFilter) => void; includeArchived: boolean;
}) {
  const { translate } = useLanguage();
  return <label className="project-status-filter"><span className="sr-only">{translate('filterStatus')}</span>
    <select value={value} onChange={event => onChange(event.target.value as StatusFilter)}>
      <option value="all">{translate('allStatuses')}</option>
      {projectStatuses.filter(status => includeArchived || status !== 'archived')
        .map(status => <option key={status} value={status}>{translate(status)}</option>)}
    </select>
  </label>;
}

import type { ProjectStatus } from '../../data_models/project_status';
import { useLanguage } from '../languages/LanguageSettings';
import './StatusLabel.css';

export function StatusLabel({ status }: { status: ProjectStatus | 'active' | 'disabled' }) {
  const { translate } = useLanguage();
  return <span className={`status-label status-label--${status}`}><span aria-hidden="true" />{translate(status)}</span>;
}

import type { LocalizedText } from './localized_text';
import type { ProjectStatus } from './project_status';

export interface Project {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  status: ProjectStatus;
  toolPath: string;
  privateNotes?: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
}

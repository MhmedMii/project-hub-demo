import type { LocalizedText } from './localized_text';
import type { ProjectStatus } from './project_status';

export interface ProjectInput {
  title: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  status: ProjectStatus;
  privateNotes: string;
  expectedRevision?: number;
}

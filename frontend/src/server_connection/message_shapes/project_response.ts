import type { LocalizedText } from '../../data_models/localized_text';
import type { ProjectStatus } from '../../data_models/project_status';

export interface ProjectResponse {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  status: ProjectStatus;
  tool_path: string;
  private_notes?: string;
  created_at: string;
  updated_at: string;
}

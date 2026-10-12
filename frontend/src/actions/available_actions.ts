import type { ProjectOperations } from './data_interfaces/project_operations';
import type { AccountOperations } from './data_interfaces/account_operations';
import type { SessionOperations } from './data_interfaces/session_operations';

export interface AvailableActions {
  projects: ProjectOperations;
  accounts: AccountOperations;
  session: SessionOperations;
}

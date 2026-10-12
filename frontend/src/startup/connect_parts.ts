import type { AvailableActions } from '../actions/available_actions';
import { addAccount } from '../actions/add_account';
import { editAccount } from '../actions/edit_account';
import { loadAccounts } from '../actions/load_accounts';
import { removeAccount } from '../actions/remove_account';
import { addProject } from '../actions/add_project';
import { editProject } from '../actions/edit_project';
import { loadProject } from '../actions/load_project';
import { loadProjects } from '../actions/load_projects';
import { removeProject } from '../actions/remove_project';
import { loadSession } from '../actions/load_session';
import { signIn } from '../actions/sign_in';
import { signOut } from '../actions/sign_out';
import { accountRequests } from '../server_connection/account_requests';
import { projectRequests } from '../server_connection/project_requests';
import { sessionRequests } from '../server_connection/session_requests';

export function connectParts(): AvailableActions {
  return {
    projects: {
      list: () => loadProjects(projectRequests), get: identifier => loadProject(projectRequests, identifier),
      add: input => addProject(projectRequests, input),
      edit: (identifier, input) => editProject(projectRequests, identifier, input),
      remove: identifier => removeProject(projectRequests, identifier),
    },
    accounts: {
      list: () => loadAccounts(accountRequests), add: input => addAccount(accountRequests, input),
      edit: (identifier, input) => editAccount(accountRequests, identifier, input),
      remove: identifier => removeAccount(accountRequests, identifier),
    },
    session: {
      get: () => loadSession(sessionRequests), signIn: role => signIn(sessionRequests, role),
      signOut: () => signOut(sessionRequests),
    },
  };
}

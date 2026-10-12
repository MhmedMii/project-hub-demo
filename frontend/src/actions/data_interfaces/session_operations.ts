import type { Role } from '../../data_models/account';
import type { Session } from '../../data_models/session';

export interface SessionOperations {
  get: () => Promise<Session>;
  signIn: (role: Role) => Promise<Session>;
  signOut: () => Promise<void>;
}

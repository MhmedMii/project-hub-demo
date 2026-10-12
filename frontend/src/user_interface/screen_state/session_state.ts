import type { Session } from '../../data_models/session';
import type { Role } from '../../data_models/account';

export interface SessionState { session: Session | null; isLoading: boolean; error: string | null }
export interface SessionControls extends SessionState {
  refresh: () => Promise<void>;
  signIn: (role: Role) => Promise<void>;
  signOut: () => Promise<void>;
}
export const emptySession: SessionState = { session: null, isLoading: true, error: null };

export interface SessionSequence { requestNumber: number; isChanging: boolean }

export function isSessionExpired(code: string): boolean {
  return ['SESSION_REQUIRED', 'ACCOUNT_INACTIVE'].includes(code);
}

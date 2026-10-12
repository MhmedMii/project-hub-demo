import { expect, it } from 'vitest';
import { ApplicationError } from '../../src/data_models/application_error';
import type { Session } from '../../src/data_models/session';
import type { SessionState } from '../../src/user_interface/screen_state/session_state';
import type { SetStateAction } from 'react';
import { endSession } from '../../src/user_interface/screen_state/end_session';
import { startSession } from '../../src/user_interface/screen_state/start_session';
import { resolveSession } from '../../src/user_interface/screen_state/resolve_session';

const session: Session = { account: { id: 'demo-counselor', name: 'Demo Counselor', email: 'counselor@demo.example',
  role: 'counselor', isActive: true, isFixed: false }, expiresAt: '2026-10-13' };

it('keeps the current session when server logout fails', async () => {
  let state: SessionState = { session, isLoading: false, error: null };
  const update = (next: SetStateAction<SessionState>) => { state = typeof next === 'function' ? next(state) : next; };
  const operations = { get: async () => session, signIn: async () => session,
    signOut: async () => { throw new ApplicationError('NETWORK_ERROR'); } };
  const sequence = { current: { requestNumber: 0, isChanging: false } };
  await expect(endSession(operations, update, sequence)).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  expect(state.session).toEqual(session);
});

it('does not let an old session read overwrite a new sign-in', async () => {
  let finishRead!: (value: Session) => void;
  const pending = new Promise<Session>(resolve => { finishRead = resolve; });
  let state: SessionState = { session: null, isLoading: true, error: null };
  const update = (next: SetStateAction<SessionState>) => { state = typeof next === 'function' ? next(state) : next; };
  const adminSession: Session = { ...session, account: { ...session.account, id: 'demo-admin', role: 'admin' } };
  const operations = { get: () => pending, signIn: async () => adminSession, signOut: async () => undefined };
  const sequence = { current: { requestNumber: 0, isChanging: false } };
  const read = resolveSession(operations, update, sequence);
  await startSession(operations, 'admin', update, sequence);
  finishRead(session);
  await read;
  expect(state.session).toEqual(adminSession);
});

it('does not let an old logout rejection clear a newer sign-in', async () => {
  let rejectLogout!: (error: Error) => void;
  const pending = new Promise<void>((_, reject) => { rejectLogout = reject; });
  let state: SessionState = { session, isLoading: false, error: null };
  const update = (next: SetStateAction<SessionState>) => { state = typeof next === 'function' ? next(state) : next; };
  const adminSession: Session = { ...session, account: { ...session.account, id: 'demo-admin', role: 'admin' } };
  const operations = { get: async () => session, signIn: async () => adminSession, signOut: () => pending };
  const sequence = { current: { requestNumber: 0, isChanging: false } };
  const logout = endSession(operations, update, sequence).catch(() => undefined);
  await startSession(operations, 'admin', update, sequence);
  rejectLogout(new ApplicationError('SESSION_REQUIRED'));
  await logout;
  expect(state.session).toEqual(adminSession);
});

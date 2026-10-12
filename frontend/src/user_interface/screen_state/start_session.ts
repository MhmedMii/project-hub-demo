import type { Dispatch, SetStateAction, RefObject } from 'react';
import type { Role } from '../../data_models/account';
import type { SessionOperations } from '../../actions/data_interfaces/session_operations';
import { errorCode } from '../../actions/display_helpers/error_code';
import type { SessionState, SessionSequence } from './session_state';

export async function startSession(operations: SessionOperations, role: Role, update: Dispatch<SetStateAction<SessionState>>, sequence: RefObject<SessionSequence>) {
  const identifier = ++sequence.current.requestNumber;
  sequence.current.isChanging = true;
  update(current => ({ ...current, error: null }));
  try {
    const session = await operations.signIn(role);
    if (identifier === sequence.current.requestNumber) update({ session, isLoading: false, error: null });
  } catch (error) {
    if (identifier === sequence.current.requestNumber) update(current => ({ ...current, error: errorCode(error) }));
    throw error;
  } finally {
    if (identifier === sequence.current.requestNumber) sequence.current.isChanging = false;
  }
}

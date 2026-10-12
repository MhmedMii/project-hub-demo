import type { Dispatch, SetStateAction, RefObject } from 'react';
import type { SessionOperations } from '../../actions/data_interfaces/session_operations';
import { errorCode } from '../../actions/display_helpers/error_code';
import { isSessionExpired, type SessionState, type SessionSequence } from './session_state';

export async function endSession(operations: SessionOperations, update: Dispatch<SetStateAction<SessionState>>, sequence: RefObject<SessionSequence>) {
  const identifier = ++sequence.current.requestNumber;
  sequence.current.isChanging = true;
  try {
    await operations.signOut();
    if (identifier === sequence.current.requestNumber) update({ session: null, isLoading: false, error: null });
  } catch (error) {
    if (identifier !== sequence.current.requestNumber) return;
    const code = errorCode(error);
    if (isSessionExpired(code)) update({ session: null, isLoading: false, error: null });
    else { update(current => ({ ...current, error: code })); throw error; }
  } finally {
    if (identifier === sequence.current.requestNumber) sequence.current.isChanging = false;
  }
}

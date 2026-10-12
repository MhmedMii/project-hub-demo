import type { Dispatch, SetStateAction, RefObject } from 'react';
import type { SessionOperations } from '../../actions/data_interfaces/session_operations';
import { errorCode } from '../../actions/display_helpers/error_code';
import { isSessionExpired, type SessionState, type SessionSequence } from './session_state';

export async function resolveSession(operations: SessionOperations, update: Dispatch<SetStateAction<SessionState>>, sequence: RefObject<SessionSequence>): Promise<void> {
  if (sequence.current.isChanging) return;
  const identifier = ++sequence.current.requestNumber;
  try {
    const session = await operations.get();
    if (identifier === sequence.current.requestNumber) update({ session, isLoading: false, error: null });
  } catch (error) {
    if (identifier !== sequence.current.requestNumber) return;
    const code = errorCode(error);
    const isExpired = isSessionExpired(code);
    update(current => ({ session: isExpired ? null : current.session, isLoading: false, error: isExpired ? null : code }));
  }
}

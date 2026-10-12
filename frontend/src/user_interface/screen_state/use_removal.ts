import { useState } from 'react';
import { errorCode } from '../../actions/display_helpers/error_code';
import { useSessionRecovery } from './use_session_recovery';

export function useRemoval(remove: () => Promise<void>, onRemoved: () => void) {
  const [isRemoving, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recover = useSessionRecovery();
  const confirm = async () => {
    setRemoving(true); setError(null);
    try { await remove(); onRemoved(); }
    catch (failure) { const code = errorCode(failure); setError(code); await recover(code); }
    finally { setRemoving(false); }
  };
  return { isRemoving, error, confirm };
}

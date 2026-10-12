import { useCallback } from 'react';
import { useSession } from './SessionSettings';

export function useSessionRecovery() {
  const { refresh } = useSession();
  return useCallback(async (code: string) => {
    if (['SESSION_REQUIRED', 'ACCOUNT_INACTIVE', 'ADMIN_REQUIRED'].includes(code)) await refresh();
  }, [refresh]);
}

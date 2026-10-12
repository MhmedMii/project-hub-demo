import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useActions } from './ActionSettings';
import { emptySession, type SessionControls } from './session_state';
import { resolveSession } from './resolve_session';
import { startSession } from './start_session';
import { endSession } from './end_session';

const SessionContext = createContext<SessionControls | null>(null);

export function SessionSettings({ children }: { children: ReactNode }) {
  const operations = useActions().session;
  const [state, setState] = useState(emptySession);
  const sequence = useRef({ requestNumber: 0, isChanging: false });
  const refresh = useCallback(() => resolveSession(operations, setState, sequence), [operations]);
  useEffect(() => {
    void refresh();
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    const interval = setInterval(onFocus, 60000);
    return () => { sequence.current.requestNumber += 1; window.removeEventListener('focus', onFocus); clearInterval(interval); };
  }, [refresh]);
  const controls = { ...state, refresh, signIn: (role: 'admin' | 'counselor') => startSession(operations, role, setState, sequence),
    signOut: () => endSession(operations, setState, sequence) };
  return <SessionContext.Provider value={controls}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionControls {
  const state = useContext(SessionContext);
  if (!state) throw new Error('Session settings are not connected');
  return state;
}

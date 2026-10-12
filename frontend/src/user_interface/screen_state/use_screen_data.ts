import { useCallback, useEffect, useRef, useState } from 'react';
import { loadScreenData, type ScreenData } from './load_screen_data';
import { useSessionRecovery } from './use_session_recovery';

export function useScreenData<T>(load: () => Promise<T>, initial: T) {
  const first = useRef(initial);
  const sequence = useRef(0);
  const recover = useSessionRecovery();
  const [state, setState] = useState<ScreenData<T>>({ data: initial, isLoading: true, error: null });
  const reload = useCallback(() => loadScreenData({ load, initial: first.current, recover }, setState, sequence), [load, recover]);
  useEffect(() => {
    void reload();
    return () => { sequence.current += 1; };
  }, [reload]);
  return { ...state, reload };
}

import { createContext, useContext, type ReactNode } from 'react';
import type { AvailableActions } from '../../actions/available_actions';

const ActionContext = createContext<AvailableActions | null>(null);

export function ActionSettings({ actions, children }: { actions: AvailableActions; children: ReactNode }) {
  return <ActionContext.Provider value={actions}>{children}</ActionContext.Provider>;
}

export function useActions(): AvailableActions {
  const actions = useContext(ActionContext);
  if (!actions) throw new Error('Application actions are not connected');
  return actions;
}

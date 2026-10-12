import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../screen_state/SessionSettings';

export function AdminAccess({ children }: { children: ReactNode }) {
  const { session } = useSession();
  return session?.account.role === 'admin' ? children : <Navigate to="/projects" replace />;
}

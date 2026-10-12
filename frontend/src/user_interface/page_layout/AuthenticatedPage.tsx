import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../screen_state/SessionSettings';
import { ErrorMessage } from '../shared_components/ErrorMessage';
import { LoadingMessage } from '../shared_components/LoadingMessage';

export function AuthenticatedPage() {
  const { session, isLoading, error, refresh } = useSession();
  if (isLoading) return <LoadingMessage />;
  if (!session && error) return <ErrorMessage code={error} onRetry={() => { void refresh(); }} />;
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet key={`${session.account.id}:${session.account.role}`} />;
}

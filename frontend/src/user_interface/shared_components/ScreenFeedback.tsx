import { EmptyMessage } from './EmptyMessage';
import { ErrorMessage } from './ErrorMessage';
import { LoadingMessage } from './LoadingMessage';

interface FeedbackProps { isLoading: boolean; error: string | null; isEmpty: boolean; onRetry: () => void; onClear?: () => void }

export function ScreenFeedback({ isLoading, error, isEmpty, onRetry, onClear }: FeedbackProps) {
  if (isLoading) return <LoadingMessage />;
  if (error) return <ErrorMessage code={error} onRetry={onRetry} />;
  if (isEmpty) return <EmptyMessage onClear={onClear} />;
  return null;
}

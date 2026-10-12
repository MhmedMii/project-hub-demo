import { ApplicationError } from '../data_models/application_error';
import { requestOnce } from './request_once';
import { requestSettings, type RequestOptions } from './request_settings';

export async function sendRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const deadline = Date.now() + requestSettings.totalDeadline;
  const maximumAttempts = (options.method ?? 'GET') === 'GET' ? 2 : 1;
  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    try {
      return await requestOnce<T>(path, options, Math.min(requestSettings.attemptTimeout, deadline - Date.now()));
    } catch (error) {
      const canRetry = error instanceof ApplicationError &&
        ['NETWORK_ERROR', 'REQUEST_TIMEOUT', 'SERVER_ERROR'].includes(error.code);
      if (!canRetry || attempt + 1 === maximumAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, requestSettings.retryDelay));
    }
  }
  throw new ApplicationError('REQUEST_TIMEOUT');
}

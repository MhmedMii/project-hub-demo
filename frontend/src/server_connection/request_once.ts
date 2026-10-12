import { ApplicationError } from '../data_models/application_error';
import type { RequestOptions } from './request_settings';
import { readServerError } from './read_server_error';

export async function requestOnce<T>(path: string, options: RequestOptions, timeout: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const signal = options.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal;
  try {
    const response = await fetch(path, { method: options.method ?? 'GET', credentials: 'include', signal,
      headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: options.body === undefined ? undefined : JSON.stringify(options.body) });
    if (!response.ok) throw await readServerError(response);
    return response.status === 204 ? undefined as T : await response.json();
  } catch (error) {
    if (error instanceof ApplicationError) throw error;
    if (options.signal?.aborted) throw new ApplicationError('REQUEST_ABORTED');
    throw new ApplicationError(controller.signal.aborted ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
  }
}

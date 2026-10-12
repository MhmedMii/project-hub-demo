import { ApplicationError } from '../data_models/application_error';

export async function readServerError(response: Response): Promise<ApplicationError> {
  const data = await response.json().catch(() => null);
  const code = typeof data?.error?.code === 'string' ? data.error.code : 'SERVER_ERROR';
  return new ApplicationError(code);
}

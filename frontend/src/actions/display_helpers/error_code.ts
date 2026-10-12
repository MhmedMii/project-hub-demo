import { ApplicationError } from '../../data_models/application_error';

export function errorCode(error: unknown): string {
  return error instanceof ApplicationError ? error.code : 'SERVER_ERROR';
}

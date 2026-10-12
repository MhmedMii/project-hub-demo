import type { Session } from '../../data_models/session';
import type { SessionResponse } from '../message_shapes/session_response';
import { readAccountResponse } from './read_account_response';

export function readSessionResponse(data: SessionResponse): Session {
  return { account: readAccountResponse(data.account), expiresAt: data.expires_at };
}

import type { SessionOperations } from '../actions/data_interfaces/session_operations';
import { readSessionResponse } from './data_conversion/read_session_response';
import type { SessionResponse } from './message_shapes/session_response';
import { sendRequest } from './send_request';

export const sessionRequests: SessionOperations = {
  get: async () => readSessionResponse(await sendRequest<SessionResponse>('/api/session')),
  signIn: async role => readSessionResponse(await sendRequest<SessionResponse>('/api/session/demo-login',
    { method: 'POST', body: { role } })),
  signOut: () => sendRequest('/api/session/logout', { method: 'POST' }),
};

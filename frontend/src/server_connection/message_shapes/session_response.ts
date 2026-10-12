import type { AccountResponse } from './account_response';

export interface SessionResponse { account: AccountResponse; expires_at: string }

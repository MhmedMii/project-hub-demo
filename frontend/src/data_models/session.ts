import type { Account } from './account';

export interface Session { account: Account; expiresAt: string }

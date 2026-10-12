import type { Role } from './account';

export interface AccountInput {
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

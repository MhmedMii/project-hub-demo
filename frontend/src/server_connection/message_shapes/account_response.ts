import type { Role } from '../../data_models/account';

export interface AccountResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  is_fixed: boolean;
}

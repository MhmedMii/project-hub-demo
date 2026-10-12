import type { Account } from '../../data_models/account';
import type { AccountResponse } from '../message_shapes/account_response';

export function readAccountResponse(data: AccountResponse): Account {
  return { id: data.id, name: data.name, email: data.email, role: data.role,
    isActive: data.is_active, isFixed: data.is_fixed };
}

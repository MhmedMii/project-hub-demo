import type { AccountInput } from '../../data_models/account_input';

export function checkAccountForm(input: AccountInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.name.trim()) errors.name = 'required';
  else if (input.name.trim().length > 120) errors.name = 'tooLong';
  const emailPattern = /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+example$/i;
  if (!emailPattern.test(input.email.trim()) || input.email.trim().length > 254) errors.email = 'demoEmailRequired';
  return errors;
}

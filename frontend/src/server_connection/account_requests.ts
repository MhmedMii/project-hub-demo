import type { AccountOperations } from '../actions/data_interfaces/account_operations';
import { readAccountResponse } from './data_conversion/read_account_response';
import { writeAccountRequest } from './data_conversion/write_account_request';
import type { AccountResponse } from './message_shapes/account_response';
import { sendRequest } from './send_request';

export const accountRequests: AccountOperations = {
  list: async () => {
    const data = await sendRequest<{ accounts: AccountResponse[] }>('/api/accounts');
    return data.accounts.map(readAccountResponse);
  },
  add: async input => {
    const data = await sendRequest<{ account: AccountResponse }>('/api/accounts', { method: 'POST', body: writeAccountRequest(input) });
    return readAccountResponse(data.account);
  },
  edit: async (identifier, input) => {
    const data = await sendRequest<{ account: AccountResponse }>(`/api/accounts/${encodeURIComponent(identifier)}`,
      { method: 'PATCH', body: writeAccountRequest(input) });
    return readAccountResponse(data.account);
  },
  remove: identifier => sendRequest(`/api/accounts/${encodeURIComponent(identifier)}`, { method: 'DELETE' }),
};

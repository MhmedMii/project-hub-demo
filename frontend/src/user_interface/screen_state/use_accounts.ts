import type { Account } from '../../data_models/account';
import { useActions } from './ActionSettings';
import { useScreenData } from './use_screen_data';

export function useAccounts() { return useScreenData<Account[]>(useActions().accounts.list, []); }

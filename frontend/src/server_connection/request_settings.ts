export const requestSettings = { attemptTimeout: 3000, totalDeadline: 6500, retryDelay: 250 };
export interface RequestOptions { method?: string; body?: unknown; signal?: AbortSignal }

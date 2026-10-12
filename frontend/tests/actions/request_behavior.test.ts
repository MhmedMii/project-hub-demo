import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendRequest } from '../../src/server_connection/send_request';

afterEach(() => vi.unstubAllGlobals());

describe('API requests', () => {
  it('retries a transient read failure once', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', async () => {
      attempts += 1;
      if (attempts === 1) throw new TypeError('Network unavailable');
      return new Response(JSON.stringify({ projects: [] }), { status: 200 });
    });
    expect(await sendRequest('/api/projects')).toEqual({ projects: [] });
    expect(attempts).toBe(2);
  });
  it('never retries a write', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', async () => { attempts += 1; throw new TypeError('Unavailable'); });
    await expect(sendRequest('/api/projects', { method: 'POST', body: {} })).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
    expect(attempts).toBe(1);
  });
  it('preserves server authorization errors without retrying', async () => {
    let attempts = 0;
    vi.stubGlobal('fetch', async () => {
      attempts += 1;
      return new Response(JSON.stringify({ error: { code: 'ADMIN_REQUIRED' } }), { status: 403 });
    });
    await expect(sendRequest('/api/accounts')).rejects.toMatchObject({ code: 'ADMIN_REQUIRED' });
    expect(attempts).toBe(1);
  });
});

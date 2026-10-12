import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

export default defineConfig({
  testDir: './tests/browser_workflows', fullyParallel: false, workers: 1,
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  projects: [{ name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: [
    { command: 'backend/.venv/bin/python -m uvicorn backend.server.create_server:create_server --factory --host 127.0.0.1 --port 8000',
      cwd: path.resolve(import.meta.dirname, '..'), url: 'http://127.0.0.1:8000/api/session', reuseExistingServer: true },
    { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: true },
  ],
});

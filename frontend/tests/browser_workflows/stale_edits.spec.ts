import { expect, test } from '@playwright/test';

const headers = { Origin: 'http://127.0.0.1:5173' };
const sample = { title: { en: 'Demo Conflict Project', ar: 'مشروع تعارض تجريبي' },
  description: { en: 'Fictional conflict example.', ar: 'مثال تعارض وهمي.' }, status: 'live' };

test('stale project edits show a conflict and retain inputs', async ({ page, request }) => {
  await request.post('/api/session/demo-login', { data: { role: 'admin' }, headers });
  const response = await request.post('/api/projects', { data: sample, headers });
  const project = (await response.json()).project;
  try {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Continue as Admin' }).click();
    await page.getByRole('link', { name: 'Administration', exact: true }).click();
    await page.getByRole('button', { name: 'Edit: Demo Conflict Project', exact: true }).click();
    await page.getByLabel('English title', { exact: true }).fill('Unsaved Demo Title');
    const changed = await request.patch(`/api/projects/${project.id}`, { data: { status: 'maintenance', expected_revision: 1 }, headers });
    expect(changed.ok()).toBeTruthy();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('dialog').getByRole('alert')).toContainText('changed since you opened');
    await expect(page.getByLabel('English title', { exact: true })).toHaveValue('Unsaved Demo Title');
    await page.getByRole('button', { name: 'Close and reload' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', { name: 'Edit: Demo Conflict Project', exact: true }).click();
    await expect(page.getByLabel('Status', { exact: true })).toHaveValue('maintenance');
  } finally {
    await request.delete(`/api/projects/${project.id}`, { headers });
  }
});

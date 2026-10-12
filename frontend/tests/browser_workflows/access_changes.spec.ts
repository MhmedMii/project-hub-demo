import { expect, test, type APIRequestContext, type Route } from '@playwright/test';

const origin = { Origin: 'http://127.0.0.1:5173' };

async function setDemoRole(request: APIRequestContext, role: 'admin' | 'counselor') {
  await request.post('/api/session/demo-login', { data: { role: 'admin' }, headers: origin });
  const response = await request.patch('/api/accounts/demo-counselor', { data: { role }, headers: origin });
  expect(response.ok()).toBeTruthy();
}

test('demotion clears an already open archived tool preview', async ({ page, request }) => {
  await setDemoRole(request, 'admin');
  try {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Continue as Counselor' }).click();
    await page.goto('/demo/tools/legacy-session-log');
    await expect(page.getByRole('heading', { name: 'Legacy Session Log' })).toBeVisible();
    await setDemoRole(request, 'counselor');
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(page.locator('.account-menu summary')).toContainText('Counselor');
    await expect(page.getByRole('alert')).toContainText('This project is unavailable.');
    await expect(page.getByRole('heading', { name: 'Legacy Session Log' })).toHaveCount(0);
  } finally {
    await setDemoRole(request, 'counselor');
  }
});

test('demotion invalidates outstanding admin project reads', async ({ page, request }) => {
  await setDemoRole(request, 'admin');
  const payload = await (await request.get('/api/projects')).json();
  const waiting: Route[] = [];
  let allowNewReads = false;
  await page.route('**/api/projects', async route => {
    if (allowNewReads) await route.continue();
    else waiting.push(route);
  });
  try {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Continue as Counselor' }).click();
    await expect.poll(() => waiting.length).toBeGreaterThan(0);
    allowNewReads = true;
    await setDemoRole(request, 'counselor');
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    await expect(page.locator('.account-menu summary')).toContainText('Counselor');
    await Promise.all(waiting.map(route => route.fulfill({ status: 200, json: payload })));
    await expect(page.locator('article.project-card')).toHaveCount(10);
    await expect(page.getByRole('heading', { name: 'Legacy Session Log' })).toHaveCount(0);
  } finally {
    await setDemoRole(request, 'counselor');
  }
});

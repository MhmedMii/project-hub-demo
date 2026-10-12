import { expect, test, type Page } from '@playwright/test';

async function signIn(page: Page, role: 'Admin' | 'Counselor') {
  await page.goto('/login');
  await page.getByRole('button', { name: `Continue as ${role}`, exact: false }).click();
  await expect(page.getByRole('heading', { name: 'Your project toolbox' })).toBeVisible();
}

test('counselor browses, searches, filters, and opens fictional tools', async ({ page }) => {
  await signIn(page, 'Counselor');
  await expect(page.locator('article.project-card')).toHaveCount(10);
  await expect(page.getByRole('link', { name: 'Administration' })).toHaveCount(0);
  await page.getByRole('searchbox').fill('Planner');
  await expect(page.locator('article.project-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Open tool: Counselor Planner', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Fictional tool preview' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to projects' }).click();
  await page.getByRole('combobox', { name: 'Filter by status' }).selectOption('maintenance');
  await expect(page.locator('article.project-card')).toHaveCount(2);
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/projects$/);
  await page.goto('/demo/tools/legacy-session-log');
  await expect(page.getByRole('alert')).toContainText('This project is unavailable.');
});

test('admin creates, refreshes, edits, and removes a bilingual project', async ({ page }) => {
  await signIn(page, 'Admin');
  await page.getByRole('link', { name: 'Administration', exact: true }).click();
  await page.getByRole('button', { name: 'Add project', exact: true }).click();
  await page.getByLabel('English title', { exact: true }).fill('Demo Browser Project');
  await page.getByLabel('Arabic title', { exact: true }).fill('مشروع المتصفح التجريبي');
  await page.getByLabel('English description', { exact: true }).fill('A fictional test project.');
  await page.getByLabel('Arabic description', { exact: true }).fill('مشروع وهمي للاختبار.');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Edit: Demo Browser Project', exact: true }).click();
  await page.getByLabel('Status', { exact: true }).selectOption('maintenance');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('row', { name: /Demo Browser Project/ })).toContainText('Maintenance');
  await page.getByRole('button', { name: 'Remove: Demo Browser Project', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Edit: Demo Browser Project', exact: true })).toHaveCount(0);
});

test('admin manages fictional accounts and fixed access remains protected', async ({ page }) => {
  await signIn(page, 'Admin');
  await page.getByRole('link', { name: 'Administration', exact: true }).click();
  await page.getByRole('tab', { name: 'People' }).click();
  await expect(page.getByRole('button', { name: 'Remove: Demo Admin', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Add person', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Demo Browser Person');
  await page.getByLabel('Email', { exact: true }).fill('browser-person@demo.example');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Edit: Demo Browser Person', exact: true }).click();
  await page.getByLabel('Role', { exact: true }).selectOption('admin');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('row', { name: /Demo Browser Person/ })).toContainText('Admin');
  await page.getByRole('button', { name: 'Remove: Demo Browser Person', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Edit: Demo Browser Person', exact: true })).toHaveCount(0);
});

test('failed saves keep the form values and can be retried', async ({ page }) => {
  await signIn(page, 'Admin');
  await page.getByRole('link', { name: 'Administration', exact: true }).click();
  await page.getByRole('button', { name: 'Add project', exact: true }).click();
  await page.getByLabel('English title', { exact: true }).fill('Demo Retry Project');
  await page.getByLabel('Arabic title', { exact: true }).fill('مشروع إعادة المحاولة');
  await page.getByLabel('English description', { exact: true }).fill('A fictional retry example.');
  await page.getByLabel('Arabic description', { exact: true }).fill('مثال وهمي لإعادة المحاولة.');
  await page.route('**/api/projects', route => route.request().method() === 'POST' ? route.abort() : route.continue());
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('could not be reached');
  await expect(page.getByLabel('English title', { exact: true })).toHaveValue('Demo Retry Project');
  await page.unroute('**/api/projects');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove: Demo Retry Project', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove', exact: true }).click();
});

test('Arabic, dark mode, mobile layouts, and admin forms stay usable', async ({ page }) => {
  await signIn(page, 'Admin');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'العربية', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'الوضع الداكن', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('link', { name: 'الإدارة', exact: true }).click();
  await page.getByRole('button', { name: 'إضافة مشروع', exact: true }).click();
  await expect(page.getByLabel('العنوان بالعربية', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  expect(await page.getByRole('dialog').evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy();
  await page.getByRole('button', { name: 'إلغاء', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

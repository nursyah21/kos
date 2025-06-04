import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')

    await page.locator('input[name="email"]').fill('admin@gmail.com')
    await page.locator('input[name="password"]').fill('password')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await page.goto('/dashboard/transaksi')
    await expect(page.locator('div[id="loading"]')).not.toBeVisible()
    await expect(page.locator('h2', { hasText: /transaksi/i }).first()).toBeVisible()
});

// dont separate it, because it just make it slower
// and combine it because the task is sequence
test('see invoice', async ({ page }) => {
   
    await page.locator('tr').locator('button[id="dropdown"]').first().click()
    await page.locator('tr').locator('a[id="invoice"]').first().click()
    
    await expect(page.locator('h2', {hasText: /invoice/i})).toBeVisible()
    
})
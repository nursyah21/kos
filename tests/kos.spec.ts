import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')

    await page.locator('input[name="email"]').fill('admin@gmail.com')
    await page.locator('input[name="password"]').fill('password')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
await page.goto('/dashboard/unit/kos')
    await expect(page.locator('h2', { hasText: /kos/i }).first()).toBeVisible()
    await expect(page.locator('div[id="loading"]')).not.toBeVisible()
});

// dont separate it, because it just make it slower
// and combine it because the task is sequence
test('crud kos', async ({ page }) => {
    // create
    await page.locator('button', { hasText: /kos/i }).click()
    await page.locator('input[name="kos"]').fill('kos1')
    await page.locator('input[name="address"]').fill('alamat1')
    await page.locator('input[name="image"]').setInputFiles('./tests/assets/pic1.jpg')   
    await page.click('button[type="submit"]')

    // update
    await page.locator('tr', { hasText: /kos1/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /kos1/i }).first().locator('button[id="edit"]').click()
    await expect(page.locator('input[name="kos"]')).toHaveValue('kos1')
    await page.locator('input[name="kos"]').fill('kos2')

    await expect(page.locator('input[name="address"]')).toHaveValue('alamat1')
    await page.locator('input[name="address"]').fill('alamat2')

    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src',/.+/)
    await page.click('button[type="submit"]')

    // delete
    await page.locator('tr', { hasText: /kos2/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /kos2/i }).first().locator('button[id="delete"]').click()
    
    await expect(page.locator('input[name="kos"]')).toHaveValue('kos2')
    await expect(page.locator('input[name="address"]')).toHaveValue('alamat2')
    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src',/.+/)
    await page.click('button[type="submit"]')
})
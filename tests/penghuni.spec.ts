import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')

    await page.locator('input[name="email"]').fill('admin@gmail.com')
    await page.locator('input[name="password"]').fill('password')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
await page.goto('/dashboard/users/penghuni')
    await expect(page.locator('h2', { hasText: /penghuni/i }).first()).toBeVisible()
    await expect(page.locator('div[id="loading"]')).not.toBeVisible()
});

// dont separate it, because it just make it slower
// and combine it because the task is sequence
test('crud penghuni', async ({ page }) => {
    // create
    await page.locator('button', { hasText: /penghuni/i }).click()
    await page.locator('input[name="nama"]').fill('penghuni1')
    await page.locator('input[name="no_hp"]').fill('081234567890')
    await page.locator('input[name="image"]').setInputFiles('./tests/assets/pic1.jpg')   
    await page.click('button[type="submit"]')

    // update
    await page.locator('tr', { hasText: /penghuni1/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /penghuni1/i }).first().locator('button[id="edit"]').click()
    await expect(page.locator('input[name="nama"]')).toHaveValue('penghuni1')
    await page.locator('input[name="nama"]').fill('penghuni2')

    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src',/.+/)
    await page.click('button[type="submit"]')

    // delete
    await page.locator('tr', { hasText: /penghuni2/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /penghuni2/i }).first().locator('button[id="delete"]').click()
    
    await expect(page.locator('input[name="nama"]')).toHaveValue('penghuni2')

    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src',/.+/)
    await page.click('button[type="submit"]')
})
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
test('crud transaksi', async ({ page }) => {
    // create
    await page.locator('button', { hasText: /transaksi/i }).click()
    await page.locator('select[name="kamar"]').selectOption({ index: 1 })
    await page.locator('input[name="tgl_bayar"]').fill('2020-12-30')
    await page.locator('select[name="petugas"]').selectOption({ index: 1 })
    await page.locator('input[name="image"]').setInputFiles('./tests/assets/pic1.jpg')
    await page.click('button[type="submit"]')

    // update
    await page.locator('tr', { hasText: /2020-12-30/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /2020-12-30/i }).first().locator('button[id="edit"]').click()
    await expect(page.locator('input[name="tgl_bayar"]')).toHaveValue('2020-12-30')
    await page.locator('input[name="tgl_bayar"]').fill('2020-11-30')


    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src', /.+/)
    await page.click('button[type="submit"]')

    // delete
    await page.locator('tr', { hasText: /2020-11-30/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /2020-11-30/i }).first().locator('button[id="delete"]').click()

    await expect(page.locator('input[name="tgl_bayar"]')).toHaveValue('2020-11-30')
    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src', /.+/)
    await page.click('button[type="submit"]')
})
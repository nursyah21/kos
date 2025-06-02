import test, { expect } from '@playwright/test';

test.beforeEach('setup login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/#/login')

    await page.locator('input[name="email"]').fill('admin@gmail.com')
    await page.locator('input[name="password"]').fill('password')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/#/dashboard')
await page.goto('/#/dashboard/unit/kamar')
    await expect(page.locator('h2', { hasText: /kamar/i }).first()).toBeVisible()
    await expect(page.locator('div[id="loading"]')).not.toBeVisible()
});

// dont separate it, because it just make it slower
// and combine it because the task is sequence
test('crud kamar', async ({ page }) => {
    // create
    await page.locator('button', { hasText: /kamar/i }).click()
    await page.locator('select[name="kos"]').selectOption({index:1})
    await page.locator('select[name="penghuni"]').selectOption({index:1})
    await page.locator('input[name="kamar"]').fill('kamar1')
    await page.locator('input[name="biaya"]').fill('350')
    await page.locator('input[name="tgl_masuk"]').fill('2020-12-30')
    await page.locator('input[name="image"]').setInputFiles('./tests/assets/pic1.jpg')   
    await page.click('button[type="submit"]')

    // update
    await page.locator('tr', { hasText: /kamar1/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /kamar1/i }).first().locator('button[id="edit"]').click()
    await expect(page.locator('input[name="kamar"]')).toHaveValue('kamar1')
    await page.locator('input[name="kamar"]').fill('kamar2')


    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src',/.+/)
    await page.click('button[type="submit"]')

    // delete
    await page.locator('tr', { hasText: /kamar2/i }).first().locator('button[id="dropdown"]').click()
    await page.locator('tr', { hasText: /kamar2/i }).first().locator('button[id="delete"]').click()
    
    await expect(page.locator('input[name="kamar"]')).toHaveValue('kamar2')
    await expect(page.locator('img[alt="Image Preview"]')).toHaveAttribute('src',/.+/)
    await page.click('button[type="submit"]')
})
import { test, expect } from '@playwright/test'

test('board loads with 5 columns and dummy cards', async ({ page }) => {
  await page.goto('/')
  const headers = page.locator('h2')
  await expect(headers).toHaveCount(5)
  const cards = page.locator('[data-testid="card"]')
  const count = await cards.count()
  expect(count).toBeGreaterThanOrEqual(10)
})

test('rename a column', async ({ page }) => {
  await page.goto('/')
  const firstHeader = page.locator('h2').first()
  await firstHeader.dblclick()
  const input = page.getByRole('textbox', { name: 'Rename column' })
  await input.fill('Sprint 1')
  await input.press('Enter')
  await expect(page.locator('h2').first()).toHaveText('Sprint 1')
})

test('add a card to a column', async ({ page }) => {
  await page.goto('/')
  const addButtons = page.getByText('+ Add card')
  await addButtons.first().click()
  await page.getByPlaceholder('Card title').fill('New task')
  await page.getByPlaceholder('Details (optional)').fill('Some details')
  await page.getByRole('button', { name: 'Add card', exact: true }).click()
  await expect(page.getByText('New task')).toBeVisible()
})

test('delete a card', async ({ page }) => {
  await page.goto('/')
  const firstCard = page.locator('[data-testid="card"]').first()
  const cardTitle = await firstCard.locator('p').first().textContent()
  await firstCard.hover()
  const deleteBtn = firstCard.getByRole('button').first()
  await deleteBtn.click()
  await expect(page.getByText(cardTitle!)).not.toBeVisible()
})

test('open and close card modal', async ({ page }) => {
  await page.goto('/')
  const firstCard = page.locator('[data-testid="card"]').first()
  const cardTitle = await firstCard.locator('p').first().textContent()
  await firstCard.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(cardTitle!)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
})

test('drag card between columns', async ({ page }) => {
  await page.goto('/')

  const firstCard = page.locator('[data-testid="card"]').first()
  const cardTitle = await firstCard.locator('p').first().textContent()
  const secondColumn = page.locator('[data-testid="column"]').nth(1)

  const fromBox = await firstCard.boundingBox()
  const toBox = await secondColumn.boundingBox()
  if (!fromBox || !toBox) throw new Error('Could not get bounding boxes')

  // Simulate drag manually for @hello-pangea/dnd compatibility
  await page.mouse.move(fromBox.x + fromBox.width / 2, fromBox.y + fromBox.height / 2)
  await page.mouse.down()
  await page.waitForTimeout(300)
  await page.mouse.move(toBox.x + toBox.width / 2, toBox.y + 60, { steps: 20 })
  await page.waitForTimeout(300)
  await page.mouse.up()
  await page.waitForTimeout(500)

  await expect(secondColumn.getByText(cardTitle!)).toBeVisible()
})

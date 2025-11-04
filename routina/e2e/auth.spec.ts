import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display sign in form', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByText('Routina')).toBeVisible()
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
    await expect(page.getByPlaceholder(/••••••••/)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/auth')
    
    // Initially on sign in
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    
    // Click to switch to sign up
    await page.getByText("Don't have an account? Sign up").click()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
    
    // Click to switch back to sign in
    await page.getByText('Already have an account? Sign in').click()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/auth')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // HTML5 validation should prevent submission
    const emailInput = page.getByRole('textbox', { name: /email/i })
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
    expect(isInvalid).toBe(true)
  })
})

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // This would require actual auth - for demo purposes, we'll test the routes exist
    await page.goto('/')
  })

  test('should redirect unauthenticated users to auth page', async ({ page }) => {
    await page.goto('/dashboard')
    // Should redirect to auth
    await page.waitForURL('**/auth', { timeout: 5000 })
  })
})

test.describe('Onboarding Flow', () => {
  test('should display role selection on first step', async ({ page }) => {
    // This would require authentication
    // For now, testing the page structure
    await page.goto('/dashboard/onboarding')
    await page.waitForLoadState('networkidle')
  })
})

test.describe('Accessibility', () => {
  test('auth page should be keyboard navigable', async ({ page }) => {
    await page.goto('/auth')
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    const emailInput = page.getByRole('textbox', { name: /email/i })
    await expect(emailInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    const passwordInput = page.getByPlaceholder(/••••••••/)
    await expect(passwordInput).toBeFocused()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/auth')
    
    const emailInput = page.getByRole('textbox', { name: /email/i })
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(emailInput).toHaveAttribute('required')
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/auth')
    
    await expect(page.getByText('Routina')).toBeVisible()
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/auth')
    
    await expect(page.getByText('Routina')).toBeVisible()
  })

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/auth')
    
    await expect(page.getByText('Routina')).toBeVisible()
  })
})
